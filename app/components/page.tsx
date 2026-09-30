import { ComponentsCatalog } from "@/components/showcase/components-catalog";
import { ComponentDemo } from "@/components/showcase/component-demo";
import { getComponentIcon } from "@/components/showcase/component-icons";
import { ComponentsShell } from "@/components/showcase/components-shell";
import { RegistryStatus } from "@/components/showcase/registry-status";
import { RotatingInstallCommand } from "@/components/showcase/rotating-install-command";
import { SponsorsSection } from "@/components/landing/sponsors";
import { componentSpotlightId, findComponent, getEnabledComponents } from "@/config/components";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Components",
  description:
    "A growing set of reusable building blocks — lightweight, themable, and easy to drop into any project.",
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    title: "components — aditya ojha",
    description:
      "A growing set of reusable building blocks — lightweight, themable, and easy to drop into any project.",
    url: "/components",
  },
  twitter: {
    card: "summary_large_image",
    title: "components — aditya ojha",
    description:
      "A growing set of reusable building blocks — lightweight, themable, and easy to drop into any project.",
  },
};

const spotlight = findComponent(componentSpotlightId);
const SpotlightIcon = spotlight ? getComponentIcon(spotlight.icon) : null;

export default function ComponentsPage() {
  const components = getEnabledComponents();

  return (
    <ComponentsShell>
      <section className="border-t border-dashed pt-14">
        <div>
          <p className="px-6 py-2 text-xs">
            Components
          </p>
        </div>
        <h1 className="section-heading">drop in.<br className="sm:hidden" /> customize. ship.</h1>

        <section className="px-6 py-2">
          <RotatingInstallCommand
            className="mt-4"
            ids={components.map((c) => c.id)}
          />
        </section>

        {spotlight && SpotlightIcon && (
          <section aria-labelledby="component-spotlight-title" className="mt-4 border-t border-dashed">
            <div className="flex min-h-[350px] items-center justify-center overflow-hidden px-6 py-2">
              <ComponentDemo id={spotlight.id} />
            </div>
            <Link
              href={`/components/${spotlight.id}`}
              className="flex items-center gap-4 px-4 py-4 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-background ring-1 ring-inset ring-muted-foreground/5">
                <SpotlightIcon aria-hidden="true" className="size-4" />
              </span>
              <h2 id="component-spotlight-title" className="text-sm font-medium tracking-tight">
                {spotlight.title}
              </h2>
            </Link>
          </section>
        )}

        <h2 className="sr-only">Available Components</h2>
        <ComponentsCatalog components={components} />

        <RegistryStatus />
      </section>

      <SponsorsSection />
    </ComponentsShell>
  );
}
