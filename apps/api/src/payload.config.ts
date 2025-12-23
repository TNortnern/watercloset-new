import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Bookings } from './collections/Bookings'
import { Conversations } from './collections/Conversations'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Payouts } from './collections/Payouts'
import { Properties } from './collections/Properties'
import { Reviews } from './collections/Reviews'
// Collections
import { Users } from './collections/Users'

// Custom Endpoints
import { stripeEndpoints } from './endpoints/stripe'

// Migrations
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  secret: process.env.PAYLOAD_SECRET || 'your-super-secret-key-change-in-production',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- MyWaterCloset Admin',
    },
  },

  editor: lexicalEditor(),
  sharp,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/watercloset',
    },
    // Use migrations in production, push in development
    push: process.env.NODE_ENV !== 'production',
    // Run migrations in production
    prodMigrations: migrations,
  }),

  collections: [
    Users,
    Properties,
    Bookings,
    Reviews,
    Payouts,
    Media,
    Conversations,
    Messages,
  ],

  endpoints: stripeEndpoints,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],

  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],
})
