from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.clothing_item import (
    ClothingItemCreate,
    ClothingItemRead,
    ClothingItemUpdate,
)
from app.services.clothing_item import (
    create_clothing_item,
    delete_clothing_item,
    get_clothing_item_by_id,
    get_clothing_items,
    update_clothing_item,
)

router = APIRouter(prefix="/clothing_item", tags=["clothing_item"])


@router.post("/", response_model=ClothingItemRead, status_code=status.HTTP_201_CREATED)
def create_wardrobe_item(
    item_in: ClothingItemCreate,
    db: Session = Depends(get_db),
):
    return create_clothing_item(db, item_in)


@router.get("/", response_model=list[ClothingItemRead])
def read_wardrobe_items(
    user_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return get_clothing_items(db, user_id=user_id)


@router.get("/{clothing_item_id}", response_model=ClothingItemRead)
def read_wardrobe_item(
    clothing_item_id: int,
    db: Session = Depends(get_db),
):
    item = get_clothing_item_by_id(db, clothing_item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 옷 아이템을 찾을 수 없어요.",
        )
    return item


@router.patch("/{clothing_item_id}", response_model=ClothingItemRead)
def update_wardrobe_item(
    clothing_item_id: int,
    item_in: ClothingItemUpdate,
    db: Session = Depends(get_db),
):
    item = get_clothing_item_by_id(db, clothing_item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 옷 아이템을 찾을 수 없어요.",
        )

    return update_clothing_item(db, item, item_in)


@router.delete("/{clothing_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wardrobe_item(
    clothing_item_id: int,
    db: Session = Depends(get_db),
):
    item = get_clothing_item_by_id(db, clothing_item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 옷 아이템을 찾을 수 없어요.",
        )

    delete_clothing_item(db, item)
    return None