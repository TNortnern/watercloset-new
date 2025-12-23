import type { CollectionConfig } from 'payload'

function getRelationshipId(value: unknown): number | string | null {
  if (typeof value === 'string' || typeof value === 'number')
    return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

export const Conversations: CollectionConfig = {
  slug: 'conversations',
  admin: {
    useAsTitle: 'id',
    group: 'Messaging',
    defaultColumns: ['booking', 'participants', 'lastMessageAt', 'createdAt'],
  },
  access: {
    // Only admins can access this collection in the admin panel
    admin: ({ req: { user } }) => user?.role === 'admin',
    // Users can only read conversations they're part of
    read: ({ req: { user } }) => {
      if (!user)
        return false
      if (user.role === 'admin')
        return true
      // User must be a participant
      return {
        'participants.user': { equals: user.id },
      }
    },
    // Conversations are created automatically via hooks, but users can also create
    create: ({ req: { user } }) => !!user,
    // Only participants can update (e.g., mark as read)
    update: ({ req: { user } }) => {
      if (!user)
        return false
      if (user.role === 'admin')
        return true
      return {
        'participants.user': { equals: user.id },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create') {
          // Ensure the creating user is a participant
          if (req.user && !data.participants?.some((p: any) =>
            getRelationshipId(p.user) === req.user?.id,
          )) {
            if (!data.participants)
              data.participants = []
            data.participants.push({
              user: req.user.id,
              role: 'user',
            })
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      unique: true, // One conversation per booking
      admin: {
        description: 'The booking this conversation is about',
      },
    },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
      admin: {
        description: 'The property being discussed',
      },
    },
    {
      name: 'participants',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Guest (Booker)', value: 'user' },
            { label: 'Host (Provider)', value: 'provider' },
          ],
        },
        {
          name: 'lastReadAt',
          type: 'date',
          admin: {
            description: 'When this participant last read the conversation',
          },
        },
        {
          name: 'muted',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'lastMessage',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Preview of the last message',
      },
      fields: [
        {
          name: 'content',
          type: 'text',
        },
        {
          name: 'sender',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'sentAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Timestamp of the last message for sorting',
      },
    },
    {
      name: 'messageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
  timestamps: true,
}
