// Profile editor page — loads all section data server-side and renders the tabbed editor
import type { Metadata } from 'next'
import { getProfileSections } from '@/app/actions/profile'
import type { ProfileSection, SectionKey } from '@/types/Profile'
import ProfileEditor from '@/components/dashboard/profile/ProfileEditor'

export const metadata: Metadata = { title: 'Edit Profile' }

export default async function ProfilePage() {
  const result = await getProfileSections()

  const sections: Partial<Record<SectionKey, unknown>> = {}
  if (result.data) {
    for (const row of result.data as ProfileSection[]) {
      sections[row.section_key] = row.data
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Profile</h1>
      <ProfileEditor sections={sections} />
    </div>
  )
}
