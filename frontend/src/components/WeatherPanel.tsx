import { useRef } from "react";
import type { MouseEvent, WheelEvent } from "react";
import type { WeatherResponse } from "../types/weather";
import "./WeatherPanel.css";

interface WeatherPanelProps {
  weather: WeatherResponse | null;
  weatherLoading: boolean;
  weatherError: string | null;
  locationLabel: string;
  locationPermissionState: "idle" | "requesting" | "granted" | "fallback";
  onUseCurrentLocation: () => void;
}

function formatHourLabel(time: string) {
  if (time.length !== 4) {
    return time;
  }
  return `${time.slice(0, 2)}시`;
}

function getWeatherSymbol(sky: string | null, precipitationType: string | null) {
  if (precipitationType === "비") return "🌧";
  if (precipitationType === "비/눈") return "🌨";
  if (precipitationType === "눈") return "❄️";
  if (precipitationType === "소나기") return "🌦";
  if (sky === "맑음") return "☀️";
  if (sky === "구름많음") return "⛅";
  if (sky === "흐림") return "☁️";
  return "·";
}

export function WeatherPanel({
  weather,
  weatherLoading,
  weatherError,
  locationLabel,
  locationPermissionState,
  onUseCurrentLocation,
}: WeatherPanelProps) {
  const current = weather?.current ?? null;
  const forecastStripRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    isDragging: boolean;
    startX: number;
    startScrollLeft: number;
  }>({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
  });

  const temperatures = (weather?.forecasts ?? [])
    .map((forecast) => forecast.temperature_celsius)
    .filter((value): value is number => value !== null);

  const minTemp = temperatures.length > 0 ? Math.min(...temperatures) : null;
  const maxTemp = temperatures.length > 0 ? Math.max(...temperatures) : null;

  const summaryStats = [
    {
      label: "체감",
      value: current?.temperature_celsius !== null && current?.temperature_celsius !== undefined
        ? `${current.temperature_celsius}°`
        : null,
    },
    {
      label: "습도",
      value: current?.humidity !== null && current?.humidity !== undefined ? `${current.humidity}%` : null,
    },
    {
      label: "바람",
      value: current?.wind_speed !== null && current?.wind_speed !== undefined ? `${current.wind_speed}m/s` : null,
    },
    {
      label: "강수확률",
      value:
        current?.precipitation_probability !== null &&
        current?.precipitation_probability !== undefined
          ? `${current.precipitation_probability}%`
          : null,
    },
  ].filter((item) => item.value !== null);

  const handleForecastWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = forecastStripRef.current;
    if (!container) {
      return;
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    container.scrollLeft += event.deltaY;
  };

  const handleForecastMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const container = forecastStripRef.current;
    if (!container) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
    };

    container.classList.add("dragging");
  };

  const handleForecastMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const container = forecastStripRef.current;
    const dragState = dragStateRef.current;
    if (!container || !dragState.isDragging) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    container.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const stopForecastDragging = () => {
    const container = forecastStripRef.current;
    dragStateRef.current.isDragging = false;
    container?.classList.remove("dragging");
  };

  return (
    <section className="weather-panel">
      <div className="weather-topbar">
        <div>
          <p className="weather-location">{locationLabel}</p>
          <p className="weather-date">
            {current ? `${current.forecast_date.slice(4, 6)}.${current.forecast_date.slice(6, 8)}` : "--.--"}
          </p>
        </div>
        <button
          type="button"
          className="location-button"
          disabled={locationPermissionState === "requesting" || weatherLoading}
          onClick={onUseCurrentLocation}
        >
          {locationPermissionState === "requesting" ? "위치 확인 중" : "내 위치 사용"}
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-main-copy">
          <div className="weather-main-symbol">
            {getWeatherSymbol(current?.sky ?? null, current?.precipitation_type ?? null)}
          </div>
          <div>
            <div className="temperature-value">
              {current?.temperature_celsius !== null && current?.temperature_celsius !== undefined
                ? `${current.temperature_celsius}°`
                : "--"}
            </div>
            <p className="weather-summary">{current?.sky ?? "날씨 정보 없음"}</p>
            <p className="weather-sub">
              {minTemp !== null && maxTemp !== null ? `최저 ${minTemp}° · 최고 ${maxTemp}°` : "예보 정보 준비 중"}
            </p>
          </div>
        </div>

        <div className="weather-stats">
          {summaryStats.map((stat) => (
            <article key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>
      </div>

      <div
        ref={forecastStripRef}
        className="forecast-strip"
        onWheel={handleForecastWheel}
        onMouseDown={handleForecastMouseDown}
        onMouseMove={handleForecastMouseMove}
        onMouseLeave={stopForecastDragging}
        onMouseUp={stopForecastDragging}
      >
        {(weather?.forecasts ?? []).map((forecast, index) => (
          <article
            className={`forecast-card ${index === 0 ? "active" : ""}`}
            key={`${forecast.forecast_date}-${forecast.forecast_time}`}
          >
            <p className="forecast-time">{formatHourLabel(forecast.forecast_time)}</p>
            <div className="forecast-icon">
              {getWeatherSymbol(forecast.sky, forecast.precipitation_type)}
            </div>
            <strong>{forecast.temperature_celsius ?? "-"}°</strong>
            <span>
              {forecast.precipitation_probability !== null
                ? `${forecast.precipitation_probability}%`
                : ""}
            </span>
          </article>
        ))}
      </div>

      {weatherError ? <p className="message error">{weatherError}</p> : null}
    </section>
  );
}
