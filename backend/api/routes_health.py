"""
Health Check Router
"""

from fastapi import APIRouter
from backend.models.schemas import HealthStatusModel
from backend.config.settings import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthStatusModel)
def health_check():
    return HealthStatusModel(
        status="healthy",
        service=settings.APP_NAME,
        version=settings.VERSION,
        database="connected (placeholder)"
    )
