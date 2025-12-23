import { proxyRequest } from 'h3'

/**
 * Proxy all /_next/* requests to Payload CMS
 * Payload uses Next.js internally and serves static assets from /_next/
 */
export default defineEventHandler(async (event) => {
  const path = event.path || ''

  // In production, Payload runs on localhost:3000
  // In development, Payload runs on localhost:3001
  const payloadUrl = process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3001'

  const target = payloadUrl + path

  return proxyRequest(event, target)
})
