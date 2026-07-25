from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ExplainRequest(BaseModel):
    question: Optional[str] = Field(None, description="User research question or prompt for AI analysis")
    prompt: Optional[str] = Field(None, description="Alternative field for user prompt")
    region: Optional[str] = Field(None, description="Target ocean region")
    regionKey: Optional[str] = Field(None, description="Target region key")
    forecast_day: Optional[int] = Field(0, description="Forecast projection day")
    forecastDay: Optional[int] = Field(None, description="Forecast projection day camelCase")
    selected_particle_index: Optional[int] = Field(None, description="Optional selected particle index")
    selectedParticleIndex: Optional[int] = Field(None, description="Optional selected particle index camelCase")

    def get_query(self) -> str:
        return self.question or self.prompt or "What are the primary oceanographic drivers and transport pathways in this region?"

    def get_region(self) -> str:
        reg = self.region or self.regionKey or "Bay of Bengal"
        mapping = {
            "bay-of-bengal": "Bay of Bengal",
            "singapore-strait": "Singapore Strait",
            "north-pacific-gyre": "North Pacific Gyre",
            "mediterranean-sea": "Mediterranean Sea"
        }
        return mapping.get(reg.lower().replace(" ", "-"), reg)

    def get_forecast_day(self) -> int:
        if self.forecast_day is not None and self.forecast_day != 0:
            return self.forecast_day
        if self.forecastDay is not None:
            return self.forecastDay
        return self.forecast_day or 0


class Citation(BaseModel):
    title: str
    url: str


class ExplainResponse(BaseModel):
    answer: str = Field(..., description="AI explanation answer text in Markdown")
    text: Optional[str] = Field(None, description="Alias field for frontend compatibility")
    citations: List[Citation] = Field(default_factory=list, description="Peer-reviewed or dataset citations")
    confidenceIndex: int = Field(92, description="Confidence score percentage")

    model_config = {
        "json_schema_extra": {
            "example": {
                "answer": "## Scientific Copilot Analysis\n\n### Ocean Conditions...",
                "text": "## Scientific Copilot Analysis\n\n### Ocean Conditions...",
                "citations": [
                    {"title": "CMEMS Copernicus Marine Service", "url": "https://marine.copernicus.eu"}
                ],
                "confidenceIndex": 93
            }
        }
    }
