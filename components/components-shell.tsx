"use client";

import { useEffect } from "react";

import { useComponentsView } from "@/components/components-view";

/**
 * Frame for the /components route.
 *
 * The card grid needs more room than the 48rem reading column the rest of the
 * site uses, so the shell widens the frame while the card view is active. The
 * width lives in `--frame-max-w` on `<html>` rather than a local class, because
 * the sticky site header sits outside this subtree and has to track the same
 * edge. The attribute is cleared on unmount so other routes keep the default.
 */
export function ComponentsShell({ children }: { children: React.ReactNode }) {
  const [view] = useComponentsView();
  const isWide = view === "cards";

  useEffect(() => {
    const root = document.documentElement;
    if (isWide) {
      root.dataset.frame = "wide";
    } else {
      delete root.dataset.frame;
    }
    return () => {
      delete root.dataset.frame;
    };
  }, [isWide]);

  return (
    <main
      id="components"
      className="relative mx-auto flex min-h-dvh w-full max-w-[var(--frame-max-w)] flex-col gap-y-4 overflow-x-clip border-x border-b-2 pt-[env(safe-area-inset-top)]"
    >
      {children}
    </main>
  );
}
