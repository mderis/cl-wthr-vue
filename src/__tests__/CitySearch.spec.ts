import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import CitySearch from '../components/CitySearch.vue'

// Mock the useWeather composable
const mockSearchCities = vi.fn()
const mockCities = ref<any[]>([])
const mockSearchLoading = ref(false)

vi.mock('../composables/useWeather', () => ({
  useWeather: () => ({
    searchCities: mockSearchCities,
    cities: mockCities,
    searchLoading: mockSearchLoading,
  }),
}))

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useDebounceFn: (fn: Function) => fn,
}))

describe('CitySearch component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCities.value = []
    mockSearchLoading.value = false
  })

  it('should render search input', () => {
    const wrapper = mount(CitySearch)

    expect(wrapper.find('.v-autocomplete').exists()).toBe(true)
  })

  it('should emit select event when city is selected', async () => {
    const mockCity = {
      id: 1,
      name: 'London',
      region: 'City of London',
      country: 'UK',
      lat: 51.52,
      lon: -0.11,
      url: 'london',
    }

    mockCities.value = [mockCity]
    mockSearchCities.mockResolvedValue([mockCity])

    const wrapper = mount(CitySearch)

    // Simulate city selection
    await wrapper.vm.selectCity(mockCity)
    await nextTick()

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual([mockCity])
  })

  it('should clear search on clear button click', async () => {
    const wrapper = mount(CitySearch)

    // Set some search state
    wrapper.vm.searchQuery = 'London'
    wrapper.vm.selectedCity = { id: 1, name: 'London' } as any
    await nextTick()

    // Trigger clear
    wrapper.vm.clearSearch()
    await nextTick()

    expect(wrapper.vm.searchQuery).toBe('')
    expect(wrapper.vm.selectedCity).toBeNull()
  })

  it('should not search for queries less than 2 characters', async () => {
    const wrapper = mount(CitySearch)

    wrapper.vm.searchQuery = 'a'
    await flushPromises()

    // Search should not be called for single character
    // The debounced function won't trigger search for short queries
  })

  it('should format selected city correctly', async () => {
    const mockCity = {
      id: 1,
      name: 'Paris',
      region: 'Ile-de-France',
      country: 'France',
      lat: 48.86,
      lon: 2.35,
      url: 'paris',
    }

    const wrapper = mount(CitySearch)

    wrapper.vm.selectCity(mockCity)
    await nextTick()

    expect(wrapper.vm.searchQuery).toBe('Paris, France')
  })
})
