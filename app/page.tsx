'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuthModal } from '@/components/auth/auth-modal'
import { 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Target,
  Shield,
  Calendar,
  FileText,
  Zap,
  MessageSquare
} from 'lucide-react'

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Skip to main content
      </a>
      
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-500">
                AI Rookie
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:inline-flex"
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="shadow-sm"
                aria-label="Get started with AI Rookie"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                For AI Rookies —
                <span className="text-blue-500 block mt-2">What's In It For Me?</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Get real AI outcomes in 60-90 minutes. Leave with working prompts, workflows, 
                or tools built on your actual task—not a demo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Book Your Session
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 border-2 hover:bg-gray-50"
                >
                  See Example Outcomes
                  <Target className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>60-90 minute sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>1:1 or small group coaching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>Real outcomes, not demos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Real Outcomes</h3>
                  <p className="text-gray-600">Leave with working prompts, a mini workflow, or a tool set up—built on your actual task, not a demo.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal, Private Coaching</h3>
                  <p className="text-gray-600">1:1 or small group with a vetted expert who adapts to your level and stack (Docs, Sheets, Gmail, Notion, etc.).</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="bg-violet-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-violet-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Clarity Without the Fluff</h3>
                  <p className="text-gray-600">Plain-English explanations, quick wins first, and a simple next-step plan so you keep momentum after the call.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Tangible Takeaways</h3>
                  <p className="text-gray-600">A short recap, your tailored prompt snippets, and a checklist you can reuse—delivered to your inbox.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Frictionless Experience</h3>
                  <p className="text-gray-600">Book in 2 minutes, automatic calendar + Zoom, timezone-safe scheduling, polite reminders.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Awkwardness, No Risk</h3>
                  <p className="text-gray-600">Transparent pricing. Your card is only captured when the expert accepts. Clear cancellation and refund rules.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                How It Works (For You)
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three simple steps to get real AI outcomes that work for your specific needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pick an Outcome</h3>
                <p className="text-gray-600">e.g., "summarize customer emails daily" or "draft a policy safely"</p>
              </div>

              <div className="text-center">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Expert & Time</h3>
                <p className="text-gray-600">Select your preferred expert and authorize payment when they accept</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Build Together</h3>
                <p className="text-gray-600">Join the session → build it together → get your recap + next steps</p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Outcomes Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Example Outcomes You Can Walk Away With
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real, tangible results you'll actually use in your daily work.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">A reusable prompt library for your weekly tasks</h3>
                <p className="text-gray-600">Custom prompts that understand your specific role, industry, and communication style.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">A simple "data → summary" workflow</h3>
                <p className="text-gray-600">e.g., email → sheet → report automation that actually works with your existing tools.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <CheckCircle className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">A safe-to-use template for contracts, policies, or briefs</h3>
                <p className="text-gray-600">Professional templates with built-in safeguards and clear guidance on customization.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                <CheckCircle className="w-8 h-8 text-yellow-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">A lightweight automation</h3>
                <p className="text-gray-600">No heavy IT needed—simple automations that integrate with your current workflow.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Real AI Outcomes?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Book your 60-90 minute session and walk away with working solutions 
              built specifically for your needs.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-blue-500 hover:bg-gray-50 shadow-lg"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Book Your Session Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="text-2xl font-bold text-blue-500 mb-4">AI Rookie</div>
              <p className="text-gray-500 mb-4">
                Real AI outcomes in 60-90 minutes. No fluff, no demos—just practical solutions for your actual tasks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-500">
                <li><Link href="/how-it-works" className="hover:text-blue-500 transition-colors">How It Works</Link></li>
                <li><Link href="/experts" className="hover:text-blue-500 transition-colors">Find Experts</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-500 transition-colors">Pricing</Link></li>
                <li><Link href="/outcomes" className="hover:text-blue-500 transition-colors">Example Outcomes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-500">
                <li><Link href="/help" className="hover:text-blue-500 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
                <li><Link href="/cancellation" className="hover:text-blue-500 transition-colors">Cancellation Policy</Link></li>
                <li><Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-500">
                <li><Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                <li><Link href="/refunds" className="hover:text-blue-500 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-500">
            <p>&copy; 2024 AI Rookie. All rights reserved. Real outcomes, not demos.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  )
}