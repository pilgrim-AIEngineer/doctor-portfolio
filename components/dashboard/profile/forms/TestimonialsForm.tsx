// TestimonialsForm — edits the "testimonials" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { testimonialsSectionSchema, type TestimonialsSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function TestimonialsForm({ data }: { data: unknown }) {
  const existing = data as { reviews?: string[] } | undefined
  const form = useForm<TestimonialsSectionInput>({
    resolver: zodResolver(testimonialsSectionSchema),
    defaultValues: {
      reviews: (existing?.reviews ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('testimonials', {
    reviews: d.reviews.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Patient Reviews</h2>
        <SaveStatus status={status} />
      </div>

      <p className="text-sm text-gray-500">
        Enter one review per line. Format: <span className="font-mono text-xs bg-gray-100 px-1 rounded">Patient name — Review text</span>
      </p>

      <div>
        <label className={LABEL}>Reviews <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea
          {...register('reviews')}
          rows={8}
          className={INPUT}
          placeholder={"Ramesh K — Excellent surgeon, very caring\nPriya S — Explained everything clearly"}
        />
      </div>
    </div>
  )
}
