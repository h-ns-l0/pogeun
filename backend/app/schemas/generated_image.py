from datetime import datetime

from pydantic import BaseModel, ConfigDict


class GeneratedImageBase(BaseModel):
    prompt: str | None = None
    img_url: str


class GeneratedImageCreate(GeneratedImageBase):
    recommendation_id: int


class GeneratedImageRead(GeneratedImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recommendation_id: int
    created_at: datetime
