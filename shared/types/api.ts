/**
 * Shared API Data Models for Ocean Intelligence Platform
 * Contract between FastAPI / Express Backend and React Frontend
 */

export type RegionKey = "bay-of-bengal" | "singapore-strait" | "north-pacific-gyre" | "mediterranean-sea";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Particle {
  id: string | number;
  lat: number;
  lng: number;
  density: number; // particles/km2
  size: "micro" | "meso" | "macro";
  ageDays: number;
  origin?: string;
  released?: string;
  speedKnots?: number;
  dest?: string;
  etaDays?: number;
  isGlobal?: boolean;
}

export interface CurrentVector {
  lat: number;
  lng: number;
  u: number; // Eastward velocity component (m/s)
  v: number; // Northward velocity component (m/s)
  magnitudeKnots: number;
  directionDegrees: number;
}

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  intensity: "Moderate" | "High" | "Extreme" | "Critical";
  radiusKm: number;
  estimatedTons: number;
}

export interface TransportPathway {
  name: string;
  intensity: "Low" | "Medium" | "High" | "Very High" | "Extreme";
}

export interface CleanupSite {
  name: string;
  costEst: string;
  estRecovery: string;
  status: string;
}

export interface RiskMetrics {
  speed: number;
  risk: "Low" | "Moderate" | "Elevated" | "Critical";
  accumulation: number;
  confidence: number;
  biodiversityIndex: number;
  fisheriesImpact: number;
}

export interface SimulationResponse {
  regionKey: RegionKey;
  regionName: string;
  coordinates: Coordinates;
  forecastDay: number;
  timestamp: string;
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
  transportPathways: TransportPathway[];
  particles: Particle[];
  cleanupSites: CleanupSite[];
  metrics: RiskMetrics;
}

export interface ExplainRequest {
  prompt: string;
  regionKey: RegionKey;
  forecastDay?: number;
  selectedParticleIndex?: number;
}

export interface Citation {
  title: string;
  url: string;
}

export interface ExplainResponse {
  text: string;
  citations: Citation[];
  confidenceIndex: number;
}

export interface ReportRequest {
  regionKey: RegionKey;
  reportType: "impact" | "briefing" | "cleanup" | "scientific";
}

export interface ReportResponse {
  markdown: string;
  generatedAt: string;
  regionName: string;
}
