import type { CollectionConfig } from 'payload'
import type { PayloadRequest } from 'payload'
import { sql } from 'drizzle-orm'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'name',
    group: 'Listings',
    defaultColumns: ['name', 'owner', 'status', 'pricePerMinute'],
  },
  endpoints: [
    {
      path: '/nearby',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const url = new URL(req.url || '', 'http://localhost')
        const lat = parseFloat(url.searchParams.get('lat') || url.searchParams.get('latitude') || '0')
        const lng = parseFloat(url.searchParams.get('lng') || url.searchParams.get('longitude') || '0')
        const radius = parseFloat(url.searchParams.get('radius') || '5000') // meters
        const limit = parseInt(url.searchParams.get('limit') || '20')

        if (!lat || !lng) {
          return Response.json(
            { error: 'lat and lng are required' },
            { status: 400 }
          )
        }

        try {
          // Use raw SQL for PostGIS distance calculation
          const db = req.payload.db
          const drizzle = (db as any).drizzle

          if (!drizzle) {
            // Fallback to standard find without distance
            const result = await req.payload.find({
              collection: 'properties',
              where: {
                status: { equals: 'active' },
              },
              limit,
              depth: 1,
            })
            return Response.json(result)
          }

          // Query with PostGIS distance calculation using sql template
          const query = sql`
            SELECT
              p.*,
              ST_X(p.location_coordinates::geometry) as coord_lng,
              ST_Y(p.location_coordinates::geometry) as coord_lat,
              ST_Distance(
                p.location_coordinates::geography,
                ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
              ) as distance
            FROM properties p
            WHERE p.status = 'active'
              AND ST_DWithin(
                p.location_coordinates::geography,
                ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
                ${radius}
              )
            ORDER BY distance ASC
            LIMIT ${limit}
          `

          const result = await drizzle.execute(query)
          const rows = result.rows || result

          // Transform to Payload format
          const docs = (rows as any[]).map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            pricePerMinute: row.price_per_minute,
            type: row.type,
            status: row.status,
            location: {
              address: row.location_address,
              city: row.location_city,
              state: row.location_state,
              zipCode: row.location_zip_code,
              coordinates: row.coord_lng && row.coord_lat ? [row.coord_lng, row.coord_lat] : null,
            },
            stats: {
              averageRating: row.stats_average_rating,
              reviewCount: row.stats_review_count,
            },
            distance: Math.round(row.distance),
          }))

          return Response.json({
            docs,
            totalDocs: docs.length,
            limit,
            totalPages: 1,
            page: 1,
            hasNextPage: false,
            hasPrevPage: false,
          })
        } catch (error) {
          console.error('Nearby search error:', error)
          // Fallback to standard find
          const result = await req.payload.find({
            collection: 'properties',
            where: {
              status: { equals: 'active' },
            },
            limit,
            depth: 1,
          })
          return Response.json(result)
        }
      },
    },
  ],
  access: {
    read: () => true, // Public can view active properties
    create: ({ req: { user } }) => user?.role === 'provider' || user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'provider') {
        return { owner: { equals: user.id } }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        // Set owner on create
        if (operation === 'create' && req.user) {
          data.owner = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Approval', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Restaurant/Cafe', value: 'restaurant' },
        { label: 'Hotel/Hospitality', value: 'hotel' },
      ],
    },
    // Location
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zipCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'US',
        },
        {
          name: 'coordinates',
          type: 'point', // PostGIS point type
          required: true,
        },
      ],
    },
    // Pricing
    {
      name: 'pricePerMinute',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in cents per minute',
      },
    },
    {
      name: 'minimumDuration',
      type: 'number',
      required: true,
      defaultValue: 15,
      admin: {
        description: 'Minimum booking duration in minutes',
      },
    },
    {
      name: 'maximumDuration',
      type: 'number',
      required: true,
      defaultValue: 60,
      admin: {
        description: 'Maximum booking duration in minutes',
      },
    },
    // Amenities
    {
      name: 'amenities',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Wheelchair Accessible', value: 'wheelchair' },
        { label: 'Baby Changing Station', value: 'baby_changing' },
        { label: 'Shower', value: 'shower' },
        { label: 'Bidet', value: 'bidet' },
        { label: 'Air Freshener', value: 'air_freshener' },
        { label: 'Hand Dryer', value: 'hand_dryer' },
        { label: 'Paper Towels', value: 'paper_towels' },
        { label: 'Feminine Products', value: 'feminine' },
        { label: 'Mirror', value: 'mirror' },
        { label: 'Climate Controlled', value: 'climate' },
        { label: 'Private', value: 'private' },
        { label: 'Gender Neutral', value: 'gender_neutral' },
      ],
    },
    // Photos
    {
      name: 'photos',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    // Availability
    {
      name: 'availability',
      type: 'group',
      fields: [
        {
          name: 'instantBooking',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'advanceNotice',
          type: 'number',
          defaultValue: 30,
          admin: {
            description: 'Minutes of advance notice required',
          },
        },
        {
          name: 'bufferTime',
          type: 'number',
          defaultValue: 10,
          admin: {
            description: 'Buffer time between bookings in minutes',
          },
        },
        {
          name: 'schedule',
          type: 'array',
          fields: [
            {
              name: 'day',
              type: 'select',
              required: true,
              options: [
                { label: 'Monday', value: 'monday' },
                { label: 'Tuesday', value: 'tuesday' },
                { label: 'Wednesday', value: 'wednesday' },
                { label: 'Thursday', value: 'thursday' },
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ],
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'startTime',
              type: 'text', // HH:mm format
              required: true,
              defaultValue: '08:00',
            },
            {
              name: 'endTime',
              type: 'text',
              required: true,
              defaultValue: '22:00',
            },
          ],
        },
      ],
    },
    // Stats (updated via hooks)
    {
      name: 'stats',
      type: 'group',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'totalBookings',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalEarnings',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'averageRating',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'reviewCount',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
  timestamps: true,
}
