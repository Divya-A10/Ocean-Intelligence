"""
AI Copilot REST Router
"""

from fastapi import APIRouter
from backend.models.schemas import ExplainRequestModel, ExplainResponseModel
from backend.ai.gemini_copilot import GeminiScientificCopilot
from backend.simulation.forecast_engine import ForecastEngine

router = APIRouter(tags=["AI Copilot"])
copilot = GeminiScientificCopilot()
forecast_engine = ForecastEngine()

@router.post("/explain", response_model=ExplainResponseModel)
def explain_simulation(req: ExplainRequestModel):
    """
    POST /explain
    Scientific Copilot explanation endpoint.
    """
    region_data = forecast_engine.generate_region_forecast(req.regionKey, req.forecastDay or 0)
    result = copilot.explain_forecast(
        prompt=req.prompt,
        region_key=req.regionKey,
        forecast_day=req.forecastDay or 0,
        particle_index=req.selectedParticleIndex or 100,
        region_data=region_data
    )
    return result
