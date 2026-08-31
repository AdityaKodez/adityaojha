import type { WorldPoint } from "@/components/ui/dotted-world-map";

// `WorldPoint` now lives with the component so it ships through the shadcn
// registry as a single self-contained file. Re-exported for existing importers.
export type { WorldPoint };

// Heat source data for the demo map. Values are illustrative rather than live census data.

export const worldPopulationHeatSources: WorldPoint[] = [
  { name: "Ganges Plain", lat: 25, lng: 85, value: 0.98, radius: 18 },
  { name: "Bangladesh", lat: 23, lng: 90, value: 0.94, radius: 11 },
  { name: "Eastern China", lat: 31, lng: 118, value: 0.88, radius: 19 },
  { name: "Java", lat: -7, lng: 110, value: 0.86, radius: 12 },
  { name: "Japan", lat: 36, lng: 139, value: 0.75, radius: 10 },
  { name: "Pakistan", lat: 30, lng: 70, value: 0.72, radius: 17 },
  { name: "Southeast Asia", lat: 15, lng: 103, value: 0.65, radius: 18 },
  { name: "Western Europe", lat: 50, lng: 8, value: 0.66, radius: 21 },
  { name: "Nile Delta", lat: 30, lng: 31, value: 0.7, radius: 10 },
  { name: "Nigeria", lat: 8, lng: 7, value: 0.58, radius: 17 },
  { name: "Eastern United States", lat: 39, lng: -78, value: 0.52, radius: 22 },
  { name: "Central Mexico", lat: 20, lng: -100, value: 0.46, radius: 14 },
  { name: "Southeastern Brazil", lat: -23, lng: -46, value: 0.44, radius: 15 },
  { name: "Andes", lat: -12, lng: -77, value: 0.3, radius: 13 },
  { name: "Great Lakes", lat: 43, lng: -82, value: 0.35, radius: 18 },
  { name: "Southern Africa", lat: -26, lng: 28, value: 0.3, radius: 14 },
];

// Edge regions, weighted by share of served traffic. Latency lives in the tooltip.
export const edgeRegionTrafficSources: WorldPoint[] = [
  {
    name: "Ashburn",
    lat: 39.04,
    lng: -77.49,
    value: 0.95,
    radius: 15,
    tooltip: "Ashburn — 32% of traffic, p50 18 ms",
  },
  {
    name: "Frankfurt",
    lat: 50.11,
    lng: 8.68,
    value: 0.82,
    radius: 14,
    tooltip: "Frankfurt — 21% of traffic, p50 22 ms",
  },
  {
    name: "Singapore",
    lat: 1.35,
    lng: 103.82,
    value: 0.7,
    radius: 13,
    tooltip: "Singapore — 14% of traffic, p50 41 ms",
  },
  {
    name: "Oregon",
    lat: 45.8,
    lng: -119.7,
    value: 0.58,
    radius: 16,
    tooltip: "Oregon — 11% of traffic, p50 27 ms",
  },
  {
    name: "Mumbai",
    lat: 19.08,
    lng: 72.88,
    value: 0.52,
    radius: 13,
    tooltip: "Mumbai — 9% of traffic, p50 46 ms",
  },
  {
    name: "São Paulo",
    lat: -23.55,
    lng: -46.63,
    value: 0.36,
    radius: 14,
    tooltip: "São Paulo — 6% of traffic, p50 58 ms",
  },
  {
    name: "Sydney",
    lat: -33.87,
    lng: 151.21,
    value: 0.28,
    radius: 12,
    tooltip: "Sydney — 4% of traffic, p50 63 ms",
  },
  {
    name: "Cape Town",
    lat: -33.92,
    lng: 18.42,
    value: 0.18,
    radius: 11,
    tooltip: "Cape Town — 3% of traffic, p50 74 ms",
  },
];

// Commit activity across contributor hubs — illustrative, not live data.
export const contributorActivitySources: WorldPoint[] = [
  {
    name: "Bengaluru",
    lat: 12.97,
    lng: 77.59,
    value: 0.95,
    radius: 12,
    tooltip: "Bengaluru — 412 commits this month",
  },
  {
    name: "San Francisco",
    lat: 37.77,
    lng: -122.42,
    value: 0.86,
    radius: 12,
    tooltip: "San Francisco — 358 commits this month",
  },
  {
    name: "London",
    lat: 51.51,
    lng: -0.13,
    value: 0.72,
    radius: 11,
    tooltip: "London — 241 commits this month",
  },
  {
    name: "Berlin",
    lat: 52.52,
    lng: 13.4,
    value: 0.68,
    radius: 11,
    tooltip: "Berlin — 226 commits this month",
  },
  {
    name: "Seoul",
    lat: 37.57,
    lng: 126.98,
    value: 0.55,
    radius: 10,
    tooltip: "Seoul — 168 commits this month",
  },
  {
    name: "Toronto",
    lat: 43.65,
    lng: -79.38,
    value: 0.42,
    radius: 11,
    tooltip: "Toronto — 121 commits this month",
  },
  {
    name: "São Paulo",
    lat: -23.55,
    lng: -46.63,
    value: 0.34,
    radius: 12,
    tooltip: "São Paulo — 96 commits this month",
  },
  {
    name: "Lagos",
    lat: 6.52,
    lng: 3.38,
    value: 0.26,
    radius: 11,
    tooltip: "Lagos — 71 commits this month",
  },
  {
    name: "Nairobi",
    lat: -1.29,
    lng: 36.82,
    value: 0.16,
    radius: 10,
    tooltip: "Nairobi — 43 commits this month",
  },
];
