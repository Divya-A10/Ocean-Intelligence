from fastapi import APIRouter
from backend.app.config.settings import settings

router = APIRouter(tags=["Health & Status"])


@router.get(
    "/",
    summary="Root Project Status",
    description="Returns project identity, runtime status, and backend version."
)
def get_root_status():
    return {
        "project": settings.APP_NAME,
        "status": "running",
        "version": settings.VERSION
    }


@router.get(
    "/health",
    summary="System Health Check",
    description="Liveness check for container orchestrators and monitoring tools."
)
def get_health_status():
    return {
        "status": "healthy"
    }
