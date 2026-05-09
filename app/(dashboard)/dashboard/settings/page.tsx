// Doctor account settings — portfolio visibility toggle
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { APP_URL } from '@/lib/constants'
import PublishToggle from '@/components/dashboard/settings/PublishToggle'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doctor } = await supabase
    .from('doctors')
    .select('id, name, slug, is_published')
    .eq('id', user.id)
    .single()

  if (!doctor) redirect('/onboarding')

  const portfolioUrl = `${APP_URL}/dr/${doctor.slug}`

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-medium text-gray-900">Portfolio visibility</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Control whether your portfolio is publicly accessible.
          </p>
        </div>
        <PublishToggle
          isPublished={doctor.is_published}
          portfolioUrl={portfolioUrl}
        />
      </section>
    </div>
  )
}
