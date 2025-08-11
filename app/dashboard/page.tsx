import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/logout-button'
import { LearnerDashboard } from '@/components/dashboard/learner-dashboard'
import { ExpertDashboard } from '@/components/dashboard/expert-dashboard'
import { DashboardNavigation } from '@/components/dashboard/dashboard-navigation'
import { Card, CardContent } from '@/components/ui/card'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navigation */}
      <DashboardNavigation userRole={user.role} />

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Role-specific dashboard content */}
          {user.role === 'learner' ? (
            <LearnerDashboard user={user} />
          ) : (
            <ExpertDashboard user={user} />
          )}

          {/* Account Section */}
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                    <p className="text-sm text-gray-600 mb-1">Email: {user.email}</p>
                    <p className="text-sm text-gray-600">
                      Role: {user.role === 'learner' ? 'Learner' : 'Expert'}
                    </p>
                  </div>
                  <div>
                    <LogoutButton />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}