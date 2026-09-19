import { Button } from "@/components/ui/button";
import { PointerDots } from "@/components/shared/pointer-dots";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-clip border-x border-b-2 bg-background px-4 py-8 text-center md:pt-16">
      <PointerDots />
      <div className="relative space-y-4">
        <h1 className="text-8xl font-pixel text-primary font-medium tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-125 mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="group relative mt-6 text-muted-foreground hover:text-foreground"
      >
        <Link href="/" className="flex gap-1.5 items-center">
          Return Home
          <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </main>
  );
}
