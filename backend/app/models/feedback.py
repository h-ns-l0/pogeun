from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class FeedbackType(str, Enum):
    HOT = "HOT"
    COLD = "COLD"


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(primary_key=True)
    recommendation_id: Mapped[int] = mapped_column(
        ForeignKey("recommendations.id"),
        unique=True,
    )
    feedback_type: Mapped[FeedbackType] = mapped_column(
        SqlEnum(FeedbackType, name="feedback_type_enum", create_type=False)
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.current_timestamp(),
    )

    recommendation = relationship("Recommendation", back_populates="feedback")
