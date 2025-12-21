/**
 * Proxy all API requests to Payload CMS
 * This allows the Nuxt app to communicate with Payload without CORS issues
 */
export default defineEventHandler(async (event) => {
  const path = event.path.replace(/^\/api/, '')
  const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'

  const url = `${payloadUrl}/api${path}`
  const method = event.method
  const contentType = event.headers.get('content-type') || ''

  try {
    // Get request body for POST/PATCH requests
    let body
    let headers: Record<string, string> = {}

    // Forward relevant headers
    if (event.headers.get('authorization')) {
      headers.authorization = event.headers.get('authorization')!
    }
    if (event.headers.get('cookie')) {
      headers.cookie = event.headers.get('cookie')!
    }

    if (method === 'POST' || method === 'PATCH') {
      // Handle multipart/form-data (file uploads) differently
      if (contentType.includes('multipart/form-data')) {
        // For multipart forms, we need to read the raw body and forward it
        const formData = await readMultipartFormData(event)
        if (formData) {
          // Reconstruct FormData for the fetch request
          const newFormData = new FormData()
          for (const field of formData) {
            if (field.filename) {
              // It's a file
              const blob = new Blob([field.data], { type: field.type || 'application/octet-stream' })
              newFormData.append(field.name || 'file', blob, field.filename)
            } else {
              // It's a regular field
              newFormData.append(field.name || '', field.data.toString())
            }
          }
          body = newFormData
        }
      } else {
        body = await readBody(event)
      }
    }

    // Get query parameters
    const query = getQuery(event)

    // Forward the request to Payload using $fetch.raw to get response headers
    const response = await $fetch.raw(url, {
      method: method as any,
      query,
      body,
      headers,
    })

    // Forward Set-Cookie headers from Payload to the client (critical for auth)
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    for (const cookie of setCookieHeaders) {
      appendResponseHeader(event, 'Set-Cookie', cookie)
    }

    return response._data
  } catch (error: any) {
    console.error(`Error proxying request to ${url}:`, error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
