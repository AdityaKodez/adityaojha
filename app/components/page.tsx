import { ComponentsCatalog } from "@/components/showcase/components-catalog";
import { ComponentsShell } from "@/components/showcase/components-shell";
import { RotatingInstallCommand } from "@/components/showcase/rotating-install-command";
import { SponsorsSection } from "@/components/landing/sponsors";
import { getEnabledComponents } from "@/config/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "components",
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

        {/* Live preview — same shell as the install block, but cycles through
            every component on its own. Confirms the registry is alive without
            sending the user into a docs page. */}
        <section className="px-6 py-2">
          <RotatingInstallCommand
            className="mt-4"
            ids={components.map((c) => c.id)}
          />
        </section>
        <h2 className="sr-only">Available Components</h2>
        <ComponentsCatalog components={components} />
      </section>

      {/* Registry — the namespace is in the official shadcn directory, so there
          is no setup step. The rule spans the frame, the copy stays at a
          readable measure when the frame widens. */}
      <section className="border-t border-dashed px-6 py-6 [&>*]:max-w-3xl">
        <h2 className="text-base font-medium tracking-tight">
          Install with the shadcn CLI
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Every component here is published under the{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            @akoder
          </code>{" "}
          namespace. The shadcn CLI already knows about it, so there is no
          registry config to add first. Name a component and the CLI fetches it
          along with the primitives it depends on.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Each component page carries its own command, with npm, pnpm, yarn, and
          bun tabs.
        </p>
      </section>

      <SponsorsSection />
    </ComponentsShell>
  );
}
