import { RegionKey, Particle, CurrentVector, Hotspot, RiskMetrics, TransportPathway, CleanupSite, SimulationResponse, ExplainRequest, ExplainResponse, ReportRequest, ReportResponse } from "../../../shared/types/api";

export type { RegionKey, Particle, CurrentVector, Hotspot, RiskMetrics, TransportPathway, CleanupSite, SimulationResponse, ExplainRequest, ExplainResponse, ReportRequest, ReportResponse };
export type CopilotResponse = ExplainResponse;

export interface SimulationState {
  particles: Particle[];
  currents: CurrentVector[];
  selectedRegion: RegionKey;
  forecastTime: number; // 0 to 7 (forecast days)
  hotspots: Hotspot[];
  riskMetrics: RiskMetrics;
  loading: boolean;
  error: string | null;
  regionData: SimulationResponse | null;
  selectedParticleIndex: number;
}
