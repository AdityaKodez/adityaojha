"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type RailItem = {
  id: string;
  label: string;
  /** With an href the item navigates to another page instead of scrolling. */
  href?: string;
  /** Rich hover preview; without it the tooltip shows the plain label. */
  card?: {
    title: string;
    description?: string;
    icon?: ReactNode;
  };
};

export type SectionRailProps = {
  items: RailItem[];
  /** Pin the active item (link rails). Omit it to follow scroll position. */
  activeId?: string;
  /** Use contained mode when the rail belongs to an embedded scroll area. */
  variant?: "viewport" | "contained";
  /** Scroll area that owns the target sections in contained mode. */
  scrollRootRef?: RefObject<HTMLElement | null>;
  className?: string;
};

const WAVE_WIDTHS = ["w-14", "w-11", "w-9", "w-7"];

export function SectionRail({
  items,
  activeId,
  variant = "viewport",
  scrollRootRef,
  className,
}: SectionRailProps) {
  const [tracked, setTracked] = useState(() => items[0]?.id ?? "");
  const active = activeId ?? tracked;

  const scrollIds = useMemo(
    () => items.filter((item) => !item.href).map((item) => item.id),
    [items]
  );

  useEffect(() => {
    if (scrollIds.length === 0) return;

    const scrollRoot = scrollRootRef?.current ?? null;
    const findTarget = (id: string) => {
      const target = document.getElementById(id);
      if (!target) return null;
      return scrollRoot && !scrollRoot.contains(target) ? null : target;
    };

    // Track every target currently inside the center band and keep the one
    // closest to its midpoint active — deterministic even when several small
    // targets intersect at once.
    const visible = new Map<string, number>();
    const pickClosest = () => {
      const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0;
      const rootHeight = scrollRoot?.clientHeight ?? window.innerHeight;
      const bandCenter = rootTop + rootHeight * 0.4;
      let best: string | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const [id, top] of visible) {
        const distance = Math.abs(top - bandCenter);
        if (distance < bestDistance) {
          best = id;
          bestDistance = distance;
        }
      }
      if (best) setTracked(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }
        pickClosest();
      },
      {
        root: scrollRoot,
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0,
      }
    );

    for (const id of scrollIds) {
      const element = findTarget(id);
      if (element) observer.observe(element);
    }

    // The last section can be too short to cross the center band at max scroll.
    const onScroll = () => {
      const remaining = scrollRoot
        ? scrollRoot.scrollHeight - scrollRoot.scrollTop - scrollRoot.clientHeight
        : document.documentElement.scrollHeight -
          window.scrollY -
          window.innerHeight;
      if (remaining < 4) setTracked(scrollIds[scrollIds.length - 1]);
    };
    const scrollSource: Window | HTMLElement = scrollRoot ?? window;
    scrollSource.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollSource.removeEventListener("scroll", onScroll);
    };
  }, [scrollIds, scrollRootRef]);

  const scrollTo = (id: string) => {
    const scrollRoot = scrollRootRef?.current ?? null;
    const element = document.getElementById(id);
    if (!element || (scrollRoot && !scrollRoot.contains(element))) return;

    setTracked(id);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduced ? "auto" : "smooth";

    if (scrollRoot) {
      const rootRect = scrollRoot.getBoundingClientRect();
      const targetRect = element.getBoundingClientRect();
      scrollRoot.scrollTo({
        top: scrollRoot.scrollTop + targetRect.top - rootRect.top,
        behavior,
      });
      return;
    }

    element.scrollIntoView({ behavior, block: "start" });
  };

  const foundActiveIndex = items.findIndex((item) => item.id === active);
  const activeIndex = foundActiveIndex === -1 ? 0 : foundActiveIndex;

  return (
    <nav
      aria-label="sections"
      className={cn(
        "top-1/2 left-0 z-30 -translate-y-1/2 flex-col items-start gap-3",
        variant === "contained" ? "absolute flex" : "fixed hidden lg:flex",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-y-1 left-0 border-l border-dashed border-border/60"
      />
      {items.map((item, index) => {
        const isActive = active === item.id;
        const distanceFromActive = Math.abs(activeIndex - index);
        const dashClass = cn(
          "block h-0.5 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          WAVE_WIDTHS[Math.min(distanceFromActive, WAVE_WIDTHS.length - 1)],
          isActive
            ? "bg-foreground"
            : "bg-muted-foreground/40 hover:bg-muted-foreground"
        );
        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              {item.href ? (
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={dashClass}
                />
              ) : (
                <button
                  type="button"
                  aria-label={item.label}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => scrollTo(item.id)}
                  className={dashClass}
                />
              )}
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={10}
              hideArrow={Boolean(item.card)}
              className={cn(
                item.card &&
                  "block w-60 rounded-xl bg-card p-3 text-card-foreground ring-1 ring-inset ring-foreground/10"
              )}
            >
              {item.card ? (
                <div className="text-left">
                  <div className="flex items-center gap-2.5">
                    {item.card.icon ? (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground ring-1 ring-inset ring-muted-foreground/10">
                        {item.card.icon}
                      </span>
                    ) : null}
                    <p className="text-sm font-medium leading-snug">
                      {item.card.title}
                    </p>
                  </div>
                  {item.card.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {item.card.description}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p>{item.label}</p>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
