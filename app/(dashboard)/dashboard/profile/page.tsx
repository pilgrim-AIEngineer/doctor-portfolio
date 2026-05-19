// Profile editor page — fetches doctor, sections, template and renders split-screen editor
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPreviewProfileData } from '@/app/actions/template'
import { createServerClient } from '@/lib/supabase/server'
import type { SectionKey, SectionMeta } from '@/types/Profile'
import ProfileEditor from '@/components/dashboard/profile/ProfileEditor'

export const metadata: Metadata = { title: 'Edit Profile' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [previewResult, metaResult] = await Promise.all([
    getPreviewProfileData(),
    supabase
      .from('profiles')
      .select('section_key, is_visible, display_order')
      .eq('doctor_id', user.id),
  ])

  if (previewResult.error || !previewResult.data) {
    return (
      <div className="p-6">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {previewResult.error ?? 'Failed to load profile.'}
        </p>
      </div>
    )
  }

  const { doctor, sections, template } = previewResult.data

  const sectionMeta: SectionMeta[] = (metaResult.data ?? []).map((row) => ({
    section_key: row.section_key as SectionKey,
    is_visible: row.is_visible,
    display_order: row.display_order,
  }))

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ProfileEditor
        sections={sections}
        sectionMeta={sectionMeta}
        doctorPlan={doctor.plan}
        doctor={doctor}
        template={template}
      />
    </div>
  )
}
