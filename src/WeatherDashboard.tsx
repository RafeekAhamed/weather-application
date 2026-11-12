import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Cloud,
  MapPin,
  Menu,
  X,
  Home,
  LogIn,
  UserPlus,
  Moon,
  Search,
  Sun,
} from 'lucide-react'
import type { AirQualityResponse, City, WeatherResponse } from './types/weather'
import { getAirQuality, getWeather } from './services/weather'
import WorldMap from './components/WorldMap'
import AuthWeatherBackground from './components/AuthWeatherBackground'
import './App.css'
import { useTheme } from './context/useTheme'

const weeklyForecast = [
  { day: 'Monday', temperature: 16, icon: '???', condition: 'Sunny' },
  { day: 'Tue', temperature: 10, icon: '???', condition: 'Rainy' },
  { day: 'Wed', temperature: 15, icon: '???', condition: 'Rainy' },
  { day: 'Thu', temperature: 11, icon: '???', condition: 'Cloudy' },
  { day: 'Fri', temperature: 18, icon: '???', condition: 'Sunny' },
  { day: 'Sat', temperature: 12, icon: '??', condition: 'Stormy' },
  { day: 'Sun', temperature: 10, icon: '???', condition: 'Rainy' },
]

const cities: (City & {
  condition: string
  temperature: number
  icon: string
})[] = [
  {
    id: 1,
    country: 'India',
    country_code: 'IN',
    name: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 'Asia/Kolkata',
    condition: 'Mostly Sunny',
    temperature: 29,
    icon: '???',
  },
  {
    id: 2,
    country: 'Japan',
    country_code: 'JP',
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    condition: 'Cloudy',
    temperature: 19,
    icon: '???',
  },
  {
    id: 3,
    country: 'United Arab Emirates',
    country_code: 'AE',
    name: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
    condition: 'Sunny',
    temperature: 31,
    icon: '??',
  },
  {
    id: 4,
    country: 'United Kingdom',
    country_code: 'GB',
    name: 'London',
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: 'Europe/London',
    condition: 'Cloudy',
    temperature: 14,
    icon: '??',
  },
  {
    id: 5,
    country: 'United States',
    country_code: 'US',
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
    condition: 'Partly Cloudy',
    temperature: 17,
    icon: '???',
  },
  {
    id: 6,
    country: 'Singapore',
    country_code: 'SG',
    name: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
    condition: 'Rainy',
    temperature: 30,
    icon: '???',
  },
  {
    id: 7,
    country: 'France',
    country_code: 'FR',
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    condition: 'Partly Cloudy',
    temperature: 16,
    icon: '???',
  },
  {
    id: 8,
    country: 'Australia',
    country_code: 'AU',
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
    condition: 'Sunny',
    temperature: 24,
    icon: '??',
  },
  {
    id: 9,
    country: 'India',
    country_code: 'IN',
    name: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    condition: 'Mostly Sunny',
    temperature: 30,
    icon: '???',
  },
  {
    id: 10,
    country: 'Canada',
    country_code: 'CA',
    name: 'Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: 'America/Toronto',
    condition: 'Cloudy',
    temperature: 12,
    icon: '??',
  },
  {
    id: 11,
    country: 'Egypt',
    country_code: 'EG',
    name: 'Cairo',
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: 'Africa/Cairo',
    condition: 'Sunny',
    temperature: 27,
    icon: '??',
  },
  {
    id: 12,
    country: 'South Korea',
    country_code: 'KR',
    name: 'Seoul',
    latitude: 37.5665,
    longitude: 126.9780,
    timezone: 'Asia/Seoul',
    condition: 'Partly Cloudy',
    temperature: 18,
    icon: '???',
  },
]
const defaultCity: City = {
  id: -1,
  name: 'Tirunelveli',
  latitude: 8.7139,
  longitude: 77.7567,
  country: 'India',
  country_code: 'IN',
  timezone: 'Asia/Kolkata',
}
function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code === 45 || code === 48) return 'Foggy'
  if (code >= 51 && code <= 55) return 'Drizzle'
  if (code >= 56 && code <= 57) return 'Freezing drizzle'
  if (code >= 61 && code <= 65) return 'Rainy'
  if (code >= 66 && code <= 67) return 'Freezing rain'
  if (code >= 71 && code <= 77) return 'Snowy'
  if (code >= 80 && code <= 82) return 'Rain showers'
  if (code >= 85 && code <= 86) return 'Snow showers'
  if (code >= 95 && code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '\u2600\uFE0F'
  if (code <= 3) return '\u26C5'
  if (code <= 48) return '\uD83C\uDF2B\uFE0F'
  if (code <= 57) return '\uD83C\uDF26\uFE0F'
  if (code <= 67) return '\uD83C\uDF27\uFE0F'
  if (code <= 77) return '\uD83C\uDF28\uFE0F'
  if (code <= 82) return '\uD83C\uDF26\uFE0F'
  if (code <= 86) return '\uD83C\uDF28\uFE0F'
  if (code >= 95) return '\u26C8\uFE0F'
  return '\u2601\uFE0F'
}
function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#eab308'
  if (aqi <= 150) return '#f97316'
  if (aqi <= 200) return '#ef4444'
  if (aqi <= 300) return '#a855f7'
  return '#7f1d1d'
}

function WeatherDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])
const routePages: Record<string, 'dashboard' | 'map' | 'air-quality' | 'rain' | 'cities'> = {
    '/': 'dashboard',
    '/map': 'map',
    '/air-quality': 'air-quality',
    '/rain': 'rain',
    '/cities': 'cities',
  }

  const activePage = routePages[location.pathname] ?? 'dashboard'
  const [unit, setUnit] = useState<'C' | 'F'>('C')

  const { isNight, setTheme } = useTheme()
  const navigationState = location.state as { selectedCity?: City } | null
  const selectedCityFromNavigation = navigationState?.selectedCity

  const [selectedCity, setSelectedCity] = useState<City | null>(
    () => selectedCityFromNavigation ?? defaultCity,
  )

  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null)
  const [airQualityLoading, setAirQualityLoading] = useState(false)
  const [airQualityError, setAirQualityError] = useState('')
  const [globalWeather, setGlobalWeather] = useState<Record<string, WeatherResponse>>({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  useEffect(() => {
    if (selectedCityFromNavigation) {
      navigate('/', { replace: true, state: null })
    }
  }, [selectedCityFromNavigation, navigate])


  useEffect(() => {
    if (!selectedCity) {
      return
    }

    let cancelled = false

    const timeout = window.setTimeout(async () => {
      try {
        setWeatherLoading(true)
        setWeatherError('')

        const result = await getWeather(
          selectedCity.latitude,
          selectedCity.longitude,
        )

        if (!cancelled) {
          setWeather(result)
        }
      } catch {
        if (!cancelled) {
          setWeatherError(
            `Unable to load weather for ${selectedCity.name}. Please try again.`,
          )
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false)
        }
      }
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [selectedCity])
  useEffect(() => {
    if (!selectedCity) return

    let cancelled = false

    const loadAirQuality = async () => {
      setAirQualityLoading(true)
      setAirQualityError('')

      try {
        const result = await getAirQuality(
          selectedCity.latitude,
          selectedCity.longitude,
        )

        if (!cancelled) {
          setAirQuality(result)
        }
      } catch (error) {
        if (!cancelled) {
          setAirQuality(null)
          setAirQualityError(
            error instanceof Error ? error.message : 'Unable to load air quality.',
          )
        }
      } finally {
        if (!cancelled) {
          setAirQualityLoading(false)
        }
      }
    }

    void loadAirQuality()

    return () => {
      cancelled = true
    }
  }, [selectedCity])

  useEffect(() => {
    let cancelled = false

    const loadGlobalWeather = async () => {
      const results = await Promise.allSettled(
        cities.map(async (city) => {
          const result = await getWeather(
            city.latitude,
            city.longitude,
          )

          return [city.name, result] as const
        }),
      )

      if (cancelled) return

      const successfulResults = results.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : [],
      )

      const failedResults = results.filter(
        (result) => result.status === 'rejected',
      )

      setGlobalWeather(Object.fromEntries(successfulResults))

      if (failedResults.length > 0) {
        console.warn(
          `${failedResults.length} city weather requests failed.`,
          failedResults,
        )
      }
    }

    void loadGlobalWeather().catch((error: unknown) => {
      console.error('Unable to load global city weather:', error)
    })

    return () => {
      cancelled = true
    }
  }, [])
  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
  }

  const convertTemperature = (temperature: number) => {
    return unit === 'C'
      ? `${temperature}\u00B0`
      : `${Math.round((temperature * 9) / 5 + 32)}\u00B0`
  }

  const cityTimezone = selectedCity?.timezone || 'Asia/Kolkata'

const liveClockTime = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZone: cityTimezone,
}).format(new Date(currentTime))

const liveClockDate = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: cityTimezone,
}).format(new Date(currentTime))
  const filteredCities = cities
  const hourlyForecast = weather
    ? (() => {
        const matchingIndex = weather.hourly.time.findIndex(
          (time) => time >= weather.current.time,
        )
        const startIndex = matchingIndex >= 0 ? matchingIndex : 0

        return weather.hourly.time
          .slice(startIndex, startIndex + 24)
          .map((time, index) => {
            const dataIndex = startIndex + index

            return {
              time,
              temperature: weather.hourly.temperature_2m[dataIndex] ?? 0,
              precipitation: weather.hourly.precipitation_probability[dataIndex] ?? 0,
              weatherCode: weather.hourly.weather_code[dataIndex] ?? 0,
              windSpeed: weather.hourly.wind_speed_10m[dataIndex] ?? 0,
            }
          })
      })()
    : []
  const forecastDays = weather
    ? weather.daily.time.map((date, index) => {
        const [year, month, day] = date.split('-').map(Number)
        const forecastDate = new Date(year, month - 1, day, 12)

        return {
          dateIndex: index,
          day: forecastDate.toLocaleDateString('en-US', {
            weekday: index === 0 ? 'long' : 'short',
          }),
          temperature: weather.daily.temperature_2m_max[index],
          icon: getWeatherIcon(weather.daily.weather_code[index]),
          condition: getWeatherCondition(weather.daily.weather_code[index]),
        }
      })
    : weeklyForecast.map((day, dateIndex) => ({ ...day, dateIndex }))

  const pollutantChartData = airQuality
    ? [
        { label: 'PM2.5', value: airQuality.current.pm2_5, max: 150, unit: 'µg/m³' },
        { label: 'PM10', value: airQuality.current.pm10, max: 200, unit: 'µg/m³' },
        { label: 'Carbon Monoxide', value: airQuality.current.carbon_monoxide, max: 10000, unit: 'µg/m³' },
        { label: 'Nitrogen Dioxide', value: airQuality.current.nitrogen_dioxide, max: 200, unit: 'µg/m³' },
        { label: 'Ozone', value: airQuality.current.ozone, max: 200, unit: 'µg/m³' },
        { label: 'Sulphur Dioxide', value: airQuality.current.sulphur_dioxide, max: 200, unit: 'µg/m³' },
      ].map((item) => ({
        ...item,
        percentage: Math.min((item.value / item.max) * 100, 100),
      }))
    : []
  return (
    <main className={`weather-app ${isNight ? 'night-theme' : 'light-theme'}`}>
      <AuthWeatherBackground />
      <div className="dashboard-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button"
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              onClick={() => {
                setIsMenuOpen(true)
                setIsProfileOpen(false)
              }}
            >
              <Menu size={20} />
            </button>

            <div className="notification-wrapper">
              <button
                className="icon-button notification-button"
                type="button"
                aria-label="Notifications"
                aria-haspopup="dialog"
                aria-expanded={isNotificationsOpen}
                aria-controls="skycast-notification-panel"
                onClick={() => {
                  setIsNotificationsOpen((previous) => !previous)
                  setIsMenuOpen(false)
                  setIsProfileOpen(false)
                }}
              >
                <Bell size={18} />
                {weather && <span className="notification-dot" />}
              </button>

              {isNotificationsOpen && (
                <div
                  className="notification-panel"
                  id="skycast-notification-panel"
                  role="dialog"
                  aria-label="Weather notifications"
                >
                  <div className="notification-panel-header">
                    <div>
                      <span className="notification-eyebrow">SKYCAST UPDATES</span>
                      <h3>Notifications</h3>
                    </div>
                    <button
                      type="button"
                      className="notification-close"
                      aria-label="Close notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {weatherLoading ? (
                    <div className="notification-empty">
                      Loading live weather...
                    </div>
                  ) : weatherError ? (
                    <div className="notification-empty notification-error">
                      {weatherError}
                    </div>
                  ) : weather ? (
                    <>
                      <div className="notification-weather-card">
                        <div className="notification-weather-location">
                          <MapPin size={15} />
                          <span>
                            {selectedCity?.name || 'Tirunelveli'},{' '}
                            {selectedCity?.country || 'India'}
                          </span>
                          <span className="notification-live-badge">
                            <span />
                            LIVE
                          </span>
                        </div>

                        <div className="notification-current-weather">
                          <div>
                            <strong>
                              {convertTemperature(weather.current.temperature_2m)}
                              {unit === 'C' ? 'C' : 'F'}
                            </strong>
                            <span>
                              {getWeatherIcon(weather.current.weather_code)}{' '}
                              {getWeatherCondition(weather.current.weather_code)}
                            </span>
                          </div>
                          <div className="notification-feels-like">
                            Feels like
                            <strong>
                              {convertTemperature(weather.current.apparent_temperature)}
                              {unit === 'C' ? 'C' : 'F'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="notification-details">
                        <div className="notification-detail-item">
                          <span className="notification-detail-icon">💧</span>
                          <div>
                            <span>Next hour rain</span>
                            <strong>
                              {hourlyForecast.length
                                ? `${hourlyForecast[0].precipitation}%`
                                : 'Unavailable'}
                            </strong>
                          </div>
                        </div>

                        <div className="notification-detail-item">
                          <span className="notification-detail-icon">💨</span>
                          <div>
                            <span>Wind speed</span>
                            <strong>{weather.current.wind_speed_10m} km/h</strong>
                          </div>
                        </div>

                        <div className="notification-detail-item">
                          <span className="notification-detail-icon">🌡️</span>
                          <div>
                            <span>Humidity</span>
                            <strong>{weather.current.relative_humidity_2m}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* SKYCAST DYNAMIC WEATHER ALERTS */}
                      {(() => {
                        const alerts: { type: string; title: string; detail: string }[] = []
                        const rain = hourlyForecast[0]?.precipitation
                        const temperature = weather.current.temperature_2m
                        const wind = weather.current.wind_speed_10m

                        if (typeof rain === 'number' && rain >= 60) {
                          alerts.push({
                            type: 'rain',
                            title: 'High chance of rain',
                            detail: `${rain}% chance of rain in the next hour.`,
                          })
                        }

                        if (temperature >= 37) {
                          alerts.push({
                            type: 'heat',
                            title: 'High temperature',
                            detail: `Current temperature is ${temperature}°C.`,
                          })
                        }

                        if (wind >= 35) {
                          alerts.push({
                            type: 'wind',
                            title: 'Strong wind conditions',
                            detail: `Current wind speed is ${wind} km/h.`,
                          })
                        }

                        return (
                          <div className="notification-alerts">
                            <div className="notification-alerts-heading">
                              <h4>Weather alerts</h4>
                              <span>{alerts.length} active</span>
                            </div>
                            {alerts.length > 0 ? (
                              <div className="notification-alert-list">
                                {alerts.map((alert) => (
                                  <div className="notification-alert-item" key={alert.type}>
                                    <span className={`notification-alert-tag ${alert.type}`}>
                                      {alert.type.toUpperCase()}
                                    </span>
                                    <div>
                                      <strong>{alert.title}</strong>
                                      <p>{alert.detail}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="notification-no-alerts">
                                No active weather alerts. Conditions are within the configured thresholds.
                              </div>
                            )}
                          </div>
                        )
                      })()}
                      <div className="notification-updated">
                        Weather data updated at{' '}
                        {new Date(weather.current.time).toLocaleTimeString(
                          'en-IN',
                          { hour: '2-digit', minute: '2-digit', hour12: true },
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="notification-empty">
                      Weather information is not available yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="current-location">
              <MapPin size={16} fill="currentColor" />
              <span>{selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : "Tirunelveli, India"}</span>
              {weatherLoading && <span className="weather-fetch-status">Loading weather...</span>}
              {weatherError && <span className="weather-fetch-status">{weatherError}</span>}
              {weather && !weatherLoading && !weatherError && (
                <span className="weather-fetch-status">
                  Live: {weather.current.temperature_2m}{String.fromCharCode(176)}C
                </span>
              )}
            </div>
          </div>

          <div className="topbar-center">
            <div className="skycast-brand">
              <span className="skycast-brand-name">SKYCAST</span>
              <span className="skycast-brand-subtitle">WEATHER DASHBOARD</span>
            </div>

            <div className="live-clock" aria-label="Current local date and time">
              <span className="live-clock-time">{currentTime ? liveClockTime : '--:--:--'}</span>
              <span className="live-clock-date">{currentTime ? liveClockDate : 'Updating...'}</span>
            </div>
          </div>

          <div className="topbar-right">
            <div className="unit-toggle">
              <button
                className={unit === 'C' ? 'unit-active' : ''}
                type="button"
                onClick={() => setUnit('C')}
              >
                {String.fromCharCode(176)}C
              </button>
              <button
                className={unit === 'F' ? 'unit-active' : ''}
                type="button"
                onClick={() => setUnit('F')}
              >
                {String.fromCharCode(176)}F
              </button>
            </div>

            <div className="theme-toggle">
              <button
                className={!isNight ? 'theme-active' : ''}
                type="button"
                onClick={() => setTheme('light')}
                aria-label="Light theme"
              >
                <Sun size={21} />
              </button>
              <button
                className={isNight ? 'theme-active' : ''}
                type="button"
                onClick={() => setTheme('dark')}
                aria-label="Dark theme"
              >
                <Moon size={19} />
              </button>
            </div>

            <div className="profile-menu-wrapper">
              <button
                className="profile-avatar"
                type="button"
                aria-label="Open profile menu"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                onClick={() => {
                  setIsProfileOpen((previous) => !previous)
                  setIsMenuOpen(false)
                }}
              >
                R
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-heading">
                    <span className="profile-dropdown-title">Welcome to SKYCAST</span>
                    <span className="profile-dropdown-subtitle">Your weather companion</span>
                  </div>

                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/login')
                    }}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>

                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/signup')
                    }}
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            <button
              className="icon-button explore-search-button"
              type="button"
              aria-label="Open city search and filters"
              title="Explore weather"
              onClick={() => navigate('/explore')}
            >
              <Search size={20} />
            </button>
          </div>
        </header>

        {isMenuOpen && (
          <div
            className="skycast-menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
          >
            <aside
              className="skycast-menu-drawer"
              aria-label="SKYCAST navigation"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="skycast-menu-header">
                <div className="skycast-menu-brand">
                  <span className="skycast-menu-brand-name">SKYCAST</span>
                  <span className="skycast-menu-brand-subtitle">WEATHER DASHBOARD</span>
                </div>

                <button
                  type="button"
                  className="skycast-menu-close"
                  aria-label="Close navigation menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={21} />
                </button>
              </div>

              <div className="skycast-menu-section-label">MAIN MENU</div>

              <nav className="skycast-menu-nav">
                <button
                  type="button"
                  className={`skycast-menu-item ${activePage === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/')
                  }}
                >
                  <Home size={19} />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  className={`skycast-menu-item ${activePage === 'map' ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/map')
                  }}
                >
                  <MapPin size={19} />
                  <span>Global Map</span>
                </button>

                <button
                  type="button"
                  className={`skycast-menu-item ${activePage === 'air-quality' ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/air-quality')
                  }}
                >
                  <Cloud size={19} />
                  <span>Air Quality</span>
                </button>

                <button
                  type="button"
                  className={`skycast-menu-item ${activePage === 'rain' ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/rain')
                  }}
                >
                  <Sun size={19} />
                  <span>Chance of Rain</span>
                </button>

                <button
                  type="button"
                  className={`skycast-menu-item ${activePage === 'cities' ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/cities')
                  }}
                >
                  <Cloud size={19} />
                  <span>Other Cities</span>
                </button>
              </nav>

              <div className="skycast-menu-auth">
                <div className="skycast-menu-section-label">YOUR ACCOUNT</div>

                <button
                  type="button"
                  className="skycast-menu-item"
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/login')
                  }}
                >
                  <LogIn size={19} />
                  <span>Login</span>
                </button>

                <button
                  type="button"
                  className="skycast-menu-signup"
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/signup')
                  }}
                >
                  <UserPlus size={19} />
                  <span>Create Account</span>
                </button>
              </div>

              <div className="skycast-menu-footer">
                SKYCAST · Your weather companion
              </div>
            </aside>
          </div>
        )}

        {activePage === 'dashboard' && (
          <section className="route-page dashboard-page">
            <div className="hourly-section">
              <div className="section-title">
                <h2>Hourly Forecast</h2>
                <span>Next 24 hours</span>
              </div>

              {weatherLoading ? (
                <p className="air-quality-message">Loading hourly forecast...</p>
              ) : weatherError ? (
                <p className="air-quality-message error">{weatherError}</p>
              ) : (
                <div className="hourly-forecast-list">
                  {hourlyForecast.map((hour, index) => (
                    <article className="hourly-card" key={`${hour.time}-${index}`}>
                      <span className="hourly-time">
                        {new Date(hour.time).toLocaleTimeString('en-IN', {
                          hour: 'numeric',
                          hour12: true,
                        })}
                      </span>
                      <span className="hourly-icon" role="img" aria-label={getWeatherCondition(hour.weatherCode)}>
                        {getWeatherIcon(hour.weatherCode)}
                      </span>
                      <strong className="hourly-temperature">
                        {convertTemperature(hour.temperature)}
                      </strong>
                      <span className="hourly-rain">
                        <Cloud size={13} /> {hour.precipitation}%
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="weekly-section">
              <div className="section-title">
                <h2>7-Day Weather Forecast</h2>
                <span>{selectedCity?.name ?? 'Selected location'}</span>
              </div>

              <div className="weekly-cards">
                {forecastDays.map((day) => (
                  <article
                    className={`day-card ${day.dateIndex === 0 ? 'today-card' : ''}`}
                    key={`${day.day}-${day.dateIndex}`}
                  >
                    <div className="day-card-heading">
                      <strong>{day.day}</strong>
                      {day.dateIndex === 0 && <span>Today</span>}
                    </div>

                    <div className="day-weather-icon" role="img" aria-label={day.condition}>
                      {day.dateIndex === 0 && weather
                        ? getWeatherIcon(weather.current.weather_code)
                        : day.icon}
                    </div>

                    <strong className="day-temperature">
                      {convertTemperature(
                        day.dateIndex === 0 && weather
                          ? weather.current.temperature_2m
                          : day.temperature,
                      )}
                    </strong>

                    <span className="day-condition">{day.condition}</span>

                    {day.dateIndex === 0 && (
                      <div className="today-weather-details">
                        <span>
                          Real Feel:
                          <strong>
                            {weather ? convertTemperature(weather.current.apparent_temperature) : '--'}
                          </strong>
                        </span>
                        <span>
                          Wind:
                          <strong>{weather ? `${Math.round(weather.current.wind_speed_10m)} km/h` : '--'}</strong>
                        </span>
                        <span>
                          Humidity:
                          <strong>{weather ? `${weather.current.relative_humidity_2m}%` : '--'}</strong>
                        </span>
                        <span>
                          Sunrise:
                          <strong>{weather?.daily.sunrise[0]?.slice(11, 16) ?? '--'}</strong>
                        </span>
                        <span>
                          Sunset:
                          <strong>{weather?.daily.sunset[0]?.slice(11, 16) ?? '--'}</strong>
                        </span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activePage === 'map' && (
          <section className="route-page standalone-map-page">
            <div className="map-section">
              <div className="section-title">
                <h2>Global Map</h2>
                <span>Live weather across cities</span>
              </div>

              <WorldMap
                cities={filteredCities}
                globalWeather={globalWeather}
                unit={unit}
                selectedCity={selectedCity}
                onCitySelect={handleCitySelect}
              />
            </div>
          </section>
        )}

        {activePage === 'air-quality' && (
          <section className="route-page standalone-air-quality-page">
            <section className="air-quality-panel">
              <div className="air-quality-heading">
                <div>
                  <span className="eyebrow">LIVE AIR QUALITY</span>
                  <h2>Air Quality Index</h2>
                  <p>{selectedCity?.name ?? 'Selected location'}</p>
                </div>
                <div className="aqi-value">
                  <strong>{airQuality?.current.us_aqi ?? '--'}</strong>
                  <span>US AQI</span>
                </div>
              </div>

              {airQualityLoading ? (
                <p className="air-quality-message">Loading air quality data...</p>
              ) : airQualityError ? (
                <p className="air-quality-message error">{airQualityError}</p>
              ) : airQuality ? (
                <>
                  <div className="aqi-status">
                    <span
                      className="aqi-status-dot"
                      style={{ backgroundColor: getAqiColor(airQuality.current.us_aqi) }}
                    />
                    {getAqiLabel(airQuality.current.us_aqi)}
                  </div>

                  <div className="aqi-scale">
                    <div className="aqi-scale-heading">
                      <span>Air quality scale</span>
                      <strong>0–500</strong>
                    </div>

                    <div className="aqi-scale-track">
                      <div className="aqi-scale-gradient" />
                      <div
                        className="aqi-scale-marker"
                        style={{
                          left: `${Math.min(Math.max(airQuality.current.us_aqi, 0), 500) / 5}%`,
                          backgroundColor: getAqiColor(airQuality.current.us_aqi),
                        }}
                        role="img"
                        aria-label={`Current AQI: ${airQuality.current.us_aqi}`}
                      />
                    </div>

                    <div className="aqi-scale-labels">
                      <span>Good</span>
                      <span>Moderate</span>
                      <span>Unhealthy</span>
                      <span>Hazardous</span>
                    </div>
                  </div>

                  <div className="pollutant-chart">
                    <h3>Pollutant concentration</h3>

                    {pollutantChartData.map((item) => (
                      <div className="pollutant-chart-row" key={item.label}>
                        <div className="pollutant-chart-info">
                          <span>{item.label}</span>
                          <strong>
                            {item.value.toFixed(1)}
                            <small>{item.unit}</small>
                          </strong>
                        </div>

                        <div
                          className="pollutant-track"
                          role="progressbar"
                          aria-label={`${item.label} concentration`}
                          aria-valuenow={item.value}
                          aria-valuemin={0}
                          aria-valuemax={item.max}
                        >
                          <div
                            className="pollutant-fill"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="air-quality-updated">
                    Updated: {airQuality.current.time.replace('T', ' ')} · Data provided by Open-Meteo
                  </p>
                </>
              ) : (
                <p className="air-quality-message">
                  Air quality data is not available for this location.
                </p>
              )}
            </section>
          </section>
        )}

        {activePage === 'rain' && (
          <section className="route-page standalone-rain-page">
            <div className="rain-panel">
              <div className="section-title">
                <h2>Chance of Rain</h2>
                <span>Next 24 hours · {selectedCity?.name}</span>
              </div>

              {weatherLoading ? (
                <p className="air-quality-message">Loading precipitation forecast...</p>
              ) : weatherError ? (
                <p className="air-quality-message error">{weatherError}</p>
              ) : (
                <div className="rain-forecast-list">
                  {hourlyForecast.map((hour, index) => (
                    <article className="rain-hour-card" key={`${hour.time}-${index}`}>
                      <span className="rain-hour-time">
                        {new Date(hour.time).toLocaleTimeString('en-IN', {
                          hour: 'numeric',
                          hour12: true,
                        })}
                      </span>

                      <span className="rain-hour-icon" role="img" aria-label="Rain probability">
                        💧
                      </span>

                      <strong className="rain-hour-value">
                        {hour.precipitation}%
                      </strong>

                      <div
                        className="rain-hour-progress"
                        role="progressbar"
                        aria-valuenow={hour.precipitation}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${hour.precipitation}% chance of rain`}
                      >
                        <div
                          className="rain-hour-progress-fill"
                          style={{ width: `${hour.precipitation}%` }}
                        />
                      </div>

                      <span className="rain-hour-label">Rain chance</span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activePage === 'cities' && (
          <section className="route-page standalone-cities-page">
            <div className="cities-section">
              <div className="section-title">
                <h2>Other Cities</h2>
                <span>Live weather conditions</span>
              </div>

              <div className="city-list">
                {cities.map((city) => {
                  const cityWeather = globalWeather[city.name]
                  const cityCondition = cityWeather
                    ? getWeatherCondition(cityWeather.current.weather_code)
                    : city.condition
                  const cityIcon = cityWeather
                    ? getWeatherIcon(cityWeather.current.weather_code)
                    : city.icon
                  const cityTemperature = cityWeather
                    ? cityWeather.current.temperature_2m
                    : city.temperature

                  return (
                    <button
                      className={`city-card ${
                        selectedCity?.name === city.name ? 'selected' : ''
                      }`}
                      type="button"
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="city-information">
                        <span className="city-country">{city.country}</span>
                        <strong>{city.name}</strong>
                        <span className="city-condition">{cityCondition}</span>
                      </div>

                      <div className="city-weather">
                        <span role="img" aria-label={cityCondition}>{cityIcon}</span>
                        <strong>{convertTemperature(cityTemperature)}</strong>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        )}
        <footer className="dashboard-footer">
          <span>SkyCast Weather</span>
          <span>
            <Cloud size={14} /> Weather information dashboard
          </span>
        </footer>
      </div>
    </main>
  )
}

export default WeatherDashboard
