// Top navigation bar for the doctor dashboard — replaces the left sidebar on desktop
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  User,
  LayoutTemplate,
  Eye,
  Calendar,
  CreditCard,
  Settings,
  ExternalLink,
  Stethoscope,
} from 'lucide-react'
import { DASHBOARD_NAV } from '@/lib/constants'

const NAV_ICONS = {
  '/dashboard/profile':      User,
  '/dashboard/template':     LayoutTemplate,
  '/dashboard/preview':      Eye,
  '/dashboard/appointments': Calendar,
  '/dashboard/billing':      CreditCard,
  '/dashboard/settings':     Settings,
} as const

interface TopNavProps {
  name: string
  specialty: string
  slug: string
}

export default function TopNav({ name, specialty, slug }: TopNavProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 hidden md:flex items-center px-6 gap-6">
      {/* Doctor identity */}
      <div className="flex items-center gap-2.5 shrink-0 max-w-[200px]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
          <Stethoscope className="h-4 w-4 text-brand-600" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
          <p className="truncate text-xs text-gray-500">{specialty}</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex items-center justify-center gap-0.5">
        {DASHBOARD_NAV.map((item) => {
          const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS]
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Portfolio CTA */}
      <a
        href={`/dr/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1.5 rounded-lg border border-brand-600 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
      >
        View my portfolio
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </a>
    </header>
  )
}
