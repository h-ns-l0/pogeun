import type { ClothingItem } from "../types/clothing_item";
import type { WardrobeTab } from "../utils/clothing";
import { wardrobeTabs } from "../utils/clothing";
import { ClothingItemCard } from "./ClothingItemCard";
import { EmptyState } from "./EmptyState";
import "./ClosetPanel.css";

interface ClosetPanelProps {
  items: ClothingItem[];
  loading: boolean;
  error: string | null;
  activeTab: WardrobeTab;
  onChangeTab: (tab: WardrobeTab) => void;
}

export function ClosetPanel({
  items,
  loading,
  error,
  activeTab,
  onChangeTab,
}: ClosetPanelProps) {
  return (
    <aside className="closet-panel">
      <div className="closet-head">
        <div>
          <p className="closet-title">내 옷장</p>
          <p className="closet-sub">user_id=1 기준 실제 옷장 데이터</p>
        </div>
      </div>

      <div className="tab-row">
        {wardrobeTabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`tab-pill ${activeTab === tab ? "active" : ""}`}
            onClick={() => onChangeTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? <p className="message">옷장 불러오는 중...</p> : null}
      {error ? <p className="message error">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="옷장 데이터가 없습니다."
          description="`clothing_item` 테이블에 `user_id=1` 데이터가 들어오면 이 영역에 실제 옷이 표시됩니다."
        />
      ) : null}

      <div className="closet-grid">
        {items.map((item) => (
          <ClothingItemCard key={item.id} item={item} detail={`두께 ${item.thickness}`} />
        ))}
      </div>
    </aside>
  );
}
