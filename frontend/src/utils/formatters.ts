/**
 * Formatters and helper functions
 */

export function formatKnots(speed: number): string {
  return `${speed.toFixed(2)} knots`;
}

export function formatPercentage(val: number): string {
  return `${Math.round(val)}%`;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir}`;
}

export function generateParticleMetadata(index: number, regionKey: string) {
  const isGlobal = index % 4 === 0;
  const origins: Record<string, string[]> = {
    "bay-of-bengal": ["Ganges River Mouth", "Chittagong Port", "Irrawaddy Delta", "Chennai Harbor"],
    "singapore-strait": ["Pasir Panjang Terminal", "Batam Island Coast", "Johor Outflow", "Riau Strait Entry"],
    "north-pacific-gyre": ["Kuroshio Extension Drift", "California Coastal Current", "Central Gyre Vortex"],
    "mediterranean-sea": ["Rhone Delta Plume", "Ebro River Inflow", "Ligurian Coast", "Tyrrhenian Gyre"]
  };
  const list = origins[regionKey] || origins["bay-of-bengal"];
  const origin = list[index % list.length];
  
  return {
    id: `p-${80000 + (index * 13) % 20000}`,
    name: `Lagrangian Float #${80000 + (index * 13) % 20000}`,
    origin,
    isGlobal,
    released: "2026-06-12",
    speedKnots: 1.2 + (index % 15) * 0.1,
    dest: "Coastal Convergence Zone",
    etaDays: 3.5 + (index % 7) * 0.8
  };
}
