import { Hero } from "@/components/hero";
import { ZenoProject } from "@/components/zeno-project";
import { Skills } from "@/components/skills";
import { Services } from "@/components/services";
import { HowIWork } from "@/components/how-i-work";
import { CTA } from "@/components/cta";
import About from "@/components/about";

export default function Home() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto py-12 md:py-16 space-y-10 border border-dashed bg-background">
      <Hero />
      <Skills />
      <About />
      <div className="border-t border-dashed" />
      <ZenoProject />
      <Services />
      <HowIWork />
      <div className="border-t border-dashed" />
      <CTA />
    </main>
  );
}
