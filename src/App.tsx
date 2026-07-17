import React, { useState, useEffect } from "react";
import { 
  Compass, Waves, Activity, AlertTriangle, FileText, Database, ShieldAlert,
  BarChart, Layers, HelpCircle, BookOpen, Settings, Anchor, Thermometer,
  ShieldCheck, ArrowUpRight, ChevronRight, Globe, Info, Sparkles, User, RefreshCw, Terminal, Clock, Play, Pause
} from "lucide-react";
import { RegionKey, ForecastData } from "./types";
import GlobePreview from "./components/GlobePreview";
import PlasticSimulator from "./components/PlasticSimulator";
import AICopilotWorkspace from "./components/AICopilotWorkspace";
import ReportsGenerator from "./components/ReportsGenerator";
import { generateParticleMetadata } from "./utils/particleGenerator";
import AnimatedNumber from "./components/AnimatedNumber";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "plastic" | "copilot" | "reports">("dashboard");
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("bay-of-bengal");
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  // Unified global forecast timeline states (Synchronizes everything)
  const [forecastDay, setForecastDay] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);

  // Particle inspector index state (Synchronizes with raycasting selection)
  const [selectedParticleIndex, setSelectedParticleIndex] = useState<number>(100);

  // Reset to default regional particle when region changes
  useEffect(() => {
    setSelectedParticleIndex(100);
  }, [selectedRegion]);

  // Synchronized Timeline playback loop in App.tsx
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 2500 / playbackSpeed;
    const interval = setInterval(() => {
      setForecastDay((prev) => (prev % 7) + 1); // Cycle smoothly from Day 1 to Day 7
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const newsList = [
    { id: 1, source: "Ocean IQ Simulation", text: "New simulations suggest monsoonal runoff increases microplastics loading by 35% in river deltas.", category: "Ocean Hydrology" },
    { id: 2, source: "OBIS Database", text: "Definitive study published on pelagic teleost plastic particle ingestion thresholds.", category: "Marine Biology" },
    { id: 3, source: "Copernicus CMEMS", text: "Global surface advection vectors updated with high-precision tidal forcing.", category: "Remote Sensing" }
  ];

  // Fetch forecast data on region change
  useEffect(() => {
    async function fetchForecast() {
      setLoading(true);
      try {
        const res = await fetch(`/api/forecast?region=${selectedRegion}`);
        if (res.ok) {
          const data = await res.json();
          setForecastData(data);
        }
      } catch (err) {
        console.error("Failed to load forecast data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, [selectedRegion]);

  // Derived region parameters based on day
  const getDynamicMetrics = () => {
    if (!forecastData) return { speed: 0, risk: "Low", accumulation: 0, confidence: 95 };
    
    // Scale current speed with selected day
    const speed = (forecastData.currentSpeedKnots * (0.6 + forecastDay * 0.15));
    
    // Calculate risk status based on selected day
    let risk = "Low";
    if (forecastDay >= 6) risk = "Extreme";
    else if (forecastDay >= 4) risk = "High";
    else if (forecastDay >= 3) risk = "Moderate";

    // Accumulation grows as day advances
    const accumulation = Math.min(100, Math.round(forecastData.biodiversityExposureIndex * (0.5 + forecastDay * 0.11)));
    
    // Confidence decays as prediction horizon expands
    const confidence = Math.max(70, Math.round(100 - forecastData.uncertaintyPercentage - (forecastDay * 2.2)));

    return { speed, risk, accumulation, confidence };
  };

  const dynamicMetrics = getDynamicMetrics();

  // Get active particle details dynamically using the scientific procedural generator
  const currentParticle = generateParticleMetadata(selectedParticleIndex, selectedRegion);

  // Dynamic context-aware Ecological Alerts that respond to selected region and day slider!
  const getDynamicAlerts = () => {
    const regionName = forecastData?.regionName || "Selected Sector";
    const alerts = [];
    if (forecastDay <= 2) {
      alerts.push({
        id: 1,
        type: "info",
        text: `Baseline advection observed in ${regionName}. Currents align with CMEMS model predictions.`,
        time: "Just now"
      });
      alerts.push({
        id: 2,
        type: "info",
        text: `Surface wind forcing of ~12 knots driving typical Lagrangian trajectories across pelagic zones.`,
        time: "10m ago"
      });
    } else if (forecastDay <= 4) {
      alerts.push({
        id: 1,
        type: "warning",
        text: `⚠ Moderate Risk: Increased convergence forming along maritime boundaries in ${regionName}.`,
        time: "Just now"
      });
      alerts.push({
        id: 2,
        type: "warning",
        text: `Localized eddy structures show signs of trapping polymer micro-specks near coastlines.`,
        time: "5m ago"
      });
    } else if (forecastDay <= 6) {
      alerts.push({
        id: 1,
        type: "critical",
        text: `⚠ Elevated Threat: Simulated particle density is entering sensitive coral reefs and marine sanctuaries.`,
        time: "Just now"
      });
      alerts.push({
        id: 2,
        type: "critical",
        text: `Pelagic encounter index shows significant ingestion threat to local migratory fish.`,
        time: "3m ago"
      });
    } else {
      alerts.push({
        id: 1,
        type: "critical",
        text: `🔴 CRITICAL EXPOSURE EVENT: Extreme particle retention exceeds tolerance levels in ${regionName} coastal segments.`,
        time: "Just now"
      });
      alerts.push({
        id: 2,
        type: "critical",
        text: `Tidal shear forcing at maximum. Leaching phthalates risk classified as severe. Urgent action proposed.`,
        time: "1m ago"
      });
    }
    return alerts;
  };

  const activeAlerts = getDynamicAlerts();

  // Dynamic context-aware AI Forecast Briefing text that reacts instantly to timeline changes
  const getAiForecastBriefing = () => {
    switch (selectedRegion) {
      case "bay-of-bengal":
        if (forecastDay <= 2) return "Southwest monsoonal currents initiate northward Lagrangian transport. Low-density polymers are currently distributed along coastal delta plumes.";
        if (forecastDay <= 4) return "Vector speeds of 1.8 knots drive particles into active anticyclonic eddies. Convergence begins to consolidate near the Andaman coral shelf.";
        if (forecastDay <= 6) return "Model shows complete retention of high-density polyethylene in the northern basin. Mechanical wave shear induces accelerated fragmentation.";
        return "CRITICAL beaching event modelled on the Sundarbans mangrove ecosystems. Phthalate leachate toxicity reaches maximum values. Recommending skimmer barrier deployments.";
      
      case "singapore-strait":
        if (forecastDay <= 2) return "Tidal currents in the Malacca channel accelerate polymer drift eastward. Boundary currents are elevated at 2.9 knots.";
        if (forecastDay <= 4) return "Narrow bottleneck constraints induce heavy shear stress. Synthetic particles gather around Batam vessel lanes and industrial outfalls.";
        if (forecastDay <= 6) return "Shipping lanes exhibit extreme marine debris accumulation. Secondary microplastic coating releases are expected to spike by 30%.";
        return "EXTREME CONVERGENCE. Singapore port anchorage and Riau reefs experience 94% exposure risk. Proposing immediate deployment of passive tidal booms.";

      case "north-pacific-gyre":
        if (forecastDay <= 2) return "Subtropical gyre clockwise transport carries California and Kuroshio inflows into a steady circular advection spiral.";
        if (forecastDay <= 4) return "Slow advection currents trap particles in the Great Pacific Garbage convergence node. Photodegradation rates are highly accelerated.";
        if (forecastDay <= 6) return "Concentric hotspot centers expand. Muted white polymer debris undergoes steady mechanical breakdown under high solar ultraviolet forcing.";
        return "Maximum pelagic accumulation reaches apex at Day 7. Marine species encounters are elevated. Focus observation is recommended at the subtropical convergence zone.";

      case "mediterranean-sea":
        if (forecastDay <= 2) return "Nile Delta and Po River runoffs enter closed-basin cyclonic currents. Wave advection pushes debris northwestward.";
        if (forecastDay <= 4) return "Urban microplastics are trapped in Adriatic sub-basin eddies. High accumulation values predicted along regional sanctuary borders.";
        if (forecastDay <= 6) return "Pelagos sanctuary boundary experiences persistent plastic-marine life contact. Exposure index increases to 82% over baseline levels.";
        return "Severe closed-basin trapping observed. Balearic and Ionian abyssal sinks contain maximum micro-particle concentrations. High leachate index warrants sentinel tracking.";

      default:
        return "Lagrangian trajectory models are tracking microplastic advection vectors. Scrub through the timeline to predict advection pathways and bio-exposure risk levels.";
    }
  };

  const aiBriefing = getAiForecastBriefing();

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 flex flex-col font-sans select-none antialiased relative">
      
      {/* Apple-style Simple, Clean and Easy to Understand Navigation Header */}
      <header id="main_header_nav" className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <Waves className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-gray-900 flex items-center gap-1.5">
            OCEAN<span className="text-gray-500 font-medium">IQ</span>
            <span className="bg-gray-100 border border-gray-250 text-gray-600 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded tracking-wide ml-1">
              Marine Science Platform
            </span>
          </h2>
        </div>

        {/* Global status message */}
        <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Ocean Tracking Active</span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Apple-style minimalist sidebar */}
        <aside id="app_layout_aside" className="w-full md:w-64 bg-[#f5f5f7] border-r border-gray-200/80 flex flex-col justify-between p-5 space-y-6">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-2 px-3">
                Research Modules
              </span>
              <nav className="space-y-0.5">
                {[
                  { id: "dashboard", label: "Ocean Simulator", icon: Compass },
                  { id: "plastic", label: "Trajectory Analysis", icon: Waves },
                  { id: "copilot", label: "Scientific Copilot", icon: Sparkles },
                  { id: "reports", label: "Report Synthesis", icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-white border border-gray-200 shadow-sm text-[#0071e3]"
                          : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-[#0071e3]" : "text-gray-500"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 text-[10px] font-mono text-gray-400 space-y-1">
            <div>Data Feed: <span className="text-gray-600 font-medium">Satellite Observations</span></div>
            <div>Database Ref: <span className="text-gray-600">Marine Currents Model</span></div>
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)] bg-[#fbfbfd]">
          
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* Top Title Bar - Neat and Minimal */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Lagrangian Particle Transport Simulation
                  </h1>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-2xl">
                    Dynamic oceanographic modeling workspace. Select coordinates on the map below. 
                    The interactive timeline controls simulated vector movements, bioaccumulation hotspots, and current values globally.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs text-gray-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Health Index</span>
                    <span className="font-semibold text-emerald-600">{loading ? "..." : `${forecastData?.oceanHealthScore || 78} pts`}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Globe map visualization - occuping 80% on desktop */}
              <GlobePreview 
                selectedRegion={selectedRegion} 
                onRegionChange={setSelectedRegion}
                forecastData={forecastData}
                loading={loading}
                forecastDay={forecastDay}
                setForecastDay={setForecastDay}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playbackSpeed={playbackSpeed}
                setPlaybackSpeed={setPlaybackSpeed}
                onNavigateToReports={() => setActiveTab("reports")}
                selectedParticleIndex={selectedParticleIndex}
                onParticleProbe={setSelectedParticleIndex}
              />

              {/* REDESIGNED: Information Cards synchronized with timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Velocity</span>
                    <span className="text-xs font-mono font-bold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-full">
                      Forecasted
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-light tracking-tight text-gray-900 font-mono">
                      {loading ? "..." : <AnimatedNumber value={dynamicMetrics.speed} decimals={2} />}
                    </span>
                    <span className="text-xs font-medium text-gray-500 ml-1">knots</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2.5">
                    Flow speed scaling with tidal forcing at Day {forecastDay}.
                  </p>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transport Risk</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      dynamicMetrics.risk === "Low" ? "bg-emerald-50 text-emerald-700" :
                      dynamicMetrics.risk === "Moderate" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700 animate-pulse"
                    }`}>
                      {dynamicMetrics.risk}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-light tracking-tight text-gray-900">
                      {dynamicMetrics.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2.5">
                    Dynamic threat index mapping potential marine biosphere contact.
                  </p>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accumulation Index</span>
                    <span className="text-[10px] font-mono text-gray-500">Convergence</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-light tracking-tight text-gray-900 font-mono">
                      {loading ? "..." : <><AnimatedNumber value={dynamicMetrics.accumulation} />%</>}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-[#0071e3] h-full transition-all duration-500" style={{ width: `${dynamicMetrics.accumulation}%` }}></div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2.5">
                    Estimated particle aggregation in beaching or convergence zones.
                  </p>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prediction Confidence</span>
                    <span className="text-[10px] font-mono text-gray-400">Error Growth</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-light tracking-tight text-gray-900 font-mono">
                      {loading ? "..." : <><AnimatedNumber value={dynamicMetrics.confidence} />%</>}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2.5">
                    Degrades naturally as the forecast projection extends to +7 days.
                  </p>
                </div>

              </div>

              {/* INTEGRATED: Active Lagrangian Particle Inspector & Alerts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Virtual Particle Inspector (Exactly requested interactive feature!) */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-2">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#0071e3]" />
                        Active Lagrangian Particle Probe
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Click on any particle in the 3D visualizer above or select below to inspect real-time trajectory analytics.
                      </p>
                    </div>

                    <select
                      value={selectedParticleIndex}
                      onChange={(e) => setSelectedParticleIndex(Number(e.target.value))}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 outline-none focus:ring-1 focus:ring-[#0071e3]"
                    >
                      {[70, 100, 120, 150, 180, 200, 220, 250, 280, 300].map((idx) => {
                        const optMeta = generateParticleMetadata(idx, selectedRegion);
                        return (
                          <option key={idx} value={idx}>
                            {optMeta.name} {optMeta.isGlobal ? "(Global Drift)" : "(Regional)"}
                          </option>
                        );
                      })}
                      {![70, 100, 120, 150, 180, 200, 220, 250, 280, 300].includes(selectedParticleIndex) && (
                        <option value={selectedParticleIndex}>
                          {currentParticle.name} (Selected in 3D View)
                        </option>
                      )}
                    </select>
                  </div>

                  {currentParticle ? (
                    <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                      
                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Float ID</span>
                        <span className="text-sm font-bold font-mono text-gray-800">#{currentParticle.id}</span>
                      </div>

                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Release Origin</span>
                        <span className="text-sm font-medium text-gray-800 truncate block">{currentParticle.origin}</span>
                      </div>

                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Date Released</span>
                        <span className="text-sm font-mono text-gray-850">{currentParticle.released}</span>
                      </div>

                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Distance Drifted</span>
                        <span className="text-sm font-mono font-bold text-[#0071e3]">
                          {(currentParticle.baseDistance + (forecastDay * currentParticle.speed * 11.5)).toFixed(1)} km
                        </span>
                      </div>

                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Current Speed</span>
                        <span className="text-sm font-mono text-gray-800">
                          {(currentParticle.speed * (0.85 + forecastDay * 0.05)).toFixed(2)} m/s
                        </span>
                      </div>

                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Predicted Destination</span>
                        <span className="text-xs font-semibold text-emerald-700 truncate block">
                          {currentParticle.dest}
                        </span>
                      </div>

                      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 col-span-2 md:col-span-3 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase block">Estimated Time of Arrival (ETA)</span>
                          <span className="text-xs text-gray-500 font-medium">To target coastal convergence zone</span>
                        </div>
                        <span className="text-lg font-bold font-mono text-[#0071e3] bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
                          {Math.max(0.1, (currentParticle.etaDays - (forecastDay - 3) * 0.5)).toFixed(1)} Days
                        </span>
                      </div>

                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-6">Initializing Lagrangian particle vector array...</p>
                  )}
                </div>

                {/* Micro briefings & Ecological alerts */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-4 h-4 text-[#0071e3]" />
                      Dynamic Ecological Alerts
                    </h3>
                    <div className="space-y-3">
                      {activeAlerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className="flex gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-750"
                        >
                          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${alert.type === 'critical' ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
                          <div className="space-y-0.5">
                            <p className="leading-relaxed text-gray-650">{alert.text}</p>
                            <span className="text-[9px] font-mono text-gray-400">{alert.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <span className="text-[8px] font-mono font-bold text-sky-600 block uppercase mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0071e3] animate-spin" style={{ animationDuration: "6s" }} /> 
                      Timeline Insight Commentary
                    </span>
                    <p className="text-[11px] text-gray-600 leading-relaxed italic bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      "{aiBriefing}"
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("copilot")}
                    className="mt-4 w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Consult Scientific Copilot
                  </button>
                </div>

              </div>

            </div>
          )}

          {activeTab === "plastic" && (
            <PlasticSimulator 
              forecastData={forecastData} 
              loading={loading} 
              forecastDay={forecastDay}
              setForecastDay={setForecastDay}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              playbackSpeed={playbackSpeed}
              setPlaybackSpeed={setPlaybackSpeed}
            />
          )}

          {activeTab === "copilot" && (
            <AICopilotWorkspace 
              selectedRegion={selectedRegion} 
              forecastDay={forecastDay}
              selectedParticleIndex={selectedParticleIndex}
            />
          )}

          {activeTab === "reports" && (
            <ReportsGenerator selectedRegion={selectedRegion} />
          )}
        </main>
      </div>
    </div>
  );
}
