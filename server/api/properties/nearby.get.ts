export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { lat, lng, radius = 5000 } = query

  if (!lat || !lng) {
    throw createError({
      statusCode: 400,
      message: 'Latitude and longitude are required',
    })
  }

  const latitude = parseFloat(lat as string)
  const longitude = parseFloat(lng as string)
  const radiusMeters = parseFloat(radius as string)

  // Payload API URL
  const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'

  try {
    // Query Payload API for properties near the coordinates
    // Using query string format that Payload expects for nested where clauses
    const response = await $fetch(`${payloadUrl}/api/properties`, {
      query: {
        'where[status][equals]': 'active',
        limit: 200,
        depth: 1,
      },
    })

    // Filter properties by distance on the server side
    const filteredProperties = (response as any).docs.filter((property: any) => {
      // Payload stores point type as [lng, lat] directly in coordinates field
      if (!property.location?.coordinates) return false

      const coords = property.location.coordinates
      // Handle both array format [lng, lat] and GeoJSON format { type: 'Point', coordinates: [lng, lat] }
      const [propLng, propLat] = Array.isArray(coords) ? coords : coords.coordinates || []

      if (propLng === undefined || propLat === undefined) return false

      const distance = calculateDistance(latitude, longitude, propLat, propLng)
      return distance <= radiusMeters
    })

    // Sort by distance
    const sortedProperties = filteredProperties
      .map((property: any) => {
        const coords = property.location.coordinates
        const [propLng, propLat] = Array.isArray(coords) ? coords : coords.coordinates || []
        return {
          ...property,
          distance: calculateDistance(latitude, longitude, propLat, propLng),
        }
      })
      .sort((a: any, b: any) => a.distance - b.distance)

    return {
      docs: sortedProperties,
      totalDocs: sortedProperties.length,
      limit: 100,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  } catch (error) {
    console.error('Error fetching nearby properties:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch nearby properties',
    })
  }
})

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}
