<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Astro } from '../types/weather'

defineProps<{
  astro: Astro
}>()

const { t } = useI18n()
</script>

<template>
  <v-card class="astro-card" elevation="0">
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <div class="astro-item">
            <v-icon icon="mdi-weather-sunset-up" size="32" color="orange" />
            <div class="astro-content">
              <span class="astro-label">{{ t('weather.sunrise') }}</span>
              <span class="astro-value">{{ astro.sunrise }}</span>
            </div>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="astro-item">
            <v-icon icon="mdi-weather-sunset-down" size="32" color="deep-orange" />
            <div class="astro-content">
              <span class="astro-label">{{ t('weather.sunset') }}</span>
              <span class="astro-value">{{ astro.sunset }}</span>
            </div>
          </div>
        </v-col>

        <v-col cols="12">
          <div class="moon-section">
            <v-icon icon="mdi-moon-waning-crescent" size="28" color="blue-grey" />
            <div class="moon-content">
              <span class="moon-label">{{ t('weather.moonPhase') }}</span>
              <span class="moon-value">{{ astro.moon_phase }}</span>
              <v-progress-linear
                :model-value="astro.moon_illumination"
                color="blue-grey"
                height="6"
                rounded
                class="mt-2"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.astro-card {
  border-radius: 24px;
  background: rgba(var(--v-theme-surface), 1);
}

.astro-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.astro-content {
  display: flex;
  flex-direction: column;
}

.astro-label {
  font-size: 0.75rem;
  opacity: 0.7;
}

.astro-value {
  font-size: 1rem;
  font-weight: 600;
}

.moon-section {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.moon-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.moon-label {
  font-size: 0.75rem;
  opacity: 0.7;
}

.moon-value {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
