import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="space-y-6">
        <LoginForm />
        
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            New learner?{' '}
            <Link 
              href="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create an account
            </Link>
          </p>
          
          <p className="text-xs text-muted-foreground">
            Expert looking to join?{' '}
            <Link 
              href="/contact" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}