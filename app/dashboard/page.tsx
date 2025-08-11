import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/')
  }

  // Auto-route based on user role
  if (user.role === 'learner') {
    redirect('/dashboard/learner')
  } else if (user.role === 'expert') {
    redirect('/dashboard/expert')
  }

  // Fallback - should not reach here
  redirect('/')
}