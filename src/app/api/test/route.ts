import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing Supabase credentials',
          env_check: {
            supabaseUrl: !!supabaseUrl,
            supabaseKey: !!supabaseKey,
          },
        },
        { status: 500 }
      )
    }

    // Test Supabase connection
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: authData, error: authError } =
      await supabase.auth.getSession()

    if (authError) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase auth error',
          error: authError.message,
        },
        { status: 500 }
      )
    }

    // Test database connection (will fail if no tables exist)
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    return NextResponse.json({
      status: 'success',
      message: 'AI Rookie API is working!',
      timestamp: new Date().toISOString(),
      tests: {
        environment: {
          nodeEnv: process.env.NODE_ENV,
          nextjsVersion: '15.4.6',
        },
        supabase: {
          connection: 'success',
          auth: 'success',
          database: dbError
            ? {
                status: 'error',
                message: dbError.message,
                note: 'Expected if database tables not created yet',
              }
            : 'success',
        },
        integrations: {
          stripe: !!process.env.STRIPE_SECRET_KEY,
          zoom: !!process.env.ZOOM_CLIENT_ID,
          smtp: !!process.env.SMTP_HOST,
          sentry: !!process.env.SENTRY_DSN,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unexpected error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
