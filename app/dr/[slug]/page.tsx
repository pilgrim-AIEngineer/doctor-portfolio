// Public portfolio page at /dr/[slug] — ISR, SEO optimised, JSON-LD schema
import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ISR_REVALIDATE_SECONDS, APP_URL } from '@/lib/constants'
import type { Doctor } from '@/types/Doctor'
import type { Template } from '@/types/Template'
import type { SectionKey } from '@/types/Profile'
import type { DoctorProfile } from '@/types/DoctorProfile'
import ClassicTemplate from '@/components/templates/classic'
import ModernTemplate from '@/components/templates/modern'
import BoldTemplate from '@/components/templates/bold'
import OncologyTemplate from '@/components/templates/oncology'
import NotPublished from '@/components/portfolio/NotPublished'

export const revalidate = ISR_REVALIDATE_SECONDS

interface PageProps {
  params: { slug: string }
}

type PortfolioData = {
  doctor: Doctor
  sections: Partial<Record<SectionKey, unknown>>
  template: Template
} | null

const DEFAULT_TEMPLATE: Template = {
  id: 'classic',
  name: 'classic',
  preview_image: '',
  is_active: true,
}

function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

const fetchPortfolioData = cache(async (slug: string): Promise<PortfolioData> => {
  const supabase = getPublicSupabase()

  const { data: doctor, error: doctorError } = await supabase
    .from('doctors')
    .select('id, name, email, phone, nmc_number, specialty, slug, plan, is_verified, is_published, created_at')
    .eq('slug', slug)
    .single()

  if (doctorError || !doctor) return null

  const [sectionsRes, templateRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('section_key, data, is_visible, display_order')
      .eq('doctor_id', doctor.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('doctor_templates')
      .select('templates(id, name, preview_image, is_active)')
      .eq('doctor_id', doctor.id)
      .maybeSingle(),
  ])

  const allRows = sectionsRes.data ?? []

  const sections: Partial<Record<SectionKey, unknown>> = {}
  for (const row of allRows) {
    if (row.is_visible) {
      sections[row.section_key as SectionKey] = row.data
    }
  }

  // Resolve display name from personal section regardless of its visibility setting
  const personalRow = allRows.find((r) => r.section_key === 'personal')
  const displayName = (personalRow?.data as { name?: string } | undefined)?.name?.trim() || doctor.name

  const rawTemplate = templateRes.data?.templates as unknown as Template | undefined
  const template: Template = rawTemplate ?? DEFAULT_TEMPLATE

  return { doctor: { ...doctor, name: displayName } as Doctor, sections, template }
})

export async function generateStaticParams() {
  const supabase = getPublicSupabase()
  const { data } = await supabase.from('doctors').select('slug').eq('is_published', true)
  return (data ?? []).map((d) => ({ slug: d.slug as string }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchPortfolioData(params.slug)
  if (!data) return { title: 'Doctor Not Found' }

  const { doctor, sections } = data
  const personal = sections.personal as { photo?: string; tagline?: string } | undefined

  return {
    title: `Dr. ${doctor.name} — ${doctor.specialty} | DocFolio`,
    description:
      personal?.tagline ??
      `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty}. View profile on DocFolio.`,
    openGraph: {
      title: `Dr. ${doctor.name} — ${doctor.specialty}`,
      description: personal?.tagline ?? `${doctor.specialty} specialist on DocFolio`,
      type: 'profile',
      url: `${APP_URL}/dr/${doctor.slug}`,
    },
  }
}

function buildJsonLd(doctor: Doctor, sections: Partial<Record<SectionKey, unknown>>) {
  const personal = sections.personal as { photo?: string } | undefined
  const clinic = sections.clinic_info as { address?: string } | undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: `Dr. ${doctor.name}`,
    medicalSpecialty: doctor.specialty,
    telephone: doctor.phone,
    url: `${APP_URL}/dr/${doctor.slug}`,
    ...(personal?.photo ? { image: personal.photo } : {}),
    ...(clinic?.address
      ? { address: { '@type': 'PostalAddress', streetAddress: clinic.address } }
      : {}),
  }
}

function buildFaqJsonLd(sections: Partial<Record<SectionKey, unknown>>) {
  const faq = sections.faq as { items?: { question: string; answer: string }[] } | undefined
  if (!faq?.items?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export default async function DoctorPortfolioPage({ params }: PageProps) {
  const data = await fetchPortfolioData(params.slug)
  if (!data) notFound()

  const { doctor, sections, template } = data

  if (!doctor.is_published) {
    const appointment = sections.appointment as { whatsapp?: string } | undefined
    return <NotPublished doctorName={doctor.name} whatsapp={appointment?.whatsapp} />
  }

  const jsonLd = buildJsonLd(doctor, sections)
  const faqJsonLd = buildFaqJsonLd(sections)
  const profile: DoctorProfile = { doctor, sections, template }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {template.name === 'modern' ? (
        <ModernTemplate profile={profile} />
      ) : template.name === 'bold' ? (
        <BoldTemplate profile={profile} />
      ) : template.name === 'oncology' ? (
        <OncologyTemplate profile={profile} />
      ) : (
        <ClassicTemplate profile={profile} />
      )}
    </>
  )
}
