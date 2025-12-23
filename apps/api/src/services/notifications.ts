import type { Payload } from 'payload'
import { sendEmail } from './email'
import {
  bookingConfirmationEmail,
  newBookingProviderEmail,
  bookingCancelledEmail,
  bookingCompletedEmail,
  newReviewNotificationEmail,
  payoutNotificationEmail,
} from '../emails/templates'

// Helper to safely get relationship data
function getRelationshipData<T>(value: unknown): T | null {
  if (!value) return null
  if (typeof value === 'object' && 'id' in value) {
    return value as T
  }
  return null
}

function getRelationshipId(value: unknown): number | string | null {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

interface User {
  id: number | string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'user' | 'provider' | 'admin'
  notifications?: {
    emailBookings?: boolean
    emailMarketing?: boolean
    smsBookings?: boolean
  }
  providerInfo?: {
    businessName?: string
  }
}

interface Property {
  id: number | string
  name: string
  owner: User | number | string
  location?: {
    address?: string
    city?: string
    state?: string
  }
}

interface Booking {
  id: number | string
  user: User | number | string
  property: Property | number | string
  startTime: string | Date
  endTime: string | Date
  duration?: number
  totalAmount?: number
  status: string
}

// Notification service class
export class NotificationService {
  private payload: Payload

  constructor(payload: Payload) {
    this.payload = payload
  }

  // Get full user data if we only have an ID
  private async getUser(userOrId: User | number | string): Promise<User | null> {
    if (typeof userOrId === 'object' && 'email' in userOrId) {
      return userOrId
    }
    try {
      const user = await this.payload.findByID({
        collection: 'users',
        id: userOrId as number,
      })
      return user as unknown as User
    } catch (err) {
      console.error('[Notifications] Failed to fetch user:', err)
      return null
    }
  }

  // Get full property data if we only have an ID
  private async getProperty(propertyOrId: Property | number | string): Promise<Property | null> {
    if (typeof propertyOrId === 'object' && 'name' in propertyOrId) {
      return propertyOrId
    }
    try {
      const property = await this.payload.findByID({
        collection: 'properties',
        id: propertyOrId as number,
        depth: 1,
      })
      return property as unknown as Property
    } catch (err) {
      console.error('[Notifications] Failed to fetch property:', err)
      return null
    }
  }

  // Check if user wants email notifications for bookings
  private shouldSendBookingEmail(user: User): boolean {
    return user.notifications?.emailBookings !== false
  }

  // Format property address
  private formatAddress(property: Property): string {
    if (!property.location) return 'Address not available'
    const { address, city, state } = property.location
    return [address, city, state].filter(Boolean).join(', ')
  }

  // Send booking confirmation to user
  async sendBookingConfirmation(booking: Booking): Promise<void> {
    const user = await this.getUser(booking.user)
    const property = await this.getProperty(booking.property)

    if (!user || !property) {
      console.error('[Notifications] Missing user or property for booking confirmation')
      return
    }

    if (!this.shouldSendBookingEmail(user)) {
      console.log('[Notifications] User has disabled booking emails:', user.email)
      return
    }

    const bookingDetails = {
      id: booking.id,
      propertyName: property.name,
      propertyAddress: this.formatAddress(property),
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.duration || 0,
      totalAmount: booking.totalAmount || 0,
      status: booking.status,
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }

    const email = bookingConfirmationEmail(bookingDetails, userDetails)
    await sendEmail({
      to: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
  }

  // Send new booking notification to provider
  async sendNewBookingToProvider(booking: Booking): Promise<void> {
    const user = await this.getUser(booking.user)
    const property = await this.getProperty(booking.property)

    if (!user || !property) {
      console.error('[Notifications] Missing user or property for provider notification')
      return
    }

    const owner = await this.getUser(property.owner)
    if (!owner) {
      console.error('[Notifications] Could not find property owner')
      return
    }

    if (!this.shouldSendBookingEmail(owner)) {
      console.log('[Notifications] Provider has disabled booking emails:', owner.email)
      return
    }

    const bookingDetails = {
      id: booking.id,
      propertyName: property.name,
      propertyAddress: this.formatAddress(property),
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.duration || 0,
      totalAmount: booking.totalAmount || 0,
      status: booking.status,
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }

    const providerDetails = {
      businessName: owner.providerInfo?.businessName,
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
    }

    const email = newBookingProviderEmail(bookingDetails, userDetails, providerDetails)
    await sendEmail({
      to: owner.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
  }

  // Send booking cancelled notification
  async sendBookingCancelled(booking: Booking, cancelledBy: 'user' | 'provider' | 'admin'): Promise<void> {
    const user = await this.getUser(booking.user)
    const property = await this.getProperty(booking.property)

    if (!user || !property) {
      console.error('[Notifications] Missing user or property for cancellation')
      return
    }

    if (this.shouldSendBookingEmail(user)) {
      const bookingDetails = {
        id: booking.id,
        propertyName: property.name,
        propertyAddress: this.formatAddress(property),
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: booking.duration || 0,
        totalAmount: booking.totalAmount || 0,
        status: booking.status,
      }

      const userDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      }

      const email = bookingCancelledEmail(bookingDetails, userDetails, cancelledBy)
      await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
    }

    // Also notify provider if cancelled by user
    if (cancelledBy === 'user') {
      const owner = await this.getUser(property.owner)
      if (owner && this.shouldSendBookingEmail(owner)) {
        await sendEmail({
          to: owner.email,
          subject: `Booking Cancelled - ${property.name}`,
          html: `<p>The booking for ${property.name} on ${new Date(booking.startTime).toLocaleString()} has been cancelled by the customer.</p>`,
          text: `The booking for ${property.name} on ${new Date(booking.startTime).toLocaleString()} has been cancelled by the customer.`,
        })
      }
    }
  }

  // Send booking completed notification with review request
  async sendBookingCompleted(booking: Booking): Promise<void> {
    const user = await this.getUser(booking.user)
    const property = await this.getProperty(booking.property)

    if (!user || !property) {
      console.error('[Notifications] Missing user or property for completion')
      return
    }

    if (!this.shouldSendBookingEmail(user)) {
      console.log('[Notifications] User has disabled booking emails:', user.email)
      return
    }

    const bookingDetails = {
      id: booking.id,
      propertyName: property.name,
      propertyAddress: this.formatAddress(property),
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.duration || 0,
      totalAmount: booking.totalAmount || 0,
      status: booking.status,
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }

    const email = bookingCompletedEmail(bookingDetails, userDetails)
    await sendEmail({
      to: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
  }

  // Send new review notification to provider
  async sendNewReviewNotification(
    propertyId: number | string,
    rating: number,
    comment: string,
    reviewerName: string
  ): Promise<void> {
    const property = await this.getProperty(propertyId)
    if (!property) {
      console.error('[Notifications] Could not find property for review notification')
      return
    }

    const owner = await this.getUser(property.owner)
    if (!owner) {
      console.error('[Notifications] Could not find property owner for review notification')
      return
    }

    const providerDetails = {
      businessName: owner.providerInfo?.businessName,
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
    }

    const email = newReviewNotificationEmail(
      property.name,
      rating,
      comment,
      reviewerName,
      providerDetails
    )

    await sendEmail({
      to: owner.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
  }

  // Send payout notification
  async sendPayoutNotification(
    providerId: number | string,
    amount: number,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    periodStart: string | Date,
    periodEnd: string | Date
  ): Promise<void> {
    const provider = await this.getUser(providerId)
    if (!provider) {
      console.error('[Notifications] Could not find provider for payout notification')
      return
    }

    const providerDetails = {
      businessName: provider.providerInfo?.businessName,
      firstName: provider.firstName,
      lastName: provider.lastName,
      email: provider.email,
    }

    const email = payoutNotificationEmail(amount, status, providerDetails, periodStart, periodEnd)
    await sendEmail({
      to: provider.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
  }
}

// Factory function to create notification service
export function createNotificationService(payload: Payload): NotificationService {
  return new NotificationService(payload)
}
