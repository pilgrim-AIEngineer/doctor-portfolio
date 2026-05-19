// Dashboard home — assembles portfolio status card, profile strength, and stats row
import Link from 'next/link'
import type { SectionKey } from '@/types/Profile'
import ProfileStrength from '@/components/dashboard/ProfileStrength'
import PortfolioStatusCard from '@/components/dashboard/PortfolioStatusCard'
import StatsRow from '@/components/dashboard/StatsRow'

interface Props {
  doctor: { name: string; slug: string; plan: string; is_published: boolean }
  sections: Partial<Record<SectionKey, unknown>>
  portfolioUrl: string
  lastUpdated: string | null
}

export default function DashboardHome({ doctor, sections, portfolioUrl, lastUpdated }: Props) {
  const firstName = doctor.name.split(' ')[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, Dr. {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is how your portfolio looks today.
        </p>
      </div>

      <PortfolioStatusCard
        isPublished={doctor.is_published}
        portfolioUrl={portfolioUrl}
        slug={doctor.slug}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 pt-4 pb-1">
            <h2 className="text-sm font-semibold text-gray-700">Profile Strength</h2>
          </div>
          <ProfileStrength sections={sections} />
          <div className="grid grid-cols-3 gap-2 p-4 pt-3">
            {[
              { label: 'Edit Profile', href: '/dashboard/profile' },
              { label: 'Template', href: '/dashboard/template' },
              { label: 'Preview', href: '/dashboard/preview' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-center rounded-lg border border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <StatsRow lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}
