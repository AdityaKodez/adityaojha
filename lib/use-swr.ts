"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SWROptions = {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
};

type SWRResponse<T> = {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
};

export default function useSWR<T>(
  key: string,
  fetcher: (key: string) => Promise<T>,
  options: SWROptions = {},
): SWRResponse<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const revalidate = useCallback(async () => {
    try {
      setError(undefined);
      const result = await fetcher(key);
      if (mountedRef.current) {
        setData(result);
      }
    } catch (caught) {
      if (mountedRef.current) {
        setError(
          caught instanceof Error
            ? caught
            : new Error("Failed to fetch data."),
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, key]);

  useEffect(() => {
    mountedRef.current = true;
    void revalidate();

    const intervalId = options.refreshInterval
      ? window.setInterval(() => {
          void revalidate();
        }, options.refreshInterval)
      : undefined;

    const onFocus = () => {
      if (options.revalidateOnFocus !== false) {
        void revalidate();
      }
    };

    if (options.revalidateOnFocus !== false) {
      window.addEventListener("focus", onFocus);
    }

    return () => {
      mountedRef.current = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      window.removeEventListener("focus", onFocus);
    };
  }, [options.refreshInterval, options.revalidateOnFocus, revalidate]);

  return { data, error, isLoading };
}
