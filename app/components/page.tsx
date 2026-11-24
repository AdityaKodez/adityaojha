import { ComponentsCatalog } from "@/components/showcase/components-catalog";
import { ComponentsShell } from "@/components/showcase/components-shell";
import { RegistryStatus } from "@/components/showcase/registry-status";
import { RotatingInstallCommand } from "@/components/showcase/rotating-install-command";
import { SponsorsSection } from "@/components/landing/sponsors";
import { Footer } from "@/components/landing/footer";
import { SideNote } from "@/components/shared/side-note";
import { CodeXml, Heart, Sparkle, Terminal } from "@/components/shared/site-icons";
import { componentsPageBenefits, getEnabledComponents } from "@/config/components";
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

const benefitIcons = {
  heart: Heart,
  terminal: Terminal,
  code: CodeXml,
  sparkle: Sparkle,
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

          <ul className="grid gap-x-8 gap-y-5 border-b px-6 py-5 sm:grid-cols-2">
            {componentsPageBenefits.map(({ icon, title, description }) => {
              const Icon = benefitIcons[icon];

              return (
                <li key={icon} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-sm leading-5 font-medium tracking-tight">{title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                </li>
              );
            })}
          </ul>

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
