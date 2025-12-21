export interface Property {
  id: string
  title: string
  description?: string
  pricePerHour: number
  images?: Array<{
    url: string
    alt?: string
  }>
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  location?: {
    type: string
    coordinates: [number, number] // [lng, lat] for MongoDB GeoJSON
  }
  amenities?: string[]
  propertyType?: string
  rating?: number
  reviewCount?: number
  status?: string
  owner?: string | {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt?: string
  updatedAt?: string
}
