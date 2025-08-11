'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setError('')
    setMessage('')
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  const validateForm = () => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return false
    }

    if (mode === 'signup') {
      if (!name) {
        setError('Please enter your name')
        return false
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Ensure user record exists in our database
        try {
          const response = await fetch('/api/auth/create-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              supabaseUserId: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || email.split('@')[0],
              role: 'learner',
            }),
          })

          if (!response.ok) {
            console.warn('Failed to ensure user record exists')
          }
        } catch (createError) {
          console.warn('Error ensuring user record:', createError)
        }

        onClose()
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // If user is immediately confirmed, create the User record
        if (data.user.email_confirmed_at) {
          try {
            const response = await fetch('/api/auth/create-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                supabaseUserId: data.user.id,
                email: data.user.email,
                name: name,
                role: 'learner',
              }),
            })

            if (!response.ok) {
              console.warn('Failed to create user record')
            }
          } catch (createError) {
            console.error('Error creating user record:', createError)
          }

          setMessage('Account created successfully! You can now sign in.')
          setTimeout(() => switchMode('signin'), 2000)
        } else {
          // User needs to confirm email first
          setMessage(
            'Check your email to confirm your account! You must confirm your email before you can sign in.'
          )
        }

        // Clear form after successful signup
        resetForm()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (mode === 'signin') {
      handleSignIn()
    } else {
      handleSignUp()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {mode === 'signin' ? 'Welcome Back' : 'Join AI Rookie'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {mode === 'signin'
              ? 'Sign in to continue your coding journey'
              : 'Create your account to start learning with expert mentors'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {mode === 'signup' && (
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                aria-label="Full name"
              />
            )}

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              aria-label="Email address"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              aria-label="Password"
            />

            {mode === 'signup' && (
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                aria-label="Confirm password"
              />
            )}

            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !email ||
                !password ||
                (mode === 'signup' && (!name || !confirmPassword))
              }
              className="w-full"
              aria-label={
                mode === 'signin'
                  ? 'Sign in to your account'
                  : 'Create your account'
              }
            >
              {isLoading
                ? mode === 'signin'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </div>

          {/* Messages */}
          {error && (
            <div
              className="p-3 text-sm text-red-800 bg-red-50 border border-red-400 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="p-3 text-sm text-green-800 bg-green-50 border border-green-400 rounded-lg"
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            By {mode === 'signin' ? 'signing in' : 'creating an account'}, you
            agree to our{' '}
            <a
              href="/terms"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
