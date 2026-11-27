import { About } from "@/components/landing/about";
import { Bookmarks } from "@/components/landing/bookmarks";
import { Bookshelf } from "@/components/landing/bookshelf";
import { Certifications } from "@/components/landing/certifications";
import { ComponentHighlights } from "@/components/landing/component-highlights";
import { Footer } from "@/components/landing/footer";
import { GitHubSection } from "@/components/landing/github-section";
import { Hero } from "@/components/landing/hero";
import { Insights } from "@/components/landing/insights";
import { ProfileBanner } from "@/components/landing/profile-banner";
import { HomeProjectExplorer } from "@/components/landing/home-project-explorer";
import { HomeSectionRail } from "@/components/landing/home-section-rail";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/landing/skills";
import Social from "@/components/landing/social";
import { SponsorsSection } from "@/components/landing/sponsors";
import { Testimonials } from "@/components/landing/testimonials";
import { PixelDissolve } from "@/components/ui/pixel-dissolve";
import { SideNote } from "@/components/shared/side-note";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import { getEnabledBooks } from "@/config/books";
import { sectionNotes } from "@/config/section-notes";
import { siteConfig } from "@/config/site";
import type { SectionId } from "@/config/types";
import type { ReactElement } from "react";
import { Suspense } from "react";
import type { ProjectExplorerItem } from "@/components/project-explorer";

/* The explorer never reads case-study content, tags, or status, so those
   fields stay on the server instead of crossing the client boundary. */
const explorerProjects: ProjectExplorerItem[] = projectsConfig.map(
  (project) => ({
    id: project.id,
    title: project.title,
    subtitle: project.tagline,
    year: project.year,
    description: project.description,
    category: project.category,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    image: project.image,
    imageAlt: project.imageAlt,
    enabled: project.enabled,
    order: project.order,
  }),
);

// Disabled sections (experience, services, workflow, contact) are intentionally
// omitted here so Turbopack does not include their client chunks in `/` while
// their sectionFlags remain false. Re-add a factory here when enabling one.
const staticSections: Partial<
  Record<Exclude<SectionId, "github">, () => ReactElement>
> = {
  socials: () => <Social />,
  skills: () => <Skills />,
  about: () => <About />,
  testimonials: () => <Testimonials />,
  projects: () => (
    <HomeProjectExplorer
      projects={explorerProjects}
      title={projectsSectionConfig.title}
    />
  ),
  components: () => <ComponentHighlights />,
  bookmarks: () => <Bookmarks />,
  bookshelf: () => <Bookshelf books={getEnabledBooks()} />,
  certifications: () => <Certifications />,
  insights: () => <Insights />,
  sponsors: () => <SponsorsSection />,
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
        className="relative flex min-h-dvh flex-col gap-y-4 overflow-x-clip border-x bg-background pt-0 xl:overflow-x-visible"
      >
        <div id="hero" className="bg-background scroll-mt-20">
          <ProfileBanner />
          <Hero />
        </div>
        {siteConfig.sectionOrder.map((sectionId) => {
          if (
            !siteConfig.sectionFlags[sectionId] ||
            (sectionId === "github" && !showGithub)
          ) {
            return null;
          }

          const renderSection =
            sectionId === "github" ? null : staticSections[sectionId];
          if (sectionId !== "github" && !renderSection) {
            return null;
          }

          const content =
            sectionId === "github" ? (
              <Suspense key="github" fallback={<GitSkeleton />}>
                <GitHubSection />
              </Suspense>
            ) : (
              renderSection!()
            );
          const note = sectionNotes[sectionId];

          return (
            <div
              key={sectionId}
              id={sectionId}
              className="relative bg-background scroll-mt-20"
            >
              {note && <SideNote side={note.side}>{note.text}</SideNote>}
              {content}
            </div>
          );
        })}
      </main>
      <Footer />
      <HomeSectionRail
        items={[
          { id: "hero", label: "Top" },
          ...visibleSections.map((id) => ({
            id,
            label: id === "github" ? "GitHub" : `${id.charAt(0).toUpperCase()}${id.slice(1)}`,
          })),
        ]}
      />
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[var(--frame-max-w)]">
        <div aria-hidden="true" className="bottom-blur" />
        <PixelDissolve />
      </div>
    </>
  );
}
