"""
Pydantic Schemas Package for API Request and Response Serialization
"""
from backend.app.schemas.ocean_state import OceanState, CurrentVector
from backend.app.schemas.simulation_schema import SimulationResponse, RiskMetricsSchema, ParticleSchema
from backend.app.schemas.current_schema import CurrentsResponse, CurrentVectorSchema
from backend.app.schemas.hotspot_schema import HotspotsResponse, HotspotSchema
from backend.app.schemas.explain_schema import ExplainRequest, ExplainResponse
from backend.app.schemas.report_schema import ReportRequest, ReportResponse

__all__ = [
    "OceanState",
    "CurrentVector",
    "SimulationResponse",
    "RiskMetricsSchema",
    "ParticleSchema",
    "CurrentsResponse",
    "CurrentVectorSchema",
    "HotspotsResponse",
    "HotspotSchema",
    "ExplainRequest",
    "ExplainResponse",
    "ReportRequest",
    "ReportResponse"
]
