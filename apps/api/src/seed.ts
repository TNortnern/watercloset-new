import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const bathroomImagesDir = path.join(projectRoot, 'public', 'images', 'bathrooms')

// Sample property data across major US cities
const propertyTemplates = [
  // New York City
  { city: 'New York', state: 'NY', lat: 40.7580, lng: -73.9855, area: 'Times Square' },
  { city: 'New York', state: 'NY', lat: 40.7484, lng: -73.9857, area: 'Empire State Building' },
  { city: 'New York', state: 'NY', lat: 40.7614, lng: -73.9776, area: 'Midtown' },
  { city: 'New York', state: 'NY', lat: 40.7831, lng: -73.9712, area: 'Upper West Side' },
  { city: 'New York', state: 'NY', lat: 40.7282, lng: -73.7949, area: 'Queens' },
  { city: 'Brooklyn', state: 'NY', lat: 40.6782, lng: -73.9442, area: 'Downtown Brooklyn' },
  { city: 'Brooklyn', state: 'NY', lat: 40.6892, lng: -73.9824, area: 'DUMBO' },
  // San Francisco
  { city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, area: 'Downtown' },
  { city: 'San Francisco', state: 'CA', lat: 37.7855, lng: -122.4064, area: 'Financial District' },
  { city: 'San Francisco', state: 'CA', lat: 37.7599, lng: -122.4148, area: 'SoMa' },
  { city: 'San Francisco', state: 'CA', lat: 37.7694, lng: -122.4862, area: 'Golden Gate Park' },
  { city: 'San Francisco', state: 'CA', lat: 37.8024, lng: -122.4058, area: 'Fisherman\'s Wharf' },
  // Los Angeles
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, area: 'Downtown LA' },
  { city: 'Los Angeles', state: 'CA', lat: 34.0195, lng: -118.4912, area: 'Santa Monica' },
  { city: 'Los Angeles', state: 'CA', lat: 34.0928, lng: -118.3287, area: 'Hollywood' },
  { city: 'Los Angeles', state: 'CA', lat: 33.9850, lng: -118.4695, area: 'Venice Beach' },
  { city: 'Beverly Hills', state: 'CA', lat: 34.0736, lng: -118.4004, area: 'Beverly Hills' },
  // Chicago
  { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298, area: 'The Loop' },
  { city: 'Chicago', state: 'IL', lat: 41.8917, lng: -87.6063, area: 'Magnificent Mile' },
  { city: 'Chicago', state: 'IL', lat: 41.8827, lng: -87.6233, area: 'Millennium Park' },
  { city: 'Chicago', state: 'IL', lat: 41.9484, lng: -87.6553, area: 'Wrigleyville' },
  // Miami
  { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918, area: 'Downtown Miami' },
  { city: 'Miami Beach', state: 'FL', lat: 25.7907, lng: -80.1300, area: 'South Beach' },
  { city: 'Miami', state: 'FL', lat: 25.8103, lng: -80.1864, area: 'Wynwood' },
  { city: 'Miami', state: 'FL', lat: 25.7259, lng: -80.2419, area: 'Coral Gables' },
  // Seattle
  { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321, area: 'Downtown Seattle' },
  { city: 'Seattle', state: 'WA', lat: 47.6097, lng: -122.3425, area: 'Pike Place Market' },
  { city: 'Seattle', state: 'WA', lat: 47.6205, lng: -122.3493, area: 'Space Needle' },
  { city: 'Seattle', state: 'WA', lat: 47.6553, lng: -122.3035, area: 'University District' },
  // Austin
  { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431, area: 'Downtown Austin' },
  { city: 'Austin', state: 'TX', lat: 30.2500, lng: -97.7500, area: 'South Congress' },
  { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7394, area: '6th Street' },
  // Denver
  { city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903, area: 'Downtown Denver' },
  { city: 'Denver', state: 'CO', lat: 39.7530, lng: -104.9996, area: 'LoDo' },
  { city: 'Denver', state: 'CO', lat: 39.7240, lng: -104.9490, area: 'Cherry Creek' },
  // Boston
  { city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589, area: 'Downtown Boston' },
  { city: 'Boston', state: 'MA', lat: 42.3554, lng: -71.0655, area: 'Back Bay' },
  { city: 'Boston', state: 'MA', lat: 42.3636, lng: -71.0544, area: 'North End' },
  // Washington DC
  { city: 'Washington', state: 'DC', lat: 38.8977, lng: -77.0365, area: 'Capitol Hill' },
  { city: 'Washington', state: 'DC', lat: 38.9072, lng: -77.0369, area: 'Downtown DC' },
  { city: 'Washington', state: 'DC', lat: 38.9051, lng: -77.0215, area: 'Georgetown' },
  // Philadelphia
  { city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652, area: 'Center City' },
  { city: 'Philadelphia', state: 'PA', lat: 39.9496, lng: -75.1503, area: 'Old City' },
  // Nashville
  { city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816, area: 'Downtown Nashville' },
  { city: 'Nashville', state: 'TN', lat: 36.1540, lng: -86.8006, area: 'The Gulch' },
  // Portland
  { city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784, area: 'Downtown Portland' },
  { city: 'Portland', state: 'OR', lat: 45.5231, lng: -122.6765, area: 'Pearl District' },
  // San Diego
  { city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611, area: 'Downtown San Diego' },
  { city: 'San Diego', state: 'CA', lat: 32.7503, lng: -117.2500, area: 'La Jolla' },
]

const propertyTypes = ['residential', 'commercial', 'restaurant', 'hotel'] as const
const amenitiesOptions = [
  'wheelchair', 'baby_changing', 'shower', 'bidet', 'air_freshener',
  'hand_dryer', 'paper_towels', 'feminine', 'mirror', 'climate', 'private', 'gender_neutral'
] as const

type Amenity = typeof amenitiesOptions[number]

const businessNames = [
  'CleanStop', 'Fresh Facilities', 'Urban Oasis', 'City Restroom', 'Quick Relief',
  'Comfort Station', 'Pristine Place', 'The Powder Room', 'Rest Easy', 'Nature\'s Call',
  'Clean Break', 'Fresh Start', 'Downtown Facilities', 'Metro Restroom', 'City Clean',
]

const residentialNames = [
  'Cozy Home Restroom', 'Private Home Bathroom', 'Guest Bathroom', 'Family Home',
  'Apartment Bath', 'Townhouse Facilities', 'Condo Restroom', 'Loft Bathroom'
]

const getMimeType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.jpeg' || ext === '.jpg') return 'image/jpeg'
  return 'application/octet-stream'
}

const loadSeedImages = () => {
  if (!fs.existsSync(bathroomImagesDir)) return []
  return fs.readdirSync(bathroomImagesDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(bathroomImagesDir, file))
}

const ensureSeedMedia = async (payload: any) => {
  const imagePaths = loadSeedImages()
  const mediaIds: number[] = []

  if (imagePaths.length === 0) {
    console.warn(`No seed images found in ${bathroomImagesDir}`)
    return mediaIds
  }

  for (const filePath of imagePaths) {
    const filename = path.basename(filePath)
    try {
      const existing = await payload.find({
        collection: 'media',
        where: { filename: { equals: filename } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        mediaIds.push(existing.docs[0].id)
        continue
      }

      const data = fs.readFileSync(filePath)
      const stats = fs.statSync(filePath)
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: filename,
        },
        file: {
          data,
          name: filename,
          mimetype: getMimeType(filename),
          size: stats.size,
        },
      })
      mediaIds.push(media.id)
    } catch (error) {
      console.error(`Error seeding media for ${filename}:`, error)
    }
  }

  return mediaIds
}

// Helper to get random elements from array
const getRandomElements = <T>(arr: readonly T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper to add small random offset to coordinates
const offsetCoords = (lat: number, lng: number): { latitude: number; longitude: number } => {
  const latOffset = (Math.random() - 0.5) * 0.02 // ~1km offset
  const lngOffset = (Math.random() - 0.5) * 0.02
  return { latitude: lat + latOffset, longitude: lng + lngOffset }
}

// Generate description for rich text
const generateDescription = (type: string, area: string) => {
  const descriptions: Record<string, string[]> = {
    residential: [
      `Clean and well-maintained private bathroom in ${area}. Perfect for those in need while exploring the neighborhood.`,
      `Spotless home bathroom available for travelers in ${area}. Recently renovated with modern fixtures.`,
      `Comfortable private restroom in a quiet ${area} residence. Fully stocked with essentials.`,
    ],
    commercial: [
      `Professional restroom facilities in ${area}. Clean, accessible, and conveniently located.`,
      `Modern commercial bathroom in the heart of ${area}. ADA compliant with premium amenities.`,
      `Well-maintained business restroom in ${area}. Perfect for professionals on the go.`,
    ],
    restaurant: [
      `Restaurant-quality restroom in ${area}. Always clean and fully stocked.`,
      `Upscale dining establishment bathroom in ${area}. Excellent maintenance standards.`,
      `Café restroom in ${area}. Convenient location with friendly staff.`,
    ],
    hotel: [
      `Hotel-quality facilities in ${area}. Luxury amenities and exceptional cleanliness.`,
      `Premium hotel bathroom in ${area}. Five-star standards at affordable prices.`,
      `Boutique hotel restroom in ${area}. Elegant and impeccably maintained.`,
    ],
  }
  const options = descriptions[type] || descriptions.commercial
  return options[Math.floor(Math.random() * options.length)]
}

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('Seeding test users...')

  // Create super admin user
  try {
    const existingAdmin = await payload.find({
      collection: 'users',
      where: { email: { equals: 'foodeater563@gmail.com' } },
    })

    if (existingAdmin.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'foodeater563@gmail.com',
          password: 'Test1234!',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'admin',
        },
      })
      console.log('Created super admin: foodeater563@gmail.com')
    } else {
      // Update role to admin if not already
      if (existingAdmin.docs[0].role !== 'admin') {
        await payload.update({
          collection: 'users',
          id: existingAdmin.docs[0].id,
          data: { role: 'admin' },
        })
        console.log('Updated foodeater563@gmail.com to admin role')
      } else {
        console.log('foodeater563@gmail.com already exists as admin')
      }
    }
  } catch (error) {
    console.error('Error creating super admin:', error)
  }

  // Create a test provider with the same credentials pattern
  try {
    const existingTestProvider = await payload.find({
      collection: 'users',
      where: { email: { equals: 'testprovider@gmail.com' } },
    })

    if (existingTestProvider.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'testprovider@gmail.com',
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'Provider',
          role: 'provider',
          providerInfo: {
            businessName: 'Test Provider Business',
            businessType: 'llc',
            verified: true,
          },
        },
      })
      console.log('Created test provider: testprovider@gmail.com')
    } else {
      console.log('testprovider@gmail.com already exists')
    }
  } catch (error) {
    console.error('Error creating test provider:', error)
  }

  // Create provider user
  let providerId: number | null = null
  try {
    const existingProvider = await payload.find({
      collection: 'users',
      where: { email: { equals: 'provider@provider.provider' } },
    })

    if (existingProvider.docs.length === 0) {
      const provider = await payload.create({
        collection: 'users',
        data: {
          email: 'provider@provider.provider',
          password: 'provider123',
          firstName: 'Test',
          lastName: 'Provider',
          role: 'provider',
          providerInfo: {
            businessName: 'Test Provider LLC',
            businessType: 'llc',
            verified: true,
          },
        },
      })
      providerId = provider.id
      console.log('Created provider@provider.provider')
    } else {
      providerId = existingProvider.docs[0].id
      console.log('provider@provider.provider already exists')
    }
  } catch (error) {
    console.error('Error creating provider:', error)
  }

  // Create additional providers
  const providerIds: number[] = providerId ? [providerId] : []
  for (let i = 1; i <= 5; i++) {
    try {
      const email = `provider${i}@watercloset.com`
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
      })

      if (existing.docs.length === 0) {
        const provider = await payload.create({
          collection: 'users',
          data: {
            email,
            password: 'provider123',
            firstName: businessNames[i] || `Provider ${i}`,
            lastName: 'Business',
            role: 'provider',
            providerInfo: {
              businessName: businessNames[i] || `Provider ${i} LLC`,
              businessType: 'llc',
              verified: true,
            },
          },
        })
        providerIds.push(provider.id)
        console.log(`Created ${email}`)
      } else {
        providerIds.push(existing.docs[0].id)
      }
    } catch (error) {
      console.error(`Error creating provider ${i}:`, error)
    }
  }

  // Create enjoyer (regular user)
  try {
    const existingEnjoyer = await payload.find({
      collection: 'users',
      where: { email: { equals: 'enjoyer@enjoyer.enjoyer' } },
    })

    if (existingEnjoyer.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'enjoyer@enjoyer.enjoyer',
          password: 'enjoyer123',
          firstName: 'Test',
          lastName: 'Enjoyer',
          role: 'user',
        },
      })
      console.log('Created enjoyer@enjoyer.enjoyer')
    } else {
      console.log('enjoyer@enjoyer.enjoyer already exists')
    }
  } catch (error) {
    console.error('Error creating enjoyer:', error)
  }

  // Seed properties
  console.log('\nSeeding properties...')
  const mediaIds = await ensureSeedMedia(payload)
  if (mediaIds.length === 0) {
    console.warn('Skipping property seeding because no media files were created.')
    process.exit(0)
  }
  let createdCount = 0
  let skippedCount = 0

  for (const template of propertyTemplates) {
    // Create 2-4 properties per location
    const numProperties = Math.floor(Math.random() * 3) + 2

    for (let i = 0; i < numProperties; i++) {
      try {
        const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
        const namePrefix = type === 'residential'
          ? residentialNames[Math.floor(Math.random() * residentialNames.length)]
          : businessNames[Math.floor(Math.random() * businessNames.length)]
        const name = `${namePrefix} - ${template.area}`

        // Check if already exists
        const existing = await payload.find({
          collection: 'properties',
          where: { name: { equals: name } },
        })

        if (existing.docs.length > 0) {
          skippedCount++
          continue
        }

        const coords = offsetCoords(template.lat, template.lng)
        const amenities = getRandomElements(amenitiesOptions, Math.floor(Math.random() * 6) + 3) as Amenity[]
        const pricePerMinute = Math.floor(Math.random() * 40) + 10 // 10-50 cents per minute
        const ownerId = providerIds[Math.floor(Math.random() * providerIds.length)]
        if (ownerId === undefined) {
          throw new Error('No provider available to assign property ownership')
        }

        const photoCount = mediaIds.length > 0 ? Math.floor(Math.random() * 3) + 1 : 0
        const photoIds = photoCount > 0
          ? getRandomElements(mediaIds, Math.min(photoCount, mediaIds.length))
          : []

        await payload.create({
          collection: 'properties',
          data: {
            name,
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: generateDescription(type, template.area), version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            owner: ownerId,
            status: 'active',
            type,
            location: {
              address: `${Math.floor(Math.random() * 9000) + 100} ${template.area} St`,
              city: template.city,
              state: template.state,
              zipCode: String(Math.floor(Math.random() * 90000) + 10000),
              country: 'US',
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            pricePerMinute,
            minimumDuration: 15,
            maximumDuration: 60,
            amenities,
            photos: photoIds.map(id => ({ image: id })),
            availability: {
              instantBooking: Math.random() > 0.3,
              advanceNotice: [15, 30, 60][Math.floor(Math.random() * 3)],
              bufferTime: [5, 10, 15][Math.floor(Math.random() * 3)],
              schedule: [
                { day: 'monday', enabled: true, startTime: '08:00', endTime: '22:00' },
                { day: 'tuesday', enabled: true, startTime: '08:00', endTime: '22:00' },
                { day: 'wednesday', enabled: true, startTime: '08:00', endTime: '22:00' },
                { day: 'thursday', enabled: true, startTime: '08:00', endTime: '22:00' },
                { day: 'friday', enabled: true, startTime: '08:00', endTime: '23:00' },
                { day: 'saturday', enabled: true, startTime: '09:00', endTime: '23:00' },
                { day: 'sunday', enabled: Math.random() > 0.3, startTime: '10:00', endTime: '20:00' },
              ],
            },
            stats: {
              totalBookings: Math.floor(Math.random() * 100),
              totalEarnings: Math.floor(Math.random() * 10000),
              averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
              reviewCount: Math.floor(Math.random() * 50),
            },
            featured: Math.random() > 0.9,
          },
        })
        createdCount++
        process.stdout.write(`\rCreated ${createdCount} properties...`)
      } catch (error) {
        console.error(`\nError creating property:`, error)
      }
    }
  }

  console.log(`\n\nProperty seeding complete!`)
  console.log(`Created: ${createdCount} properties`)
  console.log(`Skipped: ${skippedCount} (already existed)`)

  // Seed bookings and reviews
  console.log('\nSeeding bookings and reviews...')

  // Get all properties and the enjoyer user
  const allProperties = await payload.find({
    collection: 'properties',
    limit: 200,
  })

  const enjoyer = await payload.find({
    collection: 'users',
    where: { email: { equals: 'enjoyer@enjoyer.enjoyer' } },
  })

  if (enjoyer.docs.length === 0) {
    console.log('Enjoyer user not found, skipping reviews seeding')
    process.exit(0)
  }

  const enjoyerId = enjoyer.docs[0].id
  const reviewComments = [
    'Great bathroom! Very clean and well-maintained.',
    'Exactly as described. Would use again.',
    'Clean, convenient, and the host was very responsive.',
    'Perfect for a quick stop. Highly recommend!',
    'Nice amenities and easy access. 5 stars!',
    'Good location but could be cleaner.',
    'Decent bathroom for the price. Nothing special.',
    'Better than expected! Will definitely return.',
    'Clean and private. Great experience.',
    'The host was super helpful. Clean facility.',
    'Convenient location. Clean enough.',
    'Pretty good overall. Met my needs.',
    'Nice and spacious. Very clean.',
    'Quick and easy booking process. Clean bathroom.',
    'Solid choice for the area. Recommended.',
  ]

  let bookingsCreated = 0
  let reviewsCreated = 0

  // Create 3-5 bookings with reviews per property (up to 50 properties)
  const propertiesToSeed = allProperties.docs.slice(0, 50)

  for (const property of propertiesToSeed) {
    const numReviews = Math.floor(Math.random() * 3) + 3 // 3-5 reviews per property

    for (let i = 0; i < numReviews; i++) {
      try {
        // Create a completed booking
        const daysAgo = Math.floor(Math.random() * 60) + 1
        const startTime = new Date()
        startTime.setDate(startTime.getDate() - daysAgo)
        startTime.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0)

        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + 15 + Math.floor(Math.random() * 30)) // 15-45 minutes

        const durationMinutes = Math.ceil((endTime.getTime() - startTime.getTime()) / 60000)
        const totalAmount = property.pricePerMinute * durationMinutes
        const platformFee = Math.round(totalAmount * 0.15)
        const providerPayout = totalAmount - platformFee

        // Check if booking already exists for this property/time
        const existingBooking = await payload.find({
          collection: 'bookings',
          where: {
            property: { equals: property.id },
            startTime: { equals: startTime.toISOString() },
          },
        })

        if (existingBooking.docs.length > 0) {
          continue // Skip if booking exists
        }

        // Create booking directly (bypassing hooks that require Stripe)
        const booking = await payload.create({
          collection: 'bookings',
          data: {
            user: enjoyerId,
            property: property.id,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: durationMinutes,
            status: 'completed',
            totalAmount,
            platformFee,
            providerPayout,
            hasBeenReviewed: true,
          },
          overrideAccess: true,
        })
        bookingsCreated++

        // Create review for this booking
        const rating = Math.floor(Math.random() * 2) + 3.5 // 3.5-5
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)]

        await payload.create({
          collection: 'reviews',
          data: {
            booking: booking.id,
            property: property.id,
            user: enjoyerId,
            rating: Math.round(rating),
            cleanliness: Math.floor(Math.random() * 2) + 4,
            accuracy: Math.floor(Math.random() * 2) + 4,
            communication: Math.floor(Math.random() * 2) + 4,
            comment,
          },
          overrideAccess: true,
        })
        reviewsCreated++

        process.stdout.write(`\rCreated ${bookingsCreated} bookings, ${reviewsCreated} reviews...`)
      } catch (error) {
        // Silently skip errors (e.g., duplicate reviews)
      }
    }
  }

  // Update property stats based on actual reviews
  console.log('\n\nUpdating property stats...')
  for (const property of propertiesToSeed) {
    const reviews = await payload.find({
      collection: 'reviews',
      where: { property: { equals: property.id } },
      limit: 100,
    })

    if (reviews.docs.length > 0) {
      const totalRating = reviews.docs.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = Math.round((totalRating / reviews.docs.length) * 10) / 10

      await payload.update({
        collection: 'properties',
        id: property.id,
        data: {
          stats: {
            ...property.stats,
            averageRating,
            reviewCount: reviews.docs.length,
          },
        },
      })
    }
  }

  console.log(`\nSeeding complete!`)
  console.log(`Created: ${bookingsCreated} bookings, ${reviewsCreated} reviews`)
  process.exit(0)
}

seed()
