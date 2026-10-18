"use client";

import { usePathname } from "next/navigation";
import { SiteNavigationMenu } from "@/components/shared/site-navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-6 z-[60] md:hidden">
      <SiteNavigationMenu key={pathname} />
    </div>
  );
}
