'use client'

import { useEffect, useState } from 'react'
import { getUser } from '@/lib/auth'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/components/auth/logout-button'
import { 
  Calendar,
  Clock,
  MessageSquare,
  Video,
  User,
  CreditCard,
  Search,
  RotateCcw,
  X,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react'
import { formatDateTime, getCountdownString, canJoinSession } from '@/lib/datetime'

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface Booking {
  id: string
  startTime: Date
  endTime: Date
  status: string
  expertUserId: string
  expert?: {
    name: string | null
    avatarUrl: string | null
  }
}

export default function LearnerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [nextSession, setNextSession] = useState<Booking | null>(null)
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [needsAttention, setNeedsAttention] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboardData()
    setupRealtimeSubscriptions()
  }, [])

  const loadDashboardData = async () => {
    try {
      // This would typically be an API call
      // For now, we'll simulate loading user data
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to booking changes
    const bookingSubscription = supabase
      .channel('bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Booking' },
        (payload) => {
          // Handle realtime booking updates
          console.log('Booking update:', payload)
          // Reload data or update state optimistically
        }
      )
      .subscribe()

    return () => {
      bookingSubscription.unsubscribe()
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Your AI Rookie Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, {user?.name || 'Learner'}!
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next Session Card */}
            {nextSession ? (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      Next Session
                    </div>
                    <div className="text-sm font-normal text-blue-600">
                      {getCountdownString(nextSession.startTime)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      {nextSession.expert?.avatarUrl ? (
                        <img 
                          src={nextSession.expert.avatarUrl} 
                          alt="Expert avatar" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {nextSession.expert?.name || 'Expert'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {formatDateTime(nextSession.startTime)} (Copenhagen)
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm"
                          disabled={!canJoinSession(nextSession.startTime)}
                          className={!canJoinSession(nextSession.startTime) ? 'opacity-50' : ''}
                          aria-label="Join session (available 5 minutes before start)"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          {canJoinSession(nextSession.startTime) ? 'Join Session' : 'Join (T-5)'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200">
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-4">Ready to learn something new?</p>
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Find an Expert
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Bookings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex space-x-8">
                    <button className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                      Upcoming ({upcomingBookings.length})
                    </button>
                    <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                      Past ({pastBookings.length})
                    </button>
                    <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                      Needs Attention ({needsAttention.length})
                    </button>
                  </nav>
                </div>
                
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No upcoming sessions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-800">{booking.expert?.name || 'Expert'}</p>
                            <p className="text-sm text-gray-600">{formatDateTime(booking.startTime)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Find Expert
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Book Again
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent messages</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recommended Experts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Recommendations coming soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent payments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}