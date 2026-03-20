from enum import Enum

from sqlalchemy import Enum as SqlEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ClothingCategory(str, Enum):
    TOP = "TOP"
    BOTTOM = "BOTTOM"
    OUTER = "OUTER"
    SHOES = "SHOES"


class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[ClothingCategory] = mapped_column(
        SqlEnum(ClothingCategory, name="clothing_category", create_type=False)
    )
    thickness: Mapped[int] = mapped_column(Integer)
    img_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    user = relationship("User", back_populates="clothing_items")
    recommendation_item = relationship(
        "RecommendationItem",
        back_populates="clothing_item",
        uselist=False,
    )
