import { Hero } from "@/components/hero";
import { ZenoProject } from "@/components/zeno-project";
import { Skills } from "@/components/skills";
import { Services } from "@/components/services";
import { HowIWork } from "@/components/how-i-work";
import { CTA } from "@/components/cta";
import About from "@/components/about";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function Home() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto py-12 md:py-16 space-y-8 border border-dashed  overflow-hidden">
      <Hero />
      <Skills />
      <About />
      <ZenoProject />
      <Services />
      <HowIWork />
      <CTA />

      {/* Progressive Blur - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur position="bottom" height="100px" />
      </div>
    </main>
  );
}
