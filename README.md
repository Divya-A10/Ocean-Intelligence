# Ocean Intelligence - Backend Architecture

**Ocean Intelligence** is an interactive scientific platform designed for marine researchers studying ocean plastic drift, hydrodynamic currents, bioaccumulation, and environmental risks.

This repository contains the production-grade **FastAPI backend foundation**, engineered with clean layered architecture (Routes -> Services -> Models & Schemas) for maximum maintainability, scalability, and seamless integration of future scientific simulation engines.

---

## 🏗️ Architecture & Project Structure

```text
backend/
└── app/
    ├── main.py                  # FastAPI application entry point & CORS configuration
    ├── config/
    │   ├── __init__.py
    │   └── settings.py          # Central Pydantic settings & environment variables
    ├── api/
    │   └── routes/              # HTTP Route Handlers (Controller layer)
    │       ├── __init__.py
    │       ├── health.py        # System health & root project status
    │       ├── simulation.py    # Microplastic drift simulation endpoint
    │       ├── currents.py      # Hydrodynamic current vectors endpoint
    │       ├── hotspots.py      # Accumulation density hotspots endpoint
    │       ├── explain.py       # AI Copilot scientific inquiry endpoint
    │       └── reports.py       # Automated research briefing generation endpoint
    ├── services/                # Business logic & scientific integration layer
    │   ├── __init__.py
    │   ├── simulation_service.py
    │   ├── current_service.py
    │   ├── hotspot_service.py
    │   ├── gemini_service.py
    │   └── report_service.py
    ├── models/                  # Internal domain entities & dataclasses
    │   ├── __init__.py
    │   ├── simulation.py
    │   ├── current.py
    │   ├── hotspot.py
    │   └── report.py
    ├── schemas/                 # Pydantic schemas for request/response validation
    │   ├── __init__.py
    │   ├── simulation_schema.py
    │   ├── current_schema.py
    │   ├── hotspot_schema.py
    │   ├── explain_schema.py
    │   └── report_schema.py
    ├── utils/                   # Shared logging & helper utilities
    │   ├── __init__.py
    │   └── logger.py
    └── data/                    # Static / fallback placeholder datasets
        ├── __init__.py
        └── placeholders.py
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Python**: 3.12 or higher
- **Virtual Environment**: `venv` or `conda`

### 1. Environment Setup

Clone the repository and set up your Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

Install all required packages from `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

---

## 🚀 Running the Application

Start the development server using `uvicorn`:

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Alternatively, run directly via Python:

```bash
python3 -m backend.app.main
```

Once running, interactive API documentation is automatically accessible at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Spec**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 📡 Available API Endpoints

| Method | Endpoint | Description | Sample Response Payload |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Root project status | `{"project": "Ocean Intelligence", "status": "running", "version": "0.1.0"}` |
| **GET** | `/health` | Liveness health check | `{"status": "healthy"}` |
| **GET** | `/simulation` | Microplastic particle drift forecast | `{"forecast_time": "2026-07-23T12:00:00Z", "region": "Bay of Bengal", "particles": [], "currents": [], "hotspots": [], "metrics": {"risk": "Unknown", "confidence": 0}}` |
| **GET** | `/currents` | Ocean velocity vector grid | `{"region": "Bay of Bengal", "vectors": [{"latitude": 15.0, "longitude": 88.0, "u_component": 0.42, "v_component": 0.18, "velocity_knots": 2.4}]}` |
| **GET** | `/hotspots` | Density accumulation hotspots | `{"region": "Bay of Bengal", "count": 2, "hotspots": [{"id": "hotspot-001", "latitude": 15.8, "longitude": 87.5, "density_particles_per_km2": 2850.5, "risk_level": "High"}]}` |
| **POST** | `/explain` | AI Copilot research explanation | Accept: `{"question": "..."}` <br> Return: `{"answer": "Placeholder explanation."}` |
| **POST** | `/report` | Scientific briefing generation | Accept: `{}` or simulation data <br> Return: `{"report_id": "demo-report", "status": "generated"}` |

---

## 🔬 Scientific Integration Roadmap (Planned)

The backend service layer is designed for easy extension. Placeholder services include clear `# TODO:` hooks for upcoming modules:

1. **Copernicus Marine (CMEMS)**: Direct fetching of physical oceanography reanalysis & forecast models.
2. **HYCOM**: Global high-resolution ocean current velocity fields.
3. **Parcels (OceanParcels)**: Eulerian-Lagrangian fluid flow particle tracking simulations.
4. **Google Gemini AI**: Grounded copilot analysis referencing peer-reviewed literature.
5. **PDF / Report Engine**: Automated research report compilation via Jinja2 & WeasyPrint.
