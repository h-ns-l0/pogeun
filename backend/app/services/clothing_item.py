from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.clothing_item import ClothingItem
from app.models.user import User
from app.schemas.clothing_item import ClothingItemCreate, ClothingItemUpdate


class ClothingItemServiceError(Exception):
    pass


def _user_exists(db: Session, user_id: int) -> bool:
    stmt = select(User.id).where(User.id == user_id)
    return db.scalar(stmt) is not None


def _commit(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ClothingItemServiceError("DB 제약조건에 맞지 않는 요청이에요.") from exc


def create_clothing_item(db: Session, item_in: ClothingItemCreate) -> ClothingItem:
    if not _user_exists(db, item_in.user_id):
        raise ClothingItemServiceError("존재하지 않는 user_id예요.")

    item = ClothingItem(**item_in.model_dump())
    db.add(item)
    _commit(db)
    db.refresh(item)
    return item


def get_clothing_items(db: Session, user_id: int) -> list[ClothingItem]:
    stmt = (
        select(ClothingItem)
        .where(ClothingItem.user_id == user_id)
        .order_by(ClothingItem.id.desc())
    )

    return list(db.scalars(stmt).all())


def get_clothing_item_by_id(
    db: Session,
    clothing_item_id: int,
    user_id: int,
) -> ClothingItem | None:
    stmt = select(ClothingItem).where(
        ClothingItem.id == clothing_item_id,
        ClothingItem.user_id == user_id,
    )
    return db.scalar(stmt)


def update_clothing_item(
    db: Session,
    item: ClothingItem,
    item_in: ClothingItemUpdate,
) -> ClothingItem:
    update_data = item_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(item, field, value)

    _commit(db)
    db.refresh(item)
    return item


def delete_clothing_item(db: Session, item: ClothingItem) -> None:
    db.delete(item)
    _commit(db)
