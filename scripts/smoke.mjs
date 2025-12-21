const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:3000'

const fetchJson = async (path) => {
  const res = await fetch(`${baseUrl}${path}`)
  if (!res.ok) {
    throw new Error(`${path} failed with ${res.status}`)
  }
  return res.json()
}

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const run = async () => {
  console.log(`Running smoke checks against ${baseUrl}`)

  const properties = await fetchJson('/api/properties?limit=5')
  assert(Array.isArray(properties.docs), 'Properties response missing docs array')

  if (properties.docs.length === 0) {
    console.warn('No properties found. Seed data may be missing.')
    return
  }

  const property = properties.docs[0]
  const propertyId = property.id || property._id
  assert(propertyId, 'Property missing id')

  const propertyDetail = await fetchJson(`/api/properties/${propertyId}?depth=2`)
  const photos = propertyDetail.photos || []
  assert(Array.isArray(photos), 'Property photos is not an array')
  assert(photos.length > 0, 'Property has no photos')

  const photoWithUrl = photos.find(photo => photo?.image?.url || typeof photo?.image === 'string')
  assert(photoWithUrl, 'Property photos missing image URLs')

  const coords = propertyDetail.location?.coordinates
  if (Array.isArray(coords)) {
    const [lng, lat] = coords
    assert(typeof lat === 'number' && typeof lng === 'number', 'Coordinates not numeric')
  }

  const reviews = await fetchJson('/api/reviews?limit=5')
  assert(Array.isArray(reviews.docs), 'Reviews response missing docs array')

  const [lng, lat] = Array.isArray(coords) ? coords : [-122.4194, 37.7749]
  const nearby = await fetchJson(`/api/properties/nearby?lat=${lat}&lng=${lng}&radius=5000`)
  assert(Array.isArray(nearby.docs), 'Nearby response missing docs array')

  console.log('Smoke checks passed')
}

run().catch((error) => {
  console.error('Smoke checks failed:', error.message)
  process.exit(1)
})
