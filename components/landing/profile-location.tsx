"use client";

import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { RotatingGlobe } from "./rotating-globe";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: siteConfig.personal.location.timeZone,
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

export function ProfileLocation() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <Tooltip onOpenChange={setOpen}>
      <TooltipTrigger
        className="profile-location micro-transition"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <RotatingGlobe isHovered={hovered} />
        <span>{siteConfig.personal.location.label}</span>
      </TooltipTrigger>
      <TooltipContent><span className="font-mono text-xs">{time ?? "--:--:--"}</span></TooltipContent>
    </Tooltip>
  );
}
