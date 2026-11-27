"use client";

import { ArrowBigDown, ArrowBigUp } from "@/components/shared/site-icons";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { useState, type ReactNode } from "react";

interface ExpandableGridProps {
  initialItems: ReactNode;
  extraItems?: ReactNode;
  totalCount: number;
  itemLabel: string;
  expandEventName?: "bookmarks_expanded_toggled";
}

export function ExpandableGrid({
  initialItems,
  extraItems,
  totalCount,
  itemLabel,
  expandEventName,
}: ExpandableGridProps) {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {initialItems}
        {showAll && extraItems}
      </div>

      {extraItems && (
        <div className="flex items-center justify-center border-y py-4">
          <button
            type="button"
            onClick={() => {
              const nextShowAll = !showAll;
              setShowAll(nextShowAll);
              if (expandEventName) {
                trackEvent(expandEventName, {
                  expanded: nextShowAll,
                });
              }
            }}
            aria-expanded={showAll}
            className="flex cursor-pointer items-center gap-2 font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {showAll ? "Show less" : `View all ${totalCount} ${itemLabel}`}
            {showAll ? (
              <ArrowBigUp className="size-3.5" />
            ) : (
              <ArrowBigDown className="size-3.5" />
            )}
          </button>
        </div>
      )}
    </>
  );
}

interface TrackedBookmarkLinkProps {
  href: string;
  itemId: string;
  title: string;
  domain: string;
  className?: string;
  children: ReactNode;
}

export function TrackedBookmarkLink({
  href,
  itemId,
  title,
  domain,
  className,
  children,
}: TrackedBookmarkLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent("bookmark_clicked", {
          item_id: itemId,
          title,
          domain,
        });
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
