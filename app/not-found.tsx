import type { Metadata } from "next";
import { notFoundConfig } from "@/config/not-found";
import { NotFoundContent } from "./not-found-content";
import { SponsorsSection } from "@/components/landing/sponsors";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: notFoundConfig.title,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <main className="relative overflow-x-clip border-x bg-background">
        <section className="flex min-h-dvh flex-col items-center justify-center px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-24">
          <NotFoundContent />
        </section>
        <SponsorsSection />
      </main>
      <Footer />
    </>
  );
}
