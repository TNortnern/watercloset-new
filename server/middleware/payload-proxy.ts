export default defineEventHandler(async (event) => {
  const path = event.path || ''

  // Proxy these paths to Payload CMS backend
  // Note: /admin is NOT proxied - Nuxt handles /admin/* routes for the custom admin dashboard
  // Access Payload's admin panel directly at http://localhost:3001/admin if needed
  const proxyPaths = ['/media', '/_payload']

  // Also proxy /api/* EXCEPT Nuxt's internal /api routes
  // Payload API routes should go through our Nuxt server/api handlers instead
  const shouldProxy = proxyPaths.some(prefix => path.startsWith(prefix))

  if (shouldProxy) {
    const config = useRuntimeConfig()
    const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || config.public.apiUrl || 'http://localhost:3001'
    const target = payloadUrl.replace(/\/$/, '') + path
    return proxyRequest(event, target)
  }
})
