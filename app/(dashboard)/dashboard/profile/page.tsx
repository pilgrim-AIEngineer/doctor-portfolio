// Profile editor page — two-column layout with side nav and active form pane
import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getProfileSections } from '@/app/actions/profile'
import { createServerClient } from '@/lib/supabase/server'
import type { ProfileSection, SectionKey, SectionMeta } from '@/types/Profile'
import ProfileEditor from '@/components/dashboard/profile/ProfileEditor'

export const metadata: Metadata = { title: 'Edit Profile' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [sectionsResult, doctorResult] = await Promise.all([
    getProfileSections(),
    supabase.from('doctors').select('slug, plan').eq('id', user!.id).single(),
  ])

  const sections: Partial<Record<SectionKey, unknown>> = {}
  const sectionMeta: SectionMeta[] = []

  if (sectionsResult.data) {
    for (const row of sectionsResult.data as ProfileSection[]) {
      sections[row.section_key] = row.data
      sectionMeta.push({
        section_key: row.section_key,
        is_visible: row.is_visible,
        display_order: row.display_order,
      })
    }
  }

  const slug = doctorResult.data?.slug as string | undefined
  const plan = (doctorResult.data?.plan as string) ?? 'free'

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        {slug && (
          <Link
            href={`/dr/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Preview <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>
      <ProfileEditor
        sections={sections}
        sectionMeta={sectionMeta}
        doctorPlan={plan}
      />
    </div>
  )
}
