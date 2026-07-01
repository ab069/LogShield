from sqlalchemy import select, func; from sqlalchemy.ext.asyncio import AsyncSession
from app.models.logentry import LogEntry; from app.schemas.logentry import LogIngest, LogResponse

async def ingest_log(db: AsyncSession, user_id: str, data: LogIngest) -> LogResponse:
    log = LogEntry(user_id=user_id, source=data.source, event_type=data.event_type,
        severity=data.severity, message=data.message, raw_data=data.raw_data, source_ip=data.source_ip)
    db.add(log); await db.commit(); await db.refresh(log)
    return LogResponse.model_validate(log)

async def search_logs(db: AsyncSession, user_id: str, query: str | None = None,
    source: str | None = None, severity: str | None = None, limit: int = 100) -> list[LogResponse]:
    stmt = select(LogEntry).where(LogEntry.user_id == user_id)
    if source: stmt = stmt.where(LogEntry.source == source)
    if severity: stmt = stmt.where(LogEntry.severity == severity)
    if query: stmt = stmt.where(LogEntry.message.ilike(f"%{query}%"))
    stmt = stmt.order_by(LogEntry.timestamp.desc()).limit(limit)
    result = await db.execute(stmt)
    return [LogResponse.model_validate(l) for l in result.scalars().all()]

async def get_log_stats(db: AsyncSession, user_id: str) -> dict:
    total = await db.execute(select(func.count(LogEntry.id)).where(LogEntry.user_id == user_id))
    error = await db.execute(select(func.count(LogEntry.id)).where(LogEntry.user_id == user_id, LogEntry.severity == "error"))
    return {"total": total.scalar() or 0, "errors": error.scalar() or 0}
