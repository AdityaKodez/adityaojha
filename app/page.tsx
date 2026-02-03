import About from "@/components/about";
import { CTA } from "@/components/cta";
import { Hero } from "@/components/hero";
import { HowIWork } from "@/components/how-i-work";
import { Services } from "@/components/services";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/skills";
import { Testimonials } from "@/components/testimonials";
import { GitHubCalendar } from "@/components/ui/github-map";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ZenoProject } from "@/components/zeno-project";
import { fetchGithubData } from "@/lib/github";
import { Suspense } from "react";
export default async function Home() {
  const contributionData = await fetchGithubData("AdityaKodez");

  return (
    <main className="relative min-h-screen max-w-3xl mx-auto py-8 md:pt-16 space-y-8 border border-dashed overflow-hidden">
      <Hero />
      <Skills />
      <About />
      <Testimonials />
      <ZenoProject />
      <Services />
      <HowIWork />

      <div className="overflow-y-auto">
        <Suspense fallback={<GitSkeleton />}>
          <GitHubCalendar data={contributionData} />
        </Suspense>
      </div>

      <CTA />

      {/* Progressive Blur - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur position="bottom" height="100px" />
      </div>
    </main>
  );
}
