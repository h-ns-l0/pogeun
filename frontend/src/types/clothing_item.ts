export type ClothingCategory = "TOP" | "BOTTOM" | "OUTER" | "SHOES";

export interface ClothingItem {
  id: number;
  user_id: number;
  name: string;
  category: ClothingCategory;
  thickness: number;
  img_url: string | null;
}

export interface ClothingItemCreateRequest {
  user_id: number;
  name: string;
  category: ClothingCategory;
  thickness: number;
  img_url?: string | null;
}

export interface ClothingItemUpdateRequest {
  name?: string;
  category?: ClothingCategory;
  thickness?: number;
  img_url?: string | null;
}