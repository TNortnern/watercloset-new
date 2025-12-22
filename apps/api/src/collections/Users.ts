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
      if (user?.role === 'admin') return true
      const publicRoles = [
        { role: { equals: 'provider' } },
        { role: { equals: 'admin' } },
      ]
      if (!user) return { or: publicRoles }
      return { or: [{ id: { equals: user.id } }, ...publicRoles] }
    },
    create: () => true, // Anyone can register
    update: ({ req: { user }, id }) => {
      // Users can update their own record, admins can update anyone
      if (!user) return false
      if (user.role === 'admin') return true
      return user.id === id || user.id === Number(id)
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    // Removed afterRead hook - using field-level access instead
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
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favorites',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
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
