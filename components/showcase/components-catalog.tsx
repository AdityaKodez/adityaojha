import Link from "next/link";

import type { ComponentDoc } from "@/config/types";
import { getComponentIcon } from "@/components/showcase/component-icons";

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
            className="group group/component-card relative flex items-stretch border-b sm:border-b-0"
          >
            <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
              <div className="micro-transition relative flex size-[33.3px] shrink-0 items-center justify-center text-muted-foreground motion-safe:pointer-fine:group-hover/component-card:[transform:translateY(-2px)_rotate(6deg)]">
                <Icon className="size-full" />
                {c.new && (
                  <span
                    className="absolute -right-1 top-0 -rotate-6 rounded-full bg-primary px-1.5 py-0.5 font-mono text-[9px] leading-3 font-medium text-primary-foreground"
                    aria-label="New component"
                  >
                    New
                  </span>
                )}
              </div>
              <div className="flex min-w-0 grow flex-col">
                <h3 className="truncate text-sm font-medium tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {c.summary ?? c.description}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
            <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
          </Link>
        );
      })}
    </div>
  );
}
