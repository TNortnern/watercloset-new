// Email template utilities and templates for MyWaterCloset

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
  .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
  .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
  .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
  .button:hover { background: #2563eb; }
  .details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
  .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  .details-row:last-child { border-bottom: none; }
  .label { font-weight: 600; color: #374151; }
  .value { color: #6b7280; }
  h1, h2 { margin: 0 0 15px 0; }
  p { margin: 0 0 15px 0; }
`

function wrapTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`
}

// Types
interface BookingDetails {
  id: string | number
  propertyName: string
  propertyAddress: string
  startTime: string | Date
  endTime: string | Date
  duration: number
  totalAmount: number
  status: string
}

interface UserDetails {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

interface ProviderDetails {
  businessName?: string
  firstName: string
  lastName: string
  email: string
}

// Helper functions
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

// Email Templates

export function bookingConfirmationEmail(booking: BookingDetails, user: UserDetails): { subject: string; html: string; text: string } {
  const subject = `Booking Confirmed - ${booking.propertyName}`

  const html = wrapTemplate(`
    <div class="header">
      <h1>Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${user.firstName},</p>
      <p>Great news! Your booking has been confirmed. Here are the details:</p>

      <div class="details">
        <div class="details-row">
          <span class="label">Property</span>
          <span class="value">${booking.propertyName}</span>
        </div>
        <div class="details-row">
          <span class="label">Address</span>
          <span class="value">${booking.propertyAddress}</span>
        </div>
        <div class="details-row">
          <span class="label">Start Time</span>
          <span class="value">${formatDate(booking.startTime)}</span>
        </div>
        <div class="details-row">
          <span class="label">End Time</span>
          <span class="value">${formatDate(booking.endTime)}</span>
        </div>
        <div class="details-row">
          <span class="label">Duration</span>
          <span class="value">${booking.duration} minutes</span>
        </div>
        <div class="details-row">
          <span class="label">Total</span>
          <span class="value">${formatCurrency(booking.totalAmount)}</span>
        </div>
        <div class="details-row">
          <span class="label">Booking ID</span>
          <span class="value">#${booking.id}</span>
        </div>
      </div>

      <p>Please arrive on time. If you need to cancel or modify your booking, please do so at least 30 minutes in advance.</p>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}/bookings/${booking.id}" class="button">View Booking</a>
      </p>
    </div>
    <div class="footer">
      <p>MyWaterCloset - Find restrooms when you need them</p>
      <p>If you didn't make this booking, please contact us immediately.</p>
    </div>
  `)

  const text = `
Booking Confirmed!

Hi ${user.firstName},

Your booking has been confirmed.

Property: ${booking.propertyName}
Address: ${booking.propertyAddress}
Start: ${formatDate(booking.startTime)}
End: ${formatDate(booking.endTime)}
Duration: ${booking.duration} minutes
Total: ${formatCurrency(booking.totalAmount)}
Booking ID: #${booking.id}

Please arrive on time. If you need to cancel or modify your booking, please do so at least 30 minutes in advance.

MyWaterCloset - Find restrooms when you need them
`

  return { subject, html, text }
}

export function newBookingProviderEmail(booking: BookingDetails, user: UserDetails, provider: ProviderDetails): { subject: string; html: string; text: string } {
  const subject = `New Booking - ${booking.propertyName}`

  const html = wrapTemplate(`
    <div class="header">
      <h1>New Booking Received!</h1>
    </div>
    <div class="content">
      <p>Hi ${provider.firstName},</p>
      <p>You have a new booking for <strong>${booking.propertyName}</strong>.</p>

      <div class="details">
        <div class="details-row">
          <span class="label">Customer</span>
          <span class="value">${user.firstName} ${user.lastName}</span>
        </div>
        <div class="details-row">
          <span class="label">Email</span>
          <span class="value">${user.email}</span>
        </div>
        ${user.phone ? `<div class="details-row"><span class="label">Phone</span><span class="value">${user.phone}</span></div>` : ''}
        <div class="details-row">
          <span class="label">Start Time</span>
          <span class="value">${formatDate(booking.startTime)}</span>
        </div>
        <div class="details-row">
          <span class="label">End Time</span>
          <span class="value">${formatDate(booking.endTime)}</span>
        </div>
        <div class="details-row">
          <span class="label">Duration</span>
          <span class="value">${booking.duration} minutes</span>
        </div>
        <div class="details-row">
          <span class="label">Your Payout</span>
          <span class="value">${formatCurrency(Math.round(booking.totalAmount * 0.85))}</span>
        </div>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}/platform/bookings" class="button">View All Bookings</a>
      </p>
    </div>
    <div class="footer">
      <p>MyWaterCloset Provider Dashboard</p>
    </div>
  `)

  const text = `
New Booking Received!

Hi ${provider.firstName},

You have a new booking for ${booking.propertyName}.

Customer: ${user.firstName} ${user.lastName}
Email: ${user.email}
${user.phone ? `Phone: ${user.phone}` : ''}
Start: ${formatDate(booking.startTime)}
End: ${formatDate(booking.endTime)}
Duration: ${booking.duration} minutes
Your Payout: ${formatCurrency(Math.round(booking.totalAmount * 0.85))}

MyWaterCloset Provider Dashboard
`

  return { subject, html, text }
}

export function bookingCancelledEmail(booking: BookingDetails, user: UserDetails, cancelledBy: 'user' | 'provider' | 'admin'): { subject: string; html: string; text: string } {
  const subject = `Booking Cancelled - ${booking.propertyName}`

  const cancelReasonText = cancelledBy === 'user'
    ? 'You cancelled this booking.'
    : cancelledBy === 'provider'
    ? 'The property owner cancelled this booking.'
    : 'This booking was cancelled by the administrator.'

  const html = wrapTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
      <h1>Booking Cancelled</h1>
    </div>
    <div class="content">
      <p>Hi ${user.firstName},</p>
      <p>${cancelReasonText}</p>

      <div class="details">
        <div class="details-row">
          <span class="label">Property</span>
          <span class="value">${booking.propertyName}</span>
        </div>
        <div class="details-row">
          <span class="label">Original Time</span>
          <span class="value">${formatDate(booking.startTime)}</span>
        </div>
        <div class="details-row">
          <span class="label">Booking ID</span>
          <span class="value">#${booking.id}</span>
        </div>
      </div>

      <p>If you were charged, a refund will be processed within 5-10 business days.</p>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}" class="button" style="background: #3b82f6;">Find Another Restroom</a>
      </p>
    </div>
    <div class="footer">
      <p>MyWaterCloset - Find restrooms when you need them</p>
    </div>
  `)

  const text = `
Booking Cancelled

Hi ${user.firstName},

${cancelReasonText}

Property: ${booking.propertyName}
Original Time: ${formatDate(booking.startTime)}
Booking ID: #${booking.id}

If you were charged, a refund will be processed within 5-10 business days.

MyWaterCloset - Find restrooms when you need them
`

  return { subject, html, text }
}

export function bookingCompletedEmail(booking: BookingDetails, user: UserDetails): { subject: string; html: string; text: string } {
  const subject = `Thanks for using ${booking.propertyName}!`

  const html = wrapTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h1>Booking Completed!</h1>
    </div>
    <div class="content">
      <p>Hi ${user.firstName},</p>
      <p>Thanks for using MyWaterCloset! We hope you had a great experience at <strong>${booking.propertyName}</strong>.</p>

      <div class="details">
        <div class="details-row">
          <span class="label">Property</span>
          <span class="value">${booking.propertyName}</span>
        </div>
        <div class="details-row">
          <span class="label">Date</span>
          <span class="value">${formatDate(booking.startTime)}</span>
        </div>
        <div class="details-row">
          <span class="label">Duration</span>
          <span class="value">${booking.duration} minutes</span>
        </div>
      </div>

      <p><strong>How was your experience?</strong></p>
      <p>Your feedback helps other users find great restrooms and helps providers improve their facilities.</p>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}/bookings/${booking.id}/review" class="button" style="background: #10b981;">Leave a Review</a>
      </p>
    </div>
    <div class="footer">
      <p>MyWaterCloset - Find restrooms when you need them</p>
    </div>
  `)

  const text = `
Booking Completed!

Hi ${user.firstName},

Thanks for using MyWaterCloset! We hope you had a great experience at ${booking.propertyName}.

Property: ${booking.propertyName}
Date: ${formatDate(booking.startTime)}
Duration: ${booking.duration} minutes

How was your experience? Your feedback helps other users find great restrooms and helps providers improve their facilities.

Leave a review at: ${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}/bookings/${booking.id}/review

MyWaterCloset - Find restrooms when you need them
`

  return { subject, html, text }
}

export function newReviewNotificationEmail(
  propertyName: string,
  rating: number,
  comment: string,
  reviewerName: string,
  provider: ProviderDetails
): { subject: string; html: string; text: string } {
  const subject = `New ${rating}-Star Review for ${propertyName}`

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

  const html = wrapTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <h1>New Review Received!</h1>
    </div>
    <div class="content">
      <p>Hi ${provider.firstName},</p>
      <p>You received a new review for <strong>${propertyName}</strong>.</p>

      <div class="details">
        <div class="details-row">
          <span class="label">Rating</span>
          <span class="value" style="color: #f59e0b; font-size: 18px;">${stars}</span>
        </div>
        <div class="details-row">
          <span class="label">From</span>
          <span class="value">${reviewerName}</span>
        </div>
      </div>

      <blockquote style="border-left: 4px solid #3b82f6; margin: 20px 0; padding: 10px 20px; background: #f9fafb; font-style: italic;">
        "${comment}"
      </blockquote>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}/platform/properties" class="button">View Your Properties</a>
      </p>
    </div>
    <div class="footer">
      <p>MyWaterCloset Provider Dashboard</p>
    </div>
  `)

  const text = `
New Review Received!

Hi ${provider.firstName},

You received a new review for ${propertyName}.

Rating: ${stars} (${rating}/5)
From: ${reviewerName}

"${comment}"

MyWaterCloset Provider Dashboard
`

  return { subject, html, text }
}

export function payoutNotificationEmail(
  amount: number,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  provider: ProviderDetails,
  periodStart: string | Date,
  periodEnd: string | Date
): { subject: string; html: string; text: string } {
  const statusColors = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    completed: '#10b981',
    failed: '#ef4444',
  }

  const statusMessages = {
    pending: 'Your payout is being prepared.',
    processing: 'Your payout is being processed and will arrive soon.',
    completed: 'Your payout has been sent to your bank account.',
    failed: 'There was an issue processing your payout. Please check your payment details.',
  }

  const subject = `Payout ${status.charAt(0).toUpperCase() + status.slice(1)} - ${formatCurrency(amount)}`

  const html = wrapTemplate(`
    <div class="header" style="background: ${statusColors[status]};">
      <h1>Payout ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
    </div>
    <div class="content">
      <p>Hi ${provider.firstName},</p>
      <p>${statusMessages[status]}</p>

      <div class="details">
        <div class="details-row">
          <span class="label">Amount</span>
          <span class="value" style="font-size: 24px; font-weight: bold;">${formatCurrency(amount)}</span>
        </div>
        <div class="details-row">
          <span class="label">Period</span>
          <span class="value">${new Date(periodStart).toLocaleDateString()} - ${new Date(periodEnd).toLocaleDateString()}</span>
        </div>
        <div class="details-row">
          <span class="label">Status</span>
          <span class="value" style="color: ${statusColors[status]}; font-weight: bold;">${status.toUpperCase()}</span>
        </div>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://watercloset-new-production.up.railway.app'}/platform/earnings" class="button">View Earnings</a>
      </p>
    </div>
    <div class="footer">
      <p>MyWaterCloset Provider Dashboard</p>
      <p>Payouts typically arrive within 2-3 business days after processing.</p>
    </div>
  `)

  const text = `
Payout ${status.charAt(0).toUpperCase() + status.slice(1)}

Hi ${provider.firstName},

${statusMessages[status]}

Amount: ${formatCurrency(amount)}
Period: ${new Date(periodStart).toLocaleDateString()} - ${new Date(periodEnd).toLocaleDateString()}
Status: ${status.toUpperCase()}

Payouts typically arrive within 2-3 business days after processing.

MyWaterCloset Provider Dashboard
`

  return { subject, html, text }
}
