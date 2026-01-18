import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSettings } from '../composables/useSettings'

// Mock Vuetify's useTheme
vi.mock('vuetify', () => ({
  useTheme: () => ({
    global: {
      name: { value: 'light' },
    },
  }),
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'en' },
  }),
}))

describe('useSettings composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document properties
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
  })

  describe('language options', () => {
    it('should have correct language options', () => {
      const { languageOptions } = useSettings()

      expect(languageOptions).toHaveLength(3)
      expect(languageOptions.map((l) => l.value)).toEqual(['en', 'ar', 'fa'])
    })
  })

  describe('RTL detection', () => {
    it('should detect RTL for Arabic', () => {
      const { language, isRtl } = useSettings()

      // Force Arabic
      language.value = 'ar'

      expect(isRtl.value).toBe(true)
    })

    it('should detect RTL for Farsi', () => {
      const { language, isRtl } = useSettings()

      language.value = 'fa'

      expect(isRtl.value).toBe(true)
    })

    it('should not be RTL for English', () => {
      const { language, isRtl } = useSettings()

      language.value = 'en'

      expect(isRtl.value).toBe(false)
    })
  })

  describe('theme management', () => {
    it('should default to light theme', () => {
      const { theme } = useSettings()
      expect(theme.value).toBe('light')
    })

    it('should toggle theme', () => {
      const { theme, toggleTheme } = useSettings()

      expect(theme.value).toBe('light')
      toggleTheme()
      expect(theme.value).toBe('dark')
      toggleTheme()
      expect(theme.value).toBe('light')
    })
  })
})
