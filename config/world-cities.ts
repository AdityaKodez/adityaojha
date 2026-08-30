// Inlined demo dataset — capitals + major tech hubs.
// `value` is a normalized intensity (0..1) used to pick the dot's color from the scale.
export type WorldPoint = { name: string; lat: number; lng: number; value: number };

export const worldCities: WorldPoint[] = [
  // North America
  { name: "San Francisco", lat: 37.7749, lng: -122.4194, value: 0.95 },
  { name: "New York", lat: 40.7128, lng: -74.006, value: 0.9 },
  { name: "Seattle", lat: 47.6062, lng: -122.3321, value: 0.85 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832, value: 0.7 },
  { name: "Austin", lat: 30.2672, lng: -97.7431, value: 0.65 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332, value: 0.55 },
  { name: "Vancouver", lat: 49.2827, lng: -123.1207, value: 0.6 },

  // South America
  { name: "São Paulo", lat: -23.5505, lng: -46.6333, value: 0.75 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816, value: 0.5 },
  { name: "Lima", lat: -12.0464, lng: -77.0428, value: 0.4 },
  { name: "Bogotá", lat: 4.711, lng: -74.0721, value: 0.35 },
  { name: "Santiago", lat: -33.4489, lng: -70.6693, value: 0.35 },

  // Europe
  { name: "London", lat: 51.5074, lng: -0.1278, value: 0.95 },
  { name: "Berlin", lat: 52.52, lng: 13.405, value: 0.85 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041, value: 0.8 },
  { name: "Paris", lat: 48.8566, lng: 2.3522, value: 0.85 },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686, value: 0.7 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038, value: 0.6 },
  { name: "Lisbon", lat: 38.7223, lng: -9.1393, value: 0.55 },
  { name: "Warsaw", lat: 52.2297, lng: 21.0122, value: 0.6 },
  { name: "Zurich", lat: 47.3769, lng: 8.5417, value: 0.65 },
  { name: "Dublin", lat: 53.3498, lng: -6.2603, value: 0.6 },
  { name: "Helsinki", lat: 60.1699, lng: 24.9384, value: 0.5 },
  { name: "Rome", lat: 41.9028, lng: 12.4964, value: 0.55 },

  // Africa
  { name: "Cape Town", lat: -33.9249, lng: 18.4241, value: 0.5 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473, value: 0.45 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792, value: 0.55 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, value: 0.45 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, value: 0.35 },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898, value: 0.3 },

  // Middle East
  { name: "Dubai", lat: 25.2048, lng: 55.2708, value: 0.75 },
  { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, value: 0.85 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784, value: 0.65 },

  // Asia
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, value: 0.95 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, value: 0.9 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, value: 0.85 },
  { name: "Seoul", lat: 37.5665, lng: 126.978, value: 0.85 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, value: 0.8 },
  { name: "Delhi", lat: 28.6139, lng: 77.209, value: 0.7 },
  { name: "Beijing", lat: 39.9042, lng: 116.4074, value: 0.75 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737, value: 0.8 },
  { name: "Shenzhen", lat: 22.5431, lng: 114.0579, value: 0.85 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694, value: 0.8 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, value: 0.6 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018, value: 0.55 },
  { name: "Manila", lat: 14.5995, lng: 120.9842, value: 0.4 },
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869, value: 0.5 },
  { name: "Hanoi", lat: 21.0285, lng: 105.8542, value: 0.4 },
  { name: "Karachi", lat: 24.8607, lng: 67.0011, value: 0.45 },

  // Oceania
  { name: "Sydney", lat: -33.8688, lng: 151.2093, value: 0.7 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631, value: 0.65 },
  { name: "Auckland", lat: -36.8485, lng: 174.7633, value: 0.45 },
];
