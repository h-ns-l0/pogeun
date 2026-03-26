import { useEffect, useState } from "react";
import { getWardrobeItems } from "./api/clothing_item";
import { getWeatherForecast } from "./api/weather";
import { ClosetPanel } from "./components/ClosetPanel";
import { PageHeader } from "./components/PageHeader";
import { RecommendPanel } from "./components/RecommendPanel";
import { WeatherPanel } from "./components/WeatherPanel";
import type { ClothingItem } from "./types/clothing_item";
import type { WeatherResponse } from "./types/weather";
import { getRecommendedItems, categoryLabelMap } from "./utils/clothing";
import type { WardrobeTab } from "./utils/clothing";
import { convertLatLngToGrid } from "./utils/kma_grid";
import { reverseGeocodeKoreanLocation } from "./utils/location";
import "./App.css";

const DEFAULT_NX = 60;
const DEFAULT_NY = 127;
const DEFAULT_USER_ID = 1;
const DEFAULT_FORECAST_COUNT = 14;

function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(true);
  const [wardrobeError, setWardrobeError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WardrobeTab>("전체");
  const [locationLabel, setLocationLabel] = useState("서울");
  const [locationPermissionState, setLocationPermissionState] = useState<
    "idle" | "requesting" | "granted" | "fallback"
  >("idle");

  const loadWeather = async (nx: number, ny: number) => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const response = await getWeatherForecast(nx, ny, DEFAULT_FORECAST_COUNT);
      setWeather(response);
      return true;
    } catch (loadError) {
      setWeatherError(
        loadError instanceof Error
          ? loadError.message
          : "날씨 정보를 불러오지 못했습니다. 백엔드 실행 상태와 기상청 API 키를 확인해 주세요."
      );
      console.error(loadError);
      return false;
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadWardrobe = async () => {
    setWardrobeLoading(true);
    setWardrobeError(null);

    try {
      const response = await getWardrobeItems(DEFAULT_USER_ID);
      setWardrobeItems(response);
    } catch (loadError) {
      setWardrobeItems([]);
      setWardrobeError("옷장 데이터를 불러오지 못했습니다. user_id=1 데이터가 있는지 확인해 주세요.");
      console.error(loadError);
    } finally {
      setWardrobeLoading(false);
    }
  };

  useEffect(() => {
    void loadWeather(DEFAULT_NX, DEFAULT_NY);
    void loadWardrobe();
  }, []);

  const handleUseCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setWeatherError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setLocationPermissionState("requesting");
    setWeatherError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { nx, ny } = convertLatLngToGrid(latitude, longitude);

        void (async () => {
          const success = await loadWeather(nx, ny);
          if (success) {
            setLocationPermissionState("granted");
            void reverseGeocodeKoreanLocation(latitude, longitude)
              .then((resolvedLabel) => {
                setLocationLabel(resolvedLabel ?? "현재 위치");
              })
              .catch(() => {
                setLocationLabel("현재 위치");
              });
            return;
          }

          setLocationPermissionState("fallback");
          setLocationLabel("서울");
        })();
      },
      (geoError) => {
        setLocationPermissionState("fallback");
        setLocationLabel("서울");
        setWeatherError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "위치 권한이 거부되어 서울 기준으로 표시합니다. 브라우저에서 위치 권한을 허용해 주세요."
            : "현재 위치를 가져오지 못했습니다. 서울 기준으로 표시합니다."
        );
        void loadWeather(DEFAULT_NX, DEFAULT_NY);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const visibleWardrobeItems =
    activeTab === "전체"
      ? wardrobeItems
      : wardrobeItems.filter((item) => categoryLabelMap[item.category] === activeTab);

  const recommendedItems = getRecommendedItems(
    wardrobeItems,
    weather?.current?.temperature_celsius ?? null
  );

  return (
    <main className="page-shell">
      <PageHeader title="포근" subtitle="" />

      <section className="dashboard">
        <WeatherPanel
          weather={weather}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          locationLabel={locationLabel}
          locationPermissionState={locationPermissionState}
          onUseCurrentLocation={handleUseCurrentLocation}
        />

        <ClosetPanel
          items={visibleWardrobeItems}
          loading={wardrobeLoading}
          error={wardrobeError}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </section>

      <RecommendPanel items={recommendedItems} />
    </main>
  );
}

export default App;
