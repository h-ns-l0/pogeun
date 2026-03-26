import type { ClothingItem } from "../types/clothing_item";
import { categoryLabelMap, getItemTone } from "../utils/clothing";
import "./ClothingItemCard.css";

interface ClothingItemCardProps {
  item: ClothingItem;
  detail: string;
  variant?: "closet" | "recommend";
}

export function ClothingItemCard({
  item,
  detail,
  variant = "closet",
}: ClothingItemCardProps) {
  const photoClassName = `clothing-photo ${getItemTone(item) ?? "sand"}`;

  return (
    <article className={`${variant}-card clothing-card`}>
      {item.img_url ? (
        <img className="clothing-photo image" src={item.img_url} alt={item.name} />
      ) : (
        <div className={photoClassName} />
      )}
      <div className="clothing-copy">
        <strong>{item.name}</strong>
        <p>{categoryLabelMap[item.category]}</p>
      </div>
      <span>{detail}</span>
    </article>
  );
}
