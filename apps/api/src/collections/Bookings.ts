import type { CollectionConfig } from 'payload'
import Stripe from 'stripe'

// Lazy Stripe initialization to ensure env vars are loaded
let stripeInstance: Stripe | null = null
const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return stripeInstance
}

const getRelationshipId = (value: unknown): number | string | null => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'id',
    group: 'Transactions',
    defaultColumns: ['property', 'user', 'startTime', 'status', 'totalAmount'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'provider') {
        // Providers can see bookings for their properties
        return {
          'property.owner': { equals: user.id },
        } as any
      }
      // Users can see their own bookings
      return { user: { equals: user.id } } as any
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return false // Updates happen via hooks/endpoints
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create') {
          // Set user on create
          if (req.user) {
            data.user = req.user.id
          }

          // Calculate total amount
          const property = await req.payload.findByID({
            collection: 'properties',
            id: data.property,
          })

          if (property) {
            const durationMinutes = Math.ceil(
              (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 60000
            )
            data.duration = durationMinutes
            data.totalAmount = property.pricePerMinute * durationMinutes

            // Platform fee (15%)
            data.platformFee = Math.round(data.totalAmount * 0.15)
            data.providerPayout = data.totalAmount - data.platformFee
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Create Stripe Payment Intent
          try {
            const propertyId = getRelationshipId(doc.property)
            if (!propertyId) return
            const property = await req.payload.findByID({
              collection: 'properties',
              id: propertyId,
              depth: 1,
            })

            const ownerId = getRelationshipId(property?.owner)
            if (!ownerId) return
            const owner = await req.payload.findByID({
              collection: 'users',
              id: ownerId,
            })

            if (owner?.providerInfo?.stripeAccountId) {
              const paymentIntent = await getStripe().paymentIntents.create({
                amount: doc.totalAmount,
                currency: 'usd',
                transfer_data: {
                  destination: owner.providerInfo.stripeAccountId,
                  amount: doc.providerPayout,
                },
                metadata: {
                  bookingId: doc.id,
                  propertyId: property.id,
                },
              })

              // Update booking with payment intent
              await req.payload.update({
                collection: 'bookings',
                id: doc.id,
                data: {
                  stripePaymentIntentId: paymentIntent.id,
                },
              })
            }
          } catch (error) {
            req.payload.logger.error(`Stripe payment intent creation failed: ${String(error)}`)
          }
        }

        // Send notifications
        if (doc.status === 'confirmed') {
          // TODO: Send confirmation email to user
          // TODO: Send notification to provider
        }
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      // Not required in schema since it's auto-populated in beforeChange hook
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
    },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Duration in minutes',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Payment', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'No Show', value: 'no_show' },
      ],
    },
    // Pricing
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Total amount in cents',
      },
    },
    {
      name: 'platformFee',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Platform fee in cents',
      },
    },
    {
      name: 'providerPayout',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Provider payout in cents',
      },
    },
    // Stripe
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    // Access details (sent after confirmation)
    {
      name: 'accessCode',
      type: 'text',
      admin: {
        readOnly: true,
        condition: (data) => data?.status === 'confirmed',
      },
    },
    {
      name: 'accessInstructions',
      type: 'textarea',
      admin: {
        condition: (data) => data?.status === 'confirmed',
      },
    },
    // Cancellation
    {
      name: 'cancellation',
      type: 'group',
      admin: {
        condition: (data) => data?.status === 'cancelled' || data?.status === 'refunded',
      },
      fields: [
        {
          name: 'cancelledAt',
          type: 'date',
        },
        {
          name: 'cancelledBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'reason',
          type: 'textarea',
        },
        {
          name: 'refundAmount',
          type: 'number',
        },
      ],
    },
    // Review tracking
    {
      name: 'hasBeenReviewed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Automatically set when user submits a review',
      },
    },
  ],
  timestamps: true,
}
