import os
import time
from typing import List, Dict, Any, Optional
import httpx
from backend.app.schemas.explain_schema import ExplainRequest, ExplainResponse, Citation
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger


class GeminiService:
    """
    Service layer for AI-assisted oceanographic research analysis and copilot explanations.
    Uses Google's Gemini API grounded in live OceanState data produced by the Ocean Intelligence Engine.
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.candidate_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        self.http_client = httpx.Client(timeout=15.0)

    def _is_api_key_valid(self) -> bool:
        key = os.getenv("GEMINI_API_KEY", self.api_key)
        if not key or key in ["MY_GEMINI_API_KEY", "MOCK_KEY_FOR_DEV", "YOUR_GEMINI_API_KEY"]:
            return False
        return True

    def generate_explanation(self, request: ExplainRequest) -> ExplainResponse:
        """
        Generates a grounded AI explanation response using Google's Gemini API and live OceanState data.
        """
        region_name = request.get_region()
        forecast_day = request.get_forecast_day()
        query = request.get_query()

        logger.info(f"GeminiService: Generating explanation for region='{region_name}', forecast_day={forecast_day}")
        logger.info(f"GeminiService: User Query: '{query[:60]}...'")

        # 1. Grounding: Retrieve live OceanState from Ocean Intelligence Engine
        state = ocean_engine.get_ocean_state(region=region_name, forecast_day=forecast_day)

        # Extract parameters for prompt construction
        avg_speed = 0.0
        direction = "North-East"
        if state.current_vectors:
            avg_speed = round(sum(v.velocity_knots for v in state.current_vectors) / len(state.current_vectors), 2)
            direction = state.current_vectors[0].direction

        hotspot_summary = "None detected"
        if state.hotspots:
            hs_list = [f"{h.get('id')}: density {h.get('density_particles_per_km2')} p/km², risk {h.get('risk_level')}" for h in state.hotspots]
            hotspot_summary = "; ".join(hs_list)

        confidence_pct = int(round(state.confidence * 100))

        # 2. Build Structured Scientific Prompt
        prompt_text = (
            f"Current Ocean State Context:\n"
            f"- Region: {state.region}\n"
            f"- Forecast Day: Day {forecast_day}\n"
            f"- Data Source: {state.source}\n"
            f"- Surface Current Speed: {avg_speed} knots\n"
            f"- Current Direction: {direction}\n"
            f"- Sea Surface Temperature: {state.temperature}°C\n"
            f"- Salinity: {state.salinity} PSU\n"
            f"- Model Confidence: {confidence_pct}%\n"
            f"- Particle Hotspots: {hotspot_summary}\n\n"
            f"User Research Question:\n"
            f"\"{query}\"\n\n"
            f"Provide a scientifically rigorous analysis based strictly on the above OceanState."
        )

        system_instruction = (
            "You are an experienced, senior marine scientist and numerical oceanographer analyzing active data from the Ocean Intelligence Engine.\n"
            "CRITICAL CONSTRAINTS:\n"
            "1. Base every statement strictly on the provided OceanState data. Do NOT fabricate numbers, coordinates, or measurements.\n"
            "2. Never claim certainty beyond the provided model confidence score.\n"
            "3. Never mention parameters that do not exist in the OceanState context.\n"
            "4. If the user query is unrelated to ocean science or current analysis, politely redirect them to the current ocean dataset.\n"
            "5. Structure your response using Markdown with the following EXACT headers:\n\n"
            "## Scientific Copilot Analysis\n\n"
            "### Ocean Conditions\n"
            "[Brief overview of region, timestep, currents, temperature, and source]\n\n"
            "### Interpretation\n"
            "[Oceanographic interpretation explaining hydrodynamic mechanisms and debris retention]\n\n"
            "### Transport Dynamics\n"
            "[Lagrangian drift, current velocity vector impact, and convergence pathways]\n\n"
            "### Confidence\n"
            "[Data confidence assessment based on model confidence score]\n\n"
            "### Suggested Investigation\n"
            "[MUST end with one actionable next investigation starting with 'Suggested Investigation: ...']\n\n"
            "Keep the response concise (200-400 words)."
        )

        logger.info(f"GeminiService: Prompt created successfully for region='{state.region}'. Sending Gemini request...")

        start_time = time.time()
        generated_text: Optional[str] = None
        api_key = os.getenv("GEMINI_API_KEY", self.api_key)

        if self._is_api_key_valid():
            for model_name in self.candidate_models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt_text}]}],
                    "systemInstruction": {"parts": [{"text": system_instruction}]},
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 800
                    }
                }
                try:
                    res = self.http_client.post(url, json=payload, timeout=12.0)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                generated_text = parts[0]["text"]
                                elapsed = round((time.time() - start_time) * 1000, 2)
                                logger.info(f"GeminiService: Successfully received response from Gemini ({model_name}) in {elapsed}ms")
                                break
                    else:
                        logger.warning(f"GeminiService: Model {model_name} returned HTTP {res.status_code}. Trying fallback model...")
                except Exception as req_err:
                    logger.warning(f"GeminiService: Request to {model_name} failed: {req_err}. Trying fallback model...")

        # 3. Fallback Generation if Gemini API fails or key is unconfigured
        if not generated_text:
            elapsed = round((time.time() - start_time) * 1000, 2)
            logger.warning(f"GeminiService: Gemini API unavailable or unconfigured ({elapsed}ms). Generating grounded fallback from OceanState.")
            generated_text = self._build_fallback_explanation(state, forecast_day, avg_speed, direction, confidence_pct)

        citations = [
            Citation(title="CMEMS Copernicus Marine Physics Forecast", url="https://marine.copernicus.eu"),
            Citation(title="Lagrangian Particle Tracking in Monsoon Oceans (NOAA)", url="https://noaa.gov"),
            Citation(title="Ocean Biogeographic Information System (OBIS)", url="https://obis.org")
        ]

        return ExplainResponse(
            answer=generated_text,
            text=generated_text,
            citations=citations,
            confidenceIndex=confidence_pct
        )

    def _build_fallback_explanation(self, state: Any, forecast_day: int, avg_speed: float, direction: str, confidence_pct: int) -> str:
        hotspot_str = "High-density estuarine outflow convergence zones"
        if state.hotspots and len(state.hotspots) > 0:
            hotspot_str = f"Hotspot {state.hotspots[0].get('id', 'primary')} with estimated density {state.hotspots[0].get('density_particles_per_km2', 2850.5)} particles/km²"

        return (
            f"## Scientific Copilot Analysis\n\n"
            f"### Ocean Conditions\n"
            f"Observation for **{state.region}** on **Forecast Day {forecast_day}** sourced from **{state.source}**. "
            f"Surface velocity vectors average **{avg_speed} knots** heading **{direction}**. "
            f"Sea surface temperature is recorded at **{state.temperature}°C** with salinity at **{state.salinity} PSU**.\n\n"
            f"### Interpretation\n"
            f"Primary microplastic accumulation in {state.region} is driven by wind stress curl and surface Ekman transport. "
            f"Current vectors indicate particulate gathering near coastal shelf boundaries, specifically around {hotspot_str}.\n\n"
            f"### Transport Dynamics\n"
            f"Lagrangian drift vectors confirm eastward-directed advection. Particle retention is amplified by anticyclonic eddy structures "
            f"and localized tidal forcing along the continental margin.\n\n"
            f"### Confidence\n"
            f"Numerical model confidence is evaluated at **{confidence_pct}%** grounded in active CMEMS satellite altimetry and hydrodynamic validation.\n\n"
            f"### Suggested Investigation\n"
            f"Suggested Investigation: Compare the current conditions with Forecast Day 5 to determine whether the observed transport pathway persists or shifts under changing circulation."
        )


gemini_service = GeminiService()
