// Auto-sliding testimonial carousel for the oncology template — client component
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { TestimonialEntry } from '@/types/Profile'

interface Props {
  reviews: TestimonialEntry[]
}

const SLIDE_INTERVAL = 4000

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {([1, 2, 3, 4, 5] as const).map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/20'}
        />
      ))}
    </div>
  )
}

export default function TestimonialsCarousel({ reviews }: Props) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (reviews.length <= 1) return
    intervalRef.current = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), SLIDE_INTERVAL)
  }, [reviews.length])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => { start(); return stop }, [start, stop])

  const go = useCallback((dir: 1 | -1) => {
    stop()
    setCurrent((c) => (c + dir + reviews.length) % reviews.length)
    start()
  }, [reviews.length, start, stop])

  const review = reviews[current]

  return (
    <div className="relative">
      {/* Card */}
      <div className="min-h-[140px] rounded-3xl border border-white/10 bg-white/[0.06] p-6">
        <p className="text-sm font-semibold text-oncology-aura mb-1">{review.patient_name}</p>
        <StarRow rating={review.rating} />
        <blockquote className="mt-3 text-slate-200 leading-7 text-sm">
          &ldquo;{review.review}&rdquo;
        </blockquote>
      </div>

      {/* Controls */}
      {reviews.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { stop(); setCurrent(i); start() }}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-2 bg-oncology-aura' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/15 flex items-center justify-center text-white transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/15 flex items-center justify-center text-white transition-colors"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
