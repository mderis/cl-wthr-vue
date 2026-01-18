<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WeatherResponse, UnitSystem } from '../types/weather'
import { useWeather } from '../composables/useWeather'

const props = defineProps<{
  weather: WeatherResponse
  unitSystem: UnitSystem
}>()

const { t } = useI18n()
const { getAirQualityLevel, getAirQualityColor } = useWeather()

const temperature = computed(() => {
  return props.unitSystem === 'metric'
    ? Math.round(props.weather.current.temp_c)
    : Math.round(props.weather.current.temp_f)
})

const feelsLike = computed(() => {
  return props.unitSystem === 'metric'
    ? Math.round(props.weather.current.feelslike_c)
    : Math.round(props.weather.current.feelslike_f)
})

const windSpeed = computed(() => {
  return props.unitSystem === 'metric'
    ? Math.round(props.weather.current.wind_kph)
    : Math.round(props.weather.current.wind_mph)
})

const visibility = computed(() => {
  return props.unitSystem === 'metric'
    ? Math.round(props.weather.current.vis_km)
    : Math.round(props.weather.current.vis_miles)
})

const tempUnit = computed(() => {
  return props.unitSystem === 'metric' ? t('units.celsius') : t('units.fahrenheit')
})

const windUnit = computed(() => {
  return props.unitSystem === 'metric' ? t('units.kmh') : t('units.mph')
})

const visUnit = computed(() => {
  return props.unitSystem === 'metric' ? t('units.km') : 'mi'
})

const airQualityIndex = computed(() => {
  return props.weather.current.air_quality?.['us-epa-index'] || 1
})

const formattedTime = computed(() => {
  const date = new Date(props.weather.location.localtime)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const weatherIcon = computed(() => {
  return `https:${props.weather.current.condition.icon}`.replace('64x64', '128x128')
})
</script>

<template>
  <v-card class="current-weather-card" elevation="0">
    <v-card-text>
      <div class="weather-main">
        <div class="location-info">
          <h1 class="city-name">{{ weather.location.name }}</h1>
          <p class="region-country">
            {{ weather.location.region }}, {{ weather.location.country }}
          </p>
          <p class="local-time text-medium-emphasis">
            {{ formattedTime }}
          </p>
        </div>

        <div class="temperature-section">
          <div class="temp-icon-wrapper">
            <img :src="weatherIcon" :alt="weather.current.condition.text" class="weather-icon" />
            <div class="temperature">
              <span class="temp-value">{{ temperature }}</span>
              <span class="temp-unit">{{ tempUnit }}</span>
            </div>
          </div>
          <p class="condition-text">{{ weather.current.condition.text }}</p>
          <p class="feels-like text-medium-emphasis">
            {{ t('weather.feelsLike') }}: {{ feelsLike }}{{ tempUnit }}
          </p>
        </div>
      </div>

      <v-divider class="my-4" />

      <div class="weather-details">
        <v-row>
          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-water-percent" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.humidity') }}</span>
                <span class="detail-value">{{ weather.current.humidity }}{{ t('units.percent') }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-weather-windy" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.wind') }}</span>
                <span class="detail-value">{{ windSpeed }} {{ windUnit }} {{ weather.current.wind_dir }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-gauge" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.pressure') }}</span>
                <span class="detail-value">{{ weather.current.pressure_mb }} {{ t('units.hPa') }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-eye" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.visibility') }}</span>
                <span class="detail-value">{{ visibility }} {{ visUnit }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-white-balance-sunny" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.uvIndex') }}</span>
                <span class="detail-value">{{ weather.current.uv }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-cloud" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.cloudCover') }}</span>
                <span class="detail-value">{{ weather.current.cloud }}{{ t('units.percent') }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-water" color="primary" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.precipitation') }}</span>
                <span class="detail-value">{{ weather.current.precip_mm }} {{ t('units.mm') }}</span>
              </div>
            </div>
          </v-col>

          <v-col v-if="weather.current.air_quality" cols="6" sm="4" md="3">
            <div class="detail-item">
              <v-icon icon="mdi-air-filter" :color="getAirQualityColor(airQualityIndex)" size="28" />
              <div class="detail-content">
                <span class="detail-label">{{ t('weather.airQuality') }}</span>
                <v-chip
                  :color="getAirQualityColor(airQualityIndex)"
                  size="small"
                  variant="flat"
                >
                  {{ t(`airQuality.${getAirQualityLevel(airQualityIndex)}`) }}
                </v-chip>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.current-weather-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-surface), 1) 100%);
  border-radius: 24px;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

@media (min-width: 600px) {
  .weather-main {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.city-name {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.region-country {
  font-size: 1rem;
  opacity: 0.8;
}

.local-time {
  font-size: 0.875rem;
}

.temperature-section {
  text-align: center;
}

.temp-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.weather-icon {
  width: 100px;
  height: 100px;
}

.temperature {
  display: flex;
  align-items: flex-start;
}

.temp-value {
  font-size: 4rem;
  font-weight: 300;
  line-height: 1;
}

.temp-unit {
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 0.5rem;
}

.condition-text {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.feels-like {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.75rem;
  opacity: 0.7;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
