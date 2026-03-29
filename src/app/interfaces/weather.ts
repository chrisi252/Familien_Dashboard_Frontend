export interface WeatherLocation {
  city_name: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  wind_speed: number;
  weather_code: number;
  weather_description: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  weather_code: number;
  weather_description: string;
  icon: string;
  temperature_max: number;
  temperature_min: number;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
