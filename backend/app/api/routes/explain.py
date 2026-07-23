from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.explain_schema import ExplainRequest, ExplainResponse
from backend.app.services.gemini_service import gemini_service
from backend.app.utils.logger import logger

router = APIRouter(tags=["Scientific Copilot"])


@router.post(
    "/explain",
    response_model=ExplainResponse,
    status_code=status.HTTP_200_OK,
    summary="Scientific Copilot Explanation Query",
    description="Accepts a scientific inquiry question and returns an AI copilot explanation."
)
def explain_query(request: ExplainRequest):
    try:
        return gemini_service.generate_explanation(request)
    except Exception as e:
        logger.error(f"Error executing explain endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate copilot explanation"
        )
