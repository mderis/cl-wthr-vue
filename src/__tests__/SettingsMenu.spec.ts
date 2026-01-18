import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SettingsMenu from '../components/SettingsMenu.vue'

// Mock useSettings
const mockSetTheme = vi.fn()
const mockSetLanguage = vi.fn()

vi.mock('../composables/useSettings', () => ({
  useSettings: () => ({
    theme: { value: 'light' },
    language: { value: 'en' },
    languageOptions: [
      { value: 'en', label: 'English', flag: '🇺🇸' },
      { value: 'ar', label: 'العربية', flag: '🇸🇦' },
      { value: 'fa', label: 'فارسی', flag: '🇮🇷' },
    ],
    setTheme: mockSetTheme,
    setLanguage: mockSetLanguage,
  }),
}))

describe('SettingsMenu component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render settings button', () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    const button = wrapper.find('.v-btn')
    expect(button.exists()).toBe(true)
  })

  it('should emit unit system change', async () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    // Call the handler directly to test the emit
    wrapper.vm.handleUnitChange('imperial')
    await nextTick()

    expect(wrapper.emitted('update:unitSystem')).toBeTruthy()
    expect(wrapper.emitted('update:unitSystem')![0]).toEqual(['imperial'])
  })

  it('should call setTheme when theme is changed', async () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    wrapper.vm.handleThemeChange('dark')
    await nextTick()

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should call setLanguage when language is changed', async () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    wrapper.vm.handleLanguageChange('ar')
    await nextTick()

    expect(mockSetLanguage).toHaveBeenCalledWith('ar')
  })

  it('should save unit system to localStorage', () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    wrapper.vm.handleUnitChange('imperial')

    expect(localStorage.setItem).toHaveBeenCalledWith('unitSystem', 'imperial')
  })

  it('should handle metric unit selection', async () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'imperial',
      },
    })

    wrapper.vm.handleUnitChange('metric')
    await nextTick()

    expect(wrapper.emitted('update:unitSystem')![0]).toEqual(['metric'])
    expect(localStorage.setItem).toHaveBeenCalledWith('unitSystem', 'metric')
  })

  it('should handle light theme selection', async () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    wrapper.vm.handleThemeChange('light')
    await nextTick()

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should handle Persian language selection', async () => {
    const wrapper = mount(SettingsMenu, {
      props: {
        unitSystem: 'metric',
      },
    })

    wrapper.vm.handleLanguageChange('fa')
    await nextTick()

    expect(mockSetLanguage).toHaveBeenCalledWith('fa')
  })
})
