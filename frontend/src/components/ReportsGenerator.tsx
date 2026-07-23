import React, { useState } from "react";
import { 
  FileText, Printer, Check, Copy, RefreshCw, AlertTriangle, Download, Sparkles, 
  BookOpen, ShieldCheck, Info, Compass, Waves, CheckCircle2 
} from "lucide-react";
import { RegionKey } from "../types/simulation";
import { simulationService } from "../services/simulationService";

interface ReportsGeneratorProps {
  selectedRegion: RegionKey;
}

export default function ReportsGenerator({ selectedRegion }: ReportsGeneratorProps) {
  const [reportType, setReportType] = useState<"impact" | "briefing" | "cleanup" | "scientific">("impact");
  const [loading, setLoading] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const regionNames: Record<RegionKey, string> = {
    "bay-of-bengal": "Bay of Bengal",
    "singapore-strait": "Singapore Strait",
    "north-pacific-gyre": "North Pacific Gyre",
    "mediterranean-sea": "Mediterranean Sea"
  };

  const reportOptions = [
    { key: "impact" as const, title: "Environmental Impact Report", desc: "Covers local biodiversity threat, trophic bio-accumulation, and protected area overlap grids." },
    { key: "briefing" as const, title: "Executive Policy Briefing", desc: "A policy-focused memorandum proposing state actions, coastal bans, and emergency funds allocation." },
    { key: "cleanup" as const, title: "Targeted Cleanup Strategy", desc: "Detailed cost-benefit projections matching surface drift and Lagrangian flow accumulation points." },
    { key: "scientific" as const, title: "Scientific Literature Diagnostic", desc: "Cites historical publications, coastal bathymetric trap configurations, and model confidence coefficients." }
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setReportMarkdown(null);

    try {
      const data = await simulationService.generateReport({ regionKey: selectedRegion, reportType });
      setReportMarkdown(data.markdown);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred during report synthesis. Please verify backend service connection.");
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
    <div className="space-y-6 antialiased text-slate-900">
      
      {/* Intro Header - Research Assistant */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50/80 border border-slate-200/90 p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Research Assistant
                </h2>
                <span className="bg-sky-100 text-[#0071e3] font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-sky-200">
                  Data-Grounded Reports
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Generate structured research reports, policy memos, and environmental diagnostics directly from simulation outputs.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compiling Research Report...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Research Report</span>
              </>
            )}
          </button>
        </div>

        {/* Philosophy Note */}
        <div className="bg-white/80 border border-slate-200/70 p-3.5 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 font-semibold">Evidence-Based Principles:</strong> Reports are compiled directly from structured numerical simulation outputs. AI is used solely to format and improve readability. No observations or findings are invented.
          </p>
        </div>
      </div>

      {/* Selector & Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Parameters Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <span className="text-xs font-mono font-bold text-[#0071e3] uppercase tracking-wider block border-b border-slate-100 pb-2">
            Report Parameters
          </span>

          <div className="space-y-2.5">
            {reportOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setReportType(opt.key)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col gap-1 cursor-pointer ${
                  reportType === opt.key
                    ? "bg-sky-50/80 border-sky-300 shadow-xs"
                    : "bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/70"
                }`}
              >
                <span className={`text-xs font-bold ${reportType === opt.key ? "text-[#0071e3]" : "text-slate-900"}`}>
                  {opt.title}
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2">
            <span className="text-[10px] font-mono font-semibold text-slate-400 block uppercase">Target Region Context</span>
            <div className="text-xs font-bold text-slate-800 flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[#0071e3] font-bold">{regionNames[selectedRegion]}</span>
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Right Column: Report Document Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 min-h-[480px] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0071e3]" />
                <span>Research Report Document</span>
              </span>

              {reportMarkdown && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0071e3]/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <RefreshCw className="w-9 h-9 text-[#0071e3] animate-spin" />
                <h4 className="text-xs font-mono font-bold text-[#0071e3]">Compiling numerical simulation metrics & satellite feeds...</h4>
                <p className="text-[11px] text-slate-500 max-w-sm text-center leading-relaxed">
                  Structuring overview, simulation parameters, observed findings, AI interpretation, and confidence notes.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <h4 className="font-bold">Report Synthesis Interrupted</h4>
                  <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!reportMarkdown && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0071e3] flex items-center justify-center border border-sky-100">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No Report Generated</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Select a report type parameter on the left and click "Generate Research Report" to compile a publication-ready document.
                </p>
              </div>
            )}

            {reportMarkdown && (
              <div className="text-xs text-slate-800 leading-relaxed max-h-[520px] overflow-y-auto pr-2 space-y-4">
                <div className="prose max-w-none text-slate-700 space-y-3">
                  {reportMarkdown.split("\n").map((line, idx) => {
                    if (line.startsWith("# ")) {
                      return (
                        <h2 key={idx} className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 mt-2">
                          {line.replace("# ", "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h3 key={idx} className="text-sm font-bold text-[#0071e3] mt-5 mb-2">
                          {line.replace("## ", "")}
                        </h3>
                      );
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h4 key={idx} className="text-xs font-bold text-slate-900 mt-3 mb-1.5">
                          {line.replace("### ", "")}
                        </h4>
                      );
                    }
                    if (line.startsWith("| ")) {
                      const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
                      if (cells[0]?.includes("---")) return null;
                      return (
                        <div key={idx} className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 border border-slate-200 rounded-lg text-[11px] font-mono mt-1">
                          {cells.map((cell, cIdx) => (
                            <span key={cIdx} className={cIdx === 0 ? "font-bold text-slate-900" : "text-slate-600"}>
                              {cell}
                            </span>
                          ))}
                        </div>
                      );
                    }
                    if (line.startsWith("* ") || line.startsWith("- ")) {
                      return (
                        <div key={idx} className="ml-4 mb-1 text-slate-700 flex items-start gap-2">
                          <span className="text-[#0071e3] font-bold">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    if (line.trim().length === 0) return <div key={idx} className="h-1"></div>;
                    return <p key={idx} className="mb-2 text-slate-700">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </div>

          {reportMarkdown && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
              <span>Authority: Ocean Intelligence Research Assistant</span>
              <span>Report Reference: OI-RES-2026</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
