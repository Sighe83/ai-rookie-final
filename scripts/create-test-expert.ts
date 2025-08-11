#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  const email = 'expert@airookie.com'
  const password = 'expertpass123'
  const name = 'Jane Expert'

  try {
    const hashedPassword = await hashPassword(password)

    const expert = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'expert',
        supabaseUserId: null,
      },
    })

    console.log('✅ Expert created successfully:')
    console.log(`   Email: ${expert.email}`)
    console.log(`   Name: ${expert.name}`)
    console.log(`   Role: ${expert.role}`)
    console.log(`   ID: ${expert.id}`)
    console.log('')
    console.log('You can now log in with:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('❌ Expert with this email already exists')
    } else {
      console.error('❌ Error creating expert:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}
