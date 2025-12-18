import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
    verify: false, // Set to true to require email verification
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    group: 'Users',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: () => true, // Anyone can register
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Provider', value: 'provider' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    // Provider-specific fields
    {
      name: 'providerInfo',
      type: 'group',
      admin: {
        condition: (data) => data?.role === 'provider',
      },
      fields: [
        {
          name: 'businessName',
          type: 'text',
        },
        {
          name: 'businessType',
          type: 'select',
          options: [
            { label: 'Individual', value: 'individual' },
            { label: 'LLC', value: 'llc' },
            { label: 'Corporation', value: 'corporation' },
          ],
        },
        {
          name: 'stripeAccountId',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'stripeOnboarded',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    // Notification preferences
    {
      name: 'notifications',
      type: 'group',
      fields: [
        {
          name: 'emailBookings',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'emailMarketing',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'smsBookings',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
  timestamps: true,
}
