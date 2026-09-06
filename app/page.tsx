import { About } from "@/components/landing/about";
import { Bookmarks } from "@/components/landing/bookmarks";
import { Certifications } from "@/components/landing/certifications";
import { ComponentHighlights } from "@/components/landing/component-highlights";
import { CTA } from "@/components/landing/cta";
import { Experience } from "@/components/landing/experience";
import { Footer } from "@/components/landing/footer";
import { FrameGutters } from "@/components/shared/frame-gutters";
import { GitHubSection } from "@/components/landing/github-section";
import { Hero } from "@/components/landing/hero";
import { HowIWork } from "@/components/landing/how-i-work";
import { HomeProjectExplorer } from "@/components/landing/home-project-explorer";
import { HomeSectionRail } from "@/components/landing/home-section-rail";
import { Services } from "@/components/landing/services";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/landing/skills";
import Social from "@/components/landing/social";
import { Testimonials } from "@/components/landing/testimonials";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import type { SectionId } from "@/config/types";
import type { ReactElement } from "react";
import { Suspense } from "react";
import { HomeAskAI } from "@/components/landing/home-ask-ai";

const staticSections: Record<Exclude<SectionId, "github">, ReactElement> = {
  socials: <Social />,
  skills: <Skills />,
  about: <About />,
  testimonials: <Testimonials />,
  projects: (
    <HomeProjectExplorer
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
      <FrameGutters />

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

      <HomeSectionRail
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

      <div className="fixed bottom-6 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none px-4 sm:px-6 flex justify-end">
        <div className="pointer-events-auto">
          <HomeAskAI />
        </div>
      </div>
    </>
  );
}
