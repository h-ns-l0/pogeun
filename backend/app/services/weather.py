import json
import os
from datetime import datetime, timedelta
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen
from zoneinfo import ZoneInfo

from app.schemas.weather import WeatherForecastEntry, WeatherForecastResponse

KST = ZoneInfo("Asia/Seoul")
KMA_BASE_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
KMA_BASE_TIMES = (2, 5, 8, 11, 14, 17, 20, 23)

SKY_LABELS = {
    "1": "맑음",
    "3": "구름많음",
    "4": "흐림",
}

PTY_LABELS = {
    "0": "없음",
    "1": "비",
    "2": "비/눈",
    "3": "눈",
    "4": "소나기",
}


class WeatherServiceError(Exception):
    pass


def _get_service_key() -> str:
    service_key = os.getenv("KMA_SERVICE_KEY")
    if not service_key:
        raise WeatherServiceError("KMA_SERVICE_KEY 환경변수가 설정되지 않았어요.")
    return service_key


def _get_latest_base_datetime(now: datetime | None = None) -> tuple[str, str]:
    current = now.astimezone(KST) if now else datetime.now(KST)
    adjusted = current - timedelta(minutes=10)

    available_hours = [hour for hour in KMA_BASE_TIMES if hour <= adjusted.hour]
    if available_hours:
        base_hour = available_hours[-1]
        base_date = adjusted.date()
    else:
        base_hour = KMA_BASE_TIMES[-1]
        base_date = (adjusted - timedelta(days=1)).date()

    return base_date.strftime("%Y%m%d"), f"{base_hour:02d}00"


def _request_weather(payload: dict[str, str | int]) -> dict:
    query_string = urlencode(payload)
    request_url = f"{KMA_BASE_URL}?{query_string}"

    try:
        with urlopen(request_url, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raise WeatherServiceError(f"기상청 API 호출이 실패했어요. status={exc.code}") from exc
    except URLError as exc:
        raise WeatherServiceError("기상청 API에 연결하지 못했어요.") from exc
    except json.JSONDecodeError as exc:
        raise WeatherServiceError("기상청 API 응답을 해석하지 못했어요.") from exc


def _to_int(value: str | None) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def _to_float(value: str | None) -> float | None:
    if value is None or value == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def _build_forecast_entries(items: list[dict], forecast_count: int) -> list[WeatherForecastEntry]:
    grouped: dict[tuple[str, str], dict[str, str]] = {}

    for item in items:
        key = (item["fcstDate"], item["fcstTime"])
        bucket = grouped.setdefault(key, {})
        bucket[item["category"]] = item["fcstValue"]

    entries: list[WeatherForecastEntry] = []
    for forecast_date, forecast_time in sorted(grouped.keys()):
        values = grouped[(forecast_date, forecast_time)]
        entries.append(
            WeatherForecastEntry(
                forecast_date=forecast_date,
                forecast_time=forecast_time,
                temperature_celsius=_to_float(values.get("TMP")),
                sky=SKY_LABELS.get(values.get("SKY", "")),
                precipitation_type=PTY_LABELS.get(values.get("PTY", "")),
                precipitation_probability=_to_int(values.get("POP")),
                precipitation_amount=values.get("PCP"),
                humidity=_to_int(values.get("REH")),
                wind_speed=_to_float(values.get("WSD")),
            )
        )

    return entries[:forecast_count]


def _fetch_forecast_items(
    service_key: str,
    base_date: str,
    base_time: str,
    nx: int,
    ny: int,
) -> list[dict]:
    payload = {
        "serviceKey": service_key,
        "pageNo": 1,
        "numOfRows": 1000,
        "dataType": "JSON",
        "base_date": base_date,
        "base_time": base_time,
        "nx": nx,
        "ny": ny,
    }

    data = _request_weather(payload)
    response = data.get("response", {})
    header = response.get("header", {})
    if header.get("resultCode") != "00":
        raise WeatherServiceError(
            f"기상청 API 오류: {header.get('resultMsg', '알 수 없는 오류')}"
        )

    body = response.get("body", {})
    return body.get("items", {}).get("item", [])


def get_weather_forecast(
    nx: int,
    ny: int,
    forecast_count: int = 6,
) -> WeatherForecastResponse:
    service_key = _get_service_key()
    base_date, base_time = _get_latest_base_datetime()
    candidate_coords = [
        (nx, ny),
        (nx + 1, ny),
        (nx - 1, ny),
        (nx, ny + 1),
        (nx, ny - 1),
    ]

    items: list[dict] = []
    resolved_nx = nx
    resolved_ny = ny

    for candidate_nx, candidate_ny in candidate_coords:
        candidate_items = _fetch_forecast_items(
            service_key=service_key,
            base_date=base_date,
            base_time=base_time,
            nx=candidate_nx,
            ny=candidate_ny,
        )
        if candidate_items:
            items = candidate_items
            resolved_nx = candidate_nx
            resolved_ny = candidate_ny
            break

    if not items:
        raise WeatherServiceError("해당 위치의 예보 데이터를 찾지 못했어요.")

    forecasts = _build_forecast_entries(items, forecast_count)
    current = forecasts[0] if forecasts else None

    return WeatherForecastResponse(
        base_date=base_date,
        base_time=base_time,
        nx=resolved_nx,
        ny=resolved_ny,
        current=current,
        forecasts=forecasts,
    )
