import { HeaderActions } from "@/components/header-actions";

/**
 * Sticky floating header shared by every route.
 *
 * Lives at the layout level so the same actions — GitHub star pill + theme
 * toggle — appear on `/`, `/project/[id]`, and `/components/[id]`. The
 * `max-w-3xl mx-auto` keeps it aligned with the centered main column.
 */
export function SiteHeader() {
  return (
    <div className="sticky top-3 sm:top-4 z-40 mx-auto -mb-8 flex max-w-3xl justify-end px-6 pointer-events-none">
      <HeaderActions />
    </div>
  );
}
