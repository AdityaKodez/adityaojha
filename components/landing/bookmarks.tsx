"use client";

import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { reveal, revealOnMount, revealDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ArrowDownCircleIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const DEFAULT_VISIBLE_ITEMS = 4;

export function Bookmarks() {
  const { title, items } = siteConfig.bookmarks;
  const [showAll, setShowAll] = useState(false);

  if (!items || items.length === 0) return null;

  const displayedItems = showAll ? items : items.slice(0, DEFAULT_VISIBLE_ITEMS);

  return (
    <section id="bookmarks" className="border-t border-dashed pt-8">
      <motion.h2
        {...reveal({ y: 8, margin: "-80px" })}
        className="no-js-visible section-heading mb-3"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {displayedItems.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              {...revealOnMount({
                y: 8,
                delay: revealDelay(index, 0.04),
              })}
              className="group relative"
            >
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("bookmark_clicked", {
                    item_id: item.id,
                    title: item.title,
                    domain: item.domain,
                  });
                }}
                className="flex h-full items-stretch px-4 py-5 transition-colors hover:bg-muted/10"
              >
                <div className="relative z-10 flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm transition-colors">
                    {item.icon && (
                      <item.icon
                        size={18}
                        color="currentColor"
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                  </div>

                  <div className="flex min-w-0 grow flex-col">
                    <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                      {item.title}
                    </h3>
                    <p className="truncate font-mono text-[10px] tracking-wider text-muted-foreground/60">
                      {item.domain}
                    </p>
                  </div>

                  <ArrowRightIcon className="ml-auto size-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:-rotate-45 group-hover:text-primary" />
                </div>
              </Link>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
              <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </div>

      {items.length > DEFAULT_VISIBLE_ITEMS && (
        <motion.div
          {...reveal({ y: 8, margin: "-100px" })}
          className="flex justify-center border-t border-dashed py-2"
        >
          <Button
            onClick={() => {
              const nextShowAll = !showAll;
              setShowAll(nextShowAll);
              trackEvent("bookmarks_expanded_toggled", {
                expanded: nextShowAll,
              });
            }}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-pixel text-xs"
          >
            {showAll ? "show less" : `view all ${items.length} bookmarks`}
            <ArrowDownCircleIcon
              className={cn(
                "size-3.5 transition-transform",
                showAll && "rotate-180",
              )}
            />
          </Button>
        </motion.div>
      )}
    </section>
  );
}
