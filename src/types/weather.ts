export interface City {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
  timezone: string
}

export interface WeatherCurrent {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
  wind_direction_10m: number
  pressure_msl: number
}

export interface WeatherHourly {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  weather_code: number[]
  wind_speed_10m: number[]
}

export interface WeatherDaily {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_probability_max: number[]
}

export interface WeatherResponse {
  latitude: number
  longitude: number
  timezone: string
  current: WeatherCurrent
  hourly: WeatherHourly
  daily: WeatherDaily
}

export interface AirQualityCurrent {
  time: string
  us_aqi: number
  pm2_5: number
  pm10: number
  carbon_monoxide: number
  nitrogen_dioxide: number
  ozone: number
  sulphur_dioxide: number
}

export interface AirQualityResponse {
  latitude: number
  longitude: number
  timezone: string
  current: AirQualityCurrent
}
