import logging
import sys
from backend.app.config.settings import settings


def setup_logger() -> logging.Logger:
    """
    Configures and returns a structured logger for the application.
    """
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    logger = logging.getLogger("ocean_intelligence")
    logger.setLevel(log_level)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(log_level)
        
        formatter = logging.Formatter(
            fmt="[%(asctime)s] [%(levelname)s] [%(name)s:%(filename)s:%(lineno)d] - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


logger = setup_logger()
