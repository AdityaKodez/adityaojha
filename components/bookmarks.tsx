"use client";

import { siteConfig } from "@/config/site";
import type { Bookmark, Certification } from "@/config/types";
import { cn } from "@/lib/utils";
import { ArrowDownCircleIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { AccordionSection } from "./ui/accordion-section";

type CollectionId = "certifications" | "bookmarks";

type LearningItem = Bookmark | Certification;

const DEFAULT_VISIBLE_ITEMS = 4;

export function Bookmarks() {
  const { title, items: bookmarkItems } = siteConfig.bookmarks;
  const { items: certificationItems } = siteConfig.certifications;
  const defaultCollection: CollectionId = certificationItems.length
    ? "certifications"
    : "bookmarks";

  const collections: Record<
    CollectionId,
    { label: string; itemLabel: string; items: LearningItem[] }
  > = {
    certifications: {
      label: "Certificates",
      itemLabel: "certificates",
      items: certificationItems,
    },
    bookmarks: {
      label: "Bookmarks",
      itemLabel: "bookmarks",
      items: bookmarkItems,
    },
  };

  const [activeCollection, setActiveCollection] =
    useState<CollectionId>(defaultCollection);
  const [showAll, setShowAll] = useState(false);

  const hasAnyItems =
    collections.certifications.items.length > 0 ||
    collections.bookmarks.items.length > 0;

  if (!hasAnyItems) return null;

  const activeItems = collections[activeCollection].items;
  const displayedItems = showAll
    ? activeItems
    : activeItems.slice(0, DEFAULT_VISIBLE_ITEMS);

  function handleCollectionChange(collection: CollectionId) {
    setActiveCollection(collection);
    setShowAll(false);
  }

  return (
    <AccordionSection id="bookmarks" title={title}>

      <div className="border-b p-2">
        <div className="px-2">
          <div className="inline-flex rounded-sm border border-dashed p-1">
            {(
              ["certifications", "bookmarks"] as const
            ).map((collectionId, index) => {
              const isActive = activeCollection === collectionId;
              const isDisabled = collections[collectionId].items.length === 0;

              return (
                <button
                  key={collectionId}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleCollectionChange(collectionId)}
                  className={cn(
                    "rounded-sm px-3 py-1 text-xs font-pixel uppercase tracking-wider transition-colors",
                    index > 0 && "ml-1",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    isDisabled && "cursor-not-allowed opacity-40",
                  )}
                  aria-pressed={isActive}
                >
                  {collections[collectionId].label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          Nothing added yet.
        </div>
      ) : (
        <>
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
                        <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                          {item.domain}
                          {"date" in item && item.date ? ` • ${item.date}` : ""}
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

          {activeItems.length > DEFAULT_VISIBLE_ITEMS && (
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
                {showAll
                  ? "Show less"
                  : `View all ${activeItems.length} ${collections[activeCollection].itemLabel}`}
                <ArrowDownCircleIcon
                  className={cn(
                    "size-3.5 transition-transform",
                    showAll && "rotate-180",
                  )}
                />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </AccordionSection>
  );
}
