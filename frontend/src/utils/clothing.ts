import type { ClothingCategory, ClothingItem } from "../types/clothing_item";

export const wardrobeTabs = ["전체", "상의", "하의", "아우터", "신발"] as const;

export type WardrobeTab = (typeof wardrobeTabs)[number];

export const categoryLabelMap: Record<ClothingCategory, WardrobeTab> = {
  TOP: "상의",
  BOTTOM: "하의",
  OUTER: "아우터",
  SHOES: "신발",
};

export function getItemTone(item: ClothingItem) {
  if (item.img_url) {
    return null;
  }

  const tones = {
    TOP: "sand",
    BOTTOM: "forest",
    OUTER: "mist",
    SHOES: "plum",
  } satisfies Record<ClothingCategory, string>;

  return tones[item.category];
}

export function getRecommendedItems(items: ClothingItem[], temperature: number | null) {
  if (items.length === 0) {
    return [];
  }

  if (temperature === null) {
    return items.slice(0, 4);
  }

  const pickClosest = (category: ClothingCategory, targetThickness: number) => {
    const candidates = items.filter((item) => item.category === category);
    if (candidates.length === 0) {
      return null;
    }

    return [...candidates].sort((left, right) => {
      const leftGap = Math.abs(left.thickness - targetThickness);
      const rightGap = Math.abs(right.thickness - targetThickness);
      return leftGap - rightGap;
    })[0];
  };

  const recommendationSet = new Map<number, ClothingItem>();

  const addIfPresent = (item: ClothingItem | null) => {
    if (item) {
      recommendationSet.set(item.id, item);
    }
  };

  if (temperature <= 5) {
    addIfPresent(pickClosest("TOP", 5));
    addIfPresent(pickClosest("BOTTOM", 4));
    addIfPresent(pickClosest("OUTER", 5));
    addIfPresent(pickClosest("SHOES", 4));
  } else if (temperature <= 12) {
    addIfPresent(pickClosest("TOP", 4));
    addIfPresent(pickClosest("BOTTOM", 3));
    addIfPresent(pickClosest("OUTER", 4));
    addIfPresent(pickClosest("SHOES", 3));
  } else if (temperature <= 20) {
    addIfPresent(pickClosest("TOP", 3));
    addIfPresent(pickClosest("BOTTOM", 3));
    addIfPresent(pickClosest("OUTER", 2));
    addIfPresent(pickClosest("SHOES", 3));
  } else {
    addIfPresent(pickClosest("TOP", 1));
    addIfPresent(pickClosest("BOTTOM", 2));
    addIfPresent(pickClosest("SHOES", 2));
  }

  return Array.from(recommendationSet.values());
}
