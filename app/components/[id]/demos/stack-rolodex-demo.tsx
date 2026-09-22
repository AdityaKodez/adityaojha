"use client";

import {
  StackRolodex,
  type StackRolodexProps,
} from "@/components/ui/stack-rolodex";
import {
  SiCloudflare,
  SiDeepgram,
  SiGithub,
  SiPrisma,
  SiStripe,
  SiSupabase,
  SiVercel,
} from "react-icons/si";

// Vercel and GitHub are monochrome brands, so they keep the neutral pill;
// the colored brands tint the active pill with their own color.
const STACK_ITEMS = [
  { id: "vercel", name: "Vercel", icon: SiVercel },
  { id: "github", name: "GitHub", icon: SiGithub },
  { id: "supabase", name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { id: "prisma", name: "Prisma", icon: SiPrisma, color: "#16A394" },
  { id: "stripe", name: "Stripe", icon: SiStripe, color: "#635BFF" },
  { id: "deepgram", name: "Deepgram", icon: SiDeepgram, color: "#13EF93" },
  { id: "cloudflare", name: "Cloudflare", icon: SiCloudflare, color: "#F38020" },
];

/**
 * The panel drives the rotation interval and the spacing between pills. The
 * items and the label stay baked in, and both props default to the values
 * this demo always rendered.
 */
export function StackRolodexDemo({
  interval = 2000,
  step = 50,
}: Partial<StackRolodexProps> = {}) {
  return (
    <StackRolodex
      items={STACK_ITEMS}
      label="in my stack"
      interval={interval}
      step={step}
    />
  );
}
