from sqlalchemy import select, func; from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alert import Alert; from app.schemas.alert import AlertResponse

async def list_alerts(db: AsyncSession, user_id: str) -> list[AlertResponse]:
    result = await db.execute(select(Alert).where(Alert.user_id == user_id).order_by(Alert.created_at.desc()))
    return [AlertResponse.model_validate(a) for a in result.scalars().all()]

async def get_alert_count(db: AsyncSession, user_id: str) -> int:
    result = await db.execute(select(func.count(Alert.id)).where(Alert.user_id == user_id))
    return result.scalar() or 0
