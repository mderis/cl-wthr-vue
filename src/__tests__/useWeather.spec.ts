import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWeather } from '../composables/useWeather'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('useWeather composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchCities', () => {
    it('should return empty array for short queries', async () => {
      const { searchCities, cities } = useWeather()

      const result = await searchCities('a')

      expect(result).toEqual([])
      expect(cities.value).toEqual([])
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })

    it('should search cities with valid query', async () => {
      const mockCities = [
        { id: 1, name: 'London', region: 'City of London', country: 'UK', lat: 51.52, lon: -0.11, url: 'london' },
        { id: 2, name: 'Londonderry', region: 'Northern Ireland', country: 'UK', lat: 55.0, lon: -7.32, url: 'londonderry' },
      ]

      mockedAxios.get.mockResolvedValueOnce({ data: mockCities })

      const { searchCities, cities, searchLoading } = useWeather()

      const resultPromise = searchCities('London')
      expect(searchLoading.value).toBe(true)

      const result = await resultPromise

      expect(result).toEqual(mockCities)
      expect(cities.value).toEqual(mockCities)
      expect(searchLoading.value).toBe(false)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/search.json'),
        expect.objectContaining({
          params: expect.objectContaining({ q: 'London' }),
        })
      )
    })

    it('should handle search errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))

      const { searchCities, cities } = useWeather()

      const result = await searchCities('London')

      expect(result).toEqual([])
      expect(cities.value).toEqual([])
    })
  })

  describe('fetchWeather', () => {
    it('should fetch weather data successfully', async () => {
      const mockWeather = {
        location: {
          name: 'London',
          region: 'City of London',
          country: 'UK',
          lat: 51.52,
          lon: -0.11,
          tz_id: 'Europe/London',
          localtime_epoch: 1234567890,
          localtime: '2024-01-15 14:30',
        },
        current: {
          temp_c: 12,
          temp_f: 54,
          is_day: 1,
          condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png', code: 1003 },
          wind_mph: 10,
          wind_kph: 16,
          wind_degree: 220,
          wind_dir: 'SW',
          pressure_mb: 1015,
          pressure_in: 30,
          precip_mm: 0,
          precip_in: 0,
          humidity: 72,
          cloud: 50,
          feelslike_c: 10,
          feelslike_f: 50,
          vis_km: 10,
          vis_miles: 6,
          uv: 3,
          gust_mph: 15,
          gust_kph: 24,
        },
        forecast: {
          forecastday: [],
        },
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockWeather })

      const { fetchWeather, weather, loading, error } = useWeather()

      const fetchPromise = fetchWeather('London')
      expect(loading.value).toBe(true)

      await fetchPromise

      expect(weather.value).toEqual(mockWeather)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('should handle city not found error', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 400 },
      })

      const { fetchWeather, weather, error } = useWeather()

      await fetchWeather('InvalidCity123')

      expect(weather.value).toBeNull()
      expect(error.value).toBe('cityNotFound')
    })

    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))

      const { fetchWeather, weather, error } = useWeather()

      await fetchWeather('London')

      expect(weather.value).toBeNull()
      expect(error.value).toBe('fetchFailed')
    })
  })

  describe('unit system', () => {
    it('should default to metric', () => {
      const { unitSystem } = useWeather()
      expect(unitSystem.value).toBe('metric')
    })

    it('should update unit system', () => {
      const { unitSystem, setUnitSystem } = useWeather()

      setUnitSystem('imperial')

      expect(unitSystem.value).toBe('imperial')
    })
  })

  describe('air quality helpers', () => {
    it('should return correct air quality level', () => {
      const { getAirQualityLevel } = useWeather()

      expect(getAirQualityLevel(1)).toBe('good')
      expect(getAirQualityLevel(2)).toBe('moderate')
      expect(getAirQualityLevel(3)).toBe('unhealthySensitive')
      expect(getAirQualityLevel(4)).toBe('unhealthy')
      expect(getAirQualityLevel(5)).toBe('veryUnhealthy')
      expect(getAirQualityLevel(6)).toBe('hazardous')
    })

    it('should return correct air quality color', () => {
      const { getAirQualityColor } = useWeather()

      expect(getAirQualityColor(1)).toBe('success')
      expect(getAirQualityColor(2)).toBe('warning')
      expect(getAirQualityColor(3)).toBe('orange')
      expect(getAirQualityColor(4)).toBe('error')
      expect(getAirQualityColor(5)).toBe('deep-purple')
      expect(getAirQualityColor(6)).toBe('brown')
    })
  })
})
