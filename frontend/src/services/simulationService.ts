import { apiClient } from "./apiClient";
import { RegionKey, SimulationResponse, CurrentVector, Hotspot, ExplainRequest, ExplainResponse, ReportRequest, ReportResponse } from "../../../shared/types/api";

export const simulationService = {
  /**
   * Fetch complete simulation dataset for a region and forecast day
   */
  async getSimulation(region: RegionKey, day: number = 0): Promise<SimulationResponse> {
    return apiClient<SimulationResponse>(`/api/simulation?region=${region}&day=${day}`);
  },

  /**
   * Fetch ocean velocity vector grid
   */
  async getCurrents(region: RegionKey): Promise<CurrentVector[]> {
    return apiClient<CurrentVector[]>(`/api/currents?region=${region}`);
  },

  /**
   * Fetch marine plastic density hotspots
   */
  async getHotspots(region: RegionKey): Promise<Hotspot[]> {
    return apiClient<Hotspot[]>(`/api/hotspots?region=${region}`);
  },

  /**
   * Query Scientific Copilot for natural language analysis
   */
  async explain(req: ExplainRequest): Promise<ExplainResponse> {
    return apiClient<ExplainResponse>("/api/explain", {
      method: "POST",
      body: JSON.stringify(req)
    });
  },

  /**
   * Generate downloadable scientific whitepaper report
   */
  async generateReport(req: ReportRequest): Promise<ReportResponse> {
    return apiClient<ReportResponse>("/api/report", {
      method: "POST",
      body: JSON.stringify(req)
    });
  }
};
