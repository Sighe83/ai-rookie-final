import { User, ExpertProfile, Booking } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, DollarSign, Star, Settings, Users, TrendingUp, BarChart, Eye } from 'lucide-react'

interface ExpertDashboardProps {
  user: User & {
    expertProfile?: ExpertProfile | null
    expertBookings?: Booking[]
  }
}

export function ExpertDashboard({ user }: ExpertDashboardProps) {
  const profile = user.expertProfile

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.displayName || user.name}!</h1>
        <p className="text-green-100">
          {profile?.isPublished ? 'Your profile is live and accepting bookings' : 'Complete your profile to start accepting bookings'}
        </p>
      </div>

      {/* Profile Status */}
      {!profile?.isPublished && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Settings className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-yellow-800">Complete Your Profile</p>
                  <p className="text-sm text-yellow-600">Finish setting up your profile to start accepting bookings</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-yellow-300">
                <Settings className="h-4 w-4 mr-2" />
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${profile?.hourlyRate?.toString() || '0'}</p>
                <p className="text-sm text-gray-500">Hourly Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Sessions This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.avgRating?.toString() || 'N/A'}</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your expert profile and sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Manage Availability
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Bookings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest session requests and confirmations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent bookings</p>
              <p className="text-sm">Bookings will appear here once learners start booking sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Your scheduled teaching sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming sessions</p>
            <p className="text-sm mb-4">Set your availability to start accepting bookings</p>
            <Button variant="default">
              <Calendar className="h-4 w-4 mr-2" />
              Set Availability
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance This Month
            </CardTitle>
            <CardDescription>Your teaching performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sessions Completed</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Earnings</span>
                <Badge variant="secondary">$0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Rate</span>
                <Badge variant="secondary">N/A</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Reviews & Ratings
            </CardTitle>
            <CardDescription>Feedback from your learners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reviews yet</p>
              <p className="text-sm">Complete your first session to receive reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}