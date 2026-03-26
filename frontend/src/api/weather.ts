import axios from "axios";
import type { WeatherResponse } from "../types/weather";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getWeatherForecast = async (
  nx: number,
  ny: number,
  forecastCount = 6
): Promise<WeatherResponse> => {
  try {
    const response = await api.get("/weather/forecast", {
      params: {
        nx,
        ny,
        forecast_count: forecastCount,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const detail =
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "날씨 정보를 불러오지 못했습니다.";
      throw new Error(detail);
    }

    throw error;
  }
};
