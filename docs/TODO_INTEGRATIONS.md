# Scientific Integration TODO Roadmap

> **Detailed Technical Checklist for CMEMS, Parcels, and Gemini Production Integrations**

---

## 1. Copernicus Marine Environment Monitoring Service (CMEMS)

- [ ] **Account & Credentials Setup**:
  - Register API user on `marine.copernicus.eu`.
  - Store `CMEMS_USER` and `CMEMS_PASSWORD` securely in environment configuration.
- [ ] **Dataset Selection**:
  - Primary Product: `GLOBAL_ANALYSISFORECAST_PHY_001_024`.
  - Variables: `uo` (eastward sea water velocity), `vo` (northward sea water velocity), `thetao` (sea water potential temperature).
- [ ] **Ingestion Handler (`backend/data/cmems_provider.py`)**:
  - Implement automated bounding box query based on target region bounding box.
  - Convert downloaded NetCDF4 arrays into indexed memory buffers using `xarray`.

---

## 2. OceanParcels Particle Simulation Engine

- [ ] **Fieldset Construction**:
  - Build Parcels `FieldSet` directly from xarray CMEMS dataset (`FieldSet.from_netcdf(...)`).
- [ ] **Custom Advection Kernels**:
  - Define `AdvectionRK4` + `Windage2D` + `StokesDrift` custom Python kernel.
  - Define beaching condition kernel: if particle coordinates cross coastal shoreline mask, flag `beached = True`.
- [ ] **Execution & Downsampling (`backend/simulation/particle_simulation.py`)**:
  - Run `pset.execute(...)` for $T$ timesteps (6-hour output intervals).
  - Convert output particle trajectories into compressed JSON array for API output.

---

## 3. Google Gemini Scientific Copilot

- [ ] **System Instruction Fine-tuning**:
  - Embed domain-specific prompts for physical oceanography, pelagic ecology, and remote sensing.
- [ ] **Grounding & Context Injection (`backend/ai/gemini_copilot.py`)**:
  - Pass real-time regional SST, velocity magnitude, and particle density summaries into Gemini context.
- [ ] **Structured Citation Parsing**:
  - Enable citation metadata linking directly to Copernicus, NOAA, OBIS, and GBIF repositories.
