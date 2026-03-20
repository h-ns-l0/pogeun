from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.clothing_item import ClothingItem
from app.schemas.clothing_item import ClothingItemCreate, ClothingItemUpdate


def create_clothing_item(db: Session, item_in: ClothingItemCreate) -> ClothingItem:
    item = ClothingItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_clothing_items(db: Session, user_id: int | None = None) -> list[ClothingItem]:
    stmt = select(ClothingItem)

    if user_id is not None:
        stmt = stmt.where(ClothingItem.user_id == user_id)

    return list(db.scalars(stmt).all())


def get_clothing_item_by_id(db: Session, clothing_item_id: int) -> ClothingItem | None:
    stmt = select(ClothingItem).where(ClothingItem.id == clothing_item_id)
    return db.scalar(stmt)


def update_clothing_item(
    db: Session,
    item: ClothingItem,
    item_in: ClothingItemUpdate,
) -> ClothingItem:
    update_data = item_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


def delete_clothing_item(db: Session, item: ClothingItem) -> None:
    db.delete(item)
    db.commit()