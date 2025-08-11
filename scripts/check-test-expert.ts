import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function checkTestExpert() {
  const testExpertEmail = 'expert.test@airookie.com'
  const testExpertPassword = 'ExpertTest123!'

  try {
    // Check if User record exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: testExpertEmail },
      include: {
        expertProfile: true
      }
    })

    if (existingUser) {
      console.log('\n✅ Test Expert User Found!')
      console.log('=====================================')
      console.log('User ID:', existingUser.id)
      console.log('Supabase ID:', existingUser.supabaseUserId)
      console.log('Name:', existingUser.name)
      console.log('Email:', testExpertEmail)
      console.log('Password:', testExpertPassword)
      console.log('Role:', existingUser.role)
      console.log('Email Verified: Yes')
      
      if (!existingUser.expertProfile) {
        console.log('\nCreating ExpertProfile...')
        
        const expertProfile = await prisma.expertProfile.create({
          data: {
            userId: existingUser.id,
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
        
        console.log('ExpertProfile created:', expertProfile.id)
      } else {
        console.log('ExpertProfile ID:', existingUser.expertProfile.id)
      }
      
      console.log('=====================================')
      console.log('\n🔑 Login Credentials:')
      console.log('Email: expert.test@airookie.com')
      console.log('Password: ExpertTest123!')
      console.log('\nYou can now sign in at /dashboard')
      
    } else {
      console.log('Test expert user not found in database')
      console.log('Please run create-test-expert-user.ts first')
    }

  } catch (error) {
    console.error('Error checking test expert:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
checkTestExpert()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })