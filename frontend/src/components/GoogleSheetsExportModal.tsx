import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, CheckCircle2, AlertCircle, ExternalLink, LogOut, Loader2, Database, ShieldCheck } from 'lucide-react';
import { 
  initSheetsAuth, 
  googleSheetsSignIn, 
  logoutSheets, 
  createOceanDataSpreadsheet,
  ExportDataPayload 
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';

interface GoogleSheetsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  oceanStatePayload: ExportDataPayload;
}

export default function GoogleSheetsExportModal({
  isOpen,
  onClose,
  oceanStatePayload
}: GoogleSheetsExportModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initSheetsAuth(
      (u, token) => {
        setUser(u);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    setError(null);
    try {
      const res = await googleSheetsSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to authenticate with Google');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutSheets();
    setUser(null);
    setAccessToken(null);
    setSuccessUrl(null);
  };

  const handleExport = async () => {
    if (!accessToken) {
      setError('Please sign in with Google first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessUrl(null);

    try {
      const res = await createOceanDataSpreadsheet(accessToken, oceanStatePayload);
      setSuccessUrl(res.spreadsheetUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create Google Sheet export');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200 border border-white/10">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google Sheets Export</h3>
              <p className="text-xs text-emerald-100/80 font-medium">Ocean Intelligence Scientific Dataset</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Dataset Summary Preview */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <span>Dataset Summary</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live OceanState
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="text-gray-500 block">Target Region:</span>
                <span className="font-semibold text-gray-900">{oceanStatePayload.region}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Forecast Timestep:</span>
                <span className="font-semibold text-gray-900">{oceanStatePayload.forecastTime}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Current Velocity Grid:</span>
                <span className="font-semibold text-gray-900">{oceanStatePayload.currentVectors?.length || 0} points</span>
              </div>
              <div>
                <span className="text-gray-500 block">Hotspots Count:</span>
                <span className="font-semibold text-gray-900">{oceanStatePayload.hotspots?.length || 0} active zones</span>
              </div>
            </div>
          </div>

          {/* Authentication State */}
          {!user ? (
            <div className="space-y-4 text-center py-2">
              <div className="text-xs text-gray-600 max-w-sm mx-auto">
                Connect your Google Account to export ocean state telemetry, velocity vectors, and hotspot analyses directly to Google Sheets.
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={signingIn}
                  className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs px-5 py-3 rounded-xl border border-gray-300 shadow-sm transition hover:shadow cursor-pointer disabled:opacity-50"
                >
                  {signingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  )}
                  <span>{signingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Connected as <strong className="text-emerald-950">{user.email}</strong></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* Action Confirmation */}
              <div className="text-xs text-gray-600 leading-relaxed bg-blue-50/60 border border-blue-100 rounded-xl p-3">
                A new spreadsheet named <strong>Ocean Intelligence - {oceanStatePayload.region}</strong> will be created in your Google Drive with formatted worksheets for Summary, Velocity Grid, and Hotspots.
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Google Sheet...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Confirm & Export to Google Sheets</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successUrl && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Sheet Created Successfully!</span>
              </div>
              <p className="text-emerald-700 leading-relaxed">
                Your ocean state dataset is live and ready for research collaboration in Google Sheets.
              </p>
              <div className="pt-1">
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-sm"
                >
                  <span>Open Google Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
