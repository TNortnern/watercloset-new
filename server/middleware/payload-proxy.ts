export default defineEventHandler(async (event) => {
  const path = event.path || ''

  console.log('[payload-proxy] Request path:', path)

  // Proxy these paths to Payload
  const proxyPaths = ['/admin', '/api', '/media', '/_next', '/_payload']

  const shouldProxy = proxyPaths.some(prefix => path.startsWith(prefix))

  if (shouldProxy) {
    console.log('[payload-proxy] Proxying to Payload:', path)
    const target = 'http://localhost:3001' + path
    return proxyRequest(event, target)
  }
})
