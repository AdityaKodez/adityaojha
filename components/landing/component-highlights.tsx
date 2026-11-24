import { PortfolioSticker } from "@/components/shared/portfolio-sticker";
import {
  componentsSectionConfig,
  getEnabledComponents,
} from "@/config/components";
import Link from "next/link";
import { ArrowUpRightCircle } from "@/components/shared/site-icons";

export function ComponentHighlights() {
  const components = getEnabledComponents();
  const preview = components.slice(0, componentsSectionConfig.previewCount);

  if (preview.length === 0) return null;

  return (
    <section className="border-t border-dashed">
      <h2 className="section-heading">{componentsSectionConfig.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {preview.map((component) => {
          return (
            <Link
              key={component.id}
              href={`/components/${component.id}`}
              className="group group/component-card relative flex items-stretch"
            >
              <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
                <PortfolioSticker
                  name={component.icon}
                  className="micro-transition size-9 shrink-0 motion-safe:pointer-fine:group-hover/component-card:[transform:translateY(-2px)_rotate(6deg)]"
                />
                <div className="flex min-w-0 grow flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-medium tracking-tight text-foreground">
                      {component.title}
                    </h3>
                    {component.new && (
                      <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 font-mono text-[9px] leading-3 font-medium text-primary-foreground">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {component.summary ?? component.description}
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
          <ArrowUpRightCircle className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
