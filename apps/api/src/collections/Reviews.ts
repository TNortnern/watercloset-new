import type { CollectionConfig } from 'payload'

const getRelationshipId = (value: unknown): number | string | null => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'id',
    group: 'Transactions',
    defaultColumns: ['property', 'user', 'rating', 'createdAt'],
  },
  access: {
    read: () => true, // Public
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeValidate: [
      async ({ req, data, operation, context }) => {
        // Allow seeding with overrideAccess (when user and property are already set)
        if (operation === 'create' && data?.booking && data?.user && data?.property) {
          // If user and property are already set (seeding), skip validation
          return data
        }

        if (operation === 'create' && data?.booking) {
          if (!req.user) {
            throw new Error('Authentication required')
          }
          // Verify user completed this booking
          const booking = await req.payload.findByID({
            collection: 'bookings',
            id: data.booking,
          })

          if (!booking || booking.status !== 'completed') {
            throw new Error('Can only review completed bookings')
          }

          const bookingUserId = getRelationshipId(booking.user)
          if (!bookingUserId || bookingUserId !== req.user.id) {
            throw new Error('Can only review your own bookings')
          }

          // Check if already reviewed
          const existingReview = await req.payload.find({
            collection: 'reviews',
            where: {
              booking: { equals: data.booking },
            },
          })

          if (existingReview.docs.length > 0) {
            throw new Error('Booking already reviewed')
          }

          // Set property from booking
          const propertyId = getRelationshipId(booking.property)
          if (!propertyId) {
            throw new Error('Booking property not found')
          }
          data.property = propertyId
          data.user = req.user.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update property stats after review
        if (operation === 'create' || operation === 'update') {
          const propertyId = getRelationshipId(doc.property)
          if (!propertyId) return

          const reviews = await req.payload.find({
            collection: 'reviews',
            where: {
              property: { equals: propertyId },
            },
            limit: 1000,
          })

          const totalRating = reviews.docs.reduce((sum, r) => sum + r.rating, 0)
          const averageRating = reviews.docs.length > 0
            ? totalRating / reviews.docs.length
            : 0

          await req.payload.update({
            collection: 'properties',
            id: propertyId,
            data: {
              stats: {
                averageRating: Math.round(averageRating * 10) / 10,
                reviewCount: reviews.docs.length,
              },
            },
          })

          // Update booking hasBeenReviewed field
          if (operation === 'create') {
            const bookingId = getRelationshipId(doc.booking)
            if (!bookingId) return

            await req.payload.update({
              collection: 'bookings',
              id: bookingId,
              data: {
                hasBeenReviewed: true,
              },
            })
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
    },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'cleanliness',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'accuracy',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'communication',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    // Provider response
    {
      name: 'response',
      type: 'group',
      fields: [
        {
          name: 'comment',
          type: 'textarea',
          maxLength: 500,
        },
        {
          name: 'respondedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'reported',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Flag inappropriate reviews',
      },
    },
  ],
  timestamps: true,
}
