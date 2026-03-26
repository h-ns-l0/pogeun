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
  const response = await api.get("/clothing-item/", {
    params: userId ? { user_id: userId } : {},
  });
  return response.data;
};

export const getWardrobeItem = async (id: number): Promise<ClothingItem> => {
  const response = await api.get(`/clothing-item/${id}`);
  return response.data;
};

export const createWardrobeItem = async (
  payload: ClothingItemCreateRequest
): Promise<ClothingItem> => {
  const response = await api.post("/clothing-item/", payload);
  return response.data;
};

export const updateWardrobeItem = async (
  id: number,
  payload: ClothingItemUpdateRequest
): Promise<ClothingItem> => {
  const response = await api.patch(`/clothing-item/${id}`, payload);
  return response.data;
};

export const deleteWardrobeItem = async (id: number): Promise<void> => {
  await api.delete(`/clothing-item/${id}`);
};
