// ProfileStrength — weighted profile completion score with nudge copy
'use client'

import type { SectionKey } from '@/types/Profile'

const WEIGHTS: Partial<Record<SectionKey, number>> = {
  personal: 15,
  specialization: 10,
  experience: 10,
  services: 10,
  clinic_info: 10,
  qualifications: 8,
  fees: 7,
  appointment: 7,
  testimonials: 7,
  achievements: 5,
  gallery: 4,
  research: 3,
  faq: 3,
  insurance: 1,
  languages: 1,
  social: 1,
  registration: 1,
}

const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)

function isFilled(key: SectionKey, data: unknown): boolean {
  if (data == null) return false
  if (key === 'personal') {
    const d = data as { name?: string }
    return Boolean(d?.name)
  }
  if (key === 'fees') {
    const d = data as { consultation_fee?: number }
    return typeof d?.consultation_fee === 'number'
  }
  if (Array.isArray((data as Record<string, unknown>)?.reviews)) {
    return ((data as { reviews: unknown[] }).reviews).length > 0
  }
  if (Array.isArray((data as Record<string, unknown>)?.items)) {
    return ((data as { items: unknown[] }).items).length > 0
  }
  if (Array.isArray((data as Record<string, unknown>)?.hospitals)) {
    return ((data as { hospitals: unknown[] }).hospitals).length > 0
  }
  return true
}

function getNudge(sections: Partial<Record<SectionKey, unknown>>, score: number): string {
  if (score >= 80) return 'Great profile! Keep it updated.'
  const personal = sections.personal as { photo?: string } | undefined
  if (!personal?.photo) return "Add a profile photo — it's the first thing patients see."
  if (!sections.fees) return 'Add your consultation fees — patients always want to know.'
  if (!sections.testimonials) return 'Add patient reviews to build trust with new patients.'
  if (!sections.services) return 'Add your services so patients know what you treat.'
  return 'Fill in more sections to strengthen your profile.'
}

interface ProfileStrengthProps {
  sections: Partial<Record<SectionKey, unknown>>
}

export default function ProfileStrength({ sections }: ProfileStrengthProps) {
  const score = Math.round(
    (Object.entries(WEIGHTS) as [SectionKey, number][]).reduce((acc, [key, weight]) => {
      return acc + (isFilled(key, sections[key]) ? weight : 0)
    }, 0) /
      TOTAL_WEIGHT *
      100
  )

  const color =
    score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-brand-500' : 'bg-amber-400'

  return (
    <div className="px-3 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-600">Profile Strength</span>
        <span className="text-xs font-semibold text-gray-800">{score}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-500">{getNudge(sections, score)}</p>
    </div>
  )
}
