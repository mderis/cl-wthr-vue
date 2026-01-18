import { ref, watch, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

export type ThemeMode = 'light' | 'dark'
export type Language = 'en' | 'ar' | 'fa'

export function useSettings() {
  const vuetifyTheme = useTheme()
  const { locale } = useI18n()

  const theme = ref<ThemeMode>(
    (localStorage.getItem('theme') as ThemeMode) || 'light'
  )

  const language = ref<Language>(
    (localStorage.getItem('locale') as Language) || 'en'
  )

  const isRtl = computed(() => {
    return language.value === 'ar' || language.value === 'fa'
  })

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'fa', label: 'فارسی', flag: '🇮🇷' },
  ]

  const setTheme = (newTheme: ThemeMode): void => {
    theme.value = newTheme
    vuetifyTheme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = (): void => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const setLanguage = (newLanguage: Language): void => {
    language.value = newLanguage
    locale.value = newLanguage
    localStorage.setItem('locale', newLanguage)
    document.documentElement.dir = isRtl.value ? 'rtl' : 'ltr'
    document.documentElement.lang = newLanguage
  }

  // Initialize on mount
  const initSettings = (): void => {
    vuetifyTheme.global.name.value = theme.value
    locale.value = language.value
    document.documentElement.dir = isRtl.value ? 'rtl' : 'ltr'
    document.documentElement.lang = language.value
  }

  watch(language, () => {
    document.documentElement.dir = isRtl.value ? 'rtl' : 'ltr'
    document.documentElement.lang = language.value
  })

  return {
    theme,
    language,
    isRtl,
    languageOptions,
    setTheme,
    toggleTheme,
    setLanguage,
    initSettings,
  }
}
