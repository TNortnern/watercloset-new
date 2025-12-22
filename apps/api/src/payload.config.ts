import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/Users'
import { Properties } from './collections/Properties'
import { Bookings } from './collections/Bookings'
import { Reviews } from './collections/Reviews'
import { Payouts } from './collections/Payouts'
import { Media } from './collections/Media'

// Custom Endpoints
import { stripeEndpoints } from './endpoints/stripe'

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
    // Force schema push in production for initial deployment
    push: process.env.PAYLOAD_FORCE_DRIZZLE_PUSH === 'true' || process.env.NODE_ENV !== 'production',
  }),

  collections: [
    Users,
    Properties,
    Bookings,
    Reviews,
    Payouts,
    Media,
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
