// Classic template sticky section navigation — horizontal scroll chips with active-section tracking
'use client'

import { useEffect, useRef, useState } from 'react'

const SECTION_LABELS: Record<string, string> = {
  'section-personal':       'About',
  'section-qualifications': 'Quals',
  'section-specialization': 'Specialty',
  'section-experience':     'Experience',
  'section-services':       'Services',
  'section-clinic_info':    'Clinic',
  'section-achievements':   'Awards',
  'section-gallery':        'Gallery',
  'section-languages':      'More',
}

interface SectionNavProps {
  sectionIds: string[]
}

export default function SectionNav({ sectionIds }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    if (!sectionIds.length) return

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })

    return () => observers.forEach((obs) => obs?.disconnect())
  }, [sectionIds])

  // Auto-scroll the active chip into view within the strip
  useEffect(() => {
    chipRefs.current.get(activeId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeId])

  if (!sectionIds.length) return null

  function handleChipClick(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const navHeight = 48
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 [&::-webkit-scrollbar]:hidden">
        {sectionIds.map((id) => (
          <button
            key={id}
            ref={(el) => {
              if (el) chipRefs.current.set(id, el)
              else chipRefs.current.delete(id)
            }}
            onClick={() => handleChipClick(id)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeId === id
                ? 'bg-brand-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {SECTION_LABELS[id] ?? id}
          </button>
        ))}
      </div>
    </nav>
  )
}
