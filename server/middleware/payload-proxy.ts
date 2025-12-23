import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.path || ''

  // Proxy these paths to Payload CMS backend
  // /admin is the Payload admin panel
  // /media and /_payload are Payload internal routes
  const proxyPaths = ['/admin', '/media', '/_payload']

  // Check if this path should be proxied to Payload
  const shouldProxy = proxyPaths.some(prefix => path.startsWith(prefix))

  if (shouldProxy) {
    // In production, Payload runs internally on localhost:3000
    // In development, Payload runs on localhost:3001
    const payloadInternalUrl = process.env.NODE_ENV === 'production'
      ? 'http://localhost:3000'
      : 'http://localhost:3001'
    const target = payloadInternalUrl + path

    console.log(`[Payload Proxy] ${path} -> ${target}`)
    return proxyRequest(event, target)
  }
})
