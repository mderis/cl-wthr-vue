import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrentWeather from '../components/CurrentWeather.vue'
import type { WeatherResponse } from '../types/weather'

// Mock useWeather
vi.mock('../composables/useWeather', () => ({
  useWeather: () => ({
    getAirQualityLevel: (index: number) => {
      if (index <= 1) return 'good'
      if (index <= 2) return 'moderate'
      if (index <= 3) return 'unhealthySensitive'
      if (index <= 4) return 'unhealthy'
      if (index <= 5) return 'veryUnhealthy'
      return 'hazardous'
    },
    getAirQualityColor: (index: number) => {
      if (index <= 1) return 'success'
      if (index <= 2) return 'warning'
      return 'error'
    },
  }),
}))

const mockWeatherData: WeatherResponse = {
  location: {
    name: 'London',
    region: 'City of London',
    country: 'United Kingdom',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1705325400,
    localtime: '2024-01-15 14:30',
  },
  current: {
    temp_c: 12,
    temp_f: 54,
    is_day: 1,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003,
    },
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
    air_quality: {
      co: 200,
      no2: 10,
      o3: 50,
      so2: 5,
      pm2_5: 8,
      pm10: 12,
      'us-epa-index': 1,
      'gb-defra-index': 1,
    },
  },
}

describe('CurrentWeather component', () => {
  it('should render city name', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('London')
  })

  it('should display temperature in Celsius for metric system', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('°C')
  })

  it('should display temperature in Fahrenheit for imperial system', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'imperial',
      },
    })

    expect(wrapper.text()).toContain('54')
    expect(wrapper.text()).toContain('°F')
  })

  it('should display weather condition', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Partly cloudy')
  })

  it('should display humidity', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('72%')
  })

  it('should display wind speed in km/h for metric', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('16')
    expect(wrapper.text()).toContain('km/h')
  })

  it('should display wind speed in mph for imperial', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'imperial',
      },
    })

    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('mph')
  })

  it('should display feels like temperature', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Feels like')
    expect(wrapper.text()).toContain('10')
  })

  it('should display UV index', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('UV Index')
    expect(wrapper.text()).toContain('3')
  })

  it('should display pressure', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('1015')
    expect(wrapper.text()).toContain('hPa')
  })

  it('should display air quality when available', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Air Quality')
    expect(wrapper.text()).toContain('Good')
  })

  it('should render weather icon', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        unitSystem: 'metric',
      },
    })

    const img = wrapper.find('.weather-icon')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('weatherapi.com')
  })
})
