<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings, type Language, type ThemeMode } from '../composables/useSettings'
import type { UnitSystem } from '../types/weather'

const props = defineProps<{
  unitSystem: UnitSystem
}>()

const emit = defineEmits<{
  (e: 'update:unitSystem', value: UnitSystem): void
}>()

const { t } = useI18n()
const { theme, language, languageOptions, setTheme, setLanguage } = useSettings()

const menu = ref(false)

const handleUnitChange = (value: UnitSystem) => {
  emit('update:unitSystem', value)
  localStorage.setItem('unitSystem', value)
}

const handleThemeChange = (value: ThemeMode) => {
  setTheme(value)
}

const handleLanguageChange = (value: Language) => {
  setLanguage(value)
}
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        icon="mdi-cog"
        variant="text"
        :aria-label="t('settings.language')"
      />
    </template>

    <v-card min-width="280" class="settings-card">
      <v-card-title class="text-subtitle-1">
        <v-icon icon="mdi-cog" class="me-2" size="20" />
        Settings
      </v-card-title>

      <v-divider />

      <v-list>
        <v-list-subheader>{{ t('settings.language') }}</v-list-subheader>
        <v-list-item>
          <v-btn-toggle
            :model-value="language"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
            @update:model-value="handleLanguageChange"
          >
            <v-btn
              v-for="lang in languageOptions"
              :key="lang.value"
              :value="lang.value"
              size="small"
              class="flex-grow-1"
            >
              {{ lang.flag }} {{ lang.label }}
            </v-btn>
          </v-btn-toggle>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-subheader>{{ t('settings.theme') }}</v-list-subheader>
        <v-list-item>
          <v-btn-toggle
            :model-value="theme"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
            @update:model-value="handleThemeChange"
          >
            <v-btn value="light" size="small" class="flex-grow-1">
              <v-icon icon="mdi-white-balance-sunny" class="me-1" size="18" />
              {{ t('settings.light') }}
            </v-btn>
            <v-btn value="dark" size="small" class="flex-grow-1">
              <v-icon icon="mdi-moon-waning-crescent" class="me-1" size="18" />
              {{ t('settings.dark') }}
            </v-btn>
          </v-btn-toggle>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-subheader>{{ t('settings.units') }}</v-list-subheader>
        <v-list-item>
          <v-btn-toggle
            :model-value="unitSystem"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
            @update:model-value="handleUnitChange"
          >
            <v-btn value="metric" size="small" class="flex-grow-1">
              {{ t('settings.metric') }} (°C)
            </v-btn>
            <v-btn value="imperial" size="small" class="flex-grow-1">
              {{ t('settings.imperial') }} (°F)
            </v-btn>
          </v-btn-toggle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
.settings-card {
  border-radius: 16px;
}

:deep(.v-btn-toggle) {
  width: 100%;
}

:deep(.v-btn-group--divided .v-btn:not(:last-child)) {
  border-inline-end-width: 1px;
}
</style>
