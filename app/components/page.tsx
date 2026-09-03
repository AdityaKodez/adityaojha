import { getEnabledComponents } from "@/config/components";
import { registryConfig, getRegistrySetupSnippet } from "@/config/registry";
import { CopyBlock } from "@/components/copy-block";
import { RotatingInstallCommand } from "@/components/rotating-install-command";
import { ComponentsCatalog } from "@/components/components-catalog";
import { ComponentsShell } from "@/components/components-shell";
import { Metadata } from "next";

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

      {/* Registry — one-time setup so components install by name. The rule spans
          the frame, the copy stays at a readable measure when the frame widens. */}
      <section className="border-t border-dashed px-6 py-6 [&>*]:max-w-3xl">
        <h2 className="text-base font-medium tracking-tight">
          Install with the shadcn CLI
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Every component here is published as a registry item. Run the direct
          URL install command or register{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            {registryConfig.namespace}
          </code>{" "}
          once in your{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            components.json
          </code>{" "}
          to install by name.
        </p>
        <CopyBlock
          className="mt-4"
          value={getRegistrySetupSnippet()}
          location="components_index"
          copyLabel="copy registry config"
        />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Each component page shows the install command for npm, pnpm, yarn,
          and bun.
        </p>
      </section>
    </ComponentsShell>
  );
}
