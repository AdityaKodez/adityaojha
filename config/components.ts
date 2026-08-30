import type { ComponentDoc } from "./types";

export const componentRegistry: ComponentDoc[] = [
  {
    id: "dotted-world-map",
    title: "Dotted World Map",
    description:
      "A lightweight SVG world map made of dots, each tinted by a value. Drop it into analytics, hero sections, or anywhere you need a quiet global pulse.",
    icon: "globe",
    demoPath: "app/components/[id]/demos/dotted-world-map-demo.tsx",
    docPath: "content/components/dotted-world-map.md",
    order: 1,
    enabled: true,
  },
];

export function findComponent(id: string): ComponentDoc | undefined {
  return componentRegistry
    .filter((c) => c.enabled !== false)
    .find((c) => c.id === id);
}

export function getEnabledComponents(): ComponentDoc[] {
  return [...componentRegistry]
    .filter((c) => c.enabled !== false)
    .sort((a, b) => a.order - b.order);
}
