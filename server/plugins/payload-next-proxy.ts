import { proxyRequest } from 'h3'

/**
 * Nitro server plugin to proxy /_next/* requests to Payload
 * This runs before all other handlers/routes
 */
export default defineNitroPlugin((nitroApp) => {
  const payloadUrl = process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3001'

  nitroApp.hooks.hook('request', async (event) => {
    const path = event.path || ''

    // Proxy /_next/* requests to Payload
    if (path.startsWith('/_next')) {
      const target = payloadUrl + path
      console.log(`[Payload Proxy] Proxying ${path} to ${target}`)

      try {
        const response = await proxyRequest(event, target)
        event.node.res.end()
        return response
      } catch (error) {
        console.error(`[Payload Proxy] Error proxying ${path}:`, error)
      }
    }
  })
})
