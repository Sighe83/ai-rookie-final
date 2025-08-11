import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function createTestExpertUser() {
  // Create Supabase admin client with service role key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const testExpertEmail = 'expert.test@airookie.com'
  const testExpertPassword = 'ExpertTest123!'
  const testExpertName = 'Test Expert'

  try {
    console.log('Creating test expert user...')

    // Step 1: Create user in Supabase Auth with verified email
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testExpertEmail,
      password: testExpertPassword,
      email_confirm: true, // This sets the email as verified
      user_metadata: {
        name: testExpertName,
        role: 'expert'
      }
    })

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already exists')) {
        console.log('User already exists in Supabase Auth, fetching user...')
        
        // Get existing user
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          filter: `email.eq.${testExpertEmail}`
        })

        if (listError || !users || users.length === 0) {
          throw new Error('Failed to fetch existing user')
        }

        const existingUser = users[0]
        console.log('Found existing Supabase user:', existingUser.id)

        // Check if User record exists in database
        const existingDbUser = await prisma.user.findUnique({
          where: { supabaseUserId: existingUser.id }
        })

        if (existingDbUser) {
          console.log('User already exists in database')
          console.log('\n✅ Test Expert User Already Exists:')
          console.log('Email:', testExpertEmail)
          console.log('Password:', testExpertPassword)
          console.log('Role:', existingDbUser.role)
          return
        }

        // Create User record if it doesn't exist
        const dbUser = await prisma.user.create({
          data: {
            supabaseUserId: existingUser.id,
            email: testExpertEmail,
            name: testExpertName,
            role: 'expert',
            bio: 'Test expert specializing in AI workflows and prompt engineering',
            timeZone: 'Europe/Copenhagen',
            locale: 'da-DK'
          }
        })

        console.log('Created User record in database:', dbUser.id)
      } else {
        throw authError
      }
    } else if (authUser?.user) {
      console.log('Created Supabase Auth user:', authUser.user.id)
      console.log('Email verified:', authUser.user.email_confirmed_at ? 'Yes' : 'No')

      // Step 2: Create User record in database
      const dbUser = await prisma.user.create({
        data: {
          supabaseUserId: authUser.user.id,
          email: testExpertEmail,
          name: testExpertName,
          role: 'expert',
          bio: 'Test expert specializing in AI workflows and prompt engineering',
          timeZone: 'Europe/Copenhagen',
          locale: 'da-DK'
        }
      })

      console.log('Created User record in database:', dbUser.id)

      // Step 3: Optionally create ExpertProfile
      const expertProfile = await prisma.expertProfile.create({
        data: {
          userId: dbUser.id,
          displayName: 'Test Expert',
          headline: 'AI Workflow Specialist',
          description: 'I help professionals automate their daily tasks with AI tools and custom prompts. Specialized in ChatGPT, Claude, and automation workflows.',
          tags: ['AI', 'ChatGPT', 'Claude', 'Automation', 'Prompt Engineering', 'Workflows'],
          hourlyRate: 150,
          currency: 'USD',
          isPublished: true,
          avgRating: 4.9
        }
      })

      console.log('Created ExpertProfile:', expertProfile.id)
    }

    console.log('\n✅ Test Expert User Created Successfully!')
    console.log('=====================================')
    console.log('Email:', testExpertEmail)
    console.log('Password:', testExpertPassword)
    console.log('Role: EXPERT')
    console.log('Email Verified: Yes')
    console.log('=====================================')
    console.log('\nYou can now sign in with these credentials.')

  } catch (error) {
    console.error('Error creating test expert user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createTestExpertUser()
  .then(() => {
    console.log('\nScript completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nScript failed:', error)
    process.exit(1)
  })