// Property utility functions for display formatting

export const AMENITY_LABELS: Record<string, string> = {
  wheelchair: 'Wheelchair Accessible',
  baby_changing: 'Baby Changing',
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

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  restaurant: 'Restaurant/Cafe',
  hotel: 'Hotel/Hospitality',
}

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Approval',
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
}

export function usePropertyUtils() {
  const getAmenityLabel = (value: string): string => {
    return AMENITY_LABELS[value] || value
  }

  const getTypeLabel = (value: string): string => {
    return PROPERTY_TYPE_LABELS[value] || value
  }

  const getStatusLabel = (value: string): string => {
    return PROPERTY_STATUS_LABELS[value] || value
  }

  const formatAmenities = (amenities: string[]): string[] => {
    return amenities.map(getAmenityLabel)
  }

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toFixed(2)
  }

  return {
    getAmenityLabel,
    getTypeLabel,
    getStatusLabel,
    formatAmenities,
    formatPrice,
    AMENITY_LABELS,
    PROPERTY_TYPE_LABELS,
    PROPERTY_STATUS_LABELS,
  }
}
