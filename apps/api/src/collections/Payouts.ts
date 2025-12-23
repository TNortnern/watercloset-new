import type { CollectionConfig } from 'payload'

export const Payouts: CollectionConfig = {
  slug: 'payouts',
  admin: {
    useAsTitle: 'id',
    group: 'Transactions',
    defaultColumns: ['provider', 'amount', 'status', 'createdAt'],
  },
  access: {
    // Only admins can access this collection in the admin panel
    admin: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => {
      if (!user)
        return false
      if (user.role === 'admin')
        return true
      if (user.role === 'provider') {
        return { provider: { equals: user.id } }
      }
      return false
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: { equals: 'provider' },
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount in cents',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'stripeTransferId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'bookings',
      type: 'relationship',
      relationTo: 'bookings',
      hasMany: true,
      admin: {
        description: 'Bookings included in this payout',
      },
    },
    {
      name: 'periodStart',
      type: 'date',
      required: true,
    },
    {
      name: 'periodEnd',
      type: 'date',
      required: true,
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'failureReason',
      type: 'text',
      admin: {
        condition: data => data?.status === 'failed',
      },
    },
  ],
  timestamps: true,
}
