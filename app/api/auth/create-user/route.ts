import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabaseUserId, email, name, role } = body

    // Validate required fields
    if (!supabaseUserId || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: supabaseUserId, email, role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { supabaseUserId },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists', user: existingUser },
        { status: 200 }
      )
    }

    // Create new user record
    const user = await prisma.user.create({
      data: {
        supabaseUserId,
        email,
        name: name || null,
        role: role,
      },
    })

    console.log('Created user record:', user)

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
