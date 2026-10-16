import { Suspense } from "react";
import { FooterScene } from "@/components/landing/footer-scene";
import { VisitorCounter } from "@/components/landing/visitor-counter";
import { VisitorCounterSkeleton } from "@/components/skeletons/visitor-counter-skeleton";

export function Footer() {
  return (
    <FooterScene>
      <Suspense fallback={<VisitorCounterSkeleton />}>
        <VisitorCounter />
      </Suspense>
    </FooterScene>
  );
}
