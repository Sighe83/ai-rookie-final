import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const user = await getUser()

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to continue your coding journey?
            </p>
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/dashboard">
                Go to Dashboard →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            AI Rookie
          </div>
          <div className="space-x-4">
            <Button asChild variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn to Code with
            <span className="text-blue-600 block">Expert Mentors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with experienced developers for personalized, one-on-one coding sessions. 
            Accelerate your learning with live mentorship and real-time guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-4 shadow-lg">
              <Link href="/signup">
                Start Learning Today
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link href="/login">
                I'm an Expert
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Mentorship</h3>
              <p className="text-gray-600">Connect with experienced developers who understand your challenges and can guide your learning journey.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Sessions</h3>
              <p className="text-gray-600">Interactive coding sessions with screen sharing, code reviews, and real-time problem solving.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accelerated Learning</h3>
              <p className="text-gray-600">Learn faster with personalized guidance, immediate feedback, and tailored learning paths.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 p-8 bg-white rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to accelerate your coding journey?</h2>
            <p className="text-lg text-gray-600 mb-6">Join thousands of learners who are building their programming skills with expert guidance.</p>
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href="/signup">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 AI Rookie. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}