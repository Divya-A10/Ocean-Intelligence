"""
Placeholder datasets for simulation, currents, hotspots, and research reports.
Used until live integrations (CMEMS, HYCOM, Sentinel, Parcels) are active.
"""

PLACEHOLDER_SIMULATION = {
    "forecast_time": "2026-07-23T12:00:00Z",
    "region": "Bay of Bengal",
    "particles": [],
    "currents": [],
    "hotspots": [],
    "metrics": {
        "risk": "Unknown",
        "confidence": 0
    }
}

PLACEHOLDER_CURRENTS = {
    "region": "Bay of Bengal",
    "timestamp": "2026-07-23T12:00:00Z",
    "vectors": [
        {
            "latitude": 15.0,
            "longitude": 88.0,
            "u_component": 0.42,
            "v_component": 0.18,
            "velocity_knots": 2.4,
            "direction": "North-East"
        },
        {
            "latitude": 16.2,
            "longitude": 87.5,
            "u_component": 0.35,
            "v_component": 0.22,
            "velocity_knots": 2.1,
            "direction": "North-East"
        },
        {
            "latitude": 14.5,
            "longitude": 89.1,
            "u_component": 0.50,
            "v_component": 0.10,
            "velocity_knots": 2.8,
            "direction": "East-North-East"
        }
    ]
}

PLACEHOLDER_HOTSPOTS = {
    "region": "Bay of Bengal",
    "count": 2,
    "hotspots": [
        {
            "id": "hotspot-001",
            "latitude": 15.8,
            "longitude": 87.5,
            "density_particles_per_km2": 2850.5,
            "risk_level": "High",
            "description": "Estuarine outflow convergence zone"
        },
        {
            "id": "hotspot-002",
            "latitude": 14.2,
            "longitude": 88.9,
            "density_particles_per_km2": 1420.0,
            "risk_level": "Moderate",
            "description": "Anticyclonic eddy retention area"
        }
    ]
}
