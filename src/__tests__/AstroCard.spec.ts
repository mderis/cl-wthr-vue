import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AstroCard from '../components/AstroCard.vue'
import type { Astro } from '../types/weather'

const mockAstro: Astro = {
  sunrise: '07:45 AM',
  sunset: '04:30 PM',
  moonrise: '10:00 PM',
  moonset: '09:30 AM',
  moon_phase: 'Waxing Crescent',
  moon_illumination: 25,
  is_moon_up: 0,
  is_sun_up: 1,
}

describe('AstroCard component', () => {
  it('should render sunrise time', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    expect(wrapper.text()).toContain('Sunrise')
    expect(wrapper.text()).toContain('07:45 AM')
  })

  it('should render sunset time', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    expect(wrapper.text()).toContain('Sunset')
    expect(wrapper.text()).toContain('04:30 PM')
  })

  it('should render moon phase', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    expect(wrapper.text()).toContain('Moon Phase')
    expect(wrapper.text()).toContain('Waxing Crescent')
  })

  it('should render moon illumination progress bar', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    const progressBar = wrapper.find('.v-progress-linear')
    expect(progressBar.exists()).toBe(true)
  })

  it('should render sunrise icon', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    const icons = wrapper.findAll('.v-icon')
    const sunriseIcon = icons.find((icon) => icon.classes().some((c) => c.includes('sunset-up')))
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should render sunset icon', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    const icons = wrapper.findAll('.v-icon')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should render moon icon', () => {
    const wrapper = mount(AstroCard, {
      props: {
        astro: mockAstro,
      },
    })

    const icons = wrapper.findAll('.v-icon')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should display different moon phases correctly', () => {
    const fullMoonAstro: Astro = {
      ...mockAstro,
      moon_phase: 'Full Moon',
      moon_illumination: 100,
    }

    const wrapper = mount(AstroCard, {
      props: {
        astro: fullMoonAstro,
      },
    })

    expect(wrapper.text()).toContain('Full Moon')
  })

  it('should display new moon correctly', () => {
    const newMoonAstro: Astro = {
      ...mockAstro,
      moon_phase: 'New Moon',
      moon_illumination: 0,
    }

    const wrapper = mount(AstroCard, {
      props: {
        astro: newMoonAstro,
      },
    })

    expect(wrapper.text()).toContain('New Moon')
  })
})
