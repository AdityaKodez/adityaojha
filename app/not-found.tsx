import type { Metadata } from "next";
import { notFoundConfig } from "@/config/not-found";
import { NotFoundContent } from "./not-found-content";

export const metadata: Metadata = {
  title: notFoundConfig.title,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-clip border-x border-b-2 bg-background px-6 pb-24 pt-20 sm:px-10 sm:pb-28 sm:pt-24">
      <NotFoundContent />
    </main>
  );
}
