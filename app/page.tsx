import { About } from "@/components/about";
import { CTA } from "@/components/cta";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowIWork } from "@/components/how-i-work";
import { Services } from "@/components/services";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/skills";
import Social from "@/components/social";
import { Testimonials } from "@/components/testimonials";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { GitHubCalendar } from "@/components/ui/github-map";
import { ProjectExplorer } from "@/components/project-explorer";
import { Bookmarks } from "@/components/bookmarks";
import { Certifications } from "@/components/certifications";
import { ComponentHighlights } from "@/components/component-highlights";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import type { SectionId } from "@/config/types";
import { fetchGithubData } from "@/lib/github";
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

export default async function Home() {
  const shouldRenderGithub =
    siteConfig.sectionFlags.github && Boolean(process.env.GITHUB_TOKEN);
  const contributionData = shouldRenderGithub
    ? await fetchGithubData(siteConfig.personal.githubUsername)
    : [];

  return (
    <>
      <main
        id="main-content"
        className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-8"
      >
        <div className="bg-background">
          <Hero />
        </div>
        {siteConfig.sectionOrder.map((sectionId) => {
          if (!siteConfig.sectionFlags[sectionId]) {
            return null;
          }

          const content =
            sectionId === "github" ? (
              // The section rule lives here: GitHubCalendar is a bare registry
              // component, so it ships without the home page's dashed divider.
              <div key="github" className="border-t border-dashed">
                <Suspense fallback={<GitSkeleton />}>
                  <GitHubCalendar data={contributionData} />
                </Suspense>
              </div>
            ) : (
              staticSections[sectionId]
            );

          return (
            <div key={sectionId} className="bg-background">
              {content}
            </div>
          );
        })}

        <Footer />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur
          position="bottom"
          height="calc(100px + env(safe-area-inset-bottom))"
        />
      </div>
    </>
  );
}
