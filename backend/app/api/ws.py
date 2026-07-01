from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from app.core.database import async_session
from app.models.logentry import LogEntry
from app.models.alert import Alert
from app.agents.correlation import evaluate_logs

router = APIRouter()

class ConnectionManager:
    def __init__(self): self.active: dict[str, list[WebSocket]] = {}
    async def connect(self, uid: str, ws: WebSocket):
        await ws.accept(); self.active.setdefault(uid, []).append(ws)
    def disconnect(self, uid: str, ws: WebSocket):
        self.active.setdefault(uid, []).remove(ws)
        if not self.active[uid]: del self.active[uid]
    async def broadcast(self, uid: str, msg: dict):
        for ws in self.active.get(uid, []):
            try: await ws.send_json(msg)
            except Exception: pass

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(ws: WebSocket, user_id: str):
    await manager.connect(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            if data.get("action") == "analyze":
                async with async_session() as db:
                    result = await db.execute(
                        select(LogEntry).where(LogEntry.user_id == user_id).order_by(LogEntry.timestamp.desc()).limit(100)
                    )
                    logs = result.scalars().all()
                    log_dicts = [{"message": l.message, "source": l.source, "severity": l.severity, "event_type": l.event_type} for l in logs]
                    matches = evaluate_logs(log_dicts)
                    for m in matches:
                        alert = Alert(user_id=user_id, rule_name=m["rule_name"], severity=m["severity"],
                            title=m["title"], description=m["description"], source=m["source"],
                            correlation_data=m["correlation_data"])
                        db.add(alert)
                    await db.commit()
                    for m in matches:
                        await manager.broadcast(user_id, {"type": "alert", "alert": m})
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
