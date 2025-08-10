#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

// Load .env.local first, then .env
dotenv.config({ path: path.join(process.cwd(), '.env.local') })
dotenv.config({ path: path.join(process.cwd(), '.env') })

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const prisma = new PrismaClient()

async function main() {
  const email = 'expert@airookie.com'
  const password = 'expertpass123'
  const name = 'Jane Expert'

  try {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
    })

    if (error) {
      console.error('❌ Error creating Supabase user:', error.message)
      return
    }

    console.log('✅ Supabase user created:', data.user.id)

    // Create user in our database
    const dbUser = await prisma.user.create({
      data: {
        email,
        name,
        role: 'expert',
        supabaseUserId: data.user.id,
        password: null, // Using Supabase auth
      }
    })

    console.log('✅ Expert created successfully:')
    console.log(`   Email: ${dbUser.email}`)
    console.log(`   Name: ${dbUser.name}`)
    console.log(`   Role: ${dbUser.role}`)
    console.log(`   DB ID: ${dbUser.id}`)
    console.log(`   Supabase ID: ${dbUser.supabaseUserId}`)
    console.log('')
    console.log('You can now log in with:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('❌ Expert with this email already exists in database')
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