<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CitySearch from './components/CitySearch.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import ForecastCard from './components/ForecastCard.vue'
import HourlyForecast from './components/HourlyForecast.vue'
import AstroCard from './components/AstroCard.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import { useWeather } from './composables/useWeather'
import { useSettings } from './composables/useSettings'
import type { City, UnitSystem } from './types/weather'

const { t } = useI18n()
const { weather, loading, error, fetchWeather, setUnitSystem } = useWeather()
const { initSettings, isRtl } = useSettings()

const localUnitSystem = ref<UnitSystem>(
  (localStorage.getItem('unitSystem') as UnitSystem) || 'metric'
)

const handleCitySelect = async (city: City) => {
  await fetchWeather(`${city.lat},${city.lon}`)
}

const handleUnitChange = (system: UnitSystem) => {
  localUnitSystem.value = system
  setUnitSystem(system)
}

const todayForecast = computed(() => {
  return weather.value?.forecast?.forecastday[0] || null
})

const hourlyData = computed(() => {
  if (!weather.value?.forecast?.forecastday) return []
  // Combine today's and tomorrow's hours for continuous hourly forecast
  const today = weather.value.forecast.forecastday[0]?.hour || []
  const tomorrow = weather.value.forecast.forecastday[1]?.hour || []
  return [...today, ...tomorrow]
})

onMounted(() => {
  initSettings()
})
</script>

<template>
  <v-app :class="{ 'rtl-layout': isRtl }">
    <v-app-bar elevation="0" color="transparent">
      <v-app-bar-title class="d-flex align-center">
        <v-icon icon="mdi-weather-partly-cloudy" color="primary" size="28" class="me-2" />
        <span class="app-title">{{ t('app.title') }}</span>
      </v-app-bar-title>

      <template #append>
        <SettingsMenu
          :unit-system="localUnitSystem"
          @update:unit-system="handleUnitChange"
        />
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="main-container" fluid>
        <div class="search-section">
          <h2 class="search-subtitle text-medium-emphasis mb-4">
            {{ t('app.subtitle') }}
          </h2>
          <CitySearch @select="handleCitySelect" />
        </div>

        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="64"
          class="loading-spinner"
        />

        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="my-4"
          max-width="500"
        >
          {{ t(`errors.${error}`) }}
        </v-alert>

        <div v-else-if="weather" class="weather-content">
          <CurrentWeather
            :weather="weather"
            :unit-system="localUnitSystem"
            class="mb-4"
          />

          <v-row>
            <v-col cols="12" lg="8">
              <HourlyForecast
                v-if="hourlyData.length"
                :hours="hourlyData"
                :unit-system="localUnitSystem"
                class="mb-4"
              />

              <ForecastCard
                v-if="weather.forecast?.forecastday"
                :forecast="weather.forecast.forecastday"
                :unit-system="localUnitSystem"
              />
            </v-col>

            <v-col cols="12" lg="4">
              <AstroCard
                v-if="todayForecast?.astro"
                :astro="todayForecast.astro"
              />
            </v-col>
          </v-row>
        </div>

        <div v-else class="welcome-section">
          <v-icon
            icon="mdi-weather-cloudy"
            size="120"
            color="primary"
            class="welcome-icon"
          />
          <p class="welcome-text text-medium-emphasis">
            {{ t('search.placeholder') }}
          </p>
        </div>
      </v-container>
    </v-main>

    <v-footer app class="text-center text-caption pa-2">
      <span class="text-medium-emphasis">
        Powered by <a href="https://www.weatherapi.com/" target="_blank" class="text-primary">WeatherAPI.com</a>
      </span>
    </v-footer>
  </v-app>
</template>

<style>
html {
  overflow-y: auto;
}

.rtl-layout {
  direction: rtl;
}

.rtl-layout .me-2 {
  margin-left: 0.5rem !important;
  margin-right: 0 !important;
}

.rtl-layout .ms-2 {
  margin-right: 0.5rem !important;
  margin-left: 0 !important;
}
</style>

<style scoped>
.main-container {
  max-width: 1200px;
  padding: 1rem;
}

@media (min-width: 600px) {
  .main-container {
    padding: 2rem;
  }
}

.app-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
}

.search-subtitle {
  font-size: 1rem;
  font-weight: 400;
}

.loading-spinner {
  display: block;
  margin: 4rem auto;
}

.weather-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
}

.welcome-icon {
  opacity: 0.3;
  margin-bottom: 1rem;
}

.welcome-text {
  font-size: 1.125rem;
}
</style>
