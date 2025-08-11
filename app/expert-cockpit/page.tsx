import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default async function ExpertCockpitPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'expert') {
    redirect('/learner-cockpit')
  }

  const expertProfile = user.expertProfile

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expert Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {expertProfile?.displayName || user.name || user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-900">$0</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming Sessions</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sessions</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Rating</h3>
            <p className="text-3xl font-bold text-gray-900">
              {expertProfile?.avgRating ? expertProfile.avgRating.toString() : '--'}
            </p>
            <p className="text-xs text-gray-500 mt-1">From 0 reviews</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Profile Status</h3>
            <p className="text-lg font-bold">
              {expertProfile?.isPublished ? (
                <span className="text-green-600">Published</span>
              ) : (
                <span className="text-orange-600">Draft</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {expertProfile?.isPublished ? 'Visible to learners' : 'Not visible'}
            </p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Manage Availability
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View All Bookings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Edit Profile
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Update Pricing
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  View Reviews
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
                <Button className="mt-4" variant="default">
                  Set Availability
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No pending booking requests</p>
                <p className="text-sm mt-2">New requests will appear here</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="font-semibold">
                    {expertProfile ? `$${expertProfile.hourlyRate} ${expertProfile.currency}` : 'Not set'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Completion</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Photo</span>
                  {user.avatarUrl ? (
                    <span className="text-green-600 text-sm">✓</span>
                  ) : (
                    <span className="text-orange-600 text-sm">Add</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bio</span>
                  {expertProfile?.description ? (
                    <span className="text-green-600 text-sm">✓</span>
                  ) : (
                    <span className="text-orange-600 text-sm">Add</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expertise Tags</span>
                  {expertProfile?.tags && expertProfile.tags.length > 0 ? (
                    <span className="text-green-600 text-sm">✓</span>
                  ) : (
                    <span className="text-orange-600 text-sm">Add</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  {expertProfile?.hourlyRate ? (
                    <span className="text-green-600 text-sm">✓</span>
                  ) : (
                    <span className="text-orange-600 text-sm">Set</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className="text-orange-600 text-sm">Set</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Complete Profile
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No reviews yet</p>
                <p className="text-xs mt-1">Reviews from learners will appear here</p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-gray-900">Welcome as an expert!</p>
                    <p className="text-gray-500 text-xs">Just now</p>
                  </div>
                </div>
                {!expertProfile?.isPublished && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-gray-900">Complete your profile to go live</p>
                      <p className="text-gray-500 text-xs">Action required</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}