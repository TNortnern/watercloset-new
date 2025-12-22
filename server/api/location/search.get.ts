// Google Geocoding API endpoint for location search
// Supports both forward geocoding (text -> coords) and reverse geocoding (coords -> address)

export default defineEventHandler(async (event) => {
  const query = getQuery<{ text?: string, latitude?: string, longitude?: string, q?: string }>(event)

  // Use environment variable for API key (support both naming conventions)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Google Maps API key not configured',
    })
  }
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'

  // Support both 'text' and 'q' as query parameter names
  const text = query.text || query.q
  const lat = query.latitude ? Number.parseFloat(query.latitude) : undefined
  const lon = query.longitude ? Number.parseFloat(query.longitude) : undefined

  let url = ''

  // Forward geocoding: text address -> coordinates
  if (text) {
    let biasParam = ''

    // If coordinates provided, bias results to that area
    if (lat !== undefined && lon !== undefined) {
      const delta = 0.05
      const latMin = lat - delta
      const latMax = lat + delta
      const lonMin = lon - delta
      const lonMax = lon + delta
      biasParam = `&bounds=${latMin},${lonMin}|${latMax},${lonMax}`
    }

    url = `${baseUrl}?address=${encodeURIComponent(text)}${biasParam}&key=${apiKey}`
  }
  // Reverse geocoding: coordinates -> address
  else if (lat !== undefined && lon !== undefined) {
    url = `${baseUrl}?latlng=${lat},${lon}&key=${apiKey}`
  }
  else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing \'text\' (or \'q\') or \'latitude\' and \'longitude\' parameters.',
    })
  }

  try {
    const response = await $fetch<{
      results: Array<{
        formatted_address: string
        geometry: {
          location: { lat: number, lng: number }
          location_type: string
        }
        address_components: Array<{
          long_name: string
          short_name: string
          types: string[]
        }>
        place_id: string
        types: string[]
      }>
      status: string
      error_message?: string
    }>(url)

    if (response.status !== 'OK' && response.status !== 'ZERO_RESULTS') {
      throw createError({
        statusCode: 500,
        statusMessage: response.error_message || `Geocoding failed: ${response.status}`,
      })
    }

    // Transform results to a more usable format
    const results = response.results.map((result) => {
      const addressComponents = result.address_components || []

      const getComponent = (type: string) => {
        const component = addressComponents.find(c => c.types.includes(type))
        return component?.long_name || ''
      }

      return {
        formatted_address: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        place_id: result.place_id,
        types: result.types,
        location_type: result.geometry.location_type,
        components: {
          street_number: getComponent('street_number'),
          route: getComponent('route'),
          neighborhood: getComponent('neighborhood'),
          locality: getComponent('locality'),
          administrative_area_level_2: getComponent('administrative_area_level_2'),
          administrative_area_level_1: getComponent('administrative_area_level_1'),
          country: getComponent('country'),
          postal_code: getComponent('postal_code'),
        },
      }
    })

    return {
      results,
      status: response.status,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch geocoding data',
    })
  }
})
