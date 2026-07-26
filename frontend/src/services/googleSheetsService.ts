import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize Firebase App if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initSheetsAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSheetsSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sheets OAuth Sign-In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logoutSheets = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getSheetsAccessToken = (): string | null => {
  return cachedAccessToken;
};

export interface ExportDataPayload {
  region: string;
  forecastTime: string;
  source: string;
  confidence: number;
  temperature?: number;
  salinity?: number;
  currentVectors?: Array<{
    latitude: number;
    longitude: number;
    u_component: number;
    v_component: number;
    velocity_knots: number;
    direction: string;
  }>;
  hotspots?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    density_particles_per_km2: number;
    risk_level: string;
    description: string;
  }>;
}

export const createOceanDataSpreadsheet = async (
  token: string,
  payload: ExportDataPayload
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const title = `Ocean Intelligence - ${payload.region} (${timestamp})`;

  // 1. Create new spreadsheet via Google Sheets API v4
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        { properties: { title: 'Ocean State Summary' } },
        { properties: { title: 'Current Velocity Grid' } },
        { properties: { title: 'Accumulation Hotspots' } }
      ]
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json();
    throw new Error(errData.error?.message || 'Failed to create Google Sheet');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  // 2. Populate Summary Data
  const summaryValues: (string | number)[][] = [
    ['OCEAN INTELLIGENCE SCIENTIFIC EXPORT SUMMARY'],
    ['Export Timestamp', new Date().toISOString()],
    ['Target Region', payload.region],
    ['Forecast Timestamp', payload.forecastTime],
    ['Primary Data Source', payload.source],
    ['Numerical Model Confidence', `${Math.round(payload.confidence * 100)}%`],
    ['Sea Surface Temp (°C)', payload.temperature ?? 'N/A'],
    ['Salinity (PSU)', payload.salinity ?? 'N/A'],
    [],
    ['METRIC', 'VALUE', 'UNIT / NOTES'],
    ['Total Velocity Grid Points', payload.currentVectors?.length || 0, 'Grid Resolution 0.083°'],
    ['Active Hotspots Identified', payload.hotspots?.length || 0, 'Lagrangian Drift Convergence']
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Ocean State Summary!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: summaryValues }),
  });

  // 3. Populate Current Velocity Grid
  const currentValues: (string | number)[][] = [
    ['Latitude (°N)', 'Longitude (°E)', 'U Component (m/s)', 'V Component (m/s)', 'Velocity (Knots)', 'Cardinal Direction']
  ];
  if (payload.currentVectors) {
    payload.currentVectors.forEach(v => {
      currentValues.push([
        v.latitude,
        v.longitude,
        v.u_component,
        v.v_component,
        v.velocity_knots,
        v.direction
      ]);
    });
  }

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Current Velocity Grid!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: currentValues }),
  });

  // 4. Populate Hotspots
  const hotspotValues: (string | number)[][] = [
    ['Hotspot ID', 'Latitude (°N)', 'Longitude (°E)', 'Particle Density (particles/km²)', 'Risk Level', 'Convergence Description']
  ];
  if (payload.hotspots) {
    payload.hotspots.forEach(h => {
      hotspotValues.push([
        h.id,
        h.latitude,
        h.longitude,
        h.density_particles_per_km2,
        h.risk_level,
        h.description
      ]);
    });
  }

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Accumulation Hotspots!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: hotspotValues }),
  });

  return { spreadsheetId, spreadsheetUrl };
};
