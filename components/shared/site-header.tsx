"use client";

import { HeaderActions } from "@/components/shared/header-actions";
import { Logo } from "@/components/shared/logo";
import { siteNavigationItems, isNavigationItemActive } from "@/components/shared/site-navigation";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { revealOnMount } from "@/lib/motion";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <header className="pointer-events-none sticky top-3 z-40 mx-auto -mb-11 flex h-11 w-full max-w-[var(--frame-max-w)] items-center justify-between gap-4 px-6 sm:top-4">
      <motion.nav
        {...revealOnMount({ y: -10 })}
        aria-label={navigationConfig.label}
        className="pointer-events-auto flex items-center gap-2"
      >
        <Link
          href="/"
          aria-label="Home"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <motion.span
            className={styles.utilityFace}
            initial={false}
            animate="rest"
            whileHover={reduceMotion ? undefined : "hover"}
          >
            <Logo size={20.736} />
          </motion.span>
        </Link>

        <div className="hidden items-center gap-1.5 md:flex">
          <span aria-hidden="true" className="mx-1 h-px w-3 bg-border" />
          {siteNavigationItems.filter((item) => item.id !== "home").map((item) => {
            const active = isNavigationItemActive(item, pathname);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "location" : undefined}
                data-active={active}
                className={cn(styles.tab, item.id === "components" && styles.accent)}
              >
                <span className={styles.label}>{item.label}</span>
                <span aria-hidden="true" className={styles.tile}>
                  <item.Icon className="text-foreground" />
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
      <HeaderActions />
    </header>
  );
}
