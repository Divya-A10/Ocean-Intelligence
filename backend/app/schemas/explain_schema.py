from pydantic import BaseModel, Field


class ExplainRequest(BaseModel):
    question: str = Field(..., description="User research question or prompt for AI analysis")


class ExplainResponse(BaseModel):
    answer: str = Field(..., description="AI explanation answer text")

    model_config = {
        "json_schema_extra": {
            "example": {
                "answer": "Placeholder explanation."
            }
        }
    }
