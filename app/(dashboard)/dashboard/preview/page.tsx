// Live preview of the doctor's selected public portfolio template
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ExternalLink, FileText, Settings, Sparkles } from 'lucide-react'
import { getPreviewProfileData } from '@/app/actions/template'
import { TEMPLATE_META } from '@/lib/constants'
import type { DoctorProfile } from '@/types/DoctorProfile'
import ClassicTemplate from '@/components/templates/classic'
import ModernTemplate from '@/components/templates/modern'
import BoldTemplate from '@/components/templates/bold'
import OncologyTemplate from '@/components/templates/oncology'
import {
  getPreviewMissingSections,
  getTemplateSections,
} from '@/components/templates/shared'

export const metadata: Metadata = { title: 'Preview Portfolio' }
export const dynamic = 'force-dynamic'

export default async function PreviewPage() {
  const result = await getPreviewProfileData()

  if (result.error || !result.data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error ?? 'Failed to load preview.'}
        </p>
      </div>
    )
  }

  const { doctor, sections, template } = result.data
  const profile: DoctorProfile = { doctor, sections, template }
  const meta = TEMPLATE_META[template.name]
  const missing = getPreviewMissingSections(getTemplateSections(sections))

  return (
    <div className="bg-gray-100">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Sparkles size={16} />
              Previewing {meta.label}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-950">Portfolio Preview</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <DashboardLink href="/dashboard/profile" label="Edit Profile" icon={<FileText size={15} />} />
            <DashboardLink href="/dashboard/template" label="Change Template" icon={<Sparkles size={15} />} />
            <DashboardLink href="/dashboard/settings" label="Publish Settings" icon={<Settings size={15} />} />
            {doctor.slug && (
              <DashboardLink href={`/dr/${doctor.slug}`} label="Public Page" icon={<ExternalLink size={15} />} external />
            )}
          </nav>
        </div>
        {missing.length > 0 && (
          <div className="mx-auto mt-4 max-w-7xl rounded-xl border border-gold-100 bg-gold-50 px-4 py-3 text-sm text-gold-600">
            Add {missing.join(', ')} details to make this preview feel complete.
          </div>
        )}
        {!doctor.is_published && (
          <div className="mx-auto mt-3 max-w-7xl rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            This profile is still private. Preview is visible here before publishing.
          </div>
        )}
      </header>

      <div className="mx-auto max-w-[1600px] bg-white shadow-2xl">
        <TemplateRenderer profile={profile} />
      </div>
    </div>
  )
}

function TemplateRenderer({ profile }: { profile: DoctorProfile }) {
  if (profile.template.name === 'modern') return <ModernTemplate profile={profile} />
  if (profile.template.name === 'bold') return <BoldTemplate profile={profile} />
  if (profile.template.name === 'oncology') return <OncologyTemplate profile={profile} />
  return <ClassicTemplate profile={profile} />
}

function DashboardLink({
  href,
  label,
  icon,
  external = false,
}: {
  href: string
  label: string
  icon: ReactNode
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
    >
      {icon}
      {label}
    </Link>
  )
}
