#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`❌ ${message}`)
    process.exit(1)
  }
}

function main() {
  const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma')
  
  // Read schema file
  let schema: string
  try {
    schema = fs.readFileSync(schemaPath, 'utf8')
  } catch (error) {
    assert(false, `Failed to read schema file: ${error}`)
    return
  }

  // Check for unsupported @@check directive
  assert(
    !schema.includes('@@check'),
    'Schema contains @@check directive which is not supported in Prisma'
  )

  // Check datasource configuration
  assert(
    /url\s*=\s*env\("DATABASE_URL"\)/.test(schema),
    'Schema must contain: url = env("DATABASE_URL")'
  )
  assert(
    /directUrl\s*=\s*env\("DIRECT_URL"\)/.test(schema),
    'Schema must contain: directUrl = env("DIRECT_URL")'
  )

  // Check required enums with exact values
  const enumChecks = [
    {
      name: 'Role',
      values: ['learner', 'expert']
    },
    {
      name: 'SlotState',
      values: ['open', 'held', 'booked', 'blocked']
    },
    {
      name: 'BookingStatus',
      values: ['pending', 'awaiting_confirmation', 'confirmed', 'completed', 'cancelled', 'refunded', 'no_show']
    },
    {
      name: 'PaymentStatus',
      values: ['requires_capture', 'paid', 'refunded']
    },
    {
      name: 'NotificationChannel',
      values: ['email', 'in_app']
    },
    {
      name: 'NotificationType',
      values: ['BOOKING_AWAITING_CONFIRMATION', 'BOOKING_CONFIRMED_ICS', 'BOOKING_DECLINED', 'REMINDER_24H']
    }
  ]

  for (const enumDef of enumChecks) {
    // Extract enum block
    const enumRegex = new RegExp(`enum ${enumDef.name}\\s*\\{([^}]+)\\}`, 's')
    const match = schema.match(enumRegex)
    assert(match, `Enum ${enumDef.name} not found`)

    const enumContent = match[1]
    for (const value of enumDef.values) {
      assert(
        enumContent.includes(value),
        `Enum ${enumDef.name} missing value: ${value}`
      )
    }
  }

  // Check required model names
  const requiredModels = [
    'User', 'ExpertProfile', 'AvailabilitySlot', 'Booking', 
    'Payment', 'Session', 'Review', 'Notification', 'AuditLog'
  ]

  for (const modelName of requiredModels) {
    assert(
      schema.includes(`model ${modelName} {`),
      `Model ${modelName} not found`
    )
  }

  // Check LearnerReviews relation
  assert(
    schema.includes('@relation("LearnerReviews")') && 
    schema.match(/@relation\("LearnerReviews"/g)?.length === 2,
    'LearnerReviews relation must appear on both User.reviews and Review.learner'
  )

  // Verify specific relation placements
  const userModelMatch = schema.match(/model User \{[^}]+reviews[^}]+@relation\("LearnerReviews"\)[^}]+\}/s)
  assert(userModelMatch, 'User.reviews field must use @relation("LearnerReviews")')

  const reviewModelMatch = schema.match(/model Review \{[^}]+learner[^}]+@relation\("LearnerReviews"[^}]+\}/s)
  assert(reviewModelMatch, 'Review.learner field must use @relation("LearnerReviews")')

  console.log('✅ Schema checks passed')
}

if (require.main === module) {
  main()
}