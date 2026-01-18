<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HourForecast, UnitSystem } from '../types/weather'

const props = defineProps<{
  hours: HourForecast[]
  unitSystem: UnitSystem
}>()

const { t } = useI18n()

const currentHour = new Date().getHours()

const upcomingHours = computed(() => {
  const now = new Date()
  return props.hours
    .filter((hour) => new Date(hour.time) >= now)
    .slice(0, 12)
})

const getTemp = (hour: HourForecast): number => {
  return props.unitSystem === 'metric'
    ? Math.round(hour.temp_c)
    : Math.round(hour.temp_f)
}

const tempUnit = computed(() => {
  return props.unitSystem === 'metric' ? t('units.celsius') : t('units.fahrenheit')
})

const formatTime = (timeString: string): string => {
  const date = new Date(timeString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getWeatherIcon = (iconUrl: string): string => {
  return `https:${iconUrl}`
}

const isNow = (timeString: string): boolean => {
  const hourDate = new Date(timeString)
  return hourDate.getHours() === currentHour
}
</script>

<template>
  <v-card class="hourly-card" elevation="0">
    <v-card-title class="text-h6 pb-2">
      <v-icon icon="mdi-clock-outline" class="me-2" />
      {{ t('weather.hourlyForecast') }}
    </v-card-title>
    <v-card-text>
      <div class="hourly-scroll">
        <div
          v-for="hour in upcomingHours"
          :key="hour.time_epoch"
          class="hour-item"
          :class="{ 'hour-item--now': isNow(hour.time) }"
        >
          <span class="hour-time">{{ isNow(hour.time) ? 'Now' : formatTime(hour.time) }}</span>
          <img
            :src="getWeatherIcon(hour.condition.icon)"
            :alt="hour.condition.text"
            class="hour-icon"
          />
          <span class="hour-temp">{{ getTemp(hour) }}{{ tempUnit }}</span>
          <div v-if="hour.chance_of_rain > 0" class="hour-rain">
            <v-icon icon="mdi-water" size="14" color="primary" />
            <span>{{ hour.chance_of_rain }}%</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.hourly-card {
  border-radius: 24px;
  background: rgba(var(--v-theme-surface), 1);
}

.hourly-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
}

.hourly-scroll::-webkit-scrollbar {
  height: 6px;
}

.hourly-scroll::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 3px;
}

.hour-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  min-width: 80px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  transition: all 0.2s ease;
}

.hour-item--now {
  background: rgba(var(--v-theme-primary), 0.15);
  border: 2px solid rgba(var(--v-theme-primary), 0.3);
}

.hour-time {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.8;
}

.hour-icon {
  width: 40px;
  height: 40px;
}

.hour-temp {
  font-size: 0.9rem;
  font-weight: 600;
}

.hour-rain {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.7rem;
}
</style>
