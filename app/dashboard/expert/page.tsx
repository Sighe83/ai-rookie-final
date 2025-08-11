'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/components/auth/logout-button'
import { 
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  Video,
  User,
  CheckCircle,
  X,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Settings,
  Inbox,
  UserX
} from 'lucide-react'
import { formatDateTime, formatTime, formatDate, formatCurrency } from '@/lib/datetime'

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface PendingBooking {
  id: string
  startTime: Date
  endTime: Date
  learnerUserId: string
  learner?: {
    name: string | null
    avatarUrl: string | null
  }
  amount: number
}

interface TodaySession {
  id: string
  startTime: Date
  endTime: Date
  status: string
  learner?: {
    name: string | null
    avatarUrl: string | null
  }
}

export default function ExpertDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([])
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([])
  const [earnings, setEarnings] = useState({
    mtd: 0,
    pending: 0,
    nextPayout: new Date()
  })
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
      // This would typically be API calls to load expert data
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to booking changes
    const bookingSubscription = supabase
      .channel('expert-bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Booking' },
        (payload) => {
          console.log('Expert booking update:', payload)
          // Handle realtime updates optimistically
        }
      )
      .subscribe()

    return () => {
      bookingSubscription.unsubscribe()
    }
  }


  const handleAcceptBooking = async (bookingId: string) => {
    // Optimistic update
    setPendingBookings(prev => prev.filter(b => b.id !== bookingId))
    
    try {
      // API call to accept booking
      console.log('Accepting booking:', bookingId)
      // This would trigger payment capture and Zoom meeting creation
    } catch (error) {
      console.error('Error accepting booking:', error)
      // Revert optimistic update on error
    }
  }

  const handleDeclineBooking = async (bookingId: string) => {
    setPendingBookings(prev => prev.filter(b => b.id !== bookingId))
    
    try {
      // API call to decline booking
      console.log('Declining booking:', bookingId)
    } catch (error) {
      console.error('Error declining booking:', error)
    }
  }

  const handleProposeNewTime = async (bookingId: string) => {
    // Open time picker modal
    console.log('Proposing new time for booking:', bookingId)
  }

  const handleStartMeeting = (sessionId: string) => {
    // Launch Zoom meeting
    console.log('Starting meeting for session:', sessionId)
  }

  const handleMarkNoShow = async (sessionId: string) => {
    try {
      console.log('Marking no-show for session:', sessionId)
    } catch (error) {
      console.error('Error marking no-show:', error)
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
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
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
              <h1 className="text-2xl font-bold text-gray-800">Expert Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, {user?.name || 'Expert'}!
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
            
            {/* Action Queue - Pending Bookings */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Action Queue
                  {pendingBookings.length > 0 && (
                    <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      {pendingBookings.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No pending bookings</p>
                    <p className="text-sm text-gray-500">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div key={booking.id} className="bg-white p-4 rounded-lg border border-orange-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              {booking.learner?.avatarUrl ? (
                                <img 
                                  src={booking.learner.avatarUrl} 
                                  alt="Learner avatar" 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {booking.learner?.name || 'Learner'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatDateTime(booking.startTime)} (Copenhagen)
                              </p>
                              <p className="text-sm font-medium text-green-600">
                                {formatCurrency(booking.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeclineBooking(booking.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleProposeNewTime(booking.id)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Propose New Time
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                  <span className="text-sm font-normal text-gray-500">
                    ({formatDate(new Date())})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaySessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No sessions today</p>
                    <p className="text-sm text-gray-500">Enjoy your free time!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {session.learner?.name || 'Learner'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleStartMeeting(session.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Start Meeting
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkNoShow(session.id)}
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          >
                            <UserX className="w-4 h-4" />
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
            
            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Month to Date</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {formatCurrency(earnings.mtd)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-lg font-semibold text-orange-600">
                    {formatCurrency(earnings.pending)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Payout</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatDate(earnings.nextPayout)}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View All Payouts
                </Button>
              </CardContent>
            </Card>

            {/* Availability Quick Set */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    Tomorrow
                  </Button>
                  <Button variant="outline" size="sm">
                    This Week
                  </Button>
                  <Button variant="outline" size="sm">
                    Next Week
                  </Button>
                </div>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Availability
                </Button>
              </CardContent>
            </Card>

            {/* Inbox */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Inbox className="w-5 h-5" />
                  Inbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Inbox className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No new messages</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}