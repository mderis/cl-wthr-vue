<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ForecastDay, UnitSystem } from '../types/weather'

const props = defineProps<{
  forecast: ForecastDay[]
  unitSystem: UnitSystem
}>()

const { t } = useI18n()

const getDayName = (dateString: string, index: number): string => {
  if (index === 0) return t('days.today')
  if (index === 1) return t('days.tomorrow')

  const date = new Date(dateString)
  const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()]
  return t(`days.${dayKey}`)
}

const getTemp = (tempC: number, tempF: number): number => {
  return props.unitSystem === 'metric' ? Math.round(tempC) : Math.round(tempF)
}

const tempUnit = computed(() => {
  return props.unitSystem === 'metric' ? t('units.celsius') : t('units.fahrenheit')
})

const getWeatherIcon = (iconUrl: string): string => {
  return `https:${iconUrl}`
}
</script>

<template>
  <v-card class="forecast-card" elevation="0">
    <v-card-title class="text-h6 pb-2">
      <v-icon icon="mdi-calendar-week" class="me-2" />
      {{ t('weather.forecast') }}
    </v-card-title>
    <v-card-text>
      <div class="forecast-list">
        <div
          v-for="(day, index) in forecast"
          :key="day.date"
          class="forecast-item"
        >
          <span class="day-name">{{ getDayName(day.date, index) }}</span>

          <div class="forecast-icon-temp">
            <img
              :src="getWeatherIcon(day.day.condition.icon)"
              :alt="day.day.condition.text"
              class="forecast-icon"
            />
            <span class="condition-text d-none d-sm-inline">{{ day.day.condition.text }}</span>
          </div>

          <div class="rain-chance" v-if="day.day.daily_chance_of_rain > 0">
            <v-icon icon="mdi-water" size="16" color="primary" />
            <span>{{ day.day.daily_chance_of_rain }}%</span>
          </div>
          <div class="rain-chance" v-else>
            <span class="text-medium-emphasis">-</span>
          </div>

          <div class="temp-range">
            <span class="temp-high">{{ getTemp(day.day.maxtemp_c, day.day.maxtemp_f) }}{{ tempUnit }}</span>
            <span class="temp-separator">/</span>
            <span class="temp-low text-medium-emphasis">{{ getTemp(day.day.mintemp_c, day.day.mintemp_f) }}{{ tempUnit }}</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.forecast-card {
  border-radius: 24px;
  background: rgba(var(--v-theme-surface), 1);
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.forecast-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

@media (min-width: 600px) {
  .forecast-item {
    grid-template-columns: 120px 1fr auto 120px;
  }
}

.day-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.forecast-icon-temp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forecast-icon {
  width: 40px;
  height: 40px;
}

.condition-text {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.rain-chance {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  min-width: 50px;
}

.temp-range {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.temp-high {
  font-weight: 600;
}

.temp-separator {
  opacity: 0.5;
}

.temp-low {
  font-weight: 400;
}
</style>
