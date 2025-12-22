/**
 * Composable for interacting with Payload CMS API
 * All requests are proxied through Nuxt to /api/*
 */

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface PayloadQuery {
  where?: Record<string, any>
  limit?: number
  page?: number
  sort?: string
  depth?: number
}

export const usePayload = () => {
  const config = useRuntimeConfig()

  /**
   * Convert a where object to Payload v3 URL query string format
   * e.g., { owner: { equals: 1 } } becomes where[owner][equals]=1
   */
  const buildWhereParams = (where: Record<string, any>, prefix = 'where'): string => {
    const parts: string[] = []

    for (const [key, value] of Object.entries(where)) {
      const fullKey = `${prefix}[${key}]`

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively handle nested objects
        parts.push(buildWhereParams(value, fullKey))
      } else if (Array.isArray(value)) {
        // Handle arrays - encode each element
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            parts.push(buildWhereParams(item, `${fullKey}[${index}]`))
          } else {
            parts.push(`${encodeURIComponent(`${fullKey}[${index}]`)}=${encodeURIComponent(String(item))}`)
          }
        })
      } else {
        // Primitive value
        parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`)
      }
    }

    return parts.filter(Boolean).join('&')
  }

  /**
   * Find documents in a collection
   */
  const find = async <T>(
    collection: string,
    query?: PayloadQuery
  ): Promise<PayloadResponse<T>> => {
    const params: string[] = []

    if (query?.where) {
      // Use URL query string format for Payload v3 compatibility
      params.push(buildWhereParams(query.where))
    }
    if (query?.limit) {
      params.push(`limit=${query.limit}`)
    }
    if (query?.page) {
      params.push(`page=${query.page}`)
    }
    if (query?.sort) {
      params.push(`sort=${encodeURIComponent(query.sort)}`)
    }
    if (query?.depth !== undefined) {
      params.push(`depth=${query.depth}`)
    }

    const queryString = params.filter(Boolean).join('&')
    const url = `/api/${collection}${queryString ? `?${queryString}` : ''}`

    return await $fetch<PayloadResponse<T>>(url, { credentials: 'include' })
  }

  /**
   * Find a single document by ID
   */
  const findByID = async <T>(
    collection: string,
    id: string,
    depth?: number
  ): Promise<T> => {
    const params = depth !== undefined ? `?depth=${depth}` : ''
    return await $fetch<T>(`/api/${collection}/${id}${params}`, { credentials: 'include' })
  }

  /**
   * Create a new document
   */
  const create = async <T>(
    collection: string,
    data: Partial<T>
  ): Promise<T> => {
    const response = await $fetch<{ doc: T; message: string }>(`/api/${collection}`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    })
    return response.doc
  }

  /**
   * Update a document
   */
  const update = async <T>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> => {
    const response = await $fetch<{ doc: T; message: string }>(`/api/${collection}/${id}`, {
      method: 'PATCH',
      body: data,
      credentials: 'include',
    })
    return response.doc
  }

  /**
   * Delete a document
   */
  const remove = async (collection: string, id: string): Promise<void> => {
    await $fetch(`/api/${collection}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    return await $fetch<{ user: any; token: string }>('/api/users/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
  }

  /**
   * Logout user
   */
  const logout = async () => {
    return await $fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
  }

  /**
   * Get current user
   */
  const me = async () => {
    try {
      // Get cookies from the request in SSR context
      const headers: Record<string, string> = {}
      if (import.meta.server) {
        const requestHeaders = useRequestHeaders(['cookie'])
        if (requestHeaders.cookie) {
          headers.cookie = requestHeaders.cookie
        }
      }

      return await $fetch<{ user: any }>('/api/users/me?depth=1', {
        headers,
        credentials: 'include',
      })
    } catch {
      return null
    }
  }

  /**
   * Register new user
   */
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: 'user' | 'provider'
  }) => {
    return await $fetch<{ user: any; token: string }>('/api/users', {
      method: 'POST',
      body: data,
      credentials: 'include',
    })
  }

  /**
   * Check booking availability
   */
  const checkAvailability = async (
    propertyId: string,
    startTime: Date,
    endTime: Date
  ) => {
    return await $fetch<{ available: boolean; conflicts: any[] }>(
      '/api/bookings/check-availability',
      {
        method: 'POST',
        body: {
          propertyId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      }
    )
  }

  /**
   * Search nearby properties
   */
  const searchNearby = async (
    lat: number,
    lng: number,
    radius: number = 5000
  ) => {
    return await $fetch<PayloadResponse<any>>(
      `/api/properties/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    )
  }

  return {
    find,
    findByID,
    create,
    update,
    remove,
    login,
    logout,
    me,
    register,
    checkAvailability,
    searchNearby,
  }
}
