import { getComponentIcon } from "@/components/showcase/component-icons";
import {
  componentsSectionConfig,
  getEnabledComponents,
} from "@/config/components";
import Link from "next/link";
import { BsArrowUpRightCircle } from "react-icons/bs";

export function ComponentHighlights() {
  const components = getEnabledComponents();
  const preview = components.slice(0, componentsSectionConfig.previewCount);

  if (preview.length === 0) return null;

  return (
    <section className="border-t border-dashed">
      <h2 className="section-heading">{componentsSectionConfig.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {preview.map((component) => {
          const Icon = getComponentIcon(component.icon);

          return (
            <Link
              key={component.id}
              href={`/components/${component.id}`}
              className="group group/component-card relative flex items-stretch"
            >
              <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
                <div className="micro-transition relative flex size-[33.3px] shrink-0 items-center justify-center text-muted-foreground motion-safe:pointer-fine:group-hover/component-card:[transform:translateY(-2px)_rotate(6deg)]">
                  <Icon className="size-full" />
                  {component.new && (
                    <span
                      className="absolute -right-1 top-0 -rotate-6 rounded-full bg-primary px-1.5 py-0.5 font-mono text-[9px] leading-3 font-medium text-primary-foreground"
                      aria-label="New component"
                    >
                      New
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 grow flex-col">
                  <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                    {component.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
                    {component.description}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
              <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center items-center border-y py-4">
        <Link
          href="/components"
          className="flex items-center gap-2 font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {`${componentsSectionConfig.seeMoreLabel} ${components.length} components`}
          <BsArrowUpRightCircle className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
