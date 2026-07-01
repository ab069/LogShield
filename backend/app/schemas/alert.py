from datetime import datetime; from pydantic import BaseModel
class AlertResponse(BaseModel):
    id: str; rule_name: str | None; severity: str | None; title: str
    description: str | None; source: str | None; correlation_data: dict | None
    status: str; created_at: datetime; resolved_at: datetime | None = None
    model_config = {"from_attributes": True}
