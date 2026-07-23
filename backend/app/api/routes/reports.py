from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.report_schema import ReportRequest, ReportResponse
from backend.app.services.report_service import report_service
from backend.app.utils.logger import logger

router = APIRouter(tags=["Reports"])


@router.post(
    "/report",
    response_model=ReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Ocean Intelligence Report",
    description="Accepts simulation parameters and triggers research briefing synthesis."
)
def create_report(request: ReportRequest = ReportRequest()):
    try:
        return report_service.generate_report(request)
    except Exception as e:
        logger.error(f"Error executing report generation endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to synthesize research report"
        )
