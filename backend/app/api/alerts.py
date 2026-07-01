from fastapi import APIRouter, Depends; from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db; from app.core.deps import get_current_user
from app.models.user import User; from app.schemas.alert import AlertResponse
from app.services import alert_service

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("", response_model=list[AlertResponse])
async def list_alerts(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await alert_service.list_alerts(db, user.id)

@router.get("/count")
async def alert_count(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    count = await alert_service.get_alert_count(db, user.id)
    return {"count": count}
