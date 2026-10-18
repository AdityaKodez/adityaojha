import { ComponentsCatalog } from "@/components/showcase/components-catalog";
import { ComponentsShell } from "@/components/showcase/components-shell";
import { RegistryStatus } from "@/components/showcase/registry-status";
import { RotatingInstallCommand } from "@/components/showcase/rotating-install-command";
import { SponsorsSection } from "@/components/landing/sponsors";
import { Footer } from "@/components/landing/footer";
import { SideNote } from "@/components/shared/side-note";
import { getEnabledComponents } from "@/config/components";
import { openGraphConfig } from "@/config/opengraph";
import { sectionNotes } from "@/config/section-notes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: openGraphConfig.routes.components.title,
  description: openGraphConfig.routes.components.description,
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    title: "components — aditya ojha",
    description: openGraphConfig.routes.components.description,
    url: "/components",
  },
  twitter: {
    card: "summary_large_image",
    title: "components — aditya ojha",
    description: openGraphConfig.routes.components.description,
  },
};

export default function ComponentsPage() {
  const components = getEnabledComponents();
  const note = sectionNotes.components;

  return (
    <>
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

          <div
            aria-hidden="true"
            className="blueprint-bg h-5 border-t"
          />

          <section className="relative">
            {note && <SideNote side={note.side}>{note.text}</SideNote>}
            <h2 className="sr-only">Available Components</h2>
            <ComponentsCatalog components={components} />
          </section>

          <RegistryStatus />
        </section>

        <SponsorsSection />
      </ComponentsShell>
      <Footer />
    </>
  );
}
