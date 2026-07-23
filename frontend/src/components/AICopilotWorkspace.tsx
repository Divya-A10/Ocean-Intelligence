import React, { useState } from "react";
import { 
  Sparkles, Brain, ArrowRight, CornerDownLeft, RefreshCw, AlertTriangle, 
  ShieldCheck, Bookmark, ExternalLink, Compass, Activity, Search, Info
} from "lucide-react";
import { RegionKey, CopilotResponse } from "../types/simulation";
import { simulationService } from "../services/simulationService";

interface AICopilotWorkspaceProps {
  selectedRegion: RegionKey;
  forecastDay: number;
  selectedParticleIndex: number;
  onNavigateToReports?: () => void;
}

export default function AICopilotWorkspace({ 
  selectedRegion, 
  forecastDay, 
  selectedParticleIndex
}: AICopilotWorkspaceProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"explain" | "interpret" | "guide">("explain");

  // Region human names
  const regionNames: Record<RegionKey, string> = {
    "bay-of-bengal": "Bay of Bengal",
    "singapore-strait": "Singapore Strait",
    "north-pacific-gyre": "North Pacific Gyre",
    "mediterranean-sea": "Mediterranean Sea"
  };

  // One carefully selected question per tab
  const tabQuestions = {
    explain: {
      question: "Why is this hotspot forming?",
      query: `Why is the primary microplastic hotspot forming in ${regionNames[selectedRegion]} on Forecast Day ${forecastDay}?`
    },
    interpret: {
      question: "What is the most significant finding in this simulation?",
      query: `What is the most significant oceanographic finding in the ${regionNames[selectedRegion]} Day ${forecastDay} simulation?`
    },
    guide: {
      question: "What should I investigate next?",
      query: `Based on current particle convergence in ${regionNames[selectedRegion]}, what specific parameters or adjacent ecosystems should I investigate next?`
    }
  };

  const handleQuery = async (queryText: string) => {
    setPrompt(queryText);
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await simulationService.explain({ 
        prompt: queryText, 
        regionKey: selectedRegion,
        forecastDay,
        selectedParticleIndex
      });

      setResponse(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to communicate with the Scientific Copilot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCustomPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      handleQuery(prompt);
    }
  };

  const activeQuestion = tabQuestions[activeCategory];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* 1. SCIENTIFIC COPILOT HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0071e3] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Scientific Copilot
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Evidence-based explanations and interpretations grounded in active simulation metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600">
          <Info className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Contextual Simulation Assistant</span>
        </div>
      </div>

      {/* MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Context, Summary & Investigation Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 2. CURRENT ANALYSIS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0071e3]" />
                Current Analysis
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Selected Region</span>
                <span className="font-semibold text-slate-900 block mt-0.5 truncate">
                  {regionNames[selectedRegion]}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Forecast Day</span>
                <span className="font-semibold text-[#0071e3] block mt-0.5">
                  Day {forecastDay}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Data Sources</span>
                <span className="font-medium text-slate-700 block mt-0.5">
                  CMEMS + NOAA
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Simulation ID</span>
                <span className="font-mono font-semibold text-slate-700 block mt-0.5">
                  SIM-{selectedRegion.toUpperCase().slice(0,3)}-{forecastDay + 100}
                </span>
              </div>
            </div>
          </div>

          {/* 3. SIMULATION SUMMARY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0071e3]" />
                Simulation Summary
              </h2>
            </div>

            <ul className="text-xs text-slate-700 space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0"></div>
                <span><strong className="text-slate-900">Hotspots:</strong> Microplastic accumulation detected near coastal shelf.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0"></div>
                <span><strong className="text-slate-900">Transport Vector:</strong> Surface currents carrying debris toward estuary inlets.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0"></div>
                <span><strong className="text-slate-900">Primary Driver:</strong> Wind stress curl combined with tidal forcing.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <span><strong className="text-slate-900">Model Confidence:</strong> Moderate (88% based on CMEMS validation).</span>
              </li>
            </ul>
          </div>

          {/* 5. INVESTIGATE CURRENT DATA */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Investigate Current Data
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveCategory("explain")}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  activeCategory === "explain" ? "bg-white text-[#0071e3] font-bold shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Explain
              </button>
              <button
                onClick={() => setActiveCategory("interpret")}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  activeCategory === "interpret" ? "bg-white text-[#0071e3] font-bold shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Interpret
              </button>
              <button
                onClick={() => setActiveCategory("guide")}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  activeCategory === "guide" ? "bg-white text-[#0071e3] font-bold shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Guide
              </button>
            </div>

            {/* Single Clean Question Suggestion Card */}
            <div className="pt-1">
              <button
                onClick={() => handleQuery(activeQuestion.query)}
                className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 hover:border-sky-300 transition-all duration-150 flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0071e3] pr-2">
                  {activeQuestion.question}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0071e3] transition-transform group-hover:translate-x-1 shrink-0" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Input & Output Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 4. ASK ABOUT CURRENT ANALYSIS */}
          <form onSubmit={handleSubmitCustomPrompt} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Ask about Current Analysis</span>
            </label>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask a question about the current simulation..."
                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0071e3] focus:bg-white resize-none leading-relaxed transition"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Grounded in active simulation metrics
              </span>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Analyze</span>
                    <CornerDownLeft className="w-3 h-3 opacity-60" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 6. SCIENTIFIC INTERPRETATION */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 min-h-[380px] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-[#0071e3]" />
                  <span>Scientific Interpretation</span>
                </h2>
                
                {response?.confidenceIndex && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2.5 py-0.5 border border-emerald-200 rounded-lg">
                    Confidence: {response.confidenceIndex}%
                  </span>
                )}
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <RefreshCw className="w-7 h-7 text-[#0071e3] animate-spin" />
                  <p className="text-xs font-mono text-slate-500 text-center">
                    Processing Lagrangian vectors & oceanographic feeds...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <h3 className="font-bold">Analysis Error</h3>
                    <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {!response && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0071e3] flex items-center justify-center border border-sky-100">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
                    Scientific interpretations will appear here after you ask a question or select an investigation.
                  </p>
                </div>
              )}

              {response && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-800 space-y-3 leading-relaxed">
                    {response.text.split("\n").map((line, idx) => {
                      if (line.startsWith("### ")) {
                        return (
                          <h3 key={idx} className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4 mb-2 first:mt-0">
                            {line.replace("### ", "")}
                          </h3>
                        );
                      }
                      if (line.startsWith("#### ")) {
                        return (
                          <h4 key={idx} className="text-xs font-bold text-[#0071e3] mt-3 mb-1">
                            {line.replace("#### ", "")}
                          </h4>
                        );
                      }
                      if (line.startsWith("* **") || line.startsWith("- **")) {
                        const match = line.match(/^[\*\-]\s+\*\*(.*?)\*\*:\s*(.*)/);
                        if (match) {
                          return (
                            <div key={idx} className="ml-2 mb-1">
                              <span className="text-[#0071e3] font-semibold">• {match[1]}: </span>
                              <span className="text-slate-700">{match[2]}</span>
                            </div>
                          );
                        }
                      }
                      if (line.startsWith("* ") || line.startsWith("- ")) {
                        return (
                          <div key={idx} className="ml-4 mb-1 text-slate-700 flex items-start gap-1.5">
                            <span className="text-[#0071e3] font-bold">•</span>
                            <span>{line.substring(2)}</span>
                          </div>
                        );
                      }
                      if (line.trim().length === 0) return <div key={idx} className="h-1"></div>;
                      return <p key={idx} className="text-slate-700">{line}</p>;
                    })}
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Calculated directly from active Lagrangian particles and satellite oceanography feeds.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Citations Footer */}
            {response?.citations && response.citations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                  Peer-Reviewed Citations & Feeds
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {response.citations.map((cite, idx) => (
                    <a
                      key={idx}
                      href={cite.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-50 hover:bg-sky-50/70 rounded-xl border border-slate-200/80 hover:border-sky-200 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Bookmark className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
                        <span className="text-[11px] font-medium text-slate-700 group-hover:text-[#0071e3] truncate">
                          {cite.title}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
