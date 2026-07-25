"""
Ocean Intelligence Engine Module.
Orchestrates scientific data sources, Lagrangian particle tracking, and AI context builders.
Exposes the unified OceanState standard object to API routes and services.
"""

from backend.app.engine.ocean_engine import ocean_engine, OceanEngine

__all__ = ["ocean_engine", "OceanEngine"]
