from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.weather import WeatherForecastResponse
from app.services.weather import WeatherServiceError, get_weather_forecast

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/forecast", response_model=WeatherForecastResponse, status_code=status.HTTP_200_OK)
def read_weather_forecast(
    nx: int = Query(..., ge=1),
    ny: int = Query(..., ge=1),
    forecast_count: int = Query(6, ge=1, le=24),
):
    try:
        return get_weather_forecast(nx=nx, ny=ny, forecast_count=forecast_count)
    except WeatherServiceError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
