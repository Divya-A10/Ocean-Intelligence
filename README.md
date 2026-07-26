# Ocean Intelligence

**An AI-Powered Marine Intelligence Platform for Understanding and Forecasting Ocean Plastic Transport**

## Vision

Ocean Intelligence is an AI-powered scientific platform designed to transform complex oceanographic data into understandable, actionable environmental intelligence.

The long-term vision is to become the operating system for marine environmental analysis, enabling researchers, governments, NGOs, and environmental organizations to study, simulate, predict, and explain the movement of marine pollutants and their ecological impacts using artificial intelligence.

Rather than simply visualizing ocean currents, Ocean Intelligence aims to become an interactive scientific reasoning platform capable of answering questions such as:

- Where will microplastics accumulate next?
- Why are hotspots forming?
- Which coastal ecosystems are at greatest risk?
- How do ocean currents transport pollutants over time?
- What interventions would have the greatest environmental impact?

## The Problem

### Marine plastic pollution

Every year millions of tons of plastic enter the world's oceans. Once plastics enter the ocean they do not remain stationary. They are transported by:

- Ocean circulation
- Wind forcing
- Surface currents
- Temperature gradients
- Seasonal weather
- Large-scale gyres
- Coastal dynamics

This creates accumulation hotspots thousands of kilometers away from where the waste originally entered the ocean.

Understanding these transport pathways requires expertise in:

- Oceanography
- Hydrodynamics
- Climate science
- Remote sensing
- Numerical modeling

Most environmental organizations and policymakers do not have access to tools that combine all of this information into an accessible system.

### Existing challenges

Current marine tools generally focus on one specific task. Examples include:

- Ocean current visualization
- NetCDF viewers
- Climate datasets
- GIS software
- Research papers
- Numerical simulation software

These tools often require extensive scientific expertise and are rarely integrated into a unified decision-support platform.

Users must manually:

- Download datasets
- Preprocess files
- Write simulation code
- Interpret outputs
- Read literature
- Connect findings

This creates a significant barrier for researchers, students, conservation groups, and policymakers.

## Proposed Solution

Ocean Intelligence integrates:

- Live oceanographic data
- Environmental simulation
- Artificial intelligence
- Scientific visualization
- Interactive exploration

into a single platform.

The system allows users to move seamlessly from raw environmental observations to scientifically grounded explanations.

## Current Module

### Plastic Intelligence

Plastic Intelligence is the first operational scientific module built on the Ocean Intelligence platform. Its objective is to analyze and explain marine microplastic transport.

The platform enables users to:

- Simulate plastic drift
- Visualize ocean circulation
- Identify accumulation hotspots
- Inspect transport pathways
- Receive AI-generated scientific explanations grounded in observed ocean conditions

## Core Architecture

```
User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
Ocean Intelligence Engine
  ↓
OceanState
  ↓
CMEMS Loader
  ↓
CMEMS Processor
  ↓
Simulation Engine
  ↓
Scientific Copilot (Gemini)
  ↓
Interactive Dashboard
```

## Platform Components

### 1. Ocean Intelligence Engine

The Ocean Intelligence Engine is the central computational layer of the platform.

Responsibilities include:

- Maintaining OceanState
- Coordinating data pipelines
- Managing simulation state
- Synchronizing frontend requests
- Providing standardized scientific outputs

Every subsystem communicates through the OceanState abstraction.

### 2. OceanState

OceanState represents the environmental conditions for a selected region. It contains:

- Ocean currents
- Temperature
- Salinity
- Forecast day
- Particle density
- Hotspot metrics
- Confidence estimates
- Metadata

Rather than exposing raw datasets directly, all downstream systems consume OceanState. This creates a consistent interface between simulation, visualization, and AI reasoning.

### 3. CMEMS Integration

Ocean Intelligence integrates with the Copernicus Marine Environment Monitoring Service (CMEMS).

Current capabilities include:

- Live authentication
- Regional data retrieval
- Ocean current extraction
- Sea surface temperature
- Salinity
- Structured fallback dataset

Supported regions currently include:

- Bay of Bengal
- Singapore Strait
- North Pacific Gyre
- Mediterranean Sea

The platform maintains deterministic fallback datasets to ensure uninterrupted demonstrations and offline functionality.

### 4. Ocean Simulation Engine

The simulation engine models plastic transport using ocean velocity fields.

Inputs include:

- Surface currents
- Forecast day
- Selected region

Outputs include:

- Particle trajectories
- Transport vectors
- Accumulation zones
- Hotspot density

Future versions will incorporate:

- Wind forcing
- Stokes drift
- Wave dynamics
- Degradation models
- Sinking behavior
- Vertical transport

### 5. Scientific Copilot

The Scientific Copilot uses Google's Gemini models to translate scientific observations into grounded natural-language explanations. Unlike general chatbots, the Copilot is restricted to OceanState.

It explains:

- Current ocean conditions
- Transport mechanisms
- Accumulation patterns
- Confidence levels
- Scientific interpretations
- Recommended investigations

If Gemini is unavailable, the platform falls back to deterministic scientific explanations.

### 6. Interactive Dashboard

The frontend provides an interactive research workspace featuring:

- Regional selection
- Forecast timeline
- Current vector visualization
- Particle simulations
- Hotspot analysis
- Environmental metrics
- Scientific Copilot interface

The objective is to reduce the complexity of working with oceanographic datasets.

## Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Three.js
- Framer Motion

### Backend

- FastAPI
- Python
- Pydantic
- Async APIs

### Scientific Services

- Copernicus Marine Toolbox
- Google Gemini API
- Ocean Intelligence Engine

### Data

- CMEMS
- NetCDF
- Ocean current vectors
- Temperature
- Salinity

## AI Components

### Current AI capabilities

- Grounded scientific explanation
- Contextual reasoning
- Environmental interpretation
- Investigation suggestions

### Future AI capabilities

- Multi-agent scientific workflows
- Anomaly detection
- Automatic hypothesis generation
- Uncertainty estimation
- Environmental forecasting
- Scientific report generation
- Literature grounding

## Why Ocean Intelligence is Different

Most platforms either visualize data or answer questions.

Ocean Intelligence combines:

- Simulation
- Visualization
- Environmental data
- Scientific reasoning
- Explainable AI

into one research platform.

Rather than acting as a map viewer, it functions as a scientific decision-support system.

## Long-Term Roadmap

Ocean Intelligence is intended to evolve into a modular environmental intelligence platform. While Plastic Intelligence is the first module, the architecture is designed to support additional domains without changing the core engine.

Potential future modules include:

- **Oil Spill Intelligence** — simulate spill dispersion and support emergency response planning.
- **Harmful Algal Bloom Intelligence** — monitor and forecast bloom development using environmental conditions.
- **Fisheries Intelligence** — combine oceanographic variables with ecological indicators to identify productive fishing zones.
- **Coral Reef Intelligence** — monitor reef stress, bleaching risk, and environmental health.
- **Biodiversity Intelligence** — assess ecosystem vulnerability and species distribution changes.
- **Climate Intelligence** — analyze long-term ocean trends related to climate variability and change.

All of these modules would share the same core components:

- Ocean Intelligence Engine
- OceanState
- Scientific Copilot
- Interactive Dashboard

## Future Impact

The platform is designed to serve multiple communities:

- **Researchers**, by reducing the time needed to analyze complex oceanographic datasets.
- **Environmental organizations**, by helping identify pollution hotspots and prioritize conservation efforts.
- **Government agencies**, by supporting evidence-based environmental planning and policy.
- **Students and educators**, by making marine science more interactive and accessible.
- **NGOs and citizen scientists**, by lowering the technical barrier to understanding ocean processes.

## Current Status

The project has progressed beyond the concept stage and now includes:

- A React-based interactive dashboard.
- A FastAPI backend centered around the Ocean Intelligence Engine.
- Integration with Google's Gemini models for grounded scientific explanations.
- A CMEMS-based data pipeline with resilient fallback behavior.
- Particle transport simulation driven by ocean current fields.
- Interactive regional analysis and forecast visualization.
- A modular architecture designed to accommodate additional environmental intelligence modules in the future..

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
