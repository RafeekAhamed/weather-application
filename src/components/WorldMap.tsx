import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import type { City, WeatherResponse } from '../types/weather'
import { useTheme } from '../context/useTheme'

interface WorldMapProps {
  cities: City[]
  globalWeather: Record<string, WeatherResponse>
  unit: 'C' | 'F'
  selectedCity: City | null
  onCitySelect: (city: City) => void
}

function formatTemperature(value: number, unit: 'C' | 'F'): string {
  const converted = unit === 'C' ? value : (value * 9) / 5 + 32
  return `${Math.round(converted)}°${unit}`
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '🌤️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌦️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '🌨️'
  if (code >= 95) return '⛈️'
  return '🌤️'
}

function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const fitWorld = () => {
      map.invalidateSize()

      map.fitBounds(
        [[-55, -180], [75, 180]],
        {
          padding: [16, 16],
          maxZoom: 2,
          animate: false,
        },
      )
    }

    const timer = window.setTimeout(fitWorld, 300)

    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })

    observer.observe(map.getContainer())

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [map])

  return null
}

function MapControls() {
  const map = useMap()

  return (
    <div className="interactive-map-controls">
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
      >
        +
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
      >
        −
      </button>
      <button
        type="button"
        aria-label="Reset world map"
        onClick={() => map.setView([20, 10], 1)}
      >
        ↺
      </button>
    </div>
  )
}

export default function WorldMap({
  cities,
  globalWeather,
  unit,
  selectedCity,
  onCitySelect,
}: WorldMapProps) {
  const { isNight } = useTheme()
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY?.trim() ?? ''
  const mapStyle = isNight ? 'dark_all' : 'voyager'
  const tileUrl = `https://basemaps.cartocdn.com/rastertiles/${mapStyle}/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(cartoApiKey)}`

  return (
    <div className="interactive-world-map">
      <MapContainer
        center={[20, 10]}
        zoom={1}
        minZoom={1}
        maxZoom={12}
        scrollWheelZoom
        worldCopyJump
        zoomControl={false}
        className="leaflet-world-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attribution/">CARTO</a>'
          url={tileUrl}
          maxZoom={20}
        />

        <MapResizeHandler />
        <MapControls />

        {cities.map((city) => {
          const currentWeather = globalWeather[city.name]?.current
          const temperature = currentWeather?.temperature_2m
          const weatherCode = currentWeather?.weather_code ?? 0
          const isSelected = selectedCity?.id === city.id

          return (
            <CircleMarker
              key={`${city.id}-${city.name}`}
              center={[city.latitude, city.longitude]}
              radius={isSelected ? 11 : 8}
              pathOptions={{
                color: isSelected ? '#ffffff' : '#91e5d0',
                weight: isSelected ? 3 : 2,
                fillColor: isSelected ? '#16a085' : '#40c9a2',
                fillOpacity: 0.95,
              }}
              eventHandlers={{
                click: () => onCitySelect(city),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{city.name}, {city.country}</strong>
                  <span className="map-popup-weather">
                    {getWeatherEmoji(weatherCode)}
                    {' '}
                    {temperature !== undefined
                      ? formatTemperature(temperature, unit)
                      : 'Loading...'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCitySelect(city)}
                  >
                    View weather
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="map-live-legend">
        <span className="map-live-dot" />
        Live weather locations
      </div>
    </div>
  )
}
