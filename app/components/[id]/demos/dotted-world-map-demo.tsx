import { DottedWorldMap } from "@/components/ui/dotted-world-map";

export const weeklyVisitors = [
  {
    name: "New York",
    lat: 40.7128,
    lng: -74.006,
    value: 0.95,
    radius: 13,
    tooltip: "New York — 1,240 visitors this week",
  },
  {
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    value: 0.9,
    radius: 12,
    tooltip: "London — 1,120 visitors this week",
  },
  {
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    value: 0.8,
    radius: 12,
    tooltip: "Tokyo — 980 visitors this week",
  },
  {
    name: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    value: 0.68,
    radius: 10,
    tooltip: "Singapore — 760 visitors this week",
  },
  {
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    value: 0.62,
    radius: 11,
    tooltip: "Mumbai — 690 visitors this week",
  },
  {
    name: "Berlin",
    lat: 52.52,
    lng: 13.405,
    value: 0.5,
    radius: 9,
    tooltip: "Berlin — 540 visitors this week",
  },
  {
    name: "São Paulo",
    lat: -23.5505,
    lng: -46.6333,
    value: 0.45,
    radius: 10,
    tooltip: "São Paulo — 480 visitors this week",
  },
  {
    name: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    value: 0.32,
    radius: 9,
    tooltip: "Sydney — 310 visitors this week",
  },
];

export function DottedWorldMapDemo() {
  return (
    <div className="w-full max-w-3xl">
      <DottedWorldMap
        points={weeklyVisitors}
        dotRadius={2}
        spacing={6}
        baseOpacity={0.92}
        legendLabels={{ low: "Fewer visitors", high: "More visitors" }}
      />
    </div>
  );
}
