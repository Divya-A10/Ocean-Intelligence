from backend.app.schemas.report_schema import ReportRequest, ReportResponse
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger


class ReportService:
    """
    Service layer for automated research report synthesis using OceanEngine state data.
    """

    def generate_report(self, request: ReportRequest) -> ReportResponse:
        """
        Synthesizes research briefing or policy report document from OceanEngine.
        """
        logger.info(f"ReportService: Triggering report synthesis for region='{request.region}', type='{request.report_type}'")

        state = ocean_engine.get_ocean_state(region=request.region, forecast_day=0)

        report_id = f"report-{state.region.lower().replace(' ', '-')}-{request.report_type}"

        return ReportResponse(
            report_id=report_id,
            status="generated"
        )


report_service = ReportService()
