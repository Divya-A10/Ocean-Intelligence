export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Pathway {
  name: string;
  intensity: "Low" | "Medium" | "High" | "Very High" | "Extreme";
}

export interface Particle {
  id: number;
  lat: number;
  lng: number;
  density: number;
  size: "micro" | "meso" | "macro";
  ageDays: number;
}

export interface CleanupSite {
  name: string;
  costEst: string;
  estRecovery: string;
  status: string;
}

export interface ForecastData {
  regionName: string;
  coordinates: Coordinate;
  oceanHealthScore: number;
  globalOceanTemperature: number;
  plasticHotspotsCount: number;
  activeWeatherSystems: string;
  satelliteSnapshot: string;
  currentSpeedKnots: number;
  currentDirection: string;
  degradationEstimateYears: number;
  uncertaintyPercentage: number;
  cleanupPriorityRank: number;
  biodiversityExposureIndex: number;
  fisheriesImpactPercentage: number;
  transportPathways: Pathway[];
  particles: Particle[];
  cleanupSites: CleanupSite[];
}

export type RegionKey = "bay-of-bengal" | "singapore-strait" | "north-pacific-gyre" | "mediterranean-sea";

export interface CopilotResponse {
  text: string;
  citations?: { title: string; url: string }[];
  confidenceIndex?: number;
}
