import { PrismaClient } from '@prisma/client'
import { addHours, addDays } from 'date-fns'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // TODO: Create 5 experts with ExpertProfile
  // - Generate realistic names and emails
  // - Create ExpertProfile with DKK pricing (500-1000 kr/hour)
  // - Add Danish tech tags: ["React", "TypeScript", "Node.js", "Python", "Go", "DevOps"]
  // - Set isPublished: true for visibility
  
  // TODO: Create 20 learners
  // - Generate realistic names and emails
  // - Set role: 'learner'
  // - Add variety in timeZones and locales
  
  // TODO: Insert ≥30 future AvailabilitySlots per expert
  // - Use Copenhagen timezone (Europe/Copenhagen)
  // - Create slots for next 4 weeks, Mon-Fri 9-17
  // - 1-hour slots with 60-minute duration
  // - Non-overlapping times per expert
  // - Mix of 'open' and some 'blocked' states
  
  // TODO: Create sample Bookings across different states
  // - Include pending, awaiting_confirmation, confirmed, completed
  // - Create coherent Payment records for confirmed+ bookings
  // - Add Sessions for completed bookings with Zoom URLs
  // - Generate Reviews for some completed bookings (4-5 stars)
  // - Ensure expertUserId matches ExpertProfile.userId (denormalized field)
  
  console.log('✅ Seeding scaffold complete. Implement TODOs above.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })