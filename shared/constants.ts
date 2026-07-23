import { RegionKey } from "./types/api";

export interface RegionMetadata {
  key: RegionKey;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export const SUPPORTED_REGIONS: RegionMetadata[] = [
  {
    key: "bay-of-bengal",
    name: "Bay of Bengal",
    lat: 15.0,
    lng: 88.0,
    description: "Monsoonal ocean basin with high riverine plastic discharges from Ganges and Irrawaddy deltas."
  },
  {
    key: "singapore-strait",
    name: "Singapore Strait",
    lat: 1.25,
    lng: 103.8,
    description: "Major maritime bottleneck experiencing intense commercial vessel traffic and strong tidal currents."
  },
  {
    key: "north-pacific-gyre",
    name: "North Pacific Gyre",
    lat: 35.0,
    lng: -140.0,
    description: "Global microplastic accumulation hotspot driven by clockwise subtropical circulation."
  },
  {
    key: "mediterranean-sea",
    name: "Mediterranean Sea",
    lat: 38.0,
    lng: 5.0,
    description: "Semi-enclosed basin with high coastal density and cyclonic surface retention zones."
  }
];

export const DEFAULT_REGION_KEY: RegionKey = "bay-of-bengal";
