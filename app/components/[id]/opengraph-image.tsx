import { ImageResponse } from "next/og";

import { findComponent, getEnabledComponents } from "@/config/components";
import { registryConfig } from "@/config/registry";
import { getOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og/card";

export const runtime = "nodejs";

export const alt = "A component from the akoder shadcn registry";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const component = findComponent(id);

  const title = component?.title ?? "Component not found";
  const description =
    component?.description ??
    "Browse the registry at akoder.xyz/components to see every published component.";

  const enabled = getEnabledComponents();
  const position = enabled.findIndex((c) => c.id === id);
  const counter =
    position >= 0
      ? `${String(position + 1).padStart(2, "0")} / ${enabled.length}`
      : undefined;

  return new ImageResponse(
    (
      <OgCard
        eyebrow="shadcn registry item"
        title={title}
        description={description}
        footer={`npx shadcn@latest add ${registryConfig.namespace}/${id}`}
        counter={counter}
      />
    ),
    { ...OG_SIZE, fonts: getOgFonts() },
  );
}
