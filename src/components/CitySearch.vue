<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import type { City } from '../types/weather'
import { useWeather } from '../composables/useWeather'

const emit = defineEmits<{
  (e: 'select', city: City): void
}>()

const { t } = useI18n()
const { searchCities, searchLoading, cities } = useWeather()

const searchQuery = ref('')
const selectedCity = ref<City | null>(null)

const debouncedSearch = useDebounceFn(async (query: string) => {
  if (query.length >= 2) {
    await searchCities(query)
  }
}, 300)

const onSearchInput = (value: string) => {
  searchQuery.value = value
  if (value && value.length >= 2) {
    debouncedSearch(value)
  }
}

const selectCity = (city: City) => {
  selectedCity.value = city
  searchQuery.value = `${city.name}, ${city.country}`
  emit('select', city)
}

const clearSearch = () => {
  searchQuery.value = ''
  selectedCity.value = null
}
</script>

<template>
  <v-autocomplete
    v-model:search="searchQuery"
    :items="cities"
    :loading="searchLoading"
    :label="t('search.placeholder')"
    :no-data-text="t('search.noResults')"
    item-title="name"
    item-value="id"
    return-object
    clearable
    variant="outlined"
    density="comfortable"
    prepend-inner-icon="mdi-magnify"
    class="city-search"
    @update:search="onSearchInput"
    @update:model-value="selectCity"
    @click:clear="clearSearch"
  >
    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :title="item.raw.name"
        :subtitle="`${item.raw.region}, ${item.raw.country}`"
      >
        <template #prepend>
          <v-icon icon="mdi-map-marker" color="primary" />
        </template>
      </v-list-item>
    </template>

    <template #append-inner>
      <v-progress-circular
        v-if="searchLoading"
        size="20"
        width="2"
        indeterminate
        color="primary"
      />
    </template>
  </v-autocomplete>
</template>

<style scoped>
.city-search {
  max-width: 500px;
  width: 100%;
}

:deep(.v-field) {
  border-radius: 28px;
}

:deep(.v-field__input) {
  padding-inline-start: 8px;
}
</style>
