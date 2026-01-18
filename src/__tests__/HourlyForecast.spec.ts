import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HourlyForecast from '../components/HourlyForecast.vue'
import type { HourForecast } from '../types/weather'

// Mock current date
const mockDate = new Date('2024-01-15T14:00:00')
vi.setSystemTime(mockDate)

const generateHourlyData = (): HourForecast[] => {
  const hours: HourForecast[] = []
  for (let i = 12; i < 24; i++) {
    hours.push({
      time_epoch: 1705320000 + i * 3600,
      time: `2024-01-15 ${i.toString().padStart(2, '0')}:00`,
      temp_c: 10 + Math.floor(Math.random() * 5),
      temp_f: 50 + Math.floor(Math.random() * 10),
      is_day: i >= 7 && i <= 17 ? 1 : 0,
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
      humidity: 70,
      cloud: 50,
      feelslike_c: 8,
      feelslike_f: 46,
      windchill_c: 7,
      windchill_f: 45,
      heatindex_c: 10,
      heatindex_f: 50,
      dewpoint_c: 5,
      dewpoint_f: 41,
      will_it_rain: 0,
      chance_of_rain: i === 16 ? 40 : 0,
      will_it_snow: 0,
      chance_of_snow: 0,
      vis_km: 10,
      vis_miles: 6,
      gust_mph: 15,
      gust_kph: 24,
      uv: 2,
    })
  }
  return hours
}

describe('HourlyForecast component', () => {
  beforeEach(() => {
    vi.setSystemTime(mockDate)
  })

  it('should render hourly forecast title', () => {
    const wrapper = mount(HourlyForecast, {
      props: {
        hours: generateHourlyData(),
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('Hourly Forecast')
  })

  it('should display hours in the forecast', () => {
    const wrapper = mount(HourlyForecast, {
      props: {
        hours: generateHourlyData(),
        unitSystem: 'metric',
      },
    })

    const hourItems = wrapper.findAll('.hour-item')
    expect(hourItems.length).toBeGreaterThan(0)
  })

  it('should display temperature in Celsius for metric', () => {
    const hours = generateHourlyData()
    const wrapper = mount(HourlyForecast, {
      props: {
        hours,
        unitSystem: 'metric',
      },
    })

    expect(wrapper.text()).toContain('°C')
  })

  it('should display temperature in Fahrenheit for imperial', () => {
    const hours = generateHourlyData()
    const wrapper = mount(HourlyForecast, {
      props: {
        hours,
        unitSystem: 'imperial',
      },
    })

    expect(wrapper.text()).toContain('°F')
  })

  it('should display weather icons for each hour', () => {
    const wrapper = mount(HourlyForecast, {
      props: {
        hours: generateHourlyData(),
        unitSystem: 'metric',
      },
    })

    const icons = wrapper.findAll('.hour-icon')
    expect(icons.length).toBeGreaterThan(0)
    icons.forEach((icon) => {
      expect(icon.attributes('src')).toContain('weatherapi.com')
    })
  })

  it('should display rain chance when greater than 0', () => {
    const hours = generateHourlyData()
    const wrapper = mount(HourlyForecast, {
      props: {
        hours,
        unitSystem: 'metric',
      },
    })

    // One hour has 40% rain chance
    expect(wrapper.text()).toContain('40%')
  })

  it('should filter out past hours', () => {
    const hours = generateHourlyData()
    const wrapper = mount(HourlyForecast, {
      props: {
        hours,
        unitSystem: 'metric',
      },
    })

    // Should only show hours from now onwards
    const hourItems = wrapper.findAll('.hour-item')
    expect(hourItems.length).toBeLessThanOrEqual(12)
  })

  it('should mark current hour with special styling', () => {
    const hours = generateHourlyData()
    const wrapper = mount(HourlyForecast, {
      props: {
        hours,
        unitSystem: 'metric',
      },
    })

    const nowItem = wrapper.find('.hour-item--now')
    expect(nowItem.exists()).toBe(true)
    expect(nowItem.text()).toContain('Now')
  })

  it('should be scrollable horizontally', () => {
    const wrapper = mount(HourlyForecast, {
      props: {
        hours: generateHourlyData(),
        unitSystem: 'metric',
      },
    })

    const scrollContainer = wrapper.find('.hourly-scroll')
    expect(scrollContainer.exists()).toBe(true)
  })
})
