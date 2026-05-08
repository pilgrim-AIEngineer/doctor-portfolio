// Desktop sidebar navigation for the doctor dashboard
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

interface SidebarProps {
  name: string
  specialty: string
  slug: string
}

export default function Sidebar({ name, specialty, slug }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-30">
      {/* Doctor identity */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
            <Stethoscope className="h-5 w-5 text-brand-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
            <p className="truncate text-xs text-gray-500">{specialty}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {DASHBOARD_NAV.map((item) => {
          const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS]
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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
      <div className="px-3 py-4 border-t border-gray-100">
        <a
          href={`/dr/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
        >
          View my portfolio
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </aside>
  )
}
