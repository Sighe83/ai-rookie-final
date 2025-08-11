import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4">
      <div className="space-y-6">
        <SignupForm />

        <div className="text-center space-y-4">
          <p className="text-sm text-text-light">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Sign in
            </Link>
          </p>

          <p className="text-xs text-text-light max-w-sm mx-auto">
            By creating an account, you agree to our terms of service and
            privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}
