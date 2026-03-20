from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import FeedbackType


class FeedbackBase(BaseModel):
    feedback_type: FeedbackType


class FeedbackCreate(FeedbackBase):
    recommendation_id: int


class FeedbackRead(FeedbackBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recommendation_id: int
    created_at: datetime
