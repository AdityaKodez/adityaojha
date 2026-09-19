"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-clip border-x border-b-2 bg-background px-6 py-16 text-center">
      <div className="space-y-3">
        <p className="font-mono text-xs text-destructive">Something went wrong</p>
        <h1 className="text-xl font-medium tracking-tight">An error occurred</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="pt-4">
          <Button
            onClick={() => reset()}
            variant="outline"
            size="sm"
            className="gap-2 font-pixel text-xs"
          >
            <RotateCcw className="size-3.5" />
            try again
          </Button>
        </div>
      </div>
    </main>
  );
}
