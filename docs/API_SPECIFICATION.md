# Ocean Intelligence REST API Specification

> **Base URL**: `/api`

---

## Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & system status |
| `GET` | `/simulation` | Returns region simulation data & particles for specified day |
| `GET` | `/currents` | Returns 2D hydrodynamic current velocity vector grid |
| `GET` | `/hotspots` | Returns plastic density accumulation hotspot zones |
| `POST` | `/explain` | Scientific Copilot natural language analysis endpoint |
| `POST` | `/report` | Generates structured markdown scientific reports |

---

## Detailed Endpoint Schemas

### 1. `GET /api/health`
**Response**:
```json
{
  "status": "healthy",
  "service": "Ocean Intelligence Geospatial API",
  "version": "1.0.0",
  "database": "connected (placeholder)"
}
```

---

### 2. `GET /api/simulation`
**Query Parameters**:
- `region` (string): Region key (`bay-of-bengal`, `singapore-strait`, `north-pacific-gyre`, `mediterranean-sea`)
- `day` (integer): Forecast day offset (0 to 7)

**Response**:
```json
{
  "regionKey": "bay-of-bengal",
  "regionName": "Bay of Bengal",
  "coordinates": { "lat": 15.0, "lng": 88.0 },
  "forecastDay": 3,
  "timestamp": "Day +3",
  "oceanHealthScore": 49,
  "globalOceanTemperature": 29.4,
  "plasticHotspotsCount": 20,
  "activeWeatherSystems": "Southwest Monsoon Flow",
  "satelliteSnapshot": "MODIS Color-Infrared composite showing surface convergence",
  "currentSpeedKnots": 2.85,
  "currentDirection": "North-East",
  "degradationEstimateYears": 180,
  "uncertaintyPercentage": 16,
  "cleanupPriorityRank": 1,
  "biodiversityExposureIndex": 88,
  "fisheriesImpactPercentage": 44,
  "transportPathways": [
    { "name": "Ganges-Brahmaputra Outflow Convergence", "intensity": "Very High" }
  ],
  "particles": [
    {
      "id": 1,
      "lat": 16.2,
      "lng": 87.5,
      "density": 850,
      "size": "micro",
      "ageDays": 45,
      "origin": "Coastal Outfall Sector 1",
      "speedKnots": 2.1,
      "etaDays": 3.5
    }
  ],
  "cleanupSites": [
    { "name": "Sundarbans Delta Inflow Barrier", "costEst": "$450k", "estRecovery": "12.4 Tons/yr", "status": "Active Planning" }
  ],
  "metrics": {
    "speed": 2.85,
    "risk": "Moderate",
    "accumulation": 62,
    "confidence": 82,
    "biodiversityIndex": 88,
    "fisheriesImpact": 44
  }
}
```

---

### 3. `GET /api/currents`
**Query Parameters**:
- `region` (string): Region key

**Response**:
```json
[
  {
    "lat": 10.0,
    "lng": 80.0,
    "u": 0.2,
    "v": 0.1,
    "magnitudeKnots": 0.43,
    "directionDegrees": 45.0
  }
]
```

---

### 4. `POST /api/explain`
**Request Body**:
```json
{
  "prompt": "Analyze microplastic trajectory for Day 3",
  "regionKey": "bay-of-bengal",
  "forecastDay": 3,
  "selectedParticleIndex": 100
}
```

**Response**:
```json
{
  "text": "### Scientific Copilot Analysis...",
  "citations": [
    { "title": "Copernicus Marine Service (CMEMS)", "url": "https://marine.copernicus.eu" }
  ],
  "confidenceIndex": 88
}
```

---

### 5. `POST /api/report`
**Request Body**:
```json
{
  "regionKey": "bay-of-bengal",
  "reportType": "impact"
}
```

**Response**:
```json
{
  "markdown": "# Environmental Impact & Biodiversity Risk Assessment\n...",
  "generatedAt": "2026-07-23T08:25:00Z",
  "regionName": "Bay of Bengal"
}
```
