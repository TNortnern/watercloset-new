import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('Seeding test users...')

  // Create provider user
  try {
    const existingProvider = await payload.find({
      collection: 'users',
      where: { email: { equals: 'provider@provider.provider' } },
    })

    if (existingProvider.docs.length === 0) {
      await payload.create({
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
      console.log('Created provider@provider.provider')
    } else {
      console.log('provider@provider.provider already exists')
    }
  } catch (error) {
    console.error('Error creating provider:', error)
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

  console.log('Seeding complete!')
  process.exit(0)
}

seed()
