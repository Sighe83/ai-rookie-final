'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      className="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}