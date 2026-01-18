import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
})

// Mock visualViewport for Vuetify overlays
Object.defineProperty(global, 'visualViewport', {
  value: {
    width: 1024,
    height: 768,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
})

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
})

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      app: {
        title: 'Weather App',
        subtitle: 'Get real-time weather information',
      },
      search: {
        placeholder: 'Search for a city...',
        noResults: 'No cities found',
        loading: 'Searching...',
      },
      weather: {
        feelsLike: 'Feels like',
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        visibility: 'Visibility',
        uvIndex: 'UV Index',
        cloudCover: 'Cloud Cover',
        precipitation: 'Precipitation',
        lastUpdated: 'Last updated',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        moonPhase: 'Moon Phase',
        airQuality: 'Air Quality',
        forecast: '5-Day Forecast',
        hourlyForecast: 'Hourly Forecast',
        high: 'High',
        low: 'Low',
        chanceOfRain: 'Chance of rain',
      },
      units: {
        celsius: '°C',
        fahrenheit: '°F',
        kmh: 'km/h',
        mph: 'mph',
        hPa: 'hPa',
        km: 'km',
        mm: 'mm',
        percent: '%',
      },
      airQuality: {
        good: 'Good',
        moderate: 'Moderate',
        unhealthySensitive: 'Unhealthy for Sensitive Groups',
        unhealthy: 'Unhealthy',
        veryUnhealthy: 'Very Unhealthy',
        hazardous: 'Hazardous',
      },
      errors: {
        fetchFailed: 'Failed to fetch weather data',
        cityNotFound: 'City not found',
        networkError: 'Network error. Please check your connection.',
      },
      settings: {
        language: 'Language',
        theme: 'Theme',
        units: 'Units',
        light: 'Light',
        dark: 'Dark',
        metric: 'Metric',
        imperial: 'Imperial',
      },
      days: {
        sunday: 'Sunday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        today: 'Today',
        tomorrow: 'Tomorrow',
      },
    },
  },
})

// Configure Vue Test Utils
config.global.plugins = [vuetify, i18n]
config.global.stubs = {}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

// Mock scrollTo
Element.prototype.scrollTo = vi.fn()
window.scrollTo = vi.fn()
