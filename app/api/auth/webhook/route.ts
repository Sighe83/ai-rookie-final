import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for admin operations
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server component - ignore cookie setting errors
            }
          },
        },
      }
    )

    const body = await request.json()
    console.log('Webhook received:', body)

    // Handle user.created event (when email is confirmed)
    if (body.type === 'user.created' && body.record) {
      const supabaseUser = body.record

      // Check if user already exists in our database
      const existingUser = await prisma.user.findUnique({
        where: { supabaseUserId: supabaseUser.id },
      })

      if (!existingUser) {
        // Create user record
        const userData = supabaseUser.user_metadata || {}
        const user = await prisma.user.create({
          data: {
            supabaseUserId: supabaseUser.id,
            email: supabaseUser.email,
            name: userData.name || null,
            role: 'learner', // Default role
          },
        })

        console.log('Created user record from webhook:', user)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
