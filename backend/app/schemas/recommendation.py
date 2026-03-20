from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.generated_image import GeneratedImageRead
from app.schemas.recommendation_item import RecommendationItemRead


class RecommendationBase(BaseModel):
    temp: float
    weather_status: str


class RecommendationCreate(RecommendationBase):
    user_id: int


class RecommendationRead(RecommendationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime


class RecommendationDetail(RecommendationRead):
    recommendation_item: RecommendationItemRead | None = None
    generated_image: GeneratedImageRead | None = None
