import crypto from 'crypto'
import { defineEventHandler, readBody, getHeader } from 'h3'

// Webhook event types from rb-payload/BookFlow
interface WebhookPayload {
  event: 'booking.created' | 'booking.updated' | 'booking.confirmed' | 'booking.cancelled' | 'customer.created'
  timestamp: string
  data: {
    id?: number | string
    booking?: {
      id: number | string
      startTime?: string
      endTime?: string
      status?: string
      customer?: {
        id: number | string
        name?: string
        email?: string
        phone?: string
      }
      service?: {
        id: number | string
        name?: string
        price?: number
      }
    }
    customer?: {
      id: number | string
      name?: string
      email?: string
      phone?: string
    }
    previousStatus?: string
    newStatus?: string
  }
}

// Verify webhook signature
function verifyWebhookSignature(payload: unknown, signature: string, secret: string): boolean {
  if (!secret || !signature) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  } catch {
    return false
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Get webhook secret from environment
  const webhookSecret = process.env.RB_PAYLOAD_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn('[rb-payload webhook] Webhook secret not configured - processing without verification')
  }

  // Read the raw body
  const body = await readBody<WebhookPayload>(event)

  // Verify signature if secret is configured
  const signature = getHeader(event, 'x-webhook-signature') || ''

  if (webhookSecret && !verifyWebhookSignature(body, signature, webhookSecret)) {
    console.error('[rb-payload webhook] Invalid signature')
    return { error: 'Invalid signature', status: 401 }
  }

  console.log('[rb-payload webhook] Received event:', body.event, 'at', body.timestamp)

  try {
    switch (body.event) {
      case 'booking.created':
        await handleBookingCreated(body.data)
        break

      case 'booking.confirmed':
        await handleBookingConfirmed(body.data)
        break

      case 'booking.cancelled':
        await handleBookingCancelled(body.data)
        break

      case 'booking.updated':
        await handleBookingUpdated(body.data)
        break

      case 'customer.created':
        await handleCustomerCreated(body.data)
        break

      default:
        console.log('[rb-payload webhook] Unhandled event type:', body.event)
    }

    return { received: true }
  } catch (error) {
    console.error('[rb-payload webhook] Error processing event:', error)
    return { error: 'Processing failed', status: 500 }
  }
})

// Event handlers
async function handleBookingCreated(data: WebhookPayload['data']) {
  console.log('[rb-payload webhook] New booking created:', data.booking?.id)

  // You can sync this booking to your local database if needed
  // Or send additional notifications beyond what rb-payload sends

  // Example: Log booking details for tracking
  if (data.booking) {
    console.log('[rb-payload webhook] Booking details:', {
      id: data.booking.id,
      customer: data.booking.customer?.name,
      service: data.booking.service?.name,
      startTime: data.booking.startTime,
    })
  }
}

async function handleBookingConfirmed(data: WebhookPayload['data']) {
  console.log('[rb-payload webhook] Booking confirmed:', data.booking?.id)

  // Booking was confirmed (payment received)
  // You could:
  // - Update local booking status
  // - Send additional notifications
  // - Trigger inventory updates
}

async function handleBookingCancelled(data: WebhookPayload['data']) {
  console.log('[rb-payload webhook] Booking cancelled:', data.booking?.id, {
    previousStatus: data.previousStatus,
    newStatus: data.newStatus,
  })

  // Booking was cancelled
  // You could:
  // - Process refunds
  // - Release inventory
  // - Update local records
}

async function handleBookingUpdated(data: WebhookPayload['data']) {
  console.log('[rb-payload webhook] Booking updated:', data.booking?.id)

  // Booking details changed (time, notes, etc.)
  // Sync changes to local database if needed
}

async function handleCustomerCreated(data: WebhookPayload['data']) {
  console.log('[rb-payload webhook] New customer created:', data.customer?.id)

  // A new customer was created in rb-payload
  // You could sync to your local users table
}
