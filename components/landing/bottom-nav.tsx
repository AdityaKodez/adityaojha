"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useIsMobile } from "@/lib/use-mobile";
import { cn } from "@/lib/utils";
import { MOTION_EASE } from "@/lib/motion";

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/testimonials", label: "Testimonials" },
] as const;

/* two-bar mark, lucide stroke weight, lower bar stretches on hover */
function TwoBarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="4" y="8" width="16" height="2" rx="1" />
      <rect
        x="4"
        y="14"
        width="10"
        height="2"
        rx="1"
        className="transition-[width] duration-200 ease-out motion-reduce:transition-none group-hover:w-[16px]"
      />
    </svg>
  );
}

export function BottomNav() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  /* close whenever the route changes */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* close on outside pointerdown or Escape while open */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!isMobile) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-2 mx-auto w-full max-w-3xl"
    >
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Site navigation"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{
              default: { type: "spring", stiffness: 420, damping: 34, mass: 0.7 },
              opacity: { duration: 0.18, ease: MOTION_EASE },
            }}
            className="pointer-events-auto flex flex-col rounded-lg bg-popover p-1 shadow-lg ring-1 ring-inset ring-border/70"
          >
            {ROUTES.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {route.label}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto group flex size-10 items-center justify-center rounded-xl bg-background/90 text-foreground ring-1 ring-inset ring-border backdrop-blur transition-colors duration-200 motion-reduce:transition-none hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15, ease: MOTION_EASE }}
            className="flex"
          >
            {open ? (
              <X className="size-4" aria-hidden />
            ) : (
              <TwoBarIcon className="size-4" />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
