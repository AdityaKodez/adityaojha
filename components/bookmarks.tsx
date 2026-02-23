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

  const displayedItems = showAll ? items : items.slice(0, 3);

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

      <div className="grid">
        {displayedItems.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex items-stretch border-t border-dashed border-border/50 bg-background transition-all hover:border-foreground/20 hover:bg-muted/30",
                  index === 0 && "border-t-0",
                )}
              >
                <div className="flex shrink-0 items-center justify-center px-4 border-r border-dashed border-border/50 transition-colors group-hover:border-foreground/20">
                  {item.icon && (
                    <div className="relative p-2">
                      <item.icon
                        size={18}
                        color="currentColor"
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                      <div
                        className="pointer-events-none
                        absolute inset-0 ring-1 ring-offset-0 ring-border/50 rounded-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 items-center justify-between gap-4 p-4 min-w-0">
                  <div className="flex flex-col">
                    <h3
                      className="truncate font-medium tracking-tight transition-colors 
                  text-muted-foreground
                  group-hover:text-primary"
                    >
                      {item.title}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground font-mono">
                      {item.domain}
                    </p>
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="size-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {items.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
          className="flex justify-center py-2 border-y "
        >
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size={"lg"}
            className="flex items-center gap-2"
          >
            {showAll ? "Show less" : `Show all bookmarks (${items.length})`}
            <ArrowDownCircleIcon
              className={cn("size-4", showAll && "rotate-180")}
            />
          </Button>
        </motion.div>
      )}
    </section>
  );
}
