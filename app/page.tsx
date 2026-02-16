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
import { ZenoProject } from "@/components/zeno-project";
import { fetchGithubData } from "@/lib/github";
import { Heart } from "lucide-react";
import { Suspense } from "react";
export default async function Home() {
  const contributionData = await fetchGithubData("AdityaKodez");

  return (
    <main className="relative min-h-screen max-w-3xl mx-auto  md:pb-16 space-y-8 border border-dashed overflow-hidden">
      <Banner />
      <Hero />
      <Social />
      <Skills />
      <About />
      <Testimonials />
      <ZenoProject />
      <Services />
      <HowIWork />
      <Suspense fallback={<GitSkeleton />}>
        <GitHubCalendar data={contributionData} />
      </Suspense>
      <CTA />
 <footer className="mt-12 border-t py-8 text-left text-sm text-muted-foreground">
  <div className="container flex flex-col gap-1">
    <p className="font-medium text-foreground flex items-center gap-1">
      Designed & Made by Aditya with <Heart className="w-4 h-4 text-red-700 fill-red-400" />
    </p>
    <p className="text-xs">
      © {new Date().getFullYear()} All rights reserved.
    </p>
  </div>
</footer>
      {/* Progressive Blur - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur position="bottom" height="100px" />
      </div>
    </main>
  );
}
