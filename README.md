# Ocean Intelligence

> **Understanding the Ocean Through Data, Simulation, and AI.**

Ocean Intelligence is an AI-powered research platform that helps scientists, governments, NGOs, and conservation organizations monitor and forecast marine microplastic transport using Earth observation, ocean circulation data, particle transport simulation, and generative AI.

Instead of static dashboards, Ocean Intelligence provides an interactive map where users can visualize how microplastics move through the ocean over time, identify accumulation hotspots, and understand the environmental factors driving those predictions.

---

## Vision

Our oceans generate enormous amounts of environmental data every day, yet understanding how pollution moves remains difficult.

Ocean Intelligence transforms satellite imagery, ocean current data, weather observations, and scientific simulations into an intuitive platform for exploring marine plastic transport and supporting environmental decision-making.

---

## Features

### Interactive Ocean Map

- Interactive global ocean map
- Satellite imagery
- Ocean current visualization
- Forecast timeline
- Region selection
- Zoom & pan

---

### Particle Transport Simulation

Powered by **Parcels**, the platform simulates the movement of floating microplastic particles using real ocean current data.

Features include:

- Animated particle trajectories
- Forecast playback
- Transport pathways
- Coastline accumulation
- Hotspot visualization

---

### Ocean Intelligence

Analyze predicted plastic transport through:

- Hotspot detection
- Risk assessment
- Transport velocity
- Accumulation estimates
- Forecast confidence
- Environmental summaries

---

### Scientific Copilot

Built with Google Gemini.

The Scientific Copilot can:

- Explain forecasts
- Summarize environmental conditions
- Answer research questions
- Generate reports
- Interpret model outputs

---

### Report Generation

Generate downloadable scientific reports containing:

- Forecast summary
- Risk assessment
- Particle transport analysis
- Environmental observations
- AI-generated insights

---

# Architecture

```
Earth Observation Data
(Satellite • Weather • Ocean Currents)
                │
                ▼
      Environmental Data Pipeline
                │
                ▼
     Parcels Particle Simulation
                │
                ▼
      Ocean Intelligence Engine
                │
                ▼
 Hotspots • Risk • Forecast Metrics
                │
                ▼
      Gemini Scientific Copilot
                │
                ▼
      Interactive Research Dashboard
```

---

# Data Sources

Ocean Intelligence is designed to integrate publicly available Earth observation datasets.

Examples include:

- Sentinel-2
- Copernicus Marine Service (CMEMS)
- HYCOM
- ROMS
- NOAA
- ERA5 Weather
- GBIF
- OBIS
- AIS Shipping Data

---

# Tech Stack

## Frontend

- Next.js (MVP currently built using React + Vite + TypeScript)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js

---

## Backend

- FastAPI / Express.js (Express server in MVP for unified hosting and API proxies)
- Node.js

---

## Scientific Computing

- Parcels
- NumPy
- Pandas
- Xarray
- NetCDF

---

## AI

- Google Gemini (`@google/genai` TypeScript SDK)

---

# Local Development & Installation

Follow these steps to run the Ocean Intelligence MVP on your local system.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed. You can also use [Bun](https://bun.sh/) if preferred (a `bun.lock` is included).

### 1. Clone & Extract
Extract the project files to a local directory of your choice and open your terminal there.

### 2. Install Dependencies
Run one of the following commands in the root directory to install all required client-side and server-side packages:

```bash
# Using npm (recommended)
npm install

# Or using Bun
bun install
```

### 3. Configure Environment Variables
The application communicates with Google Gemini API server-side to provide intelligent scientific copilot summaries and reports.

1. Copy the template `.env.example` file to create your active `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *You can generate a free developer API key from the [Google AI Studio Console](https://aistudio.google.com/).*

### 4. Run the Development Server
Launch the unified local development server running both Vite asset streaming and the Express proxy endpoint:

```bash
# Using npm
npm run dev

# Or using Bun
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to interact with the platform.

### 5. Production Build & Start
To test the production optimized build compiled into optimized JavaScript assets and compiled server bundles:

```bash
# Build the production bundle
npm run build

# Start the optimized server
npm run start
```
This builds static assets into the `dist` directory and bundles the Express server using `esbuild` to run optimized server routines.

---

# MVP Roadmap

## Phase 1

- Interactive Ocean Dashboard
- Ocean Map
- Region Selection

---

## Phase 2

- Ocean Current Visualization
- Parcels Integration
- Particle Transport Animation
- Forecast Timeline

---

## Phase 3

- Dynamic Metrics
- Plastic Hotspots
- Risk Assessment
- Report Generation

---

## Phase 4

- Gemini Scientific Copilot
- Natural Language Queries
- AI Report Generation

---

# Future Work

Ocean Intelligence is designed as a modular platform.

Future research modules include:

- Coral Intelligence
- Fisheries Intelligence
- Marine Biodiversity
- Oil Spill Monitoring
- Harmful Algal Bloom Forecasting
- Coastal Resilience

---

# MVP

The MVP demonstrates:

- Interactive ocean visualization
- Particle transport simulation
- Forecast timeline
- Dynamic environmental metrics
- AI-powered scientific explanations

---

Contributions, ideas, and scientific collaborations are welcome.
