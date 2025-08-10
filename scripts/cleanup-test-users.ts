#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const prisma = new PrismaClient()

async function main() {
  const email = 'expert@airookie.com'

  try {
    // First, try to find and delete from Supabase by email
    const { data: users } = await supabase.auth.admin.listUsers()
    const supabaseUser = users.users.find(u => u.email === email)
    
    if (supabaseUser) {
      const { error } = await supabase.auth.admin.deleteUser(supabaseUser.id)
      if (error) {
        console.log('⚠️  Could not delete from Supabase:', error.message)
      } else {
        console.log('✅ Deleted user from Supabase:', supabaseUser.id)
      }
    }

    // Find and delete from database
    const dbUser = await prisma.user.findUnique({
      where: { email }
    })

    if (dbUser) {
      console.log(`Found user in database: ${dbUser.id}`)
      await prisma.user.delete({
        where: { email }
      })
      console.log('✅ Deleted user from database')
    } else {
      console.log('No user found in database with that email')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}