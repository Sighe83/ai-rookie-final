import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default async function LearnerCockpitPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'learner') {
    redirect('/expert-cockpit')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learner Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name || user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming Sessions</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">No sessions scheduled</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sessions</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Lifetime bookings</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Hours Learned</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Total learning time</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Reviews Given</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Help others choose</p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Link href="/experts">
                  <Button className="w-full justify-start" variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Experts
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View My Bookings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Schedule Session
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Update Profile
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No upcoming sessions</p>
                <Link href="/experts">
                  <Button className="mt-4" variant="default">
                    Browse Experts
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No completed sessions yet</p>
                <p className="text-sm mt-2">Your session history will appear here</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Sessions This Month</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Learning Streak</span>
                    <span className="font-medium">0 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recommended Experts</h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 text-center py-4">
                  Expert recommendations will appear here based on your interests
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-gray-900">Welcome to the platform!</p>
                    <p className="text-gray-500 text-xs">Just now</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}