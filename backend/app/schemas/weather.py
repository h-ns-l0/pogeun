from pydantic import BaseModel


class WeatherForecastEntry(BaseModel):
    forecast_date: str
    forecast_time: str
    temperature_celsius: float | None = None
    sky: str | None = None
    precipitation_type: str | None = None
    precipitation_probability: int | None = None
    precipitation_amount: str | None = None
    humidity: int | None = None
    wind_speed: float | None = None


class WeatherForecastResponse(BaseModel):
    base_date: str
    base_time: str
    nx: int
    ny: int
    current: WeatherForecastEntry | None
    forecasts: list[WeatherForecastEntry]
