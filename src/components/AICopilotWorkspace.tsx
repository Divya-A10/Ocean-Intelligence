import React, { useState } from "react";
import { Sparkles, Brain, ArrowRight, CornerDownLeft, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2, Bookmark, ExternalLink } from "lucide-react";
import { RegionKey, CopilotResponse } from "../types";

interface AICopilotWorkspaceProps {
  selectedRegion: RegionKey;
  forecastDay: number;
  selectedParticleIndex: number;
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

  const suggestedPrompts = [
    {
      label: "Selected Day Forecast",
      text: `Analyze the microplastic convergence and risk level on Day ${forecastDay} for the current coordinates.`,
      region: selectedRegion
    },
    {
      label: "Probed Particle Pathway",
      text: `Inspect the trajectory of particle #${80000 + (selectedParticleIndex * 13) % 20000}. What are its expected environmental impact indices?`,
      region: selectedRegion
    },
    {
      label: "Bay of Bengal Accumulation",
      text: "Why is the Bay of Bengal forecast showing increased plastic accumulation over the next five days?",
      region: "bay-of-bengal" as RegionKey
    },
    {
      label: "Compare Singapore & Pacific Gyre",
      text: "Compare Singapore Strait and the Great Pacific Garbage Patch in terms of transport dynamics and polymer shear rates.",
      region: "singapore-strait" as RegionKey
    },
    {
      label: "Vulnerable Marine Areas",
      text: "Identify species at the highest toxicological risk from microplastics in the Mediterranean Sea Western Basin.",
      region: "mediterranean-sea" as RegionKey
    },
    {
      label: "Booms Cleanup Strategy",
      text: "What are the most cost-effective marine cleanup sites and intervention recommendations for the selected coordinates?",
      region: selectedRegion
    }
  ];

  const handleTriggerSuggested = (text: string) => {
    setPrompt(text);
  };

  const handleQueryCopilot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          regionKey: selectedRegion,
          forecastDay,
          selectedParticleIndex
        })
      });

      if (!res.ok) {
        throw new Error("Oceanographic Knowledge Base API returned error.");
      }

      const data: CopilotResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to communicate with scientific copilot. Please verify the server state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Intro Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 rounded-lg bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 text-[#4FC3F7]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Gemini Scientific Ocean Copilot</h2>
        </div>
        <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
          Ask our unified Gemini AI copilot for natural language explanations of Lagrangian simulations, 
          ocean circulation modeling, degradation predictions, and marine biodiversity exposure. 
          Responses are backed by Copernicus CMEMS, NOAA observations, and scientific literature.
        </p>
      </div>

      {/* Grid: Inputs & Presets / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ask Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleQueryCopilot} className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <label className="text-xs font-mono text-[#4FC3F7] uppercase tracking-widest block">
              Natural Language Research Inquiry
            </label>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything about ocean plastics transport, ecological risks, or cleanup priorities..."
                className="w-full h-32 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#4FC3F7]/50 resize-none leading-relaxed"
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/30">
                UTF-8 Integration
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1976D2] to-[#4FC3F7] hover:from-[#1976D2]/95 hover:to-[#4FC3F7]/95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Synthesizing Scientific Data...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Query Scientific Copilot
                  <CornerDownLeft className="w-3 h-3 opacity-60 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Suggested prompts list */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl">
            <h4 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
              Standard Research Prompts
            </h4>
            <div className="space-y-2">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTriggerSuggested(p.text)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-[11px] text-white/80 transition flex flex-col gap-1"
                >
                  <span className="font-semibold text-[#4FC3F7]">{p.label}</span>
                  <p className="text-white/55 line-clamp-2 leading-relaxed">{p.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Response (7 cols) */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 min-h-[400px] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-mono text-[#4FC3F7] uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                Synthesized Assessment Analysis
              </span>
              {response?.confidenceIndex && (
                <span className="bg-[#64FFDA]/10 text-[#64FFDA] text-[10px] font-mono px-2 py-0.5 border border-[#64FFDA]/30 rounded-md">
                  Confidence Score: {response.confidenceIndex}%
                </span>
              )}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#4FC3F7] animate-spin" />
                <p className="text-xs font-mono text-white/50 text-center">Consulting knowledge models and satellite observation databases...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Inquiry Dispatch Error</h4>
                  <p className="text-[11px] text-white/50 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!response && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Brain className="w-10 h-10 text-white/15 mb-3" />
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider">Copilot Idle</h4>
                <p className="text-xs text-white/40 max-w-sm mt-1 leading-relaxed">
                  Enter a research question or select one of the preloaded prompts to synthesize custom oceanographic insights.
                </p>
              </div>
            )}

            {response && (
              <div className="text-xs text-white/85 space-y-4 leading-relaxed">
                {/* Simulated rendering of markdown (we render it elegantly with CSS) */}
                <div className="prose prose-invert max-w-none text-white/70">
                  {response.text.split("\n").map((line, idx) => {
                    if (line.startsWith("### ")) {
                      return <h4 key={idx} className="text-sm font-bold text-white mt-4 mb-2 first:mt-0">{line.replace("### ", "")}</h4>;
                    }
                    if (line.startsWith("#### ")) {
                      return <h5 key={idx} className="text-xs font-bold text-[#4FC3F7] mt-3 mb-1.5">{line.replace("#### ", "")}</h5>;
                    }
                    if (line.startsWith("* **") || line.startsWith("- **")) {
                      const match = line.match(/^[\*\-]\s+\*\*(.*?)\*\*:\s*(.*)/);
                      if (match) {
                        return (
                          <div key={idx} className="ml-2 mb-1">
                            <span className="text-[#4FC3F7] font-semibold">• {match[1]}: </span>
                            <span>{match[2]}</span>
                          </div>
                        );
                      }
                    }
                    if (line.startsWith("* ") || line.startsWith("- ")) {
                      return <div key={idx} className="ml-4 mb-1 text-white/60">• {line.substring(2)}</div>;
                    }
                    if (line.trim().length === 0) return <div key={idx} className="h-2"></div>;
                    return <p key={idx} className="mb-2.5">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Citations List */}
          {response?.citations && response.citations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-2">
                Grounding & Peer-Reviewed References
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {response.citations.map((cite, idx) => (
                  <a
                    key={idx}
                    href={cite.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-black/40 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-[#4FC3F7]" />
                      <span className="text-[10px] font-semibold text-white/80 group-hover:text-[#4FC3F7] truncate max-w-[200px]">
                        {cite.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/30" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
