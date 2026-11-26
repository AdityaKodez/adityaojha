"use client";

import { Sofa } from "scribbles-icons";

import { UsageCard, type UsageCardProps } from "@/components/ui/usage-card";

export function UsageCardDemo(props: Partial<UsageCardProps> = {}) {
  return (
    <div className="flex w-full justify-center py-4">
      <UsageCard
        className="max-w-sm"
        label="Seats used"
        value={18}
        limit={25}
        icon={<Sofa weight="fill" />}
        {...props}
      />
    </div>
  );
}
