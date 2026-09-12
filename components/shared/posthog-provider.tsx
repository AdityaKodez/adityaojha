"use client";

import { getPostHog } from "@/lib/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, type ReactNode } from "react";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      const searchStr = searchParams?.toString();
      if (searchStr) {
        url = `${url}?${searchStr}`;
      }
      void getPostHog().then((posthog) => {
        posthog?.capture("$pageview", {
          $current_url: url,
          pathname,
        });
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/** Runs the callback when the main thread next has a spare moment. */
function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback);
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!posthogKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not defined. Events will not be sent to PostHog.",
        );
      }
      return;
    }

    // Wait for the window load event, then an idle slot, so the PostHog
    // bundle never competes with hydration or first paint.
    if (document.readyState === "complete") {
      return onIdle(() => void getPostHog());
    }

    const onLoad = () => {
      onIdle(() => void getPostHog());
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
