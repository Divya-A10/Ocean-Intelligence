# Ocean Intelligence - Architecture Specification

> **Scalable Geospatial & Physical Oceanography Architecture for Marine Plastic Intelligence**

## Architecture Overview

Ocean Intelligence is decoupled into modular layers that separate scientific data ingestion, Lagrangian particle transport solvers, AI synthesis, and interactive visual analytics.

```
                  ┌──────────────────────────────────────────────┐
                  │          Earth Observation & Models          │
                  │ (CMEMS NetCDF • HYCOM • ERA5 Wind • Sentinel)│
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            Backend Scientific Layer          │
                  │   (FastAPI • Python • Parcels Simulation)    │
                  └──────────────────────┬───────────────────────┘
                                         │ REST APIs
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             Frontend Client Layer            │
                  │   (React • TypeScript • Centralized State)   │
                  └──────────────────────────────────────────────┘
```

---

## Directory Layout

```
├── frontend/                     # Client application
│   ├── components/               # React UI components (GlobePreview, PlasticSimulator, Copilot, Reports)
│   ├── hooks/                    # Central state hooks (useSimulation)
│   ├── services/                 # API service layer (simulationService, apiClient)
│   ├── types/                    # Frontend type definitions
│   ├── utils/                    # Formatting & spatial math helpers
│   ├── pages/                    # Page level layouts (DashboardPage)
│   ├── App.tsx                   # Main React entry container
│   ├── main.tsx                  # Vite DOM mounting point
│   └── index.css                 # Global Tailwind CSS styling
│
├── backend/                      # FastAPI Python scientific engine
│   ├── main.py                   # FastAPI server entry point
│   ├── api/                      # REST endpoint routers (/health, /simulation, /explain, /report)
│   ├── simulation/               # Particle transport & current loaders (Parcels, RK4, Hotspots)
│   ├── data/                     # Data source interfaces (CMEMS, HYCOM, Sentinel-2, Weather)
│   ├── ai/                       # Gemini AI copilot engine
│   ├── reports/                  # Whitepaper markdown report synthesis
│   ├── models/                   # Pydantic schema validation models
│   └── config/                   # Settings & environment configuration
│
├── shared/                       # Cross-stack definitions
│   ├── types/                    # Shared API interfaces
│   └── constants.ts              # Region keys & standard ocean metadata
│
└── docs/                         # System documentation
    ├── ARCHITECTURE.md           # System design & topology
    ├── MIGRATION.md              # Migration plan from mock to real data
    ├── TODO_INTEGRATIONS.md      # Scientific integrations roadmap (CMEMS, Parcels, Gemini)
    └── API_SPECIFICATION.md      # REST API contracts
```

---

## State Management Flow

1. **User Interaction**: User changes selected region or moves the 7-day forecast timeline slider.
2. **Hook Trigger**: `useSimulation` hook fires an asynchronous request via `simulationService`.
3. **API Call**: `simulationService` queries GET `/api/simulation?region=...&day=...`.
4. **Backend Processing**: FastAPI invokes `ForecastEngine` -> `ParticleSimulationEngine` & `CurrentLoader`.
5. **State Propagation**: `SimulationState` is updated atomically, propagating new particle trajectories, current vectors, risk metrics, and hotspots to all React components.
