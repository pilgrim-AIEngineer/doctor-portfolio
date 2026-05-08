// Public portfolio page at /dr/[slug] — ISR, SEO optimised
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ISR_REVALIDATE_SECONDS } from '@/lib/constants'

export const revalidate = ISR_REVALIDATE_SECONDS

interface PageProps {
  params: { slug: string }
}

function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = getPublicSupabase()
  const { data: doctor } = await supabase
    .from('doctors')
    .select('name, specialty')
    .eq('slug', params.slug)
    .single()

  if (!doctor) return { title: 'Doctor Not Found' }

  return {
    title: `Dr. ${doctor.name} — ${doctor.specialty}`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty}. View profile on DocFolio.`,
    openGraph: {
      title: `Dr. ${doctor.name}`,
      description: `${doctor.specialty} | DocFolio`,
      type: 'profile',
    },
  }
}

export default async function DoctorPortfolioPage({ params }: PageProps) {
  const supabase = getPublicSupabase()

  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('id, name, specialty, slug, nmc_number, is_verified')
    .eq('slug', params.slug)
    .single()

  if (error || !doctor) notFound()

  return (
    <main>
      {/* Template renderer replaces this once feat/templates lands */}
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
        <p className="text-gray-600 mt-1">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
            ✓ NMC Verified
          </span>
        )}
      </div>
    </main>
  )
}
