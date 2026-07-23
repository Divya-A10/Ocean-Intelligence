from backend.app.schemas.explain_schema import ExplainRequest, ExplainResponse
from backend.app.utils.logger import logger


class GeminiService:
    """
    Service layer for AI-assisted oceanographic research analysis and copilot explanations.
    """

    def generate_explanation(self, request: ExplainRequest) -> ExplainResponse:
        """
        Generates an AI explanation response for user scientific inquiries.
        """
        logger.info(f"GeminiService: Received scientific question query: '{request.question[:50]}...'")

        # TODO: Initialize Google GenAI / Gemini client using process.env.GEMINI_API_KEY
        # TODO: Construct scientific prompt grounded in CMEMS ocean data and peer-reviewed literature
        # TODO: Stream generated insights with confidence metrics

        return ExplainResponse(
            answer="Placeholder explanation."
        )


gemini_service = GeminiService()
