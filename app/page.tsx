import About from "@/components/about";
import { Banner } from "@/components/banner";
import { CTA } from "@/components/cta";
import { Hero } from "@/components/hero";
import { HowIWork } from "@/components/how-i-work";
import { Services } from "@/components/services";
import { GitSkeleton } from "@/components/skeletons/github-skeleton";
import { Skills } from "@/components/skills";
import Social from "@/components/social";
import { Testimonials } from "@/components/testimonials";
import { GitHubCalendar } from "@/components/ui/github-map";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ParallaxSection } from "@/components/parallax-section";
import { ZenoProject } from "@/components/zeno-project";
import { fetchGithubData } from "@/lib/github";
import { Suspense } from "react";
export default async function Home() {
  const contributionData = await fetchGithubData("AdityaKodez");

  return (
    <main className="relative min-h-screen max-w-3xl mx-auto  md:pb-16 space-y-8 border border-dashed overflow-hidden">
      <Banner />
      <ParallaxSection offset={42} direction={1}>
        <Hero />
      </ParallaxSection>
      <ParallaxSection offset={34} direction={-1}>
        <Social />
      </ParallaxSection>
      <ParallaxSection offset={28} direction={1}>
        <Skills />
      </ParallaxSection>
      <About />
      <ParallaxSection offset={30} direction={-1}>
        <Testimonials />
      </ParallaxSection>
      <ParallaxSection offset={26} direction={1}>
        <ZenoProject />
      </ParallaxSection>
      <Services />
      <HowIWork />
      <Suspense fallback={<GitSkeleton />}>
        <GitHubCalendar data={contributionData} />
      </Suspense>
      <CTA />

      {/* Progressive Blur - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur position="bottom" height="100px" />
      </div>
    </main>
  );
}
