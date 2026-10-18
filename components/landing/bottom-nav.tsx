"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SiteNavigationMenu } from "@/components/shared/site-navigation";
import { revealOnMount } from "@/lib/motion";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.div
      {...revealOnMount({ y: -10 })}
      key={pathname}
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-6 z-[60] md:hidden"
    >
      <SiteNavigationMenu />
    </motion.div>
  );
}
