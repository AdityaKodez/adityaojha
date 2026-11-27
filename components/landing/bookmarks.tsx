import { ArrowUpRight } from "@/components/shared/site-icons";
import {
  ExpandableGrid,
  TrackedBookmarkLink,
} from "@/components/landing/expandable-grid";
import { siteConfig } from "@/config/site";
import type { Bookmark } from "@/config/types";

const DEFAULT_VISIBLE_ITEMS = 4;

function renderBookmarkItem(item: Bookmark) {
  return (
    <div key={item.id} className="group relative">
      <TrackedBookmarkLink
        href={item.url}
        itemId={item.id}
        title={item.title}
        domain={item.domain}
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

          <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-primary" />
        </div>
      </TrackedBookmarkLink>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
      <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

export function Bookmarks() {
  const { title, items } = siteConfig.bookmarks;

  if (!items || items.length === 0) return null;

  const initialItems = items
    .slice(0, DEFAULT_VISIBLE_ITEMS)
    .map(renderBookmarkItem);
  const extraItems =
    items.length > DEFAULT_VISIBLE_ITEMS
      ? items.slice(DEFAULT_VISIBLE_ITEMS).map(renderBookmarkItem)
      : null;

  // The `#bookmarks` anchor is owned by the section wrapper in `app/page.tsx`,
  // which renders `<div id={sectionId}>` for every entry in `sectionOrder`.
  // Setting it again here produced a duplicate id: invalid HTML, and the anchor
  // resolved unpredictably.
  return (
    <section className="border-t border-dashed pt-8">
      <h2 className="no-js-visible section-heading mb-3">{title}</h2>

      <ExpandableGrid
        initialItems={initialItems}
        extraItems={extraItems}
        totalCount={items.length}
        itemLabel="bookmarks"
        expandEventName="bookmarks_expanded_toggled"
      />
    </section>
  );
}
