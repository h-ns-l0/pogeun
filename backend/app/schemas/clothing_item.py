from pydantic import BaseModel, ConfigDict

from app.models import ClothingCategory


class ClothingItemBase(BaseModel):
    name: str
    category: ClothingCategory
    thickness: int
    img_url: str | None = None


class ClothingItemCreate(ClothingItemBase):
    user_id: int


class ClothingItemRead(ClothingItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
