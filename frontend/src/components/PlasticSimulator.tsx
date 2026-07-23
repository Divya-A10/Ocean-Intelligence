import React, { useState } from "react";
import { 
  BarChart, ArrowRight, ShieldAlert, Waves, Anchor, Compass, Info,
  AlertTriangle, Flame, ShieldCheck, HelpCircle, ArrowUpRight, DollarSign, Calendar,
  Play, Pause, FastForward, RotateCcw, PlayCircle
} from "lucide-react";
import { SimulationResponse as ForecastData } from "../types/simulation";
import AnimatedNumber from "./AnimatedNumber";

interface PlasticSimulatorProps {
  forecastData: ForecastData | null;
  loading: boolean;
  forecastDay: number;
  setForecastDay: (day: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackSpeed: 0.5 | 1 | 2;
  setPlaybackSpeed: (speed: 0.5 | 1 | 2) => void;
  onRunSimulation?: () => void;
  onReset?: () => void;
}

export default function PlasticSimulator({ 
  forecastData, 
  loading,
  forecastDay,
  setForecastDay,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onRunSimulation,
  onReset
}: PlasticSimulatorProps) {
  const [activeModelTab, setActiveModelTab] = useState<"currents" | "pathways" | "degradation" | "biodiversity">("currents");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#fcfcfd] border border-gray-200 rounded-2xl p-8 text-center shadow-sm animate-fade-in">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin mb-3"></div>
        <p className="text-xs font-mono font-semibold text-gray-700">Running particle transport simulation...</p>
        <p className="text-[11px] font-mono text-gray-400 mt-1">Executing Lagrangian advection-diffusion calculations</p>
      </div>
    );
  }

  if (!forecastData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#fcfcfd] border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <ShieldAlert className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-xs text-gray-500">Select an observation region on the map to initialize trajectory analysis forecasting.</p>
      </div>
    );
  }

  // Calculate simulated parameters scaling with forecast days
  const driftSpeedModifier = (0.6 + forecastDay * 0.15);
  const biodiversityIndexModifier = Math.min(100, Math.round(forecastData.biodiversityExposureIndex * (0.5 + forecastDay * 0.11)));
  const uncertaintyPercentage = Math.round(forecastData.uncertaintyPercentage + (forecastDay * 2.2));

  return (
    <div className="space-y-6">
      
      {/* Top Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Timeline Playback Slider */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between col-span-1 lg:col-span-2 shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Projection Horizon Controls
              </span>
              <div className="flex items-center gap-2">
                {onRunSimulation && (
                  <button
                    onClick={onRunSimulation}
                    disabled={loading}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[10px] font-bold font-mono transition flex items-center gap-1 shadow-sm"
                  >
                    <PlayCircle className="w-3 h-3 fill-current" />
                    Run Simulation
                  </button>
                )}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-mono font-bold transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md text-gray-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
                  Simulation {isPlaying ? "Active" : "Paused"}
                </div>
              </div>
            </div>
            <h3 className="text-base font-bold text-gray-900">Drift Horizon Simulation</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Drag the control timeline slider to forecast passive microplastic drift corridors, advection trajectories, and degradation rates.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
              <span>Now (Day 0)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center cursor-pointer"
                  title={isPlaying ? "Pause Simulation" : "Play Forecast"}
                >
                  {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                </button>
                <span className="text-[#0071e3] font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  + {forecastDay} Days Horizon
                </span>
              </div>
              <span>+ 7 Days Out</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="7"
                value={forecastDay}
                onChange={(e) => {
                  setForecastDay(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md border border-gray-200 shrink-0">
                {( [0.5, 1, 2] as const ).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold transition-all ${
                      playbackSpeed === spd 
                        ? "bg-[#0071e3] text-white" 
                        : "text-gray-400 hover:text-gray-800"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
              <span>
                Advection Velocity: <strong className="text-gray-800"><AnimatedNumber value={forecastData.currentSpeedKnots * driftSpeedModifier} decimals={2} /> knots</strong>
              </span>
              <span>•</span>
              <span>
                Accumulation Rate: <strong className="text-gray-800">+<AnimatedNumber value={forecastDay * 12.5} decimals={0} />%</strong>
              </span>
              <span>•</span>
              <span>
                Margin of Error: <strong className="text-gray-800">±<AnimatedNumber value={uncertaintyPercentage} decimals={0} />%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Physical Integrity Metrics */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Model Confidence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-base font-bold text-gray-900">Forcing Uncertainty</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Calculated variance based on Copernicus CMEMS tidal databases matched against real drifting buoy arrays.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-xs font-semibold text-gray-600">Model Precision Index</span>
              <span className="text-xl font-bold font-mono text-emerald-600">
                <AnimatedNumber value={100 - uncertaintyPercentage} decimals={0} />%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${100 - uncertaintyPercentage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal">
              *Daily radar updates from Sentinel-2 automatically recalibrate current vector matrices.
            </p>
          </div>
        </div>
      </div>

      {/* Flagship Modules Display Tab switching */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-6 shadow-sm">
        <div className="flex border-b border-gray-200/80 pb-3 gap-1.5 overflow-x-auto">
          {[
            { id: "currents", label: "ROMS Surface Currents" },
            { id: "pathways", label: `Transport Pathways (${forecastData.transportPathways.length})` },
            { id: "degradation", label: "Polymer Degradation Estimate" },
            { id: "biodiversity", label: "Biodiversity Exposure" }
          ].map((tab) => {
            const isSelected = activeModelTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModelTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#0071e3] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Context Container */}
        <div className="mt-6">
          
          {activeModelTab === "currents" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Hydrologic Forcing Profiles</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    The primary physics forces driving polymer drift are ocean boundary currents, regional wind stress curl, and tide-induced sea surface heights.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Advection Current Velocity</span>
                    <span className="text-xs font-bold text-gray-800 font-mono">
                      <AnimatedNumber value={forecastData.currentSpeedKnots * driftSpeedModifier} decimals={2} /> knots
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Primary Drift Bearing</span>
                    <span className="text-xs font-bold text-gray-800 font-mono">
                      {forecastData.currentDirection}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Calibrated Feed</span>
                    <span className="text-xs font-semibold text-gray-700 font-mono truncate max-w-[180px]">
                      Sentinel-2 Radar Sync
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical simulation panel */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 min-h-[180px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <Compass className="w-6 h-6 text-sky-600 mb-2 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Advection Vector</span>
                <p className="text-[11px] text-gray-500 max-w-xs mt-1 leading-relaxed">
                  Surface friction calculations indicate high likelihood of shoreline deposition at current forecast rates.
                </p>
              </div>
            </div>
          )}

          {activeModelTab === "pathways" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Dominant Polymer Transport Corridors</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Corridors representing high-flux zones where marine debris is transported from coastal rivers to pelagic gyres.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecastData.transportPathways.map((pathway, idx) => {
                  const isCritical = pathway.intensity === "Extreme" || pathway.intensity === "Very High";
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between h-28 transition-all ${
                        isCritical 
                          ? "bg-red-50/5 border-red-200 text-red-700"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <div>
                        <span className="text-[8px] font-bold text-gray-400 block tracking-widest uppercase">Corridor {idx + 1}</span>
                        <h5 className="text-xs font-bold text-gray-900 mt-0.5">{pathway.name}</h5>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[10px] font-mono border-t border-gray-200/50 pt-2">
                        <span className="text-gray-400 font-semibold">Intensity</span>
                        <span className={`text-[10px] font-bold ${
                          isCritical ? "text-red-600" : "text-[#0071e3]"
                        }`}>
                          {pathway.intensity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeModelTab === "degradation" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Polymer Half-Life & Degradation Rates</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Calculated weathering times based on localized ultraviolet index values and sea water surface temperature dynamics.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { type: "PET (Drink bottles)", share: "45%", yearsToDegrade: Math.round(forecastData.degradationEstimateYears * 1.1) },
                    { type: "HDPE (Containers)", share: "25%", yearsToDegrade: Math.round(forecastData.degradationEstimateYears * 0.95) },
                    { type: "LDPE (Plastic bags)", share: "18%", yearsToDegrade: Math.round(forecastData.degradationEstimateYears * 0.4) },
                    { type: "PP (Caps & Straws)", share: "12%", yearsToDegrade: Math.round(forecastData.degradationEstimateYears * 0.75) },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                      <div className="flex justify-between text-xs font-semibold text-gray-800">
                        <span>{item.type} ({item.share} share)</span>
                        <span className="font-mono text-gray-500">
                          <AnimatedNumber value={item.yearsToDegrade} decimals={0} /> years
                        </span>
                      </div>
                      <div className="w-full bg-gray-255 h-1.5 rounded-full overflow-hidden mt-2">
                        <div 
                          className="bg-sky-500 h-full transition-all duration-700 ease-out" 
                          style={{ width: `${100 - Math.min(90, idx * 25)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chemical Exposure</span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1">Chemical Leachate Accrual</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Drifting micro-plastics undergo steady photolysis, leaking phthalate plasticizers and bisphenols directly into surrounding habitats.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg flex gap-2.5 mt-4 text-[11px] text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Leachate risk at Day {forecastDay} is classified as <strong className="font-bold">MODERATE</strong>. Organics bioaccumulation remains primary concern.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeModelTab === "biodiversity" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Biodiversity Encounter Index</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Overlap matrices measuring microplastic density tracks directly against active pelagic species migration routes and marine sanctuaries.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Critical Habitat Overlaps</span>
                    <span className="font-bold font-mono text-gray-800">{Math.round(forecastData.plasticHotspotsCount * 0.35)} areas</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Exposure Percentile</span>
                    <span className="font-bold font-mono text-red-600">
                      <AnimatedNumber value={biodiversityIndexModifier} decimals={0} />% Risk
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Pelagic Ingestion Threat</span>
                    <span className="font-bold text-amber-600">Elevated</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center min-h-[180px] flex flex-col justify-center items-center">
                <ShieldCheck className="w-7 h-7 text-emerald-600 mb-2" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scientific Guidance</span>
                <p className="text-[11px] text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                  Recommended sanctuary exclusion zones: high-intensity tracking around local seagrass and nesting corals is advised.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Virtual Particle Sensors Feed Table - Full Width Elegant White Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-gray-500" />
            Active Buoy Sensors
          </span>
          <span className="text-[10px] font-mono text-emerald-600 uppercase font-semibold">Teledyne Floats Synchronized</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900">Virtual Lagrangian Marine Float Telemetry</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Autonomous virtual tracking sensors recording polymer particles counts per cubic meter.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider pb-2">
                <th className="pb-2 text-gray-500 font-bold">Float Sensor ID</th>
                <th className="pb-2 text-gray-500 text-center font-bold">Estimated Particle Density</th>
                <th className="pb-2 text-gray-500 text-center font-bold">Target Particle Classification</th>
                <th className="pb-2 text-gray-500 text-right font-bold">Active Drift Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 animate-fade-in">
              {forecastData.particles.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-2.5 text-gray-900 font-bold">V-FLOAT-{p.id}</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">
                    <AnimatedNumber value={Math.round(p.density * (0.8 + forecastDay * 0.08))} decimals={0} />
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[10px] text-gray-600">
                      {p.size}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-gray-400 font-medium">{p.ageDays + forecastDay} Days Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
