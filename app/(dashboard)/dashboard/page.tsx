// Dashboard home page — fetches doctor + sections and renders the home control centre
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { APP_URL } from '@/lib/constants'
import DashboardHome from '@/components/dashboard/DashboardHome'
import type { SectionKey } from '@/types/Profile'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [doctorRes, profilesRes] = await Promise.all([
    supabase
      .from('doctors')
      .select('name, slug, plan, is_published')
      .eq('id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('section_key, data, updated_at')
      .eq('doctor_id', user.id),
  ])

  if (doctorRes.error || !doctorRes.data) redirect('/onboarding')

  if (profilesRes.error) {
    console.error('[DashboardPage] profiles fetch failed', profilesRes.error.message)
  }
  const doctor = doctorRes.data
  const profiles = profilesRes.data ?? []

  const sections: Partial<Record<SectionKey, unknown>> = {}
  for (const row of profiles) {
    sections[row.section_key as SectionKey] = row.data
  }

  const lastUpdated =
    profiles.length > 0
      ? profiles.reduce(
          (max, p) => (p.updated_at > max ? p.updated_at : max),
          profiles[0].updated_at,
        )
      : null

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <DashboardHome
        doctor={doctor}
        sections={sections}
        portfolioUrl={`${APP_URL}/dr/${doctor.slug}`}
        lastUpdated={formattedLastUpdated}
      />
    </div>
  )
}
