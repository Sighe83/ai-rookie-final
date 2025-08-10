import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get user from our database using supabaseUserId
  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
    include: {
      expertProfile: true,
    }
  })
  
  return dbUser
}

export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient()
  
  // Sign up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: error?.message || 'Sign up failed' }
  }

  // Create user in our database
  try {
    const user = await prisma.user.create({
      data: {
        email: data.user.email!,
        name,
        role: 'learner',
        supabaseUserId: data.user.id,
        password: '', // Not used with Supabase auth
      }
    })

    return { user }
  } catch (prismaError) {
    // If database creation fails, we should ideally clean up the Supabase user
    // For now, we'll just return an error
    return { error: 'Failed to create user profile' }
  }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { user: data.user }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}