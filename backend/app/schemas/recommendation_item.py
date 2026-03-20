from pydantic import BaseModel, ConfigDict

from app.models import ClothingRole


class RecommendationItemBase(BaseModel):
    clothing_item_id: int
    role: ClothingRole


class RecommendationItemCreate(RecommendationItemBase):
    recommendation_id: int


class RecommendationItemRead(RecommendationItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recommendation_id: int
