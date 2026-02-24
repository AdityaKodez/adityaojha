"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowDownCircleIcon, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

export function Bookmarks() {
  const { title, items } = siteConfig.bookmarks;
  const [showAll, setShowAll] = useState(false);

  if (!items || items.length === 0) return null;

  const displayedItems = showAll ? items : items.slice(0, 4);

  return (
    <section id="bookmarks" className="border-t border-dashed pt-6">
      <div className="space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
          className="no-js-visible section-heading"
        >
          {title}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {displayedItems.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="group relative"
            >
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-stretch p-4 
                bg-background hover:bg-background/80 py-5 transition-all"
              >
                <div className="flex flex-1 items-center gap-4 min-w-0 relative z-10">
                  <div className="flex shrink-0 items-center justify-center size-10 rounded-sm relative transition-colors">
                    {item.icon && (
                      <item.icon
                        size={18}
                        color="currentColor"
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                    )}
                    <div className="absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 pointer-events-none rounded-sm"></div>
                  </div>

                  <div className="flex flex-col min-w-0 grow">
                    <h3 className="truncate font-medium text-sm tracking-tight transition-colors text-muted-foreground group-hover:text-foreground">
                      {item.title}
                    </h3>
                    <p className="truncate text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">
                      {item.domain}
                    </p>
                  </div>

                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/50 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </div>
              </Link>
              <div className="absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 pointer-events-none"></div>
              {/* Blueprint Texture on Hover */}
              <div className="absolute inset-0 blueprint-bg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Shimmer Line */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {items.length > 4 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
          className="flex justify-center border-y py-2"
        >
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-pixel text-xs"
          >
            {showAll ? "Show less" : `View all ${items.length} bookmarks`}
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
