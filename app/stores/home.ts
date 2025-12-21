import { defineStore } from 'pinia'

interface LocationResult {
  formatted_address: string
  lat: number
  lng: number
  place_id?: string
  components?: {
    city?: string
    state?: string
    country?: string
  }
}

interface HomeAddress {
  coordinates: {
    latitude: number
    longitude: number
  }
  description: string
  title: string
  location?: LocationResult
}

interface HomeState {
  address: HomeAddress | null
  radius: number // in meters
  isLoading: boolean
  locationPermissionDenied: boolean
}

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    address: null,
    radius: 50000, // 50km default
    isLoading: false,
    locationPermissionDenied: false,
  }),

  getters: {
    hasLocation: (state) => !!state.address,
    currentCoordinates: (state) => state.address?.coordinates || null,
  },

  actions: {
    setAddress(address: HomeAddress | null) {
      this.address = address
    },

    setRadius(radius: number) {
      this.radius = radius
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setLocationPermissionDenied(denied: boolean) {
      this.locationPermissionDenied = denied
    },

    async detectLocation() {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported')
        return null
      }

      this.isLoading = true

      return new Promise<{ lat: number; lng: number } | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            this.locationPermissionDenied = false

            // Reverse geocode using location API
            try {
              const locationApi = useLocationApi()
              const response = await locationApi.search({
                latitude,
                longitude,
              })

              if (response.results && response.results.length > 0) {
                const location = response.results[0]
                this.address = {
                  coordinates: { latitude, longitude },
                  description: location.formatted_address,
                  title: location.formatted_address,
                  location,
                }
              } else {
                this.address = {
                  coordinates: { latitude, longitude },
                  description: 'Current Location',
                  title: 'Current Location',
                }
              }

              this.isLoading = false
              resolve({ lat: latitude, lng: longitude })
            } catch (error) {
              console.error('Error reverse geocoding:', error)
              this.address = {
                coordinates: { latitude, longitude },
                description: 'Current Location',
                title: 'Current Location',
              }
              this.isLoading = false
              resolve({ lat: latitude, lng: longitude })
            }
          },
          (error) => {
            console.error('Error getting location:', error)
            this.locationPermissionDenied = error.code === error.PERMISSION_DENIED
            this.isLoading = false
            resolve(null)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        )
      })
    },

    clearAddress() {
      this.address = null
    },
  },
})
