export interface WeatherForecast {
  forecast_date: string;
  forecast_time: string;
  temperature_celsius: number | null;
  sky: string | null;
  precipitation_type: string | null;
  precipitation_probability: number | null;
  precipitation_amount: string | null;
  humidity: number | null;
  wind_speed: number | null;
}

export interface WeatherCurrent {
  forecast_date: string;
  forecast_time: string;
  temperature_celsius: number | null;
  sky: string | null;
  precipitation_type: string | null;
  precipitation_probability: number | null;
  precipitation_amount: string | null;
  humidity: number | null;
  wind_speed: number | null;
}

export interface WeatherResponse {
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
  current: WeatherCurrent | null;
  forecasts: WeatherForecast[];
}
