import { componentRegistry, getEnabledComponents } from "@/config/components";
import { Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Components",
  description:
    "A growing set of reusable building blocks — lightweight, themable, and easy to drop into any project.",
};

function pickIcon(name: string) {
  switch (name) {
    case "globe":
      return Globe;
    default:
      return Globe;
  }
}

export default function ComponentsPage() {
  const components = getEnabledComponents();

  return (
    <main
      id="components"
      className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-[env(safe-area-inset-top)]"
    >
      <section className="border-t border-dashed pt-6">
        <h1 className="section-heading">Components</h1>

        <div className="px-6 mt-3 mb-6">
          <p className="text-md text-muted-foreground">
            A growing collection of reusable building blocks. Lightweight,
            themable, and ready to drop into a new project in a few seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {components.map((c, index) => {
            const Icon = pickIcon(c.icon);
            return (
              <Link
                key={c.id}
                href={`/components/${c.id}`}
                className={cn(
                  "group relative flex items-stretch",
                  index < componentRegistry.length - 1 && "border-b sm:border-b-0"
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
        </div>
      </section>
    </main>
  );
}
