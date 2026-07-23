from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ReportRequest(BaseModel):
    region: Optional[str] = Field("Bay of Bengal", description="Region context for report generation")
    report_type: Optional[str] = Field("impact", description="Report classification (impact, briefing, cleanup, scientific)")
    simulation_data: Optional[Dict[str, Any]] = Field(default=None, description="Optional raw simulation state payload")


class ReportResponse(BaseModel):
    report_id: str = Field("demo-report", description="Unique report document identifier")
    status: str = Field("generated", description="Report processing status")

    model_config = {
        "json_schema_extra": {
            "example": {
                "report_id": "demo-report",
                "status": "generated"
            }
        }
    }
