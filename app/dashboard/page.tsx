import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/logout-button'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Role: {user.role === 'learner' ? 'Learner' : 'Expert'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            {user.role === 'learner' ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Find an expert</p>
                <p className="text-sm text-gray-600">View my bookings</p>
                <p className="text-sm text-gray-600">Browse sessions</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Manage availability</p>
                <p className="text-sm text-gray-600">View bookings</p>
                <p className="text-sm text-gray-600">Update profile</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p className="text-sm text-gray-600">No recent activity</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Account</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <div className="mt-4">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}