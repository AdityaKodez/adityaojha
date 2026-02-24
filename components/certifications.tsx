"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowDownCircleIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

export function Certifications() {
  const { title, items } = siteConfig.certifications;
  const [showAll, setShowAll] = useState(false);

  if (!items || items.length === 0) return null;

  const displayedItems = showAll ? items : items.slice(0, 4);

  return (
    <section id="certifications" className="border-t border-dashed pt-6">
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
        {displayedItems.map((item, index) => (
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
              className="flex h-full items-stretch px-4 py-5 transition-colors hover:bg-muted/10"
            >
              <div className="relative z-10 flex min-w-0 flex-1 items-center gap-4">
                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm transition-colors">
                  {item.icon && (
                    <item.icon
                      size={18}
                      className="text-muted-foreground transition-colors group-hover:text-foreground"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                </div>

                <div className="flex min-w-0 grow flex-col">
                  <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                    {item.title}
                  </h3>
                  <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {item.domain}
                  </p>
                </div>

                <ArrowRightIcon
                  className="ml-auto size-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:-rotate-45 group-hover:text-primary"
                />
              </div>
            </Link>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
            <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
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
            className="flex items-center gap-2 font-pixel text-xs text-muted-foreground hover:text-foreground"
          >
            {showAll ? "Show less" : `View all ${items.length} certifications`}
            <ArrowDownCircleIcon
              className={cn("size-3.5 transition-transform", showAll && "rotate-180")}
            />
          </Button>
        </motion.div>
      )}
    </section>
  );
}
