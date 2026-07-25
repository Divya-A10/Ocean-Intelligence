# Ocean Intelligence - Architectural Overview & Engine Platform

**Ocean Intelligence** is an interactive scientific platform designed for marine researchers studying ocean plastic drift, hydrodynamic currents, bioaccumulation, and environmental risks.

The backend features the **Ocean Intelligence Engine**, a clean, modular, and scalable scientific architecture engineered with FastAPI and Python.

---

## 🏛️ System Architecture

```text
React Frontend
        │
        ▼
FastAPI API Routes
        │
        ▼
Ocean Intelligence Engine
        │
 ┌──────┼───────────┬────────────────────────┐
 ▼      ▼           ▼                        ▼
CMEMS  Parcels   Hotspot Engine    Future Modules (Biodiversity, ML, etc.)
        │
        ▼
    OceanState  (Standardized Scientific Data Contract)
        │
        ▼
   React UI
```

---

## 🌊 Backend Layering & Principles

The backend architecture follows strict **Single Responsibility** and **Loose Coupling**:

* **FastAPI API Routes (`backend/app/api/routes/`)**: Standardized controller endpoints handling client requests.
* **Ocean Intelligence Engine (`backend/app/engine/ocean_engine.py`)**: The central scientific core that orchestrates scientific data loaders, processes velocity fields, manages caching, and builds the unified `OceanState` data contract.
* **CMEMS Services (`backend/app/services/cmems/`)**:
  * `loader.py`: Authenticates, connects, downloads, and loads raw NetCDF datasets.
  * `processor.py`: Transforms raw variables (`u`, `v` current components), applies quality control filters, converts units, and subsets regional coordinates.
* **Standardized Data Contract (`backend/app/schemas/ocean_state.py`)**: The Pydantic schema `OceanState` providing a universal, extensible format across all data feeds, simulation engines, and frontend interfaces.

---

## 🚀 Running the Platform

### 1. Environment Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Launch FastAPI Server

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Access Swagger UI documentation at `http://localhost:8000/docs`.

### 3. Key Endpoints

- **`/engine/ocean-state`**: Directly queries the Ocean Engine for the unified `OceanState` object.
- **`/simulation`**: Lagrangian drift forecast data grounded in `OceanState`.
- **`/currents`**: Surface velocity vectors and cardinal headings.
- **`/hotspots`**: High-density accumulation hotspot coordinates and risk parameters.
- **`/explain`**: Scientific Copilot AI explanations grounded in active `OceanState` metrics.
