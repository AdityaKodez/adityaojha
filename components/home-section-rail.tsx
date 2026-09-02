"use client";

import { SectionRail, type SectionRailProps } from "@/components/section-rail";
import { trackEvent } from "@/lib/analytics";

export function HomeSectionRail(props: SectionRailProps) {
  return (
    <SectionRail
      {...props}
      onSectionClick={(targetId, currentId) => {
        trackEvent("section_rail_clicked", {
          target_section_id: targetId,
          current_section_id: currentId,
        });
      }}
    />
  );
}
