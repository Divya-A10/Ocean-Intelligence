# Ocean Intelligence - Migration Plan

> **Step-by-Step Strategy to Transition from Mock Data to Real Scientific Data Pipelines**

## Phase 1: Decoupling & Architecture Scaffold (Completed)
- [x] Reorganized directory layout into `frontend/`, `backend/`, `shared/`, and `docs/`.
- [x] Removed client-side mock particle calculation logic from React components.
- [x] Implemented `simulationService.ts` and `useSimulation` central hook.
- [x] Scaffolding FastAPI backend with `/api/simulation`, `/api/currents`, `/api/hotspots`, `/api/explain`, and `/api/report`.

## Phase 2: Hydrodynamic Current Data Pipeline
- [ ] Install `copernicusmarine` Python client in backend environment.
- [ ] Connect `CMEMSDataProvider` in `backend/data/cmems_provider.py` to pull 3D daily `u_water_velocity` and `v_water_velocity` NetCDF files.
- [ ] Cache NetCDF grids locally or stream slices via xarray OPeNDAP.
- [ ] Wire `CurrentLoader` to extract real m/s velocity vectors at 0.5m sea surface depth.

## Phase 3: Parcels Lagrangian Particle Transport Engine
- [ ] Install `parcels` and `netCDF4` in backend.
- [ ] Replace `PlaceholderParcelsEngine` in `backend/simulation/particle_simulation.py` with real `parcels.ParticleSet`.
- [ ] Add Runge-Kutta 4 (RK4) advection kernel combining:
  - CMEMS surface velocity field ($u_{current}, v_{current}$)
  - ERA5 10m windage factor ($1-3\%$ slip ratio)
  - Wave Stokes drift calculations
- [ ] Export simulated particle trajectory snapshots as GeoJSON or optimized binary arrays.

## Phase 4: Remote Sensing & Hotspot Density Analysis
- [ ] Implement `hotspot_analysis.py` using Kernel Density Estimation (KDE) or HDBSCAN spatial clustering.
- [ ] Connect `SentinelDataProvider` to query Copernicus Sentinel-2 STAC API for Floating Debris Index (FDI) validation.

## Phase 5: Production Deployment & Monitoring
- [ ] Containerize FastAPI backend into standalone Docker service.
- [ ] Add Redis caching layer for fast simulation response delivery.
- [ ] Configure automatic daily NetCDF background ingestion jobs.
