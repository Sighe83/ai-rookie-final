import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4">
      <div className="space-y-6">
        <LoginForm />
        
        <div className="text-center space-y-4">
          <p className="text-sm text-text-light">
            New learner?{' '}
            <Link 
              href="/signup" 
              className="font-medium text-primary hover:text-primary-hover"
            >
              Create an account
            </Link>
          </p>
          
          <p className="text-xs text-text-light">
            Expert looking to join?{' '}
            <Link 
              href="/contact" 
              className="font-medium text-veteran-text hover:text-violet-700"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}