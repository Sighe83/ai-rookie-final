'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, BookOpen, Settings, Calendar, Users, TrendingUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface DashboardNavigationProps {
  userRole: 'learner' | 'expert'
}

export function DashboardNavigation({ userRole }: DashboardNavigationProps) {
  const pathname = usePathname()

  const learnerNavItems = [
    { icon: User, label: 'Dashboard', href: '/dashboard', badge: null },
    { icon: BookOpen, label: 'Find Experts', href: '/experts', badge: null },
    { icon: Calendar, label: 'My Bookings', href: '/bookings', badge: null },
    { icon: TrendingUp, label: 'Progress', href: '/progress', badge: null },
    { icon: Settings, label: 'Settings', href: '/settings', badge: null }
  ]

  const expertNavItems = [
    { icon: User, label: 'Dashboard', href: '/dashboard', badge: null },
    { icon: Calendar, label: 'Availability', href: '/availability', badge: null },
    { icon: Users, label: 'Bookings', href: '/expert/bookings', badge: 'New' },
    { icon: TrendingUp, label: 'Analytics', href: '/expert/analytics', badge: null },
    { icon: Settings, label: 'Profile', href: '/expert/profile', badge: null }
  ]

  const navItems = userRole === 'learner' ? learnerNavItems : expertNavItems

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 mb-6">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className="flex-shrink-0 whitespace-nowrap"
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-red-100 text-red-800 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}