import type { AirQualityResponse, City, WeatherResponse } from '../types/weather'

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

export async function searchCities(
  query: string,
  countryCode?: string,
): Promise<City[]> {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length < 2) {
    return []
  }

  const params = new URLSearchParams({
    name: trimmedQuery,
    count: '8',
    language: 'en',
    format: 'json',
  })

  if (countryCode) {
    params.set('countryCode', countryCode.toUpperCase())
  }

  const response = await fetch(`${GEOCODING_API}?${params}`)

  if (!response.ok) {
    throw new Error(`City search failed: HTTP ${response.status}`)
  }

  const data: { results?: City[] } = await response.json()

  return data.results ?? []
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
    ].join(','),
    forecast_days: '7',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  })

  const response = await fetch(`${WEATHER_API}?${params}`)

  if (!response.ok) {
    throw new Error(`Weather request failed: HTTP ${response.status}`)
  }

  return response.json() as Promise<WeatherResponse>
}


const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export async function getAirQuality(
  latitude: number,
  longitude: number,
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'us_aqi',
      'pm2_5',
      'pm10',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'ozone',
      'sulphur_dioxide',
    ].join(','),
    timezone: 'auto',
  })

  const response = await fetch(`${AIR_QUALITY_API}?${params}`)

  if (!response.ok) {
    throw new Error(`Air quality request failed: HTTP ${response.status}`)
  }

  return response.json() as Promise<AirQualityResponse>
}
