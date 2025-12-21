// Location API composable for Google Geocoding

interface LocationSearchParams {
  text?: string
  q?: string
  latitude?: number
  longitude?: number
}

interface LocationResult {
  formatted_address: string
  lat: number
  lng: number
  place_id: string
  types: string[]
  location_type: string
  components: {
    street_number: string
    route: string
    neighborhood: string
    locality: string
    administrative_area_level_2: string
    administrative_area_level_1: string
    country: string
    postal_code: string
  }
}

interface LocationSearchResponse {
  results: LocationResult[]
  status: string
}

export function useLocationApi() {
  const search = async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
    const query = new URLSearchParams()

    if (params.text) {
      query.set('text', params.text)
    }
    else if (params.q) {
      query.set('q', params.q)
    }

    if (params.latitude !== undefined) {
      query.set('latitude', params.latitude.toString())
    }
    if (params.longitude !== undefined) {
      query.set('longitude', params.longitude.toString())
    }

    return await $fetch<LocationSearchResponse>(`/api/location/search?${query.toString()}`)
  }

  return {
    search,
  }
}
