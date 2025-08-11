import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  Users,
  BookOpen,
  Target,
  Star,
  Settings,
  Plus,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/')
  }

  const isLearner = user.role === 'learner'
  const isExpert = user.role === 'expert'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-500">
                AI Rookie
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {isLearner ? 'Learner' : 'Expert'}
              </Badge>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'there'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            {isLearner 
              ? "Ready to level up your AI skills? Let's find you the perfect session."
              : "Time to share your expertise and help AI rookies succeed."
            }
          </p>
        </div>

        {isLearner && (
          <>
            {/* Learner Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-6 flex-col space-y-2" size="lg">
                  <Users className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Find an Expert</span>
                  <span className="text-sm opacity-80">Browse available experts</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex-col space-y-2" size="lg">
                  <Calendar className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Book a Session</span>
                  <span className="text-sm opacity-80">Schedule your next learning session</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex-col space-y-2" size="lg">
                  <BookOpen className="w-8 h-8 mb-2" />
                  <span className="font-semibold">My Sessions</span>
                  <span className="text-sm opacity-80">View upcoming & past sessions</span>
                </Button>
              </div>
            </div>

            {/* Learner Dashboard Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* What You'll Get */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    What You'll Get From Your Next Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Working Solutions</h4>
                        <p className="text-sm text-gray-600">Leave with actual prompts, workflows, or tools built for your specific needs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Personalized Guidance</h4>
                        <p className="text-sm text-gray-600">1:1 coaching adapted to your skill level and specific tools</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Actionable Takeaways</h4>
                        <p className="text-sm text-gray-600">Recap, custom prompts, and next-step checklist delivered to your inbox</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">No Fluff Approach</h4>
                        <p className="text-sm text-gray-600">Plain-English explanations and quick wins you can implement immediately</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6">
                    Book Your Next Session
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">0</div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">0</div>
                    <div className="text-sm text-gray-600">AI Tools Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">0</div>
                    <div className="text-sm text-gray-600">Workflows Built</div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No sessions yet</p>
                    <Button variant="outline" size="sm">
                      Schedule Your First Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips for Success */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Tips for Success
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">Come with a specific task or outcome in mind</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">Mention your current tools (Docs, Sheets, Notion, etc.)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">Ask questions during the session</p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-500">Email:</span>
                    <br />
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Member since:</span>
                    <br />
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {isExpert && (
          <>
            {/* Expert Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-auto p-6 flex-col space-y-2" size="lg">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Add Availability</span>
                  <span className="text-sm opacity-80">Set your open time slots</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex-col space-y-2" size="lg">
                  <Calendar className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Manage Schedule</span>
                  <span className="text-sm opacity-80">View & update your calendar</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex-col space-y-2" size="lg">
                  <Users className="w-8 h-8 mb-2" />
                  <span className="font-semibold">View Bookings</span>
                  <span className="text-sm opacity-80">See upcoming sessions</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex-col space-y-2" size="lg">
                  <Settings className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Update Profile</span>
                  <span className="text-sm opacity-80">Edit your expert info</span>
                </Button>
              </div>
            </div>

            {/* Expert Dashboard Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Expert Impact */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Your Expert Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-2">0</div>
                      <div className="text-sm text-gray-600 mb-1">Sessions Taught</div>
                      <p className="text-xs text-gray-500">Helping rookies succeed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">0</div>
                      <div className="text-sm text-gray-600 mb-1">Happy Learners</div>
                      <p className="text-xs text-gray-500">Real outcomes delivered</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-500 mb-2">-</div>
                      <div className="text-sm text-gray-600 mb-1">Average Rating</div>
                      <p className="text-xs text-gray-500">Quality feedback</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">💡 Expert Tips</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Focus on practical outcomes learners can implement immediately</li>
                      <li>• Adapt to their existing tools (Docs, Sheets, Gmail, Notion)</li>
                      <li>• Provide clear next steps and takeaway materials</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-gray-400 mb-2">No slots set</div>
                    <p className="text-sm text-gray-600 mb-4">Add your availability to start receiving bookings</p>
                    <Button size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Time Slots
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No upcoming sessions</p>
                    <Button variant="outline" size="sm">
                      Add Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-xs text-gray-400 mt-2">Complete your first session to receive feedback</p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    Profile Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Profile Complete</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Published Status</span>
                      <Badge variant="outline">Not Published</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}