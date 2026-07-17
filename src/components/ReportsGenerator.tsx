import React, { useState } from "react";
import { FileText, Printer, Check, Copy, RefreshCw, AlertTriangle, Download, Sparkles, BookOpen } from "lucide-react";
import { RegionKey } from "../types";

interface ReportsGeneratorProps {
  selectedRegion: RegionKey;
}

export default function ReportsGenerator({ selectedRegion }: ReportsGeneratorProps) {
  const [reportType, setReportType] = useState<"impact" | "briefing" | "cleanup" | "scientific">("impact");
  const [loading, setLoading] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reportOptions = [
    { key: "impact" as const, title: "Environmental Impact Report", desc: "Covers local biodiversity threat, trophic bio-accumulation, and protected area overlap grids." },
    { key: "briefing" as const, title: "Executive Government Briefing", desc: "A policy-focused memorandum proposing state actions, coastal bans, and emergency funds allocation." },
    { key: "cleanup" as const, title: "Cleanup Action Strategy Plan", desc: "Detailed cost-benefit projections matching surface drift and Lagrangian flow accumulation points." },
    { key: "scientific" as const, title: "Scientific Literature Diagnostic", desc: "Cites historical publications, coastal bathymetric trap configurations, and model confidence coefficients." }
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setReportMarkdown(null);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regionKey: selectedRegion, reportType })
      });

      if (!res.ok) {
        throw new Error("Report Generator API failed to return data.");
      }

      const data = await res.json();
      setReportMarkdown(data.markdown);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred during report synthesis. Please verify the backend states.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!reportMarkdown) return;
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Intro Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-1.5 rounded-lg bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 text-[#4FC3F7]">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Automated Scientific Report Engine</h2>
          </div>
          <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
            Synthesize ready-to-export research briefings, conservation proposals, or coastal intervention assessments 
            formulated by the Gemini copilot.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="py-2.5 px-5 bg-gradient-to-r from-[#64FFDA] to-[#4FC3F7] hover:from-[#64FFDA]/90 hover:to-[#4FC3F7]/90 text-[#021B33] font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Synthesizing Study...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Publication-Ready Report
            </>
          )}
        </button>
      </div>

      {/* Selector & Viewer grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <span className="text-xs font-mono text-[#4FC3F7] uppercase tracking-widest block">
            Report Parameters
          </span>

          <div className="space-y-3">
            {reportOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setReportType(opt.key)}
                className={`w-full text-left p-3.5 rounded-xl border transition duration-200 flex flex-col gap-1.5 ${
                  reportType === opt.key
                    ? "bg-[#4FC3F7]/10 border-[#4FC3F7]/30"
                    : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                <span className={`text-xs font-bold ${reportType === opt.key ? "text-[#4FC3F7]" : "text-white/80"}`}>
                  {opt.title}
                </span>
                <p className="text-[10px] text-white/55 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-white/40 block uppercase">Target Region context</span>
            <div className="text-xs font-bold text-white/80 flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg border border-white/10">
              <span className="text-[#64FFDA]">{selectedRegion.replace("-", " ").toUpperCase()}</span>
              <BookOpen className="w-3.5 h-3.5 text-white/30" />
            </div>
          </div>
        </div>

        {/* Right Column: Viewer Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[450px] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-5">
              <span className="text-xs font-mono text-[#4FC3F7] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Scientific Document Viewer
              </span>

              {reportMarkdown && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/80 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#64FFDA]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Markdown"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/80 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Export PDF
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <RefreshCw className="w-10 h-10 text-[#4FC3F7] animate-spin" />
                <h4 className="text-xs font-mono text-[#4FC3F7]">Compiling Lagrangian metrics & remote sensing records...</h4>
                <p className="text-[10px] text-white/40 max-w-sm text-center">
                  This report includes calculations for species vulnerability, microplastic fragmentation, and strategic cleanup expenditures.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Synthesis Pipeline Interrupted</h4>
                  <p className="text-[11px] text-white/50 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!reportMarkdown && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-12 h-12 text-white/10 mb-3" />
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider">No Report Generated</h4>
                <p className="text-xs text-white/40 max-w-sm mt-1 leading-relaxed">
                  Select a report type parameter and click "Generate Publication-Ready Report" to trigger automated synthesis.
                </p>
              </div>
            )}

            {reportMarkdown && (
              <div className="text-xs text-white/80 leading-relaxed max-h-[500px] overflow-y-auto pr-2 space-y-4">
                {/* Simulated rendering of the beautiful scientific report */}
                <div className="prose prose-invert max-w-none text-white/70">
                  {reportMarkdown.split("\n").map((line, idx) => {
                    if (line.startsWith("# ")) {
                      return <h2 key={idx} className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 mt-2">{line.replace("# ", "")}</h2>;
                    }
                    if (line.startsWith("## ")) {
                      return <h3 key={idx} className="text-sm font-bold text-[#4FC3F7] mt-4 mb-2">{line.replace("## ", "")}</h3>;
                    }
                    if (line.startsWith("### ")) {
                      return <h4 key={idx} className="text-xs font-bold text-white/90 mt-3 mb-1.5">{line.replace("### ", "")}</h4>;
                    }
                    if (line.startsWith("| ")) {
                      // Render structured table rows beautifully!
                      const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
                      if (cells[0]?.includes("---")) return null; // Skip markdown separator line
                      return (
                        <div key={idx} className="grid grid-cols-3 gap-2 bg-black/40 p-2 border border-white/5 rounded-lg text-[10px] font-mono mt-1">
                          {cells.map((cell, cIdx) => (
                            <span key={cIdx} className={cIdx === 0 ? "font-bold text-white/80" : "text-white/50"}>
                              {cell}
                            </span>
                          ))}
                        </div>
                      );
                    }
                    if (line.startsWith("* ") || line.startsWith("- ")) {
                      return <div key={idx} className="ml-4 mb-1 text-white/70">• {line.substring(2)}</div>;
                    }
                    if (line.trim().length === 0) return <div key={idx} className="h-1"></div>;
                    return <p key={idx} className="mb-2">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </div>

          {reportMarkdown && (
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/30">
              <span>Authority: Ocean Intelligence Scientific Committee</span>
              <span>Report Reference: OQ-302-2026</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
