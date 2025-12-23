// Brevo (formerly Sendinblue) email service

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  fromName?: string
  replyTo?: string
}

interface BrevoPayload {
  sender: {
    name: string
    email: string
  }
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
  textContent?: string
  replyTo?: { email: string }
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    console.log('[Email] Skipping email (BREVO_API_KEY not configured):', options.subject)
    return { success: false, error: 'Email service not configured' }
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'traynorthern96@gmail.com'
  const senderName = options.fromName || 'MyWaterCloset'

  const toAddresses = Array.isArray(options.to) ? options.to : [options.to]

  const payload: BrevoPayload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: toAddresses.map(email => ({ email })),
    subject: options.subject,
    htmlContent: options.html,
  }

  if (options.text) {
    payload.textContent = options.text
  }

  if (options.replyTo) {
    payload.replyTo = { email: options.replyTo }
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Email] Brevo API error:', errorData)
      return { success: false, error: `Brevo API error: ${JSON.stringify(errorData)}` }
    }

    const data = await response.json()
    console.log('[Email] Sent successfully:', data.messageId, 'to:', toAddresses.join(', '))
    return { success: true, messageId: data.messageId }
  } catch (err) {
    console.error('[Email] Error sending email:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendBatchEmails(emails: EmailOptions[]): Promise<{ success: boolean; results: Array<{ success: boolean; error?: string }> }> {
  const results = await Promise.all(emails.map(sendEmail))
  return {
    success: results.every(r => r.success),
    results,
  }
}
