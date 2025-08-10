import { PrismaClient } from '@prisma/client'
import { addHours, addDays } from 'date-fns'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create 5 experts
  const experts = []
  for (let i = 1; i <= 5; i++) {
    const user = await db.user.create({
      data: {
        id: `expert-${i}`,
        email: `expert${i}@example.com`,
        name: `Expert ${i}`,
        role: 'EXPERT',
        expertProfile: {
          create: {
            bio: `Experienced developer with ${5 + i} years in the industry. Specializes in ${i <= 2 ? 'Frontend' : i <= 4 ? 'Backend' : 'Full Stack'} development.`,
            expertise: i <= 2 
              ? ['React', 'TypeScript', 'Next.js'] 
              : i <= 4 
              ? ['Node.js', 'Python', 'Databases']
              : ['React', 'Node.js', 'DevOps'],
            hourlyRate: 50000 + (i * 10000), // 500-900 DKK per hour
            currency: 'DKK',
          }
        }
      },
      include: {
        expertProfile: true,
      }
    })
    experts.push(user)

    // Create weekly availability slots for each expert
    const slots = []
    // Monday to Friday, 9 AM to 5 PM
    for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
      for (let hour = 9; hour < 17; hour++) {
        const slot = await db.availabilitySlot.create({
          data: {
            expertId: user.expertProfile!.id,
            dayOfWeek,
            startTime: `${hour.toString().padStart(2, '0')}:00`,
            endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
            isRecurring: true,
            isAvailable: Math.random() > 0.3, // 70% chance of being available
          }
        })
        slots.push(slot)
      }
    }

    console.log(`✅ Created expert: ${user.name} with ${slots.length} availability slots`)
  }

  // Create 20 learners
  const learners = []
  for (let i = 1; i <= 20; i++) {
    const user = await db.user.create({
      data: {
        id: `learner-${i}`,
        email: `learner${i}@example.com`,
        name: `Learner ${i}`,
        role: 'LEARNER',
      }
    })
    learners.push(user)
  }
  console.log(`✅ Created ${learners.length} learners`)

  // Create some sample bookings
  const now = new Date()
  const bookings = []

  for (let i = 0; i < 10; i++) {
    const expert = experts[Math.floor(Math.random() * experts.length)]
    const learner = learners[Math.floor(Math.random() * learners.length)]
    
    // Get a random available slot for this expert
    const availableSlots = await db.availabilitySlot.findMany({
      where: {
        expertId: expert.expertProfile!.id,
        isAvailable: true,
      }
    })

    if (availableSlots.length === 0) continue

    const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)]
    const scheduledAt = addDays(now, Math.floor(Math.random() * 14)) // Random date in next 2 weeks

    const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any

    const booking = await db.booking.create({
      data: {
        learnerId: learner.id,
        expertId: expert.id,
        availabilitySlotId: slot.id,
        scheduledAt,
        status,
        totalAmount: expert.expertProfile!.hourlyRate,
        currency: 'DKK',
      }
    })

    // Create payment for confirmed/completed bookings
    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      await db.payment.create({
        data: {
          bookingId: booking.id,
          stripePaymentIntentId: `pi_test_${booking.id}`,
          amount: booking.totalAmount,
          currency: booking.currency,
          status: 'PAID',
        }
      })

      // Create session for completed bookings
      if (status === 'COMPLETED') {
        const session = await db.session.create({
          data: {
            bookingId: booking.id,
            learnerId: learner.id,
            expertId: expert.id,
            zoomMeetingId: `zoom_${booking.id}`,
            zoomJoinUrl: `https://zoom.us/j/${booking.id}`,
            zoomStartUrl: `https://zoom.us/s/${booking.id}`,
            startedAt: addHours(scheduledAt, -1),
            endedAt: scheduledAt,
          }
        })

        // Create reviews for completed sessions
        if (Math.random() > 0.5) {
          await db.review.create({
            data: {
              sessionId: session.id,
              giverId: learner.id,
              receiverId: expert.id,
              rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
              comment: 'Great session! Very helpful and knowledgeable.',
            }
          })
        }
      }
    }

    bookings.push(booking)
  }

  console.log(`✅ Created ${bookings.length} sample bookings`)

  // Create some notifications
  for (let i = 0; i < 5; i++) {
    const user = [...experts, ...learners][Math.floor(Math.random() * (experts.length + learners.length))]
    
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'BOOKING_CREATED',
        title: 'New booking created',
        message: 'Your booking has been created and is awaiting confirmation.',
        channels: ['IN_APP', 'EMAIL'],
        isRead: Math.random() > 0.5,
      }
    })
  }

  console.log('✅ Created sample notifications')
  console.log('🌱 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })