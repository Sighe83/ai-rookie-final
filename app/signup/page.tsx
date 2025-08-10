import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="space-y-6">
        <SignupForm />
        
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
          
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            By creating an account, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}