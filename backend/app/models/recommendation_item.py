from enum import Enum

from sqlalchemy import Enum as SqlEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ClothingRole(str, Enum):
    TOP = "TOP"
    BOTTOM = "BOTTOM"
    OUTER = "OUTER"
    SHOES = "SHOES"


class RecommendationItem(Base):
    __tablename__ = "recommendation_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    recommendation_id: Mapped[int] = mapped_column(
        ForeignKey("recommendations.id"),
        unique=True,
    )
    clothing_item_id: Mapped[int] = mapped_column(
        ForeignKey("clothing_items.id"),
        unique=True,
    )
    role: Mapped[ClothingRole] = mapped_column(
        SqlEnum(ClothingRole, name="clothing_role", create_type=False)
    )

    recommendation = relationship("Recommendation", back_populates="recommendation_item")
    clothing_item = relationship("ClothingItem", back_populates="recommendation_item")
