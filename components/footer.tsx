import { siteConfig } from "@/config/site";
export function Footer() {
  return (
    <footer className="-mt-4 border-t border-dashed bg-background">
      <div className="relative overflow-hidden px-6 pt-5 pb-24">
        <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-35" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-pixel uppercase tracking-wide text-muted-foreground">
              End of page
            </p>
            <p className="max-w-lg text-sm text-muted-foreground">
              {siteConfig.personal.fullName} builds scoped SaaS MVPs from
              {" "}
              {siteConfig.personal.location.label}.
            </p>
          </div>

         
        </div>
      </div>
    </footer>
  );
}