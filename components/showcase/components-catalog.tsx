import Link from "next/link";

import type { ComponentDoc } from "@/config/types";
import { getComponentIcon } from "@/components/showcase/component-icons";
import { ComponentSuggestion } from "@/components/showcase/component-suggestion";

interface ComponentsCatalogProps {
  components: ComponentDoc[];
}

export function ComponentsCatalog({ components }: ComponentsCatalogProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {components.map((c) => {
        const Icon = getComponentIcon(c.icon);
        return (
          <Link
            key={c.id}
            href={`/components/${c.id}`}
            className="group relative flex items-stretch border-b sm:border-b-0"
          >
            <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                <Icon className="h-4 w-4" />
                <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                {c.new && (
                  <span
                    className="absolute -top-1 -right-1 size-2 rounded-full bg-sky-500 ring-2 ring-background"
                    aria-label="New component"
                  />
                )}
              </div>
              <div className="flex min-w-0 grow flex-col">
                <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                  {c.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
                  {c.description}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
            <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
          </Link>
        );
      })}

      {/* The trailing slot. It squares off an odd row exactly like the
          old filler did, and when the count is even it simply opens the
          next one, because the suggestion CTA is a permanent fixture,
          not a gap-filler. */}
      <ComponentSuggestion />
    </div>
  );
}
