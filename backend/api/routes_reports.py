"""
Report Synthesis REST Router
"""

from fastapi import APIRouter
from backend.models.schemas import ReportRequestModel, ReportResponseModel
from backend.reports.report_generator import ScientificReportGenerator
from backend.simulation.forecast_engine import ForecastEngine

router = APIRouter(tags=["Reports"])
report_gen = ScientificReportGenerator()
forecast_engine = ForecastEngine()

@router.post("/report", response_model=ReportResponseModel)
def generate_report(req: ReportRequestModel):
    """
    POST /report
    Generates downloadable markdown whitepaper reports.
    """
    region_data = forecast_engine.generate_region_forecast(req.regionKey, 0)
    report = report_gen.generate_report(region_data, req.reportType)
    return report
