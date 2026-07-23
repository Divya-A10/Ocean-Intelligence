"""
Ocean Intelligence Entry Point Re-exporter
Redirects to the modular app structure in backend.app.main
"""
from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    from backend.app.config.settings import settings
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
