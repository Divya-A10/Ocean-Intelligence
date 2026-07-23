from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class ReportModel:
    report_id: str
    status: str
    title: Optional[str] = None
    region: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
