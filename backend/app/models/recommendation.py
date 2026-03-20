from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    temp: Mapped[float] = mapped_column(Float)
    weather_status: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.current_timestamp(),
    )

    user = relationship("User", back_populates="recommendations")
    recommendation_item = relationship(
        "RecommendationItem",
        back_populates="recommendation",
        uselist=False,
    )
    generated_image = relationship(
        "GeneratedImage",
        back_populates="recommendation",
        uselist=False,
    )
    feedback = relationship(
        "Feedback",
        back_populates="recommendation",
        uselist=False,
    )
