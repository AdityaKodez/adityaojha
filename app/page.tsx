import { About } from "@/components/about";
import { Banner } from "@/components/banner";
import { CTA } from "@/components/cta";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { HowIWork } from "@/components/how-i-work";
import { Services } from "@/components/services";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/skills";
import Social from "@/components/social";
import { Testimonials } from "@/components/testimonials";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { GitHubCalendar } from "@/components/ui/github-map";
import { ZenoProject } from "@/components/zeno-project";
import { Bookmarks } from "@/components/bookmarks";
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
  projects: <ZenoProject />,
  bookmarks: <Bookmarks />,
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
    <main
      id="main-content"
      className="relative min-h-screen max-w-3xl mx-auto md:pb-16 space-y-8 border border-dashed overflow-hidden"
    >
      <div className="bg-background">
        <Banner />
        <Hero />
      </div>
      {siteConfig.sectionOrder.map((sectionId) => {
        if (!siteConfig.sectionFlags[sectionId]) {
          return null;
        }

        const content =
          sectionId === "github" ? (
            <Suspense key="github" fallback={<GitSkeleton />}>
              <GitHubCalendar data={contributionData} />
            </Suspense>
          ) : (
            staticSections[sectionId]
          );

        return (
          <div key={sectionId} className="bg-background">
            {content}
          </div>
        );
      })}

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur position="bottom" height="100px" />
      </div>
    </main>
  );
}
