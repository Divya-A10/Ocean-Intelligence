# Ocean Intelligence Engine - Backend Architecture

**Ocean Intelligence** is a scientific platform designed for marine researchers, oceanographers, and environmental scientists studying ocean plastic drift, hydrodynamic current vectors, bioaccumulation risks, and coastal conservation.

The backend is powered by the **Ocean Intelligence Engine**, a clean, modular, and scalable scientific architecture engineered with FastAPI and Python.

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

## 🌊 Architecture Overview & Layers

The Ocean Intelligence backend enforces strict **Single Responsibility** and **Loose Coupling** across layers:

### 1. `backend/app/engine/ocean_engine.py` (Ocean Intelligence Engine)
* **Purpose**: The central scientific core of the platform.
* **Responsibilities**:
  * Orchestrates scientific data retrievals from satellite & numerical model services (CMEMS, Parcels, etc.).
  * Manages dataset selection, spatial bounding box subsetting, and preprocessing.
  * Implements intelligent in-memory caching to optimize response latency.
  * Constructs the standardized `OceanState` object.
  * Hides source-specific details (e.g. CMEMS NetCDF structures) from API routes and the frontend.

### 2. `backend/app/services/cmems/` (Copernicus Marine Integration)
* **`loader.py` (CMEMS Loader)**:
  * Responsible **only** for authentication, connecting to Copernicus Marine Service endpoints, and downloading raw NetCDF datasets.
  * Does not perform data transformation, API formatting, or business logic.
* **`processor.py` (CMEMS Processor)**:
  * Responsible for scientific data transformation.
  * Extracts zonal (`u`) and meridional (`v`) velocity components.
  * Converts velocities from m/s to knots and calculates cardinal headings.
  * Filters out invalid Quality Control (QC) flags and NaNs.
  * Subsets spatial coordinates and returns clean processed numerical grids.

### 3. `backend/app/schemas/ocean_state.py` (OceanState Interface)
* **Purpose**: Serves as the universal data contract returned by the engine.
* **Key Fields**:
  * `region`: Target ocean geographic region (e.g. "Bay of Bengal", "Singapore Strait").
  * `forecast_time`: ISO 8601 timestamp.
  * `current_vectors`: List of hydrodynamic velocity vectors (`u_component`, `v_component`, `velocity_knots`, `direction`).
  * `metadata`: Grid resolution, dataset ID, bounding boxes, and conventions.
  * `source`: Data provider identifier (e.g. "CMEMS Copernicus Marine Service").
  * `confidence`: Model confidence coefficient (0.0 to 1.0).
* **Extensible Module Placeholders**:
  * `temperature`, `salinity`, `chlorophyll`, `wave_height`, `winds`
  * `particle_simulation` (Lagrangian drift state)
  * `hotspots` (Accumulation density points)

---

## 🔮 Future Module Integrations

The Ocean Intelligence Engine is designed to easily plug in future scientific modules without breaking existing API routes or UI contracts:

* **Parcels Simulation Engine**: Lagrangian particle tracking framework for high-resolution microplastic trajectory projections.
* **Hotspot Detection Engine**: Spatial clustering algorithms (DBSCAN / KDE) identifying plastic retention zones.
* **Confidence Engine**: Multi-model ensemble verification weighting satellite altimetry against field buoy data.
* **Scientific Copilot Context Builder**: Pre-processes `OceanState` metrics into RAG vector context for LLM explanations.
* **Ecosystem Modules**:
  * **Biodiversity Module**: Species exposure indices and marine protected area proximity scoring.
  * **Coral Reef & Mangrove Module**: Vulnerability mapping for fragile coastal ecosystems.
  * **Fisheries & HAB Module**: Commercial fishery impact estimations and Harmful Algal Bloom forecasts.
  * **Machine Learning Engine**: Neural networks predicting sub-surface microplastic sinking dynamics.

---

## 📁 Directory Structure

```text
backend/
└── app/
    ├── main.py                  # FastAPI application entry point
    ├── engine/
    │   ├── __init__.py
    │   └── ocean_engine.py      # Ocean Intelligence Engine (Central Core)
    ├── services/
    │   ├── cmems/
    │   │   ├── __init__.py
    │   │   ├── loader.py        # CMEMS raw data loader
    │   │   └── processor.py     # CMEMS scientific transformer
    │   ├── simulation_service.py
    │   ├── current_service.py
    │   ├── hotspot_service.py
    │   ├── gemini_service.py
    │   └── report_service.py
    ├── api/
    │   └── routes/              # FastAPI controller routes
    │       ├── simulation.py    # Includes /simulation & /engine/ocean-state
    │       ├── currents.py
    │       ├── hotspots.py
    │       ├── explain.py
    │       └── reports.py
    ├── schemas/                 # Pydantic data validation schemas
    │   ├── ocean_state.py       # Core OceanState schema
    │   ├── simulation_schema.py
    │   ├── current_schema.py
    │   ├── hotspot_schema.py
    │   ├── explain_schema.py
    │   └── report_schema.py
    └── config/                  # Settings and configuration
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/engine/ocean-state` | Direct query for the standardized `OceanState` object from Ocean Engine |
| **GET** | `/simulation` | Retrieves particle drift forecasts, vectors, and risk metrics via Ocean Engine |
| **GET** | `/currents` | Retrieves hydrodynamic surface velocity vectors via Ocean Engine |
| **GET** | `/hotspots` | Retrieves plastic accumulation hotspot points via Ocean Engine |
| **POST** | `/explain` | Grounded Scientific Copilot AI explanations powered by `OceanState` |
| **POST** | `/reports` | Synthesizes automated briefing reports from active `OceanState` |
