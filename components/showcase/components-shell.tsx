"use client";

import { useEffect } from "react";

import { useComponentsView } from "@/components/showcase/components-view";

/**
 * Inner column for the /components route.
 *
 * The card grid needs more room than the 48rem reading column the rest of the
 * site uses, so the shell widens `--frame-max-w` on `<html>` while the card
 * view is active. The root layout, header, and gutter all read that token.
 * The attribute is cleared on unmount so other routes keep the default.
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
      className="relative flex min-h-dvh w-full flex-col gap-y-4 overflow-x-clip border-x border-b-2 bg-background pt-[env(safe-area-inset-top)]"
    >
      {children}
    </main>
  );
}
