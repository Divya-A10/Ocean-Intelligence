import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { 
  Globe, MapPin, Compass, Waves, Thermometer, Satellite, RefreshCw, 
  Play, Pause, ZoomIn, ZoomOut, Maximize2, Layers, AlertTriangle, Eye, ArrowRight,
  RotateCcw, PlayCircle
} from "lucide-react";
import { RegionKey, SimulationResponse as ForecastData } from "../types/simulation";

interface GlobePreviewProps {
  selectedRegion: RegionKey;
  onRegionChange: (region: RegionKey) => void;
  forecastData: ForecastData | null;
  loading: boolean;
  forecastDay: number;
  setForecastDay: (day: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackSpeed: 0.5 | 1 | 2;
  setPlaybackSpeed: (speed: 0.5 | 1 | 2) => void;
  onRunSimulation?: () => void;
  onReset?: () => void;
  onNavigateToReports?: () => void;
  selectedParticleIndex: number;
  onParticleProbe: (index: number) => void;
  minimal?: boolean;
}

interface SimParticle {
  lat: number;
  lng: number;
  baseLat: number;
  baseLng: number;
  speed: number;
  angle: number;
  baseAngle: number;
  radiusOffset: number;
  baseRadiusOffset: number;
  size: number;
  isGlobal: boolean;
  trail: THREE.Vector3[];
}

// Bounding box continent test for high-tech holographic land representation
function isLand(lat: number, lng: number): boolean {
  // Africa
  if (lat > -35 && lat < 35 && lng > -20 && lng < 50) return true;
  // South America
  if (lat > -55 && lat < 12 && lng > -85 && lng < -35) return true;
  // North America
  if (lat > 12 && lat < 75 && lng > -170 && lng < -50) {
    if (lat < 25 && lng > -100) return false;
    return true;
  }
  // Eurasia (Europe + Asia)
  if (lat > 10 && lat < 78 && lng > -10 && lng < 170) {
    if (lat < 20 && lng > 120) return false;
    return true;
  }
  // Australia
  if (lat > -45 && lat < -10 && lng > 110 && lng < 155) return true;
  // Antarctica
  if (lat < -60) return true;
  return false;
}

// Spherical coordinates (lat, lng) to 3D Cartesian coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Dynamic texture generator for points (glowing circles)
function createGlowTexture(colorStr: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, colorStr);
    gradient.addColorStop(0.2, colorStr);
    gradient.addColorStop(0.6, colorStr.replace(/[\d.]+\)$/, "0.15)")); // fade out smoothly
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Custom 2D Canvas-based Earth Basemap Texture Generator (with visible coastlines & satellite aesthetics)
function createEarthBasemap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Deep Space-Ocean Background (Dark elegant navy/black)
  ctx.fillStyle = "#020710";
  ctx.fillRect(0, 0, w, h);

  // Subtle ocean gradient or depth contours
  const gradient = ctx.createRadialGradient(w / 2, h / 2, h / 4, w / 2, h / 2, w);
  gradient.addColorStop(0, "#030c1b");
  gradient.addColorStop(1, "#01050a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // 2. Draw Latitude/Longitude Gridlines (Very faint white/blue lines)
  ctx.strokeStyle = "rgba(56, 189, 248, 0.03)";
  ctx.lineWidth = 1;
  // Latitudes
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // Longitudes
  for (let lng = -180; lng <= 180; lng += 20) {
    const x = ((lng + 180) / 360) * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Helper to draw continent polygons
  const drawPolygon = (poly: number[][]) => {
    ctx.beginPath();
    poly.forEach(([lng, lat], idx) => {
      const cx = ((lng + 180) / 360) * w;
      const cy = ((90 - lat) / 180) * h;
      if (idx === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.closePath();
  };

  // Simplified continental coordinates (Lng, Lat)
  const continents = [
    // North America
    [[-168, 65], [-150, 70], [-120, 70], [-100, 75], [-80, 75], [-60, 60], [-55, 45], [-80, 25], [-90, 15], [-100, 20], [-110, 22], [-115, 30], [-125, 48], [-140, 60]],
    // South America
    [[-80, 12], [-72, 10], [-45, -5], [-35, -7], [-40, -20], [-65, -50], [-73, -55], [-73, -40], [-80, -10], [-81, 5]],
    // Greenland
    [[-60, 60], [-50, 60], [-40, 65], [-30, 75], [-40, 83], [-60, 80], [-70, 75]],
    // Africa
    [[-17, 15], [-5, 35], [10, 37], [30, 31], [32, 30], [34, 25], [43, 12], [51, 11], [40, -22], [30, -34], [18, -34], [10, -10], [8, -5], [5, 5]],
    // Eurasia (Europe + Asia)
    [[-10, 36], [0, 45], [15, 55], [30, 70], [60, 75], [100, 78], [170, 70], [170, 60], [140, 50], [120, 35], [105, 30], [85, 35], [70, 30], [60, 25], [45, 15], [35, 30], [25, 36], [15, 38]],
    // India & South Asia (Detailing Bay of Bengal / Indian Ocean region)
    [[68, 24], [72, 30], [80, 30], [88, 25], [92, 26], [92, 22], [80, 6], [73, 8], [72, 18]],
    // Southeast Asia / Indochina / Malay Peninsula (Singapore Strait detail)
    [[95, 22], [105, 20], [109, 15], [108, 10], [103, 1], [101, 5], [98, 10], [98, 18]],
    // Japan
    [[130, 30], [140, 35], [145, 45], [140, 45], [135, 38], [130, 33]],
    // Sumatra & Malay
    [[95, 5], [100, -5], [105, -5], [100, 3]],
    // Borneo
    [[110, 5], [118, 5], [115, -3], [110, -3]],
    // New Guinea
    [[130, -3], [140, -3], [145, -8], [135, -8]],
    // Java
    [[105, -6], [115, -6], [115, -8], [105, -8]],
    // Australia
    [[113, -26], [114, -35], [138, -38], [151, -34], [142, -11], [136, -12], [120, -15]],
    // Antarctica
    [[-180, -70], [180, -70], [180, -90], [-180, -90]],
    // Madagascar
    [[43, -25], [47, -25], [50, -12], [47, -12]]
  ];

  // Fill continents with solid, gorgeous, dark navy slate color
  ctx.fillStyle = "#0c1523";
  continents.forEach((poly) => {
    drawPolygon(poly);
    ctx.fill();
  });

  // Stroke continental coastlines with a glowing subtle blue line
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 2.5;
  continents.forEach((poly) => {
    drawPolygon(poly);
    ctx.stroke();
  });

  // Add subtle soft shadows or nested inner glowing lines along coastlines for premium look
  ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
  ctx.lineWidth = 5;
  continents.forEach((poly) => {
    drawPolygon(poly);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function GlobePreview({
  selectedRegion,
  onRegionChange,
  forecastData,
  loading,
  forecastDay,
  setForecastDay,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onRunSimulation,
  onReset,
  onNavigateToReports,
  selectedParticleIndex,
  onParticleProbe,
  minimal = false
}: GlobePreviewProps) {
  // Layer controls
  const [activeLayers, setActiveLayers] = useState({
    particles: true,
    grid: true,
    currents: true,
    weather: false,
    hotspots: true,
    protectedAreas: true,
    shippingLanes: true,
  });

  // Globe rotators
  const [isRotating, setIsRotating] = useState(true);

  // ThreeJS Refs
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const currentLinesRef = useRef<THREE.LineSegments | null>(null);
  const gridLinesRef = useRef<THREE.Group | null>(null);
  const hotspotGroupRef = useRef<THREE.Group | null>(null);
  const weatherGroupRef = useRef<THREE.Group | null>(null);

  // Simulation particle records
  const particlesRef = useRef<SimParticle[]>([]);

  // Drag-to-rotate states
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.3, y: -0.6 });
  const zoomDistanceRef = useRef(9.0);

  // Region hotspots info with enriched grounded scientific parameters
  const regionsList = [
    { 
      key: "bay-of-bengal" as RegionKey, 
      name: "Bay of Bengal", 
      lat: 15.0, 
      lng: 88.0, 
      status: "Critical Convergence", 
      desc: "Monsoonal runoff trap",
      risk: "HIGH",
      density: "82%",
      speed: "0.82 m/s",
      accumulation: "87%",
      confidence: "91%",
      protectedAreas: 12,
      direction: "Northwest"
    },
    { 
      key: "singapore-strait" as RegionKey, 
      name: "Singapore Strait", 
      lat: 1.25, 
      lng: 103.8, 
      status: "Vessel Outflow Extreme", 
      desc: "High-density shipping lane",
      risk: "EXTREME",
      density: "94%",
      speed: "1.45 m/s",
      accumulation: "91%",
      confidence: "95%",
      protectedAreas: 4,
      direction: "East-Southeast"
    },
    { 
      key: "north-pacific-gyre" as RegionKey, 
      name: "North Pacific Gyre", 
      lat: 35.0, 
      lng: -140.0, 
      status: "Subtropical Maximum", 
      desc: "Global garbage convergence",
      risk: "HIGH",
      density: "98%",
      speed: "0.35 m/s",
      accumulation: "96%",
      confidence: "89%",
      protectedAreas: 2,
      direction: "Clockwise Spiral"
    },
    { 
      key: "mediterranean-sea" as RegionKey, 
      name: "Mediterranean Sea", 
      lat: 38.0, 
      lng: 5.0, 
      status: "Closed Basin Trapping", 
      desc: "Urban microplastic retention",
      risk: "HIGH",
      density: "85%",
      speed: "0.62 m/s",
      accumulation: "82%",
      confidence: "93%",
      protectedAreas: 18,
      direction: "Cyclonic Counter-clockwise"
    }
  ];

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Handle region coordinate panning
  useEffect(() => {
    const region = regionsList.find((r) => r.key === selectedRegion);
    if (region) {
      // Calculate rotation to face the region directly
      const phi = (90 - region.lat) * (Math.PI / 180);
      const theta = (region.lng + 180) * (Math.PI / 180);
      
      targetRotationRef.current = {
        x: phi - Math.PI / 2,
        y: -theta + Math.PI / 2
      };
    }
  }, [selectedRegion]);

  const PARTICLE_COUNT = 350;

  // Handle re-spawning particles based on selected region
  useEffect(() => {
    if (minimal) {
      particlesRef.current = [];
      return;
    }
    const list: SimParticle[] = [];

    // 70 global drifting particles for subtle ambient oceanic flow
    for (let i = 0; i < 70; i++) {
      const lat = (Math.random() - 0.5) * 140; // equator-focused drift
      const lng = (Math.random() - 0.5) * 360;
      const angle = Math.random() * Math.PI * 2;
      const radiusOffset = 0.5 + Math.random() * 1.5;
      list.push({
        lat,
        lng,
        baseLat: lat,
        baseLng: lng,
        speed: 0.1 + Math.random() * 0.15,
        angle,
        baseAngle: angle,
        radiusOffset,
        baseRadiusOffset: radiusOffset,
        size: 1 + Math.random() * 2,
        isGlobal: true,
        trail: []
      });
    }

    // 280 regional highly concentrated particles around selected site
    const activeSite = regionsList.find((r) => r.key === selectedRegion) || regionsList[0];
    for (let i = 0; i < 280; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusOffset = 0.2 + Math.random() * 2.5;
      
      // Spawning with offsets around target center
      const latOffset = (Math.random() - 0.5) * 8;
      const lngOffset = (Math.random() - 0.5) * 12;
      const lat = activeSite.lat + latOffset;
      const lng = activeSite.lng + lngOffset;
      list.push({
        lat,
        lng,
        baseLat: lat,
        baseLng: lng,
        speed: 0.15 + Math.random() * 0.25,
        angle,
        baseAngle: angle,
        radiusOffset,
        baseRadiusOffset: radiusOffset,
        size: 1.5 + Math.random() * 2.5,
        isGlobal: false,
        trail: []
      });
    }

    particlesRef.current = list;
  }, [selectedRegion]);

  // Zoom helpers
  const handleZoomIn = () => {
    zoomDistanceRef.current = Math.max(6.0, zoomDistanceRef.current - 1.0);
  };
  const handleZoomOut = () => {
    zoomDistanceRef.current = Math.min(15.0, zoomDistanceRef.current + 1.0);
  };

  // Initialize and run Three.js canvas simulation
  useEffect(() => {
    if (!mountRef.current) return;

    // Clear existing children to prevent duplicate canvas elements
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = zoomDistanceRef.current;
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Main Group for global rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // 5. Ambient Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // --- Build Holographic Digital Globe Elements ---
    const r = 5.0; // sphere radius

    // (A) Canvas-based Earth Basemap Sphere (Solid elegant ocean with styled coastlines)
    const earthGeom = new THREE.SphereGeometry(r, 64, 64);
    const earthTexture = createEarthBasemap();
    const earthMat = new THREE.MeshBasicMaterial({
      map: earthTexture,
      transparent: false
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    mainGroup.add(earthMesh);

    // (B) Transparent ocean spherical grid boundaries (Faint Latitude / Longitude lines overlay)
    const gridGroup = new THREE.Group();
    mainGroup.add(gridGroup);
    gridLinesRef.current = gridGroup;

    const gridMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08
    });

    // Create 12 longitude rings and 8 latitude rings
    for (let i = 0; i < 12; i++) {
      const ringGeom = new THREE.BufferGeometry();
      const pts: number[] = [];
      const angle = (i * Math.PI) / 6;
      for (let j = 0; j <= 64; j++) {
        const u = (j * Math.PI * 2) / 64;
        const x = r * Math.sin(u) * Math.cos(angle);
        const y = r * Math.cos(u);
        const z = r * Math.sin(u) * Math.sin(angle);
        pts.push(x, y, z);
      }
      ringGeom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const ringLine = new THREE.Line(ringGeom, gridMat);
      gridGroup.add(ringLine);
    }

    for (let i = 1; i < 8; i++) {
      const latAngle = (i * Math.PI) / 8;
      const ringRadius = r * Math.sin(latAngle);
      const ringY = r * Math.cos(latAngle);
      
      const ringGeom = new THREE.BufferGeometry();
      const pts: number[] = [];
      for (let j = 0; j <= 64; j++) {
        const u = (j * Math.PI * 2) / 64;
        const x = ringRadius * Math.cos(u);
        const z = ringRadius * Math.sin(u);
        pts.push(x, ringY, z);
      }
      ringGeom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const ringLine = new THREE.Line(ringGeom, gridMat);
      gridGroup.add(ringLine);
    }

    // (C) Ocean Currents Vector Fields (Subtle flowing arrows showing current streamlines)
    const currentLinesGroup = new THREE.Group();
    mainGroup.add(currentLinesGroup);

    const activeSite = regionsList.find((reg) => reg.key === selectedRegion) || regionsList[0];

    // Distribute arrows uniformly around the region center to map out the current direction vector field
    const vectorLayers = [
      { radius: 1.0, count: 6 },
      { radius: 2.2, count: 12 },
      { radius: 3.8, count: 18 }
    ];

    vectorLayers.forEach(({ radius, count }) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        
        let lat = activeSite.lat;
        let lng = activeSite.lng;
        let d_lat = 0;
        let d_lng = 0;
        
        if (selectedRegion === "north-pacific-gyre") {
          lat = activeSite.lat + Math.sin(angle) * radius;
          lng = activeSite.lng + Math.cos(angle) * radius * 1.5;
          
          const dx = lng - activeSite.lng;
          const dy = lat - activeSite.lat;
          // Clockwise subtropical spiral currents
          d_lng = dy;
          d_lat = -dx;
        } else if (selectedRegion === "bay-of-bengal") {
          lat = activeSite.lat + Math.sin(angle) * radius * 1.1;
          lng = activeSite.lng + Math.cos(angle) * radius * 1.4;
          
          const dx = lng - activeSite.lng;
          const dy = lat - activeSite.lat;
          // Counter-clockwise monsoonal currents
          d_lng = -dy;
          d_lat = dx;
        } else if (selectedRegion === "singapore-strait") {
          const t = (i / (count - 1)) * 2 - 1; // scale from -1 to 1
          lng = activeSite.lng + t * 6;
          lat = activeSite.lat + (Math.random() - 0.5) * 0.8 + Math.sin(lng * 0.5) * 0.3;
          // Linear west-to-east channel flow
          d_lng = 1.0;
          d_lat = 0.05 * Math.cos(lng * 0.5);
        } else if (selectedRegion === "mediterranean-sea") {
          lat = activeSite.lat + Math.sin(angle) * radius * 0.8;
          lng = activeSite.lng + Math.cos(angle) * radius * 1.6;
          
          const dx = lng - activeSite.lng;
          const dy = lat - activeSite.lat;
          // Counter-clockwise closed basin currents
          d_lng = -dy;
          d_lat = dx;
        }
        
        // Convert coordinates to 3D tangent direction vectors
        const eps = 0.01;
        const vP = latLngToVector3(lat, lng, r + 0.01);
        const vQ = latLngToVector3(lat + d_lat * eps, lng + d_lng * eps, r + 0.01);
        const dir = new THREE.Vector3().subVectors(vQ, vP).normalize();
        
        // Create subtle 3D Arrow Helper
        const arrowHelper = new THREE.ArrowHelper(
          dir,
          vP,
          0.32,             // arrow length
          0x00f0ff,         // glowing turquoise/cyan
          0.10,             // head length
          0.07              // head width
        );
        
        // Apply transparency to line and cone components
        if (arrowHelper.line.material instanceof THREE.Material) {
          arrowHelper.line.material.transparent = true;
          arrowHelper.line.material.opacity = 0.35;
        }
        if (arrowHelper.cone.material instanceof THREE.Material) {
          arrowHelper.cone.material.transparent = true;
          arrowHelper.cone.material.opacity = 0.55;
        }
        
        currentLinesGroup.add(arrowHelper);
      }
    });

    // (D) Soft Concentric Hotspot Heatmaps (concentric glowing zones where debris converges)
    const hotspotGroup = new THREE.Group();
    mainGroup.add(hotspotGroup);
    hotspotGroupRef.current = hotspotGroup;

    regionsList.forEach((site) => {
      const hotspotPos = latLngToVector3(site.lat, site.lng, r + 0.02);
      
      // concentric tiers representing high, medium, and low density areas
      const tiers = [
        { size: 0.35, color: "rgba(239, 68, 68, 0.85)", opacity: 0.9 }, // High core (Red)
        { size: 0.85, color: "rgba(249, 115, 22, 0.55)", opacity: 0.6 }, // Mid zone (Orange)
        { size: 1.60, color: "rgba(234, 179, 8, 0.25)", opacity: 0.35 }  // Outer accumulation (Yellow)
      ];

      tiers.forEach((tier) => {
        const tierGeom = new THREE.BufferGeometry();
        tierGeom.setAttribute("position", new THREE.Float32BufferAttribute([hotspotPos.x, hotspotPos.y, hotspotPos.z], 3));
        const tierMat = new THREE.PointsMaterial({
          size: tier.size,
          transparent: true,
          opacity: tier.opacity,
          map: createGlowTexture(tier.color),
          blending: THREE.NormalBlending,
          sizeAttenuation: true,
          depthWrite: false
        });
        const tierPoints = new THREE.Points(tierGeom, tierMat);
        hotspotGroup.add(tierPoints);
      });
    });

    // (E) Weather overlays (ambient clouds wrapping Earth)
    const weatherGroup = new THREE.Group();
    mainGroup.add(weatherGroup);
    weatherGroupRef.current = weatherGroup;

    const weatherParticleCount = 800;
    const weatherPositions: number[] = [];
    for (let i = 0; i < weatherParticleCount; i++) {
      const wLat = (Math.random() - 0.5) * 110;
      const wLng = Math.random() * 360;
      const wPos = latLngToVector3(wLat, wLng, r + 0.15);
      weatherPositions.push(wPos.x, wPos.y, wPos.z);
    }
    const weatherGeom = new THREE.BufferGeometry();
    weatherGeom.setAttribute("position", new THREE.Float32BufferAttribute(weatherPositions, 3));
    const weatherMat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      map: createGlowTexture("#ffffff"),
      blending: THREE.AdditiveBlending
    });
    const weatherPoints = new THREE.Points(weatherGeom, weatherMat);
    weatherGroup.add(weatherPoints);

    // (F) Interactive microplastics Lagrangian active points (Subtle, pollen-like specks floating on water)
    const pGeometry = new THREE.BufferGeometry();
    const initialPos = new Float32Array(PARTICLE_COUNT * 3);
    const initialColors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      initialPos[i * 3] = 0;
      initialPos[i * 3 + 1] = 0;
      initialPos[i * 3 + 2] = 0;

      const rColor = Math.random();
      if (rColor < 0.5) {
        // Muted white polymer debris
        initialColors[i * 3] = 0.95;
        initialColors[i * 3 + 1] = 0.96;
        initialColors[i * 3 + 2] = 0.96;
      } else if (rColor < 0.8) {
        // Translucent blue dot
        initialColors[i * 3] = 0.22;
        initialColors[i * 3 + 1] = 0.65;
        initialColors[i * 3 + 2] = 0.91;
      } else {
        // Soft turquoise organic-looking speck
        initialColors[i * 3] = 0.18;
        initialColors[i * 3 + 1] = 0.83;
        initialColors[i * 3 + 2] = 0.78;
      }
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(initialPos, 3));
    pGeometry.setAttribute("color", new THREE.BufferAttribute(initialColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,             // elegant, tiny specks!
      vertexColors: true,
      transparent: true,
      opacity: 0.80,          // subtle, non-overpowering density
      map: createGlowTexture("#ffffff"),
      blending: THREE.NormalBlending, // Normal blending makes them look like floating debris rather than starfields
      sizeAttenuation: true,
      depthWrite: false
    });
    
    const pPoints = new THREE.Points(pGeometry, pMat);
    mainGroup.add(pPoints);
    particleSystemRef.current = pPoints;

    // (G) Shipping Lanes 3D curves (commercial vessel corridors)
    const shippingLanesGroup = new THREE.Group();
    mainGroup.add(shippingLanesGroup);

    const lanes = [
      { from: { lat: 1.25, lng: 103.8 }, to: { lat: 15.0, lng: 88.0 } }, // Singapore to Bay of Bengal
      { from: { lat: 15.0, lng: 88.0 }, to: { lat: 12.0, lng: 45.0 } },  // Bengal to Red Sea
      { from: { lat: 35.0, lng: 140.0 }, to: { lat: 35.0, lng: -140.0 } }, // Tokyo to Pacific Gyre Center
      { from: { lat: 43.0, lng: 5.0 }, to: { lat: 38.0, lng: 15.0 } }, // Po to Adriatic
      { from: { lat: 38.0, lng: 15.0 }, to: { lat: 31.0, lng: 32.0 } }  // Mediterranean spine
    ];

    const laneMaterials: THREE.LineDashedMaterial[] = [];
    lanes.forEach((lane) => {
      const p1 = latLngToVector3(lane.from.lat, lane.from.lng, r + 0.01);
      const p2 = latLngToVector3(lane.to.lat, lane.to.lng, r + 0.01);
      
      const midLat = (lane.from.lat + lane.to.lat) / 2;
      const midLng = (lane.from.lng + lane.to.lng) / 2;
      const pMid = latLngToVector3(midLat, midLng, r + 0.12);

      const curve = new THREE.QuadraticBezierCurve3(p1, pMid, p2);
      const curvePoints = curve.getPoints(20);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xf97316, // orange
        dashSize: 0.1,
        gapSize: 0.06,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
      });
      laneMaterials.push(lineMat);
      const line = new THREE.Line(lineGeom, lineMat);
      line.computeLineDistances();
      shippingLanesGroup.add(line);
    });

    // (H) Marine Protected Areas (MPA) 3D concentric reserve circles
    const mpaGroup = new THREE.Group();
    mainGroup.add(mpaGroup);

    const reserves = [
      { name: "Sundarbans Sanctuary", lat: 21.8, lng: 89.0, radius: 0.22 },
      { name: "Andaman Biosphere", lat: 11.5, lng: 92.5, radius: 0.18 },
      { name: "Maldives Coral Reserves", lat: 3.2, lng: 73.0, radius: 0.15 },
      { name: "Pelagos Mammal Sanctuary", lat: 42.5, lng: 8.5, radius: 0.28 },
      { name: "Papahānaumokuākea Reserve", lat: 25.0, lng: -168.0, radius: 0.35 }
    ];

    const mpaMaterials: THREE.MeshBasicMaterial[] = [];
    const mpaGeometries: THREE.RingGeometry[] = [];
    reserves.forEach((res) => {
      const center = latLngToVector3(res.lat, res.lng, r + 0.005);
      const mpaGeom = new THREE.RingGeometry(res.radius * 0.8, res.radius, 16);
      mpaGeometries.push(mpaGeom);
      const mpaMat = new THREE.MeshBasicMaterial({
        color: 0x10b981, // emerald green
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      });
      mpaMaterials.push(mpaMat);
      const mesh = new THREE.Mesh(mpaGeom, mpaMat);
      mesh.position.copy(center);
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      mesh.rotateX(Math.PI / 2);
      mpaGroup.add(mesh);
    });

    // (I) Blinking targeting circle mesh for the selected particle probe
    const highlightGeom = new THREE.RingGeometry(0.06, 0.12, 16);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // pulsing crimson red
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
    highlightMesh.visible = false;
    mainGroup.add(highlightMesh);

    // 6. Handle interactions (Drag to rotate & click raycasting)
    const mouseDownPos = { x: 0, y: 0 };
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      mouseDownPos.x = e.clientX;
      mouseDownPos.y = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;
      
      // limit vertical rotation
      targetRotationRef.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDraggingRef.current = false;

      // Calculate travel distance to differentiate single click vs swipe/drag rotation
      const dragDistance = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      if (dragDistance < 4) {
        // Run Raycast selection over the interactive particles points
        const rect = renderer.domElement.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const mouseVector = new THREE.Vector2(mouseX, mouseY);
        const raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 0.22; // generous hit zone for accessible micro-clicks
        raycaster.setFromCamera(mouseVector, camera);

        const intersects = raycaster.intersectObject(pPoints);
        if (intersects.length > 0) {
          const clickedIndex = intersects[0].index;
          if (clickedIndex !== undefined && clickedIndex !== null && clickedIndex >= 0 && clickedIndex < particlesRef.current.length) {
            onParticleProbe(clickedIndex);
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomDistanceRef.current = Math.max(6.0, Math.min(15.0, zoomDistanceRef.current + e.deltaY * 0.005));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handleMouseDown);
    dom.addEventListener("mousemove", handleMouseMove);
    dom.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("mouseleave", handleMouseUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    // 7. Animation Loop
    let animationFrameId = 0;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);

      timer.update(timestamp);
      const delta = timer.getDelta();
      const time = timer.getElapsed();

      // Smooth camera zoom lerp
      camera.position.z += (zoomDistanceRef.current - camera.position.z) * 0.1;

      // Smooth orbital rotation interpolation (LERP)
      if (!isDraggingRef.current) {
        if (isRotating) {
          // Slow continuous rotation around the Y-axis
          targetRotationRef.current.y += 0.0015;
        }
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      mainGroup.rotation.x = currentRotationRef.current.x;
      mainGroup.rotation.y = currentRotationRef.current.y;

      // Pulse active hotspots scale & opacity
      if (hotspotGroup) {
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.15;
        hotspotGroup.children.forEach((mesh, index) => {
          mesh.scale.set(pulse, pulse, pulse);
          const mat = (mesh as THREE.Points).material as THREE.PointsMaterial;
          mat.opacity = 0.7 + Math.sin(time * 3 + index) * 0.25;
        });
      }

      // Layer Visibility Sync
      gridGroup.visible = activeLayers.grid;
      currentLinesGroup.visible = activeLayers.currents;
      weatherPoints.visible = activeLayers.weather;
      hotspotGroup.visible = activeLayers.hotspots;
      pPoints.visible = activeLayers.particles;
      shippingLanesGroup.visible = activeLayers.shippingLanes;
      mpaGroup.visible = activeLayers.protectedAreas;

      // Pulse and update the selected particle target indicator ring
      if (activeLayers.particles && selectedParticleIndex !== undefined && selectedParticleIndex >= 0 && selectedParticleIndex < particlesRef.current.length) {
        const selPart = particlesRef.current[selectedParticleIndex];
        if (selPart) {
          const targetPos = latLngToVector3(selPart.lat, selPart.lng, r + 0.04);
          highlightMesh.position.copy(targetPos);
          highlightMesh.lookAt(new THREE.Vector3(0, 0, 0));
          highlightMesh.rotateX(Math.PI / 2); // conform flatly to sphere surface
          
          const pulse = 1.0 + Math.sin(time * 6.0) * 0.25; // elegant rapid pulse
          highlightMesh.scale.set(pulse, pulse, 1.0);
          highlightMesh.visible = true;
        } else {
          highlightMesh.visible = false;
        }
      } else {
        highlightMesh.visible = false;
      }

      // Rotate weather overlays slightly faster
      if (activeLayers.weather) {
        weatherPoints.rotation.y = time * 0.015;
      }

      // --- Microplastic Particle Lagrangian Movement Engine ---
      if (activeLayers.particles && particlesRef.current.length > 0) {
        const positions = pPoints.geometry.attributes.position.array as Float32Array;
        const currentActiveSite = regionsList.find((r) => r.key === selectedRegion) || regionsList[0];

        particlesRef.current.forEach((p, idx) => {
          if (idx >= PARTICLE_COUNT) return;

          if (!isPlaying) {
            // Static simulation state according to current forecastDay timestep
            if (p.isGlobal) {
              p.lng = p.baseLng + (p.speed * forecastDay * 1.5);
              if (p.lng > 180) p.lng -= 360;
              p.lat = p.baseLat + Math.sin(forecastDay + idx) * 0.2;
            } else {
              p.angle = p.baseAngle + (p.speed * forecastDay * 0.35);
              p.radiusOffset = Math.max(0.1, p.baseRadiusOffset - (0.15 * forecastDay));

              if (selectedRegion === "north-pacific-gyre") {
                p.lat = currentActiveSite.lat + Math.sin(p.angle) * p.radiusOffset;
                p.lng = currentActiveSite.lng + Math.cos(p.angle) * p.radiusOffset * 1.5;
              } else if (selectedRegion === "bay-of-bengal") {
                p.lat = currentActiveSite.lat + Math.sin(p.angle) * p.radiusOffset * 1.1;
                p.lng = currentActiveSite.lng + Math.cos(p.angle) * p.radiusOffset * 1.4;
              } else if (selectedRegion === "singapore-strait") {
                p.lng = currentActiveSite.lng + (p.speed * forecastDay * 1.2) - 3;
                p.lat = currentActiveSite.lat + Math.sin(p.lng * 2 + idx) * 0.04;
              } else if (selectedRegion === "mediterranean-sea") {
                p.lat = currentActiveSite.lat + Math.sin(p.angle * 1.5) * p.radiusOffset * 0.8;
                p.lng = currentActiveSite.lng + Math.cos(p.angle) * p.radiusOffset * 1.6;
              }
            }
          } else {
            // Continuous animated simulation playback
            const dayMultiplier = (0.5 + forecastDay * 0.35) * playbackSpeed;
            if (p.isGlobal) {
              p.lng += p.speed * dayMultiplier * 0.2;
              if (p.lng > 180) p.lng = -180;
              p.lat += Math.sin(time + idx) * 0.02;
            } else {
              if (selectedRegion === "north-pacific-gyre") {
                p.angle += p.speed * dayMultiplier * 0.012;
                p.radiusOffset -= 0.0035 * dayMultiplier;
                if (p.radiusOffset < 0.1) {
                  p.radiusOffset = 2.0 + Math.random() * 2.0;
                  p.angle = Math.random() * Math.PI * 2;
                }
                p.lat = currentActiveSite.lat + Math.sin(p.angle) * p.radiusOffset;
                p.lng = currentActiveSite.lng + Math.cos(p.angle) * p.radiusOffset * 1.5;
              } else if (selectedRegion === "bay-of-bengal") {
                p.angle -= p.speed * dayMultiplier * 0.015;
                p.radiusOffset -= 0.0025 * dayMultiplier;
                if (p.radiusOffset < 0.1) {
                  p.radiusOffset = 1.2 + Math.random() * 1.8;
                  p.angle = Math.random() * Math.PI * 2;
                }
                p.lat = currentActiveSite.lat + Math.sin(p.angle) * p.radiusOffset * 1.1;
                p.lng = currentActiveSite.lng + Math.cos(p.angle) * p.radiusOffset * 1.4;
              } else if (selectedRegion === "singapore-strait") {
                p.lng += p.speed * dayMultiplier * 0.12;
                p.lat += Math.sin(p.lng * 2 + idx) * 0.04;
                p.lat = p.lat * 0.95 + currentActiveSite.lat * 0.05;
                if (p.lng > currentActiveSite.lng + 8) {
                  p.lng = currentActiveSite.lng - 8;
                  p.lat = currentActiveSite.lat + (Math.random() - 0.5) * 1.5;
                }
              } else if (selectedRegion === "mediterranean-sea") {
                p.angle += p.speed * dayMultiplier * 0.01;
                p.radiusOffset -= 0.002 * dayMultiplier;
                if (p.radiusOffset < 0.1) {
                  p.radiusOffset = 1.0 + Math.random() * 2.2;
                  p.angle = Math.random() * Math.PI * 2;
                }
                p.lat = currentActiveSite.lat + Math.sin(p.angle * 1.5) * p.radiusOffset * 0.8;
                p.lng = currentActiveSite.lng + Math.cos(p.angle) * p.radiusOffset * 1.6;
              }
            }
          }

          // Convert final calculated lat / lng to 3D Cartesian vectors
          const calculatedPos = latLngToVector3(p.lat, p.lng, r + 0.035);
          positions[idx * 3] = calculatedPos.x;
          positions[idx * 3 + 1] = calculatedPos.y;
          positions[idx * 3 + 2] = calculatedPos.z;
        });

        pPoints.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      timer.dispose();
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", handleMouseDown);
      dom.removeEventListener("mousemove", handleMouseMove);
      dom.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("mouseleave", handleMouseUp);
      dom.removeEventListener("wheel", handleWheel);

      // Dispose resources
      if (rendererRef.current && dom) {
        if (mountRef.current && mountRef.current.contains(dom)) {
          mountRef.current.removeChild(dom);
        }
      }
      
      // Dispose meshes, geometries, materials & textures
      earthGeom.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      
      gridMat.dispose();
      
      // Dispose ArrowHelpers in currentLinesGroup
      currentLinesGroup.children.forEach((child) => {
        if (child instanceof THREE.ArrowHelper) {
          child.line.geometry.dispose();
          if (child.line.material instanceof THREE.Material) child.line.material.dispose();
          child.cone.geometry.dispose();
          if (child.cone.material instanceof THREE.Material) child.cone.material.dispose();
        }
      });
      
      weatherGeom.dispose();
      weatherMat.dispose();
      pGeometry.dispose();
      pMat.dispose();

      // Dispose of custom Shipping Lanes, MPAs, and targeting highlight meshes
      laneMaterials.forEach((m) => m.dispose());
      mpaMaterials.forEach((m) => m.dispose());
      mpaGeometries.forEach((g) => g.dispose());
      highlightGeom.dispose();
      highlightMat.dispose();
    };
  }, [activeLayers, selectedRegion, forecastDay, isRotating, selectedParticleIndex]);

  // Find currently active region statistics
  const activeRegionData = regionsList.find((r) => r.key === selectedRegion) || regionsList[0];

  if (minimal) {
    return (
      <div id="globe_viewport_container" className="relative w-full h-[360px] sm:h-[420px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800/80">
        <div 
          ref={mountRef} 
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div id="globe_viewport_container" className="relative flex flex-col xl:flex-row gap-6 bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm overflow-hidden">
      
      {/* 3D WebGL Visualization Stage - Hero component (Takes up 80% on desktop) */}
      <div className="flex-1 relative min-h-[500px] bg-slate-900 rounded-xl border border-gray-100 flex flex-col justify-between p-5 overflow-hidden shadow-sm">
        
        {/* Apple-style clean Scientific Metadata Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 z-10">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              Live Lagrangian Observation
            </h3>
            <span className="text-[11px] text-gray-300 block mt-0.5">
              Copernicus Marine + Sentinel-2 Ocean Constellation
            </span>
          </div>

          {/* Scientific Metadata Grid (Grounding credibility) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-3 gap-y-1 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10 text-[10px] font-mono text-gray-200">
            <div className="flex flex-col">
              <span className="text-gray-400 text-[8px] uppercase tracking-wider">Dataset</span>
              <span className="text-sky-400 font-bold">Sentinel-2</span>
            </div>
            <div className="hidden sm:block text-white/20">|</div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[8px] uppercase tracking-wider">Updated</span>
              <span className="text-white font-semibold">3h ago</span>
            </div>
            <div className="hidden sm:block text-white/20">|</div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[8px] uppercase tracking-wider">Horizon</span>
              <span className="text-emerald-400 font-semibold">7 Days</span>
            </div>
            <div className="hidden sm:block text-white/20">|</div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[8px] uppercase tracking-wider">Currents</span>
              <span className="text-white font-semibold">CMEMS</span>
            </div>
            <div className="hidden sm:block text-white/20">|</div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[8px] uppercase tracking-wider">Simulation</span>
              <span className="text-emerald-400 font-semibold">Parcels</span>
            </div>
          </div>
        </div>

        {/* The Mount for ThreeJS canvas */}
        <div 
          ref={mountRef} 
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Enriched Focal Region Popup (Floating elegant card) */}
        <div className="absolute top-20 left-5 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 max-w-[240px] pointer-events-auto shadow-lg transition-all duration-300">
          <div className="space-y-3">
            <div>
              <span className="text-[8px] font-mono text-sky-400 uppercase tracking-widest block font-bold">Regional Observation</span>
              <h4 className="text-xs font-bold text-white mt-0.5">{activeRegionData.name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-mono border-t border-white/5 pt-2 text-gray-300">
              <div>
                <span className="text-gray-400 text-[8px] block uppercase">Risk Index</span>
                <span className={`font-bold ${activeRegionData.risk === "EXTREME" ? "text-red-400" : "text-amber-400"}`}>
                  {activeRegionData.risk}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[8px] block uppercase">Avg Speed</span>
                <span className="text-white font-semibold">{activeRegionData.speed}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[8px] block uppercase">Density</span>
                <span className="text-emerald-400 font-bold">{activeRegionData.accumulation}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[8px] block uppercase">Confidence</span>
                <span className="text-white font-semibold">{activeRegionData.confidence}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 text-[8px] block uppercase">Protected Marine Habitats</span>
                <span className="text-white font-semibold">{activeRegionData.protectedAreas} nearby</span>
              </div>
            </div>

            {onNavigateToReports && (
              <button 
                onClick={onNavigateToReports}
                className="w-full mt-1.5 py-1.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-[10px] font-semibold text-sky-300 transition flex items-center justify-center gap-1 group cursor-pointer"
              >
                Synthesize PDF Report
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Floating Zoom & Drift controls overlay */}
        <div className="absolute left-5 bottom-28 z-10 flex flex-col gap-1.5">
          <button 
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border transition-all ${
              isRotating ? "border-sky-400/30 bg-sky-400/20 text-sky-300" : "border-white/10 bg-black/60 text-gray-400"
            }`}
            title="Toggle Earth Rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "16s" }} />
          </button>
        </div>

        {/* Legend / Key Overlay (Floating at bottom-left above timeline) */}
        <div className="absolute left-16 bottom-28 z-10 bg-black/60 backdrop-blur-md border border-white/10 p-2.5 rounded-xl max-w-xs text-[9px] font-mono text-gray-350 space-y-1">
          <span className="text-[8px] font-bold text-gray-400 block tracking-wider uppercase">Legend</span>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            <span className="flex items-center gap-0.5">🌍 <span className="text-white">Coast</span></span>
            <span className="flex items-center gap-0.5"><span className="text-sky-400">~~~~</span> <span className="text-white">Currents</span></span>
            <span className="flex items-center gap-0.5"><span className="text-emerald-400">• • •</span> <span className="text-white">Particles</span></span>
            <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-orange-500 inline-block"></span> <span className="text-white">Hotspots</span></span>
          </div>
        </div>

        {/* Layers Switch Control Panel (Floating overlay) */}
        <div className="absolute right-5 bottom-28 z-10 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-xl flex flex-col gap-1.5 max-w-[150px]">
          <span className="text-[8px] font-mono text-gray-400 font-bold block text-center uppercase">Layers</span>
          <button
            onClick={() => toggleLayer("particles")}
            className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-mono transition-all text-left ${
              activeLayers.particles ? "border border-emerald-400/30 bg-emerald-400/20 text-emerald-300" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> Particles</span>
            <Eye className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleLayer("currents")}
            className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-mono transition-all text-left ${
              activeLayers.currents ? "border border-sky-400/30 bg-sky-400/20 text-sky-300" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1"><Compass className="w-3 h-3" /> Currents</span>
            <Eye className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleLayer("weather")}
            className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-mono transition-all text-left ${
              activeLayers.weather ? "border border-purple-400/30 bg-purple-400/20 text-purple-300" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1"><Satellite className="w-3 h-3" /> Winds</span>
            <Eye className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleLayer("hotspots")}
            className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-mono transition-all text-left ${
              activeLayers.hotspots ? "border border-orange-400/30 bg-orange-400/20 text-orange-300" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> Hotspots</span>
            <Eye className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleLayer("protectedAreas")}
            className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-mono transition-all text-left ${
              activeLayers.protectedAreas ? "border border-emerald-400/30 bg-emerald-400/20 text-emerald-300" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1">🟢 MPA Reserves</span>
            <Eye className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleLayer("shippingLanes")}
            className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-mono transition-all text-left ${
              activeLayers.shippingLanes ? "border border-orange-400/30 bg-orange-400/20 text-orange-300" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1">🟠 Shipping Lanes</span>
            <Eye className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Loading Overlay state when backend computation is running */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center transition-all animate-fade-in">
            <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin mb-4"></div>
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4.5 h-4.5 text-sky-400 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="text-sm font-semibold text-white tracking-wide">
                Running particle transport simulation...
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm font-mono mt-1">
              Solving 3D Lagrangian advection-diffusion vectors across {activeRegionData.name} grid coordinates.
            </p>
          </div>
        )}

        {/* THE TIMELINE FORECAST COMPONENT (Directly controlling simulation) */}
        <div className="z-10 w-full mt-auto bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col xl:flex-row items-center gap-3 justify-between shadow-lg">
          
          {/* Main Action Buttons */}
          <div className="flex items-center gap-2 w-full xl:w-auto shrink-0 flex-wrap">
            {/* Run Simulation Button */}
            {onRunSimulation && (
              <button
                onClick={onRunSimulation}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Execute Particle Transport Simulation backend"
              >
                <PlayCircle className="w-3.5 h-3.5 fill-current" />
                Run Simulation
              </button>
            )}

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isPlaying ? "bg-amber-600 hover:bg-amber-500" : "bg-[#0071e3] hover:bg-[#0071e3]/90"
              }`}
              title={isPlaying ? "Pause Simulation" : "Play Forecast"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Play Forecast
                </>
              )}
            </button>

            {/* Reset Button */}
            {onReset && (
              <button
                onClick={onReset}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-medium font-mono transition flex items-center gap-1 cursor-pointer"
                title="Reset simulation time"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}

            <div className="hidden sm:flex flex-col ml-1 border-l border-white/10 pl-2">
              <span className="text-[8px] font-mono text-sky-300 uppercase tracking-wider font-bold">SIMULATION TIMESTEP</span>
              <span className="text-xs text-white font-medium">Day {forecastDay} / 7 Days</span>
            </div>
          </div>

          {/* Timeline Slider Indicator */}
          <div className="flex-1 flex items-center gap-1 w-full px-1 relative">
            <button
              onClick={() => { setForecastDay(0); setIsPlaying(false); }}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition ${forecastDay === 0 ? "text-sky-300 font-bold bg-white/10" : "text-gray-400 hover:text-white"}`}
            >
              Day 0
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                onClick={() => { setForecastDay(d); setIsPlaying(false); }}
                className={`flex-1 h-1.5 rounded-full transition-all relative ${
                  forecastDay === d 
                    ? "bg-[#0071e3]" 
                    : d < forecastDay 
                      ? "bg-sky-500/80" 
                      : "bg-white/15 hover:bg-white/25"
                }`}
                title={`Jump to Day ${d}`}
              >
                {forecastDay === d && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20">
                    Day {d}
                  </span>
                )}
              </button>
            ))}
            <span className="text-[9px] font-mono text-gray-400 shrink-0 ml-1">+7 Days</span>
          </div>

          {/* Speed multiplier selections (0.5x, 1x, 2x) */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg shrink-0">
            <span className="text-[8px] font-mono text-gray-400 px-1 uppercase font-semibold">Speed:</span>
            {( [0.5, 1, 2] as const ).map((sp) => (
              <button
                key={sp}
                onClick={() => setPlaybackSpeed(sp)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  playbackSpeed === sp 
                    ? "bg-[#0071e3] text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Observation Sites Side Selection panel (Takes up 20% on desktop) */}
      <div className="w-full xl:w-[20%] xl:min-w-[240px] flex flex-col justify-between bg-gray-50 rounded-xl border border-gray-250 p-4 z-10 shadow-sm">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-gray-500" />
            Observation Sites
          </h4>
          <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
            Select an ocean geographic coordinate matrix to update simulation feeds.
          </p>

          <div className="space-y-2">
            {regionsList.map((region) => {
              const isSelected = region.key === selectedRegion;
              return (
                <button
                  key={region.key}
                  onClick={() => onRegionChange(region.key)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? "bg-white border-gray-300 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-xs font-semibold ${isSelected ? "text-[#0071e3]" : "text-gray-700"}`}>
                      {region.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    {region.desc}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-gray-400 border-t border-gray-200/60 pt-1">
                    <span>{region.lat > 0 ? `${region.lat}°N` : `${Math.abs(region.lat)}°S`}, {region.lng > 0 ? `${region.lng}°E` : `${Math.abs(region.lng)}°W`}</span>
                    <span className={`font-semibold ${isSelected ? "text-emerald-600" : "text-gray-400"}`}>
                      {region.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sync Latency diagnostics details */}
        <div className="mt-6 pt-3 border-t border-gray-200 flex items-center justify-between text-[9px] font-mono text-gray-400">
          <div>Ref: ROMS-CMEMS</div>
          <div className="text-emerald-600 font-bold">OPERATIONAL</div>
        </div>
      </div>
    </div>
  );
}
