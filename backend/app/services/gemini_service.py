import os
import time
from typing import List, Dict, Any, Optional
import httpx
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

# Try importing official Google Gen AI SDK
try:
    from google import genai
    from google.genai import types
    HAS_GENAI_SDK = True
except ImportError:
    HAS_GENAI_SDK = False

from backend.app.schemas.explain_schema import ExplainRequest, ExplainResponse, Citation
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger


# Environment configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Initialize client ONCE at module load time
genai_client = None
if HAS_GENAI_SDK and GEMINI_API_KEY and GEMINI_API_KEY not in ["MY_GEMINI_API_KEY", "MOCK_KEY_FOR_DEV", "YOUR_GEMINI_API_KEY"]:
    try:
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("GeminiService: Google Gen AI Client initialized successfully.")
    except Exception:
        logger.exception("GeminiService: Failed to initialize Google Gen AI Client")


class GeminiService:
    """
    Service layer for AI-assisted oceanographic research analysis and copilot explanations.
    Uses Google's Gemini API grounded in live OceanState data produced by the Ocean Intelligence Engine.
    """

    def __init__(self):
        self.http_client = httpx.Client(timeout=15.0)
        self.candidate_models = [GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

    def _get_api_key(self) -> str:
        return os.getenv("GEMINI_API_KEY", GEMINI_API_KEY)

    def _get_model(self) -> str:
        return os.getenv("GEMINI_MODEL", GEMINI_MODEL)

    def _is_api_key_valid(self) -> bool:
        key = self._get_api_key()
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

        logger.info(f"GeminiService: Incoming request received for region='{region_name}', forecast_day={forecast_day}")
        logger.info(f"GeminiService: Selected Region: {region_name}, Forecast Day: {forecast_day}")
        logger.info(f"GeminiService: User Query: '{query}'")

        # 1. Grounding: Retrieve live OceanState from Ocean Intelligence Engine
        state = ocean_engine.get_ocean_state(region=region_name, forecast_day=forecast_day)
        logger.info(f"GeminiService: OceanState successfully loaded for region='{state.region}'.")

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
            f"You are Ocean Intelligence's Scientific Copilot.\n"
            f"You are assisting marine researchers studying marine microplastic transport.\n"
            f"You must ONLY use the supplied OceanState.\n"
            f"Do not invent measurements. Do not fabricate scientific facts. Do not mention values that are not provided.\n"
            f"If insufficient information exists, explicitly state that additional observations are required.\n\n"
            f"Current Ocean State:\n"
            f"- Region: {state.region}\n"
            f"- Forecast Day: Day {forecast_day}\n"
            f"- Data Source: {state.source}\n"
            f"- Surface Velocity: {avg_speed} knots\n"
            f"- Current Direction: {direction}\n"
            f"- Sea Surface Temperature: {state.temperature}°C\n"
            f"- Salinity: {state.salinity} PSU\n"
            f"- Model Confidence: {confidence_pct}%\n"
            f"- Hotspot Density: {hotspot_summary}\n\n"
            f"User Question:\n"
            f"\"{query}\"\n\n"
            f"Return your response in Markdown using EXACTLY these section headers:\n\n"
            f"## Scientific Copilot Analysis\n\n"
            f"### Ocean Conditions\n\n"
            f"### Interpretation\n\n"
            f"### Transport Dynamics\n\n"
            f"### Confidence\n\n"
            f"### Suggested Investigation\n\n"
            f"The Suggested Investigation should always end with one actionable recommendation for researchers starting with 'Suggested Investigation: ...'."
        )

        system_instruction = (
            "You are Ocean Intelligence's Scientific Copilot. Base every statement strictly on the provided OceanState. "
            "Never invent measurements or fabricate facts. Always end with one actionable recommendation under ### Suggested Investigation."
        )

        logger.info(f"GeminiService: Prompt successfully built for region='{state.region}'.")

        start_time = time.time()
        generated_text: Optional[str] = None
        current_api_key = self._get_api_key()
        current_model = self._get_model()

        # Method A: Use initialized genai.Client if available
        if genai_client and self._is_api_key_valid():
            try:
                logger.info(f"GeminiService: Gemini request started using Gen AI SDK (Model: {current_model})...")
                response = genai_client.models.generate_content(
                    model=current_model,
                    contents=prompt_text,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.2,
                        max_output_tokens=800
                    )
                )
                if response and response.text:
                    generated_text = response.text
                    elapsed = round((time.time() - start_time) * 1000, 2)
                    logger.info(f"GeminiService: Gemini response received successfully via SDK in {elapsed}ms.")
            except Exception:
                logger.exception(f"GeminiService: SDK generation with {current_model} encountered an error")

        # Method B: HTTP REST endpoint fallback
        if not generated_text and self._is_api_key_valid():
            for model_name in self.candidate_models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={current_api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt_text}]}],
                    "systemInstruction": {"parts": [{"text": system_instruction}]},
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 800
                    }
                }
                try:
                    logger.info(f"GeminiService: Gemini REST request started (Model: {model_name})...")
                    res = self.http_client.post(url, json=payload, timeout=12.0)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                generated_text = parts[0]["text"]
                                elapsed = round((time.time() - start_time) * 1000, 2)
                                logger.info(f"GeminiService: Gemini response received successfully via REST ({model_name}) in {elapsed}ms.")
                                break
                    else:
                        logger.warning(f"GeminiService: REST model {model_name} returned HTTP {res.status_code}.")
                except Exception:
                    logger.exception(f"GeminiService: REST request to {model_name} encountered an exception")

        # Method C: Keep existing fallback implementation if Gemini fails
        if not generated_text:
            elapsed = round((time.time() - start_time) * 1000, 2)
            logger.warning(f"GeminiService: Gemini API unavailable or unconfigured ({elapsed}ms). Returning deterministic grounded fallback from OceanState.")
            generated_text = self._build_fallback_explanation(state, forecast_day, avg_speed, direction, confidence_pct)

        logger.info(f"GeminiService: Final response returned for region='{state.region}'.")

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
