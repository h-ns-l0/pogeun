import type { ClothingItem } from "../types/clothing_item";
import { ClothingItemCard } from "./ClothingItemCard";
import { EmptyState } from "./EmptyState";
import "./RecommendPanel.css";

interface RecommendPanelProps {
  items: ClothingItem[];
}

export function RecommendPanel({ items }: RecommendPanelProps) {
  return (
    <section className="recommend-panel">
      <div className="recommend-copy">
        <p className="section-kicker">오늘의 코디</p>
        <h1>현재 기온에 맞는 조합</h1>
        <p>상의, 하의, 아우터, 신발을 온도대에 맞춰 한 벌처럼 묶어 추천합니다.</p>
      </div>

      <div className="recommend-list">
        {items.length > 0 ? (
          items.map((item) => (
            <ClothingItemCard
              key={item.id}
              item={item}
              detail={`두께 ${item.thickness}`}
              variant="recommend"
            />
          ))
        ) : (
          <EmptyState
            title="추천할 옷이 없습니다."
            description="옷장에 실제 아이템이 들어오면 여기서 현재 기온에 맞는 후보를 보여줍니다."
          />
        )}
      </div>
    </section>
  );
}
