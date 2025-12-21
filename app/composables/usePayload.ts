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
   * Find documents in a collection
   */
  const find = async <T>(
    collection: string,
    query?: PayloadQuery
  ): Promise<PayloadResponse<T>> => {
    const params = new URLSearchParams()

    if (query?.where) {
      params.set('where', JSON.stringify(query.where))
    }
    if (query?.limit) {
      params.set('limit', String(query.limit))
    }
    if (query?.page) {
      params.set('page', String(query.page))
    }
    if (query?.sort) {
      params.set('sort', query.sort)
    }
    if (query?.depth !== undefined) {
      params.set('depth', String(query.depth))
    }

    const queryString = params.toString()
    const url = `/api/${collection}${queryString ? `?${queryString}` : ''}`

    return await $fetch<PayloadResponse<T>>(url)
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
    return await $fetch<T>(`/api/${collection}/${id}${params}`)
  }

  /**
   * Create a new document
   */
  const create = async <T>(
    collection: string,
    data: Partial<T>
  ): Promise<T> => {
    return await $fetch<T>(`/api/${collection}`, {
      method: 'POST',
      body: data,
    })
  }

  /**
   * Update a document
   */
  const update = async <T>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> => {
    return await $fetch<T>(`/api/${collection}/${id}`, {
      method: 'PATCH',
      body: data,
      credentials: 'include',
    })
  }

  /**
   * Delete a document
   */
  const remove = async (collection: string, id: string): Promise<void> => {
    await $fetch(`/api/${collection}/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    return await $fetch<{ user: any; token: string }>('/api/users/login', {
      method: 'POST',
      body: { email, password },
    })
  }

  /**
   * Logout user
   */
  const logout = async () => {
    return await $fetch('/api/users/logout', {
      method: 'POST',
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

      return await $fetch<{ user: any }>('/api/users/me?depth=1', { headers })
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
