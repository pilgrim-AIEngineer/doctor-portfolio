// Mobile bottom tab bar for the doctor dashboard (hidden on md+ screens)
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User,
  LayoutTemplate,
  Eye,
  Calendar,
  CreditCard,
  Settings,
} from 'lucide-react'
import { DASHBOARD_NAV } from '@/lib/constants'

const NAV_ICONS = {
  '/dashboard':              Home,
  '/dashboard/profile':      User,
  '/dashboard/template':     LayoutTemplate,
  '/dashboard/preview':      Eye,
  '/dashboard/appointments': Calendar,
  '/dashboard/billing':      CreditCard,
  '/dashboard/settings':     Settings,
} as const

export default function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 md:hidden">
      <div className="flex">
        {DASHBOARD_NAV.map((item) => {
          const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS]
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.shortLabel}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
