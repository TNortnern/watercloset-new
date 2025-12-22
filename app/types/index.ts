/**
 * Shared TypeScript types for the WaterCloset application
 */

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'user' | 'provider' | 'admin'
  avatar?: Media
  providerInfo?: ProviderInfo
  notifications?: NotificationPreferences
  createdAt: string
  updatedAt: string
}

export interface ProviderInfo {
  businessName?: string
  businessType?: 'individual' | 'llc' | 'corporation'
  stripeAccountId?: string
  stripeOnboarded?: boolean
  verified?: boolean
}

export interface NotificationPreferences {
  emailBookings?: boolean
  emailMarketing?: boolean
  smsBookings?: boolean
}

// Property types
export interface Property {
  id: string
  name: string
  description: string
  owner: User | string
  status: 'pending' | 'active' | 'inactive' | 'suspended'
  type: 'residential' | 'commercial' | 'restaurant' | 'hotel'
  location: PropertyLocation
  pricePerMinute: number
  minimumDuration: number
  maximumDuration: number
  amenities?: string[]
  photos?: PropertyPhoto[]
  availability?: PropertyAvailability
  stats?: PropertyStats
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface PropertyLocation {
  address: string
  city: string
  state: string
  zipCode: string
  country?: string
  latitude: number
  longitude: number
}

export interface PropertyPhoto {
  image: Media | string
  caption?: string
}

export interface PropertyAvailability {
  instantBooking?: boolean
  advanceNotice?: number
  bufferTime?: number
  schedule?: DaySchedule[]
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  enabled: boolean
  startTime: string // HH:mm format
  endTime: string
}

export interface PropertyStats {
  totalBookings: number
  totalEarnings: number
  averageRating: number
  reviewCount: number
}

// Booking types
export interface Booking {
  id: string
  user: User | string
  property: Property | string
  startTime: string
  endTime: string
  duration?: number
  status: BookingStatus
  totalAmount?: number
  platformFee?: number
  providerPayout?: number
  stripePaymentIntentId?: string
  accessCode?: string
  accessInstructions?: string
  cancellation?: BookingCancellation
  createdAt: string
  updatedAt: string
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'no_show'

export interface BookingCancellation {
  cancelledAt?: string
  cancelledBy?: User | string
  reason?: string
  refundAmount?: number
}

// Review types
export interface Review {
  id: string
  booking: Booking | string
  property: Property | string
  user: User | string
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
}

// Media types
export interface Media {
  id: string
  url: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  alt?: string
}

// Payout types
export interface Payout {
  id: string
  provider: User | string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  stripeTransferId?: string
  bookings?: (Booking | string)[]
  createdAt: string
  updatedAt: string
}

// API Response types
export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Amenity labels
export const AMENITY_LABELS: Record<string, string> = {
  wheelchair: 'Wheelchair Accessible',
  baby_changing: 'Baby Changing Station',
  shower: 'Shower',
  bidet: 'Bidet',
  air_freshener: 'Air Freshener',
  hand_dryer: 'Hand Dryer',
  paper_towels: 'Paper Towels',
  feminine: 'Feminine Products',
  mirror: 'Mirror',
  climate: 'Climate Controlled',
  private: 'Private',
  gender_neutral: 'Gender Neutral',
}

// Property type labels
export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  restaurant: 'Restaurant/Cafe',
  hotel: 'Hotel/Hospitality',
}
