import { RegionKey } from "../types";

export interface ProbedParticle {
  id: string;
  name: string;
  origin: string;
  released: string;
  baseDistance: number;
  speed: number;
  dest: string;
  etaDays: number;
  isGlobal: boolean;
}

const REGION_ORIGINS: Record<RegionKey, string[]> = {
  "bay-of-bengal": [
    "Ganges Delta Outflow",
    "Irrawaddy Coastal Estuary",
    "Chennai Port Drainage",
    "Brahmaputra Delta Silt",
    "Chittagong Harbour Sump",
    "Vishakhapatnam Coastal Runoff"
  ],
  "singapore-strait": [
    "Johor Estuary Delta",
    "Batam Commercial Outflow",
    "Singapore Port Anchor Area",
    "Riau Archipelago Inflow",
    "Tuas Industrial Drainage",
    "Changi Maritime Corridor"
  ],
  "north-pacific-gyre": [
    "California Coastal Runoff",
    "Kuroshio Extension Jet",
    "Hawaii Nearshore Outflow",
    "Yangtze River Delta",
    "Tokyo Bay Marine Conduit",
    "Columbia River Outfall"
  ],
  "mediterranean-sea": [
    "Nile Delta Outflow Channel",
    "Po River Discharge Basin",
    "Rhone River Delta Sump",
    "Ebro River Plume",
    "Alboran Sea Passage Way",
    "Athens Municipal Drainage"
  ]
};

const REGION_DESTINATIONS: Record<RegionKey, string[]> = {
  "bay-of-bengal": [
    "Northern Bay Deep Convergence",
    "Andaman Coastal Shelf Zone",
    "Central Indian Ocean Boundary",
    "Sri Lankan Deep Basin Basin",
    "Nicobar Marine Reserve Rim"
  ],
  "singapore-strait": [
    "Riau Coastal Archipelago",
    "Southern Malacca Strait Lanes",
    "South China Sea Outer Boundary",
    "Sunda Shelf Marine Corridor",
    "Karimata Strait Flow Segment"
  ],
  "north-pacific-gyre": [
    "Eastern Subtropical Node",
    "Great Pacific Convergence Center",
    "Gyre core Accumulation Apex",
    "Subtropical Gyre Northern Rim",
    "Hawaii Archipelago Reef Margin"
  ],
  "mediterranean-sea": [
    "Levantine Deep Basin Drift",
    "Adriatic Coastal Convergence",
    "Balearic Sea Gyre Node",
    "Ionian Sea Abyssal Sink",
    "Tyrrhenian Sub-basin Eddy Zone"
  ]
};

export function generateParticleMetadata(index: number, region: RegionKey): ProbedParticle {
  // Predictable pseudo-random generation based on index and region
  const seed = (index * 13 + region.charCodeAt(0) * 7 + region.charCodeAt(region.length - 1) * 3) % 1000;
  
  // Is this particle global or regional?
  const isGlobal = index < 70;
  
  const idNum = 80000 + (seed % 19999);
  const name = `Particle #${idNum}`;
  
  // Decide origins/destinations based on seed
  const origins = REGION_ORIGINS[region];
  const destinations = REGION_DESTINATIONS[region];
  
  const origin = isGlobal 
    ? "Open Ocean Driftwood" 
    : origins[seed % origins.length];
    
  const dest = isGlobal
    ? "Pelagic Deep Sea Dispersion"
    : destinations[(seed + 3) % destinations.length];
    
  // Release day
  const releaseOffsetDays = (seed % 18) + 2; // 2 to 20 days ago
  const releaseDayNum = (17 - releaseOffsetDays);
  const released = `${releaseDayNum > 0 ? releaseDayNum : 30 + releaseDayNum} Jul`;
  
  // Base distance
  const baseDistance = isGlobal 
    ? 450 + (seed % 800) 
    : 15 + (seed % 140); // km
    
  // Speed in knots/m/s
  const speed = isGlobal
    ? 0.08 + (seed % 15) * 0.01 // very slow open ocean drift
    : 0.15 + (seed % 25) * 0.03; // active regional currents
    
  // ETA in days
  const etaDays = isGlobal
    ? 15 + (seed % 25)
    : 2 + (seed % 7); // 2 to 8 days
    
  return {
    id: idNum.toString(),
    name,
    origin,
    released,
    baseDistance,
    speed,
    dest,
    etaDays,
    isGlobal
  };
}
