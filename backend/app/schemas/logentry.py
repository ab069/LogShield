from datetime import datetime; from pydantic import BaseModel

class LogIngest(BaseModel):
    source: str; event_type: str; severity: str = "info"
    message: str; raw_data: dict | None = None; source_ip: str | None = None

class LogResponse(BaseModel):
    id: str; source: str; event_type: str; severity: str; message: str
    raw_data: dict | None = None; source_ip: str | None = None; timestamp: datetime
    model_config = {"from_attributes": True}
