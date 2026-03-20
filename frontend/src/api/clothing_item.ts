import axios from "axios";
import type {
  ClothingItem,
  ClothingItemCreateRequest,
  ClothingItemUpdateRequest,
} from "../types/clothing_item";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getWardrobeItems = async (userId?: number): Promise<ClothingItem[]> => {
  const response = await api.get("/wardrobe/", {
    params: userId ? { user_id: userId } : {},
  });
  return response.data;
};

export const getWardrobeItem = async (id: number): Promise<ClothingItem> => {
  const response = await api.get(`/wardrobe/${id}`);
  return response.data;
};

export const createWardrobeItem = async (
  payload: ClothingItemCreateRequest
): Promise<ClothingItem> => {
  const response = await api.post("/wardrobe/", payload);
  return response.data;
};

export const updateWardrobeItem = async (
  id: number,
  payload: ClothingItemUpdateRequest
): Promise<ClothingItem> => {
  const response = await api.patch(`/wardrobe/${id}`, payload);
  return response.data;
};

export const deleteWardrobeItem = async (id: number): Promise<void> => {
  await api.delete(`/wardrobe/${id}`);
};