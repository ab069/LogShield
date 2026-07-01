from fastapi import APIRouter, Depends, Query; from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db; from app.core.deps import get_current_user
from app.models.user import User; from app.schemas.logentry import LogIngest, LogResponse
from app.services import log_service

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.post("/ingest", response_model=LogResponse)
async def ingest(data: LogIngest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await log_service.ingest_log(db, user.id, data)

@router.get("", response_model=list[LogResponse])
async def search(query: str | None = Query(None), source: str | None = Query(None),
    severity: str | None = Query(None), limit: int = Query(100),
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await log_service.search_logs(db, user.id, query, source, severity, limit)

@router.get("/stats")
async def stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await log_service.get_log_stats(db, user.id)
