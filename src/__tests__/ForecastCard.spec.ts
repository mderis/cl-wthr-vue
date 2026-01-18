import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ForecastCard from '../components/ForecastCard.vue'
import type { ForecastDay } from '../types/weather'

const mockForecast: ForecastDay[] = [
  {
    date: '2024-01-15',
    date_epoch: 1705276800,
    day: {
      maxtemp_c: 15,
      maxtemp_f: 59,
      mintemp_c: 8,
      mintemp_f: 46,
      avgtemp_c: 11,
      avgtemp_f: 52,
      maxwind_mph: 12,
      maxwind_kph: 19,
      totalprecip_mm: 0,
      totalprecip_in: 0,
      totalsnow_cm: 0,
      avgvis_km: 10,
      avgvis_miles: 6,
      avghumidity: 70,
      daily_will_it_rain: 0,
      daily_chance_of_rain: 10,
      daily_will_it_snow: 0,
      daily_chance_of_snow: 0,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        code: 1000,
      },
      uv: 3,
    },
    astro: {
      sunrise: '07:45 AM',
      sunset: '04:30 PM',
      moonrise: '10:00 PM',
      moonset: '09:30 AM',
      moon_phase: 'Waxing Crescent',
      moon_illumination: 25,
      is_moon_up: 0,
      is_sun_up: 1,
    },
    hour: [],
  },
  {
    date: '2024-01-16',
    date_epoch: 1705363200,
    day: {
      maxtemp_c: 12,
      maxtemp_f: 54,
      mintemp_c: 6,
      mintemp_f: 43,
      avgtemp_c: 9,
      avgtemp_f: 48,
      maxwind_mph: 15,
      maxwind_kph: 24,
      totalprecip_mm: 2,
      totalprecip_in: 0.08,
      totalsnow_cm: 0,
      avgvis_km: 8,
      avgvis_miles: 5,
      avghumidity: 80,
      daily_will_it_rain: 1,
      daily_chance_of_rain: 70,
      daily_will_it_snow: 0,
      daily_chance_of_snow: 0,
      condition: {
        text: 'Light rain',
        icon: '//cdn.weatherapi.com/weather/64x64/day/296.png',
        code: 1183,
      },
      uv: 2,
    },
    astro: {
      sunrise: '07:44 AM',
      sunset: '04:31 PM',
      moonrise: '11:00 PM',
      moonset: '10:00 AM',
      moon_phase: 'Waxing Crescent',
      moon_illumination: 35,
      is_moon_up: 0,
      is_sun_up: 1,
    },
    hour: [],
  },
  {
    date: '2024-01-17',
    date_epoch: 1705449600,
    day: {
      maxtemp_c: 10,
      maxtemp_f: 50,
      mintemp_c: 4,
      mintemp_f: 39,
      avgtemp_c: 7,
      avgtemp_f: 45,
      maxwind_mph: 8,
      maxwind_kph: 13,
      totalprecip_mm: 0,
      totalprecip_in: 0,
      totalsnow_cm: 0,
      avgvis_km: 10,
      avgvis_miles: 6,
      avghumidity: 65,
      daily_will_it_rain: 0,
      daily_chance_of_rain: 5,
      daily_will_it_snow: 0,
      daily_chance_of_snow: 0,
      condition: {
        text: 'Cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/119.png',
        code: 1006,
      },
      uv: 2,
    },
    astro: {
      sunrise: '07:43 AM',
      sunset: '04:33 PM',
      moonrise: '12:00 AM',
      moonset: '10:30 AM',
      moon_phase: 'First Quarter',
      moon_illumination: 50,
      is_moon_up: 0,
      is_sun_up: 1,
    },
    hour: [],
  },
]

describe('ForecastCard component', () => {
  it('should render forecast title', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('5-Day Forecast')
  })

  it('should render all forecast days', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    const forecastItems = wrapper.findAll('.forecast-item')
    expect(forecastItems.length).toBe(mockForecast.length)
  })

  it('should display "Today" for the first forecast day', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Today')
  })

  it('should display "Tomorrow" for the second forecast day', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Tomorrow')
  })

  it('should display temperatures in Celsius for metric', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('15°C')
    expect(wrapper.text()).toContain('8°C')
  })

  it('should display temperatures in Fahrenheit for imperial', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'imperial',
      },
    })

    expect(wrapper.text()).toContain('59°F')
    expect(wrapper.text()).toContain('46°F')
  })

  it('should display rain chance when greater than 0', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    // Second day has 70% rain chance
    expect(wrapper.text()).toContain('70%')
  })

  it('should display weather icons', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    const icons = wrapper.findAll('.forecast-icon')
    expect(icons.length).toBe(mockForecast.length)
    expect(icons[0].attributes('src')).toContain('weatherapi.com')
  })

  it('should display weather condition text on larger screens', () => {
    const wrapper = mount(ForecastCard, {
      props: {
        forecast: mockForecast,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Sunny')
    expect(wrapper.text()).toContain('Light rain')
    expect(wrapper.text()).toContain('Cloudy')
  })
})
