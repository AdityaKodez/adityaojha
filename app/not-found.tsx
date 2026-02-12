import { Button } from "@/components/ui/button";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ArrowRightCircleIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto py-8 md:pt-16 space-y-8 border border-dashed flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="space-y-4">
        <h1 className="text-8xl font-mono text-primary font-bold tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-[500px] mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button
        asChild
        variant="default"
        size="lg"
        className="group hover:translate-y-1 transition-transform duration-800"
      >
        <Link href="/" className="flex gap-2 items-center">
          Return Home
          <ArrowRightCircleIcon className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </Button>

      {/* Progressive Blur - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl pointer-events-none">
        <ProgressiveBlur position="bottom" height="100px" />
      </div>
    </main>
  );
}
