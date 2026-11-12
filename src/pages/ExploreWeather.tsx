import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Moon,
  Search,
  Sun,
  Wind,
} from 'lucide-react'
import type { City, WeatherResponse } from '../types/weather'
import { getWeather, searchCities } from '../services/weather'
import { countryList } from '../data/countries'
import AuthWeatherBackground from '../components/AuthWeatherBackground'
import { useTheme } from '../context/useTheme'
import './ExploreWeather.css'

interface ExploreResult {
  city: City
  weather: WeatherResponse | null
}

function getCondition(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Cloudy'
  if (code <= 48) return 'Fog'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rainy'
  if (code <= 86) return 'Snowy'
  return 'Stormy'
}

function getWeatherIcon(code: number) {
  if (code === 0) return <Sun size={30} />
  if (code <= 3) return <CloudSun size={30} />
  if (code <= 48) return <Cloud size={30} />
  if (code >= 95) return <CloudRain size={30} />
  if (code >= 51) return <CloudRain size={30} />
  return <Cloud size={30} />
}

export default function ExploreWeather() {
  const navigate = useNavigate()
  const { isNight, setTheme } = useTheme()

  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [condition, setCondition] = useState('All')
  const [temperature, setTemperature] = useState('All')
  const [results, setResults] = useState<ExploreResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) return

    let cancelled = false

    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      setHasSearched(true)

      try {
        const cities = await searchCities(query.trim(), country || undefined)

        if (!cancelled) {
          if (cities.length === 0) {
            setResults([])
          } else {
            const initialResults = cities.map((city) => ({
              city,
              weather: null,
            }))

            setResults(initialResults)
          }
        }
      } catch {
        if (!cancelled) {
          setResults([])
          setError('Unable to search cities. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, country])

  useEffect(() => {
    if (results.length === 0 || results.every((item) => item.weather !== null)) {
      return
    }

    let cancelled = false

    const loadWeather = async () => {
      const updated = await Promise.all(
        results.map(async (item) => {
          try {
            const weather = await getWeather(
              item.city.latitude,
              item.city.longitude,
            )

            return { ...item, weather }
          } catch {
            return item
          }
        }),
      )

      if (!cancelled) {
        setResults(updated)
      }
    }

    void loadWeather()

    return () => {
      cancelled = true
    }
  }, [results])

  const filteredResults = useMemo(() => {
    return results.filter(({ weather }) => {
      if (!weather) return true

      const code = weather.current.weather_code
      const degrees = weather.current.temperature_2m

      const conditionMatches =
        condition === 'All' || getCondition(code) === condition

      let temperatureMatches = true

      if (temperature === 'Cold') temperatureMatches = degrees < 15
      if (temperature === 'Mild') temperatureMatches = degrees >= 15 && degrees < 25
      if (temperature === 'Warm') temperatureMatches = degrees >= 25 && degrees < 35
      if (temperature === 'Hot') temperatureMatches = degrees >= 35

      return conditionMatches && temperatureMatches
    })
  }, [results, condition, temperature])

  const clearFilters = () => {
    setCountry('')
    setCondition('All')
    setTemperature('All')
  }

  const selectCity = (city: City) => {
    navigate('/', {
      state: { selectedCity: city },
    })
  }

  return (
    <main className={`weather-app ${isNight ? 'night-theme' : 'light-theme'}`}>
      <AuthWeatherBackground />

      <div className="explore-page">
        <header className="explore-header">
          <button
            type="button"
            className="explore-back-button"
            onClick={() => navigate('/')}
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={19} />
            <span>Dashboard</span>
          </button>

          <div className="explore-brand">
            <CloudSun size={27} />
            <span>SKYCAST</span>
          </div>

          <div className="explore-header-actions">
            <button
              type="button"
              className="explore-theme-button"
              onClick={() => setTheme(isNight ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {isNight ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>

        <section className="explore-hero">
          <span className="explore-eyebrow">DISCOVER THE WORLD</span>
          <h1>Explore Weather</h1>
          <p>Find cities, discover local conditions and explore weather around the globe.</p>

          <div className="explore-search-box">
            <Search size={22} />

            <input
              type="search"
              placeholder="Search city, country or location..."
              value={query}
              onChange={(event) => {
              const value = event.target.value
              setQuery(value)

              if (value.trim().length < 2) {
                setResults([])
                setError('')
                setHasSearched(false)
                setLoading(false)
              }
            }}
              autoComplete="off"
              aria-label="Search cities worldwide"
            />

            {loading && <span className="explore-search-status">Searching...</span>}
          </div>
        </section>

        <section className="explore-filter-section">
          <div className="explore-filter-heading">
            <div>
              <h2>Filters</h2>
              <p>Refine your weather search</p>
            </div>
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="explore-filter-grid">
            <label>
              <span>Country</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                <option value="">Worldwide</option>
                {countryList.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Weather condition</span>
              <select
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
              >
                <option value="All">All conditions</option>
                <option value="Clear">Clear</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Fog">Fog</option>
                <option value="Rainy">Rainy</option>
                <option value="Snowy">Snowy</option>
                <option value="Stormy">Stormy</option>
              </select>
            </label>

            <label>
              <span>Temperature</span>
              <select
                value={temperature}
                onChange={(event) => setTemperature(event.target.value)}
              >
                <option value="All">All temperatures</option>
                <option value="Cold">Cold · Below 15°C</option>
                <option value="Mild">Mild · 15–24°C</option>
                <option value="Warm">Warm · 25–34°C</option>
                <option value="Hot">Hot · 35°C and above</option>
              </select>
            </label>
          </div>
        </section>

        <section className="explore-results-section">
          <div className="explore-results-heading">
            <div>
              <h2>Search Results</h2>
              <p>
                {hasSearched
                  ? `${filteredResults.length} matching locations`
                  : 'Search for a city to discover its live weather'}
              </p>
            </div>
            <span className="explore-live-badge">
              <span />
              LIVE WEATHER
            </span>
          </div>

          {error && <div className="explore-message explore-error">{error}</div>}

          {!hasSearched && !loading && (
            <div className="explore-empty-state">
              <div className="explore-empty-icon">
                <Search size={35} />
              </div>
              <h3>Where would you like to explore?</h3>
              <p>Enter at least two characters to search cities around the world.</p>
            </div>
          )}

          {hasSearched && filteredResults.length === 0 && !loading && !error && (
            <div className="explore-empty-state">
              <div className="explore-empty-icon">
                <MapPin size={35} />
              </div>
              <h3>No matching locations</h3>
              <p>Try another city or change your filters.</p>
            </div>
          )}

          <div className="explore-city-grid">
            {filteredResults.map(({ city, weather }) => (
              <button
                type="button"
                className="explore-city-card"
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                onClick={() => selectCity(city)}
              >
                <div className="explore-card-top">
                  <div className="explore-card-location">
                    <MapPin size={16} />
                    <span>{city.country}</span>
                  </div>
                  <span className="explore-card-arrow">↗</span>
                </div>

                <div className="explore-city-name">{city.name}</div>
                {city.admin1 && <div className="explore-city-region">{city.admin1}</div>}

                <div className="explore-card-weather">
                  <div className="explore-weather-icon">
                    {weather
                      ? getWeatherIcon(weather.current.weather_code)
                      : <CloudSun size={30} />}
                  </div>

                  <div className="explore-temperature">
                    {weather
                      ? `${Math.round(weather.current.temperature_2m)}°`
                      : '--°'}
                    <small>
                      {weather
                        ? getCondition(weather.current.weather_code)
                        : 'Loading weather...'}
                    </small>
                  </div>
                </div>

                {weather && (
                  <div className="explore-card-details">
                    <span>
                      <Droplets size={15} />
                      {weather.current.relative_humidity_2m}%
                    </span>
                    <span>
                      <Wind size={15} />
                      {Math.round(weather.current.wind_speed_10m)} km/h
                    </span>
                  </div>
                )}

                <div className="explore-card-footer">
                  View weather dashboard
                  <ArrowLeft size={15} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <footer className="explore-footer">
          Weather data provided by Open-Meteo.
        </footer>
      </div>
    </main>
  )
}