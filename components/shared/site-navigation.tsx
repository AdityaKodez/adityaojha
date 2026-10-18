"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Plus } from "@/components/shared/site-icons";
import { getComponentIcon } from "@/components/showcase/component-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { navigationConfig, navigationItems } from "@/config/navigation";
import type { SiteNavigationItem } from "@/config/types";
import { revealDelay, revealOnMount } from "@/lib/motion";
import { cn } from "@/lib/utils";
import styles from "./site-header.module.css";

const MotionLink = motion.create(Link);

export function isNavigationItemActive(item: SiteNavigationItem, pathname: string) {
  const path = item.href;
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

export const siteNavigationItems = navigationItems.map((item) => ({
  ...item,
  Icon: getComponentIcon(item.icon),
}));

export function SiteNavigationMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          {...revealOnMount({ y: -10 })}
          aria-label={open ? navigationConfig.close : navigationConfig.menu}
          className={cn(styles.tab, styles.mobileTrigger, "cursor-pointer")}
        >
          <span className={styles.label}>{navigationConfig.menu}</span>
          <span aria-hidden="true" className={styles.tile}><Plus className={styles.plus} /></span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={navigationConfig.label}
        align="start"
        side="top"
        sideOffset={8}
        collisionPadding={16}
        className="z-[70] w-56 gap-0 rounded-xl bg-popover p-1.5 shadow-lg ring-inset ring-border/70 motion-reduce:animate-none md:hidden"
      >
        <nav aria-label={navigationConfig.label} className="flex flex-col gap-0.5">
          {siteNavigationItems.map((item, index) => {
            const isActive = isNavigationItemActive(item, pathname);
            return (
              <MotionLink
                key={item.id}
                {...revealOnMount({ y: -6, delay: revealDelay(index, 0.04, 0.16) })}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 text-sm micro-transition hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <item.Icon className="size-6 shrink-0" />
                <span>{item.label}</span>
                {isActive && <span aria-hidden="true" className="ml-auto size-1 rounded-full bg-primary" />}
              </MotionLink>
            );
          })}
        </nav>
      </PopoverContent>
    </Popover>
  );
}
