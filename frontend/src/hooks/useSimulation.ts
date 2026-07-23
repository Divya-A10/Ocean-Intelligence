import { useState, useEffect, useCallback } from "react";
import { RegionKey, SimulationState, Particle, CurrentVector, Hotspot, RiskMetrics } from "../types/simulation";
import { simulationService } from "../services/simulationService";

const initialRiskMetrics: RiskMetrics = {
  speed: 2.4,
  risk: "Moderate",
  accumulation: 35,
  confidence: 94,
  biodiversityIndex: 82,
  fisheriesImpact: 35
};

export function useSimulation(initialRegion: RegionKey = "bay-of-bengal", initialDay: number = 0) {
  const [state, setState] = useState<SimulationState>({
    particles: [],
    currents: [],
    selectedRegion: initialRegion,
    forecastTime: initialDay,
    hotspots: [],
    riskMetrics: initialRiskMetrics,
    loading: true,
    error: null,
    regionData: null,
    selectedParticleIndex: 100
  });

  // Default isPlaying to false (Requirement: Remove all automatic timeline playback)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);

  const fetchSimulationData = useCallback(async (region: RegionKey, day: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [simResponse, currents, hotspots] = await Promise.all([
        simulationService.getSimulation(region, day),
        simulationService.getCurrents(region),
        simulationService.getHotspots(region)
      ]);

      setState(prev => ({
        ...prev,
        regionData: simResponse,
        particles: simResponse.particles,
        riskMetrics: simResponse.metrics || prev.riskMetrics,
        currents,
        hotspots,
        loading: false
      }));
    } catch (err: any) {
      console.error("Failed to load simulation state:", err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "Error communicating with simulation backend"
      }));
    }
  }, []);

  useEffect(() => {
    fetchSimulationData(state.selectedRegion, state.forecastTime);
  }, [state.selectedRegion, state.forecastTime, fetchSimulationData]);

  // Synchronized Timeline playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 3000 / speed;
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        forecastTime: prev.forecastTime >= 7 ? 0 : prev.forecastTime + 1
      }));
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const setRegion = useCallback((region: RegionKey) => {
    setIsPlaying(false);
    setState(prev => ({ ...prev, selectedRegion: region, forecastTime: 0 }));
  }, []);

  const setForecastTime = useCallback((day: number) => {
    setState(prev => ({ ...prev, forecastTime: day }));
  }, []);

  const setSelectedParticleIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedParticleIndex: index }));
  }, []);

  const runSimulation = useCallback(async () => {
    await fetchSimulationData(state.selectedRegion, state.forecastTime);
  }, [fetchSimulationData, state.selectedRegion, state.forecastTime]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setState(prev => ({ ...prev, forecastTime: 0 }));
  }, []);

  return {
    ...state,
    simulation: state.regionData,
    region: state.selectedRegion,
    day: state.forecastTime,
    isPlaying,
    speed,
    setIsPlaying,
    setSpeed,
    setRegion,
    setDay: setForecastTime,
    setForecastTime,
    setSelectedParticleIndex,
    runSimulation,
    reset,
    refresh: () => fetchSimulationData(state.selectedRegion, state.forecastTime)
  };
}
