import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AI <span className="text-blue-600">Rookie</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with expert developers for personalized coding sessions. Learn faster with one-on-one mentorship.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/experts">Find an Expert</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👨‍💻 Expert Mentors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn from experienced developers with real-world expertise in your tech stack.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Personalized Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get tailored guidance based on your specific goals and learning pace.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Pay Per Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                No subscriptions. Only pay for the sessions you book with secure Stripe payments.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Browse Experts</h3>
              <p className="text-gray-600 text-sm">
                Find the perfect mentor based on their expertise and availability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Book Session</h3>
              <p className="text-gray-600 text-sm">
                Choose a time slot and securely pay for your session.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Confirmation</h3>
              <p className="text-gray-600 text-sm">
                Expert confirms your booking and you receive a Zoom link.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Learn & Grow</h3>
              <p className="text-gray-600 text-sm">
                Have your 1-on-1 session and accelerate your learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
