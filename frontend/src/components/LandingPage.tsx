import React from "react";
import { 
  Waves, Compass, ArrowRight, Sparkles, FileText, Globe, Layers,
  ShieldCheck, Activity, ArrowDown, ChevronRight, Github, ExternalLink, Mail, Info
} from "lucide-react";
import GlobePreview from "./GlobePreview";
import { RegionKey, SimulationResponse as ForecastData } from "../types/simulation";

interface LandingPageProps {
  onStartExploring: () => void;
  selectedRegion: RegionKey;
  onRegionChange: (region: RegionKey) => void;
  forecastData: ForecastData | null;
  loading: boolean;
}

export default function LandingPage({
  onStartExploring,
  selectedRegion,
  onRegionChange,
  forecastData,
  loading
}: LandingPageProps) {

  const scrollToWhySection = () => {
    const el = document.getElementById("why-ocean-intelligence");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-24 py-6 px-4 sm:px-6 antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-sky-950/90 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 md:p-20 text-center overflow-hidden border border-sky-900/40 shadow-2xl">
        {/* Subtle oceanic gradient backdrop glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-32 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium tracking-wide">
            <Waves className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Ocean Exploration Platform</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
              Ocean Intelligence
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-sky-200/90 tracking-tight max-w-2xl mx-auto">
              Understanding our oceans through data, science, and AI.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Ocean Intelligence helps researchers, conservationists, students, policymakers, and curious minds explore how marine pollution moves through our oceans using real-world data, interactive visualizations, and scientific simulations—all in one place.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartExploring}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Explore the Ocean</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToWhySection}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Learn More</span>
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>
      </section>

      {/* 2. SECTION 2: WHY OCEAN INTELLIGENCE? */}
      <section id="why-ocean-intelligence" className="scroll-mt-24">
        <div className="bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-[11px] font-mono font-bold text-sky-600 uppercase tracking-widest">
              Platform Vision
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Why Ocean Intelligence?
            </h2>
            
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-left sm:text-center">
              <p>
                Understanding our oceans often requires combining information from many different scientific sources.
              </p>
              <p className="text-slate-700 font-medium">
                Ocean Intelligence brings these sources together into one intuitive platform, helping people explore marine environments through data, simulations, and AI-powered explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 3: INTERACTIVE GLOBE */}
      <section className="space-y-4">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold text-sky-600 uppercase tracking-widest">
            Global View
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explore Ocean Systems Worldwide
          </h2>
        </div>

        {/* Minimal Globe View */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-800 bg-slate-950">
          <GlobePreview
            minimal={true}
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
            forecastData={forecastData}
            loading={loading}
            forecastDay={0}
            setForecastDay={() => {}}
            isPlaying={false}
            setIsPlaying={() => {}}
            playbackSpeed={1}
            setPlaybackSpeed={() => {}}
            selectedParticleIndex={100}
            onParticleProbe={() => {}}
          />
        </div>

        <div className="text-center pt-2">
          <p className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span>Explore our oceans from a global perspective.</span>
          </p>
        </div>
      </section>

      {/* 4. SECTION 4: WHAT CAN YOU EXPLORE? */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold text-sky-600 uppercase tracking-widest">
            Key Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            What can you explore?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Three core modules designed for effortless environmental discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ocean Conditions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore ocean currents and environmental patterns.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Plastic Transport</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand how marine pollution moves through the ocean.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Insights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask questions and receive clear scientific explanations.
            </p>
          </div>

        </div>
      </section>

      {/* 5. SECTION 5: BUILT FOR DISCOVERY */}
      <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
            Integrated Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Built for Discovery
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Ocean Intelligence brings together scientific data, interactive visualizations, simulations, and AI into one cohesive, accessible experience. By removing technical barriers, it transforms complex environmental dynamics into actionable insights for researchers, educators, and conservation teams worldwide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Component</span>
              <span className="text-xs font-bold text-sky-300">Scientific Data</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Component</span>
              <span className="text-xs font-bold text-blue-300">Interactive Visuals</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Component</span>
              <span className="text-xs font-bold text-indigo-300">Simulations</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Component</span>
              <span className="text-xs font-bold text-emerald-300">AI Explanations</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 6: WORKSPACE PREVIEW MOCKUP */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold text-sky-600 uppercase tracking-widest">
            Workspace Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ready to explore?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Step into the research workspace to analyze ocean conditions and run particle transport simulations.
          </p>
        </div>

        {/* Polished Workspace Frame Preview Mockup */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
          
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <span className="text-[11px] font-mono text-slate-400 ml-2">ocean-intelligence.app/workspace</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Active Session
            </span>
          </div>

          {/* Mockup Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 rounded-2xl p-5 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
                <Compass className="w-4 h-4" />
                <span>Sector Focus</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <span className="text-xs font-bold block">{forecastData?.regionName || "Bay of Bengal"}</span>
                <span className="text-[10px] text-slate-400">Current Velocity: {forecastData?.currentSpeedKnots || 2.4} knots</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI Briefing</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1 text-[11px] text-slate-300">
                Monsoonal currents drive particle advection along coastal shelf boundaries.
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Report Status</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Ready for Synthesis</span>
                <span className="text-[10px] text-slate-400">PDF & Data export ready</span>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-2 text-center">
            <button
              onClick={onStartExploring}
              className="px-8 py-3.5 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm shadow-md transition-all duration-200 inline-flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-12 border-t border-slate-200/80 text-xs text-slate-500 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Waves className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Ocean Intelligence</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-600">
            <button onClick={scrollToWhySection} className="hover:text-slate-900 transition cursor-pointer">
              About
            </button>
            <button onClick={onStartExploring} className="hover:text-slate-900 transition cursor-pointer">
              Documentation
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition inline-flex items-center gap-1">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <button onClick={onStartExploring} className="hover:text-slate-900 transition cursor-pointer">
              Contact
            </button>
          </div>
        </div>

        <div className="text-center sm:text-left text-slate-400 text-[11px] font-mono">
          © {new Date().getFullYear()} Ocean Intelligence. Plastic Intelligence module active. Understanding our oceans through data, science, and AI.
        </div>
      </footer>

    </div>
  );
}
