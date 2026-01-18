import { ref, computed } from 'vue'
import axios from 'axios'
import type { City, WeatherResponse, UnitSystem } from '../types/weather'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo'
const BASE_URL = 'https://api.weatherapi.com/v1'

// Shared state (singleton pattern)
const weather = ref<WeatherResponse | null>(null)
const cities = ref<City[]>([])
const loading = ref(false)
const searchLoading = ref(false)
const error = ref<string | null>(null)
const unitSystem = ref<UnitSystem>(
  (typeof localStorage !== 'undefined' && localStorage.getItem('unitSystem') as UnitSystem) || 'metric'
)

export function useWeather() {
  const temperature = computed(() => {
    if (!weather.value) return null
    return unitSystem.value === 'metric'
      ? Math.round(weather.value.current.temp_c)
      : Math.round(weather.value.current.temp_f)
  })

  const feelsLike = computed(() => {
    if (!weather.value) return null
    return unitSystem.value === 'metric'
      ? Math.round(weather.value.current.feelslike_c)
      : Math.round(weather.value.current.feelslike_f)
  })

  const windSpeed = computed(() => {
    if (!weather.value) return null
    return unitSystem.value === 'metric'
      ? Math.round(weather.value.current.wind_kph)
      : Math.round(weather.value.current.wind_mph)
  })

  const visibility = computed(() => {
    if (!weather.value) return null
    return unitSystem.value === 'metric'
      ? Math.round(weather.value.current.vis_km)
      : Math.round(weather.value.current.vis_miles)
  })

  const searchCities = async (query: string): Promise<City[]> => {
    if (!query || query.length < 2) {
      cities.value = []
      return []
    }

    searchLoading.value = true
    try {
      const response = await axios.get<City[]>(`${BASE_URL}/search.json`, {
        params: {
          key: API_KEY,
          q: query,
        },
      })
      cities.value = response.data
      return response.data
    } catch (err) {
      console.error('Failed to search cities:', err)
      cities.value = []
      return []
    } finally {
      searchLoading.value = false
    }
  }

  const fetchWeather = async (city: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get<WeatherResponse>(
        `${BASE_URL}/forecast.json`,
        {
          params: {
            key: API_KEY,
            q: city,
            days: 5,
            aqi: 'yes',
            alerts: 'no',
          },
        }
      )
      weather.value = response.data
    } catch (err: unknown) {
      console.error('Failed to fetch weather:', err)
      const axiosError = err as { response?: { status: number } }
      if (axiosError.response?.status === 400) {
        error.value = 'cityNotFound'
      } else if (axiosError.response?.status === 401) {
        error.value = 'invalidApiKey'
      } else {
        error.value = 'fetchFailed'
      }
      weather.value = null
    } finally {
      loading.value = false
    }
  }

  const setUnitSystem = (system: UnitSystem): void => {
    unitSystem.value = system
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('unitSystem', system)
    }
  }

  const getAirQualityLevel = (index: number): string => {
    if (index <= 1) return 'good'
    if (index <= 2) return 'moderate'
    if (index <= 3) return 'unhealthySensitive'
    if (index <= 4) return 'unhealthy'
    if (index <= 5) return 'veryUnhealthy'
    return 'hazardous'
  }

  const getAirQualityColor = (index: number): string => {
    if (index <= 1) return 'success'
    if (index <= 2) return 'warning'
    if (index <= 3) return 'orange'
    if (index <= 4) return 'error'
    if (index <= 5) return 'deep-purple'
    return 'brown'
  }

  return {
    weather,
    cities,
    loading,
    searchLoading,
    error,
    unitSystem,
    temperature,
    feelsLike,
    windSpeed,
    visibility,
    searchCities,
    fetchWeather,
    setUnitSystem,
    getAirQualityLevel,
    getAirQualityColor,
  }
}
