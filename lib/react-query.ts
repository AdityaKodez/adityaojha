"use client";

import { useEffect, useState } from "react";

type QueryState<T> = {
  data?: T;
  error?: Error;
  updatedAt: number;
  isFetching: boolean;
  promise?: Promise<T>;
  gcTimer?: ReturnType<typeof setTimeout>;
  listeners: Set<() => void>;
};

type UseQueryOptions = {
  staleTime?: number;
  gcTime?: number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
};

type UseQueryResult<T> = {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isFetching: boolean;
};

const queryCache = new Map<string, QueryState<unknown>>();

function getOrCreateQueryState<T>(key: string): QueryState<T> {
  const existing = queryCache.get(key);
  if (existing) {
    return existing as QueryState<T>;
  }

  const state: QueryState<T> = {
    updatedAt: 0,
    isFetching: false,
    listeners: new Set(),
  };

  queryCache.set(key, state as QueryState<unknown>);
  return state;
}

function notify<T>(state: QueryState<T>) {
  state.listeners.forEach((listener) => listener());
}

function stopGcTimer<T>(key: string) {
  const state = getOrCreateQueryState<T>(key);

  if (!state.gcTimer) {
    return;
  }

  clearTimeout(state.gcTimer);
  state.gcTimer = undefined;
}

function scheduleGc<T>(key: string, gcTime: number) {
  const state = getOrCreateQueryState<T>(key);

  if (state.listeners.size > 0) {
    return;
  }

  state.gcTimer = setTimeout(() => {
    queryCache.delete(key);
  }, gcTime);
}

async function fetchQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
): Promise<T> {
  const state = getOrCreateQueryState<T>(key);

  if (state.promise) {
    return state.promise;
  }

  state.isFetching = true;
  notify(state);

  state.promise = queryFn()
    .then((data) => {
      state.data = data;
      state.error = undefined;
      state.updatedAt = Date.now();
      return data;
    })
    .catch((error: unknown) => {
      state.error =
        error instanceof Error ? error : new Error("Failed to fetch query.");
      throw state.error;
    })
    .finally(() => {
      state.isFetching = false;
      state.promise = undefined;
      notify(state);
    });

  return state.promise;
}

export function useQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: UseQueryOptions = {},
): UseQueryResult<T> {
  const {
    staleTime = 60_000,
    gcTime = 300_000,
    refetchInterval,
    refetchOnWindowFocus = true,
  } = options;

  const [, forceRerender] = useState(0);

  useEffect(() => {
    const state = getOrCreateQueryState<T>(key);

    const listener = () => {
      forceRerender((value) => value + 1);
    };

    state.listeners.add(listener);
    stopGcTimer<T>(key);

    const now = Date.now();
    const isStale = now - state.updatedAt > staleTime;
    const hasNoData = typeof state.data === "undefined";

    if (hasNoData || isStale) {
      void fetchQuery(key, queryFn);
    }

    const intervalId = refetchInterval
      ? window.setInterval(() => {
          void fetchQuery(key, queryFn);
        }, refetchInterval)
      : undefined;

    const focusHandler = () => {
      if (!refetchOnWindowFocus) {
        return;
      }

      const latest = getOrCreateQueryState<T>(key);
      const staleOnFocus = Date.now() - latest.updatedAt > staleTime;

      if (staleOnFocus) {
        void fetchQuery(key, queryFn);
      }
    };

    window.addEventListener("focus", focusHandler);

    return () => {
      const latest = getOrCreateQueryState<T>(key);
      latest.listeners.delete(listener);
      scheduleGc<T>(key, gcTime);

      if (intervalId) {
        clearInterval(intervalId);
      }

      window.removeEventListener("focus", focusHandler);
    };
  }, [gcTime, key, queryFn, refetchInterval, refetchOnWindowFocus, staleTime]);

  const state = getOrCreateQueryState<T>(key);

  return {
    data: state.data,
    error: state.error,
    isLoading: typeof state.data === "undefined" && !state.error,
    isFetching: state.isFetching,
  };
}
