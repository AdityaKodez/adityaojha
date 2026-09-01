import { getEnabledComponents } from "@/config/components";
import { registryConfig, getRegistrySetupSnippet } from "@/config/registry";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CopyBlock } from "@/components/copy-block";
import { RotatingInstallCommand } from "@/components/rotating-install-command";
import { getComponentIcon } from "@/components/component-icons";
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
};

export default function ComponentsPage() {
  const components = getEnabledComponents();
  // An odd count leaves a gap in the two-column grid — fill it with a
  // placeholder cell so the hairline grid still reads as complete.
  const needsFiller = components.length % 2 === 1;

  return (
    <main
      id="components"
      className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-[env(safe-area-inset-top)]"
    >
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
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {components.map((c, index) => {
            const Icon = getComponentIcon(c.icon);
            return (
              <Link
                key={c.id}
                href={`/components/${c.id}`}
                className={cn(
                  "group relative flex items-stretch",
                  (index < components.length - 1 || needsFiller) &&
                    "border-b sm:border-b-0"
                )}
              >
                <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                    <Icon className="h-4 w-4" />
                    <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                  </div>
                  <div className="flex min-w-0 grow flex-col">
                    <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                      {c.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground/80 mt-1">
                      {c.description}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
                <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}

          {needsFiller ? (
            <div
              aria-hidden
              className="relative flex select-none items-stretch"
            >
              <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5">
                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground/50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 6v12" />
                    <path d="M6 12h12" />
                  </svg>
                  <div className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-muted-foreground/20" />
                </div>
                <div className="flex min-w-0 grow flex-col">
                  <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground/60">
                    something new is on the bench
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/50">
                    the next block lands in this slot. it is being drawn,
                    measured, and argued with.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 border border-dashed border-muted-foreground/15" />
            </div>
          ) : null}
        </div>
      </section>


      {/* Registry — one-time setup so components install by name. */}
      <section className="border-t border-dashed px-6 py-6">
        <h2 className="text-base font-medium tracking-tight">
          Install with the shadcn CLI
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Every component here is published as a registry item. Register{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            {registryConfig.namespace}
          </code>{" "}
          once in your{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            components.json
          </code>
          , then install by name — the CLI handles files, dependencies, and
          registry dependencies.
        </p>
        <CopyBlock
          className="mt-4"
          value={getRegistrySetupSnippet()}
          copyLabel="copy registry config"
        />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Each component page shows the install command for npm, pnpm, yarn,
          and bun.
        </p>
      </section>
    </main>
  );
}
