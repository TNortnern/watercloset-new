import type { CollectionConfig } from 'payload'
import { createNotificationService } from '../services/notifications'

function getRelationshipId(value: unknown): number | string | null {
  if (typeof value === 'string' || typeof value === 'number')
    return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'id',
    group: 'Messaging',
    defaultColumns: ['conversation', 'sender', 'content', 'createdAt'],
  },
  access: {
    // Only admins can access this collection in the admin panel
    admin: ({ req: { user } }) => user?.role === 'admin',
    // Users can only read messages in conversations they're part of
    read: ({ req: { user } }) => {
      if (!user)
        return false
      if (user.role === 'admin')
        return true
      // User must be a participant in the conversation
      return {
        'conversation.participants.user': { equals: user.id },
      }
    },
    // Users can create messages in conversations they're part of
    create: ({ req: { user } }) => !!user,
    // Only sender can update their own messages (for editing)
    update: ({ req: { user } }) => {
      if (!user)
        return false
      if (user.role === 'admin')
        return true
      return { sender: { equals: user.id } }
    },
    // Soft delete only - messages can be marked as deleted
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create') {
          // Set sender to current user
          if (req.user) {
            data.sender = req.user.id
          }

          // Verify user is a participant in the conversation
          if (data.conversation && req.user) {
            const conversation = await req.payload.findByID({
              collection: 'conversations',
              id: data.conversation,
              depth: 1,
            })

            const isParticipant = conversation?.participants?.some((p: any) => {
              const userId = getRelationshipId(p.user)
              return userId === req.user?.id
            })

            if (!isParticipant) {
              throw new Error('You are not a participant in this conversation')
            }
          }
        }

        // Handle message editing
        if (operation === 'update' && data.content) {
          data.isEdited = true
          data.editedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          const conversationId = getRelationshipId(doc.conversation)
          if (!conversationId)
            return

          // Update conversation with last message info
          try {
            const conversation = await req.payload.findByID({
              collection: 'conversations',
              id: conversationId,
              depth: 1,
            })

            // Count messages in conversation
            const messageCount = await req.payload.count({
              collection: 'messages',
              where: {
                conversation: { equals: conversationId },
                isDeleted: { not_equals: true },
              },
            })

            await req.payload.update({
              collection: 'conversations',
              id: conversationId as number,
              data: {
                lastMessage: {
                  content: doc.content?.substring(0, 100) || '',
                  sender: getRelationshipId(doc.sender) as number,
                  sentAt: doc.createdAt,
                },
                lastMessageAt: doc.createdAt,
                messageCount: messageCount.totalDocs,
              },
            })

            // Send email notification to other participants
            const notificationService = createNotificationService(req.payload)
            const senderId = getRelationshipId(doc.sender)

            for (const participant of (conversation?.participants || [])) {
              const participantUserId = getRelationshipId(participant.user)

              // Don't notify the sender or muted participants
              if (participantUserId === senderId || participant.muted)
                continue

              // Get participant user data
              const recipientUser = await req.payload.findByID({
                collection: 'users',
                id: participantUserId as number,
              })

              // Check if user wants email notifications
              if (recipientUser?.notifications?.emailBookings !== false) {
                // Get sender name
                const senderUser = await req.payload.findByID({
                  collection: 'users',
                  id: senderId as number,
                })

                const senderName = senderUser
                  ? `${senderUser.firstName} ${senderUser.lastName}`
                  : 'Someone'

                // Get property name
                const propertyId = getRelationshipId(conversation?.property)
                let propertyName = 'your booking'
                if (propertyId) {
                  const property = await req.payload.findByID({
                    collection: 'properties',
                    id: propertyId as number,
                  })
                  if (property)
                    propertyName = property.name
                }

                // Send notification email
                await notificationService.sendMessageNotification(
                  recipientUser.email,
                  recipientUser.firstName,
                  senderName,
                  doc.content?.substring(0, 200) || '',
                  propertyName,
                  conversationId,
                )
              }
            }
          }
          catch (error) {
            req.payload.logger.error(`Failed to update conversation or send notification: ${String(error)}`)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      required: true,
      index: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'messageType',
      type: 'select',
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'System', value: 'system' },
        { label: 'Image', value: 'image' },
        { label: 'File', value: 'file' },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'fileName',
          type: 'text',
        },
      ],
    },
    {
      name: 'isEdited',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'editedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isDeleted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Soft delete - message content hidden but record preserved',
      },
    },
    {
      name: 'readBy',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'readAt',
          type: 'date',
        },
      ],
    },
  ],
  timestamps: true,
}
