// TestimonialsForm — edits the "testimonials" profile section
'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { TestimonialEntry } from '@/types/Profile'
import { TESTIMONIAL_REVIEW_MAX_CHARS } from '@/lib/constants'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): TestimonialEntry => ({ patient_name: '', review: '', rating: 5 })

function TestimonialCard({
  item,
  index,
  onChange,
}: {
  item: TestimonialEntry
  index: number
  onChange: (index: number, updated: TestimonialEntry) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Patient name</label>
          <input
            type="text"
            value={item.patient_name}
            onChange={(e) => onChange(index, { ...item, patient_name: e.target.value })}
            className={INPUT}
            placeholder="e.g. Ramesh K."
          />
        </div>
        <div>
          <label className={LABEL}>Rating</label>
          <div className="flex gap-1 mt-1">
            {([1, 2, 3, 4, 5] as const).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(index, { ...item, rating: star })}
                aria-label={`${star} star`}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className={LABEL}>Review <span className="text-gray-400">({item.review.length}/{TESTIMONIAL_REVIEW_MAX_CHARS})</span></label>
        <textarea
          value={item.review}
          onChange={(e) => onChange(index, { ...item, review: e.target.value })}
          rows={3}
          maxLength={TESTIMONIAL_REVIEW_MAX_CHARS}
          className={`${INPUT} resize-y`}
          placeholder="Excellent doctor, very thorough and caring."
        />
      </div>
    </div>
  )
}

export default function TestimonialsForm({ data }: { data: unknown }) {
  const existing = data as { reviews?: TestimonialEntry[] } | undefined
  const [reviews, setReviews] = useState<TestimonialEntry[]>(existing?.reviews ?? [])

  function updateReview(index: number, updated: TestimonialEntry) {
    setReviews((prev) => prev.map((r, i) => (i === index ? updated : r)))
  }

  const status = useAutoSave({ reviews }, (d) => saveProfileSection('testimonials', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Patient Reviews</h2>
        <SaveStatus status={status} />
      </div>
      <CardArrayInput
        items={reviews}
        onAdd={() => setReviews((prev) => [...prev, emptyEntry()])}
        onRemove={(i) => setReviews((prev) => prev.filter((_, idx) => idx !== i))}
        renderCard={(item, i) => <TestimonialCard item={item} index={i} onChange={updateReview} />}
        addLabel="Add review"
      />
    </div>
  )
}
