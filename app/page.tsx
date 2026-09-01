import { About } from "@/components/about";
import { Bookmarks } from "@/components/bookmarks";
import { Certifications } from "@/components/certifications";
import { ComponentHighlights } from "@/components/component-highlights";
import { CTA } from "@/components/cta";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { GitHubSection } from "@/components/github-section";
import { Hero } from "@/components/hero";
import { HowIWork } from "@/components/how-i-work";
import { ProjectExplorer } from "@/components/project-explorer";
import { SectionRail } from "@/components/section-rail";
import { Services } from "@/components/services";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/skills";
import Social from "@/components/social";
import { Testimonials } from "@/components/testimonials";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import type { SectionId } from "@/config/types";
import type { ReactElement } from "react";
import { Suspense } from "react";

const staticSections: Record<Exclude<SectionId, "github">, ReactElement> = {
  socials: <Social />,
  skills: <Skills />,
  about: <About />,
  testimonials: <Testimonials />,
  projects: (
    <ProjectExplorer
      projects={projectsConfig}
      title={projectsSectionConfig.title}
    />
  ),
  components: <ComponentHighlights />,
  bookmarks: <Bookmarks />,
  certifications: <Certifications />,
  experience: <Experience />,
  services: <Services />,
  workflow: <HowIWork />,
  contact: <CTA />,
};

export default function Home() {
  const showGithub =
    siteConfig.sectionFlags.github && Boolean(process.env.GITHUB_TOKEN);
  const visibleSections = siteConfig.sectionOrder.filter(
    (id) => siteConfig.sectionFlags[id] && (id !== "github" || showGithub),
  );

  return (
    <>
      <main
        id="main-content"
        className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-8"
      >
        <div id="hero" className="bg-background scroll-mt-20">
          <Hero />
        </div>
        {siteConfig.sectionOrder.map((sectionId) => {
          if (
            !siteConfig.sectionFlags[sectionId] ||
            (sectionId === "github" && !showGithub)
          ) {
            return null;
          }

          const content =
            sectionId === "github" ? (
              <Suspense key="github" fallback={<GitSkeleton />}>
                <GitHubSection />
              </Suspense>
            ) : (
              staticSections[sectionId]
            );

          return (
            <div
              key={sectionId}
              id={sectionId}
              className="bg-background scroll-mt-20"
            >
              {content}
            </div>
          );
        })}

        <Footer />
      </main>

      <SectionRail
        items={[
          { id: "hero", label: "top" },
          ...visibleSections.map((id) => ({ id, label: id })),
        ]}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur
          position="bottom"
          height="calc(100px + env(safe-area-inset-bottom))"
        />
      </div>
    </>
  );
}
