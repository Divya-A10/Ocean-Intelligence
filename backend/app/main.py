from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.app.config.settings import settings
from backend.app.utils.logger import logger
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.simulation import router as simulation_router
from backend.app.api.routes.currents import router as currents_router
from backend.app.api.routes.hotspots import router as hotspots_router
from backend.app.api.routes.explain import router as explain_router
from backend.app.api.routes.reports import router as reports_router


# Initialize FastAPI application with Swagger & ReDoc documentation enabled
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description=(
        "Ocean Intelligence API - Scalable scientific backend foundation for "
        "marine environment research, Lagrangian particle transport, ocean currents, "
        "and AI-assisted environmental analysis."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list if settings.cors_origins_list else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP Exception on {request.method} {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation Error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation Error", "details": exc.errors()}
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Internal Server Error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal Server Error", "status_code": 500}
    )


# Include API Routers
app.include_router(health_router)
app.include_router(simulation_router)
app.include_router(currents_router)
app.include_router(hotspots_router)
app.include_router(explain_router)
app.include_router(reports_router)


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION} on {settings.HOST}:{settings.PORT}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
