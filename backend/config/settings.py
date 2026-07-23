"""
Ocean Intelligence Backend Configuration & Environment Settings
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Ocean Intelligence Geospatial API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CMEMS_API_KEY: str = os.getenv("CMEMS_API_KEY", "")
    
    # Server host & port
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Simulation defaults
    DEFAULT_PARTICLE_COUNT: int = 500
    DEFAULT_SIMULATION_DAYS: int = 7
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
