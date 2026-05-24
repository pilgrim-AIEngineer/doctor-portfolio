// Modern template sidebar nav - sticky desktop navigation with progress track
'use client'

import { useMemo, useEffect, useState } from 'react'
import {
  Award,
  Briefcase,
  GraduationCap,
  Images,
  MapPin,
  Shield,
  Stethoscope,
  User2,
} from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import { getInitials, type TemplateSections } from '@/components/templates/shared'

interface SidebarNavProps {
  sections: TemplateSections
  doctor: Doctor
}

const ALL_NAV_ITEMS = [
  { id: 'modern-about',           label: 'About',          icon: User2,         check: (s: TemplateSections) => !!s.personal?.about },
  { id: 'modern-experience',      label: 'Experience',     icon: Briefcase,     check: (s: TemplateSections) => !!s.experience },
  { id: 'section-qualifications', label: 'Qualifications', icon: GraduationCap, check: (s: TemplateSections) => !!(s.qualifications?.degrees?.length || s.qualifications?.fellowships?.length) },
  { id: 'section-specialization', label: 'Specialization', icon: Shield,        check: (s: TemplateSections) => !!s.specialization },
  { id: 'modern-services',        label: 'Services',       icon: Stethoscope,   check: (s: TemplateSections) => !!s.services },
  { id: 'modern-clinic',          label: 'Clinic',         icon: MapPin,        check: (s: TemplateSections) => !!(s.locations?.locations?.length || s.clinicInfo) },
  { id: 'section-gallery',        label: 'Gallery',        icon: Images,        check: (s: TemplateSections) => !!s.gallery },
  { id: 'section-languages',      label: 'More',           icon: Award,         check: (s: TemplateSections) => !!(s.achievements || s.languages || s.social) },
] as const

export default function SidebarNav({ sections, doctor }: SidebarNavProps) {
  const navItems = useMemo(
    () => ALL_NAV_ITEMS.filter(item => item.check(sections)),
    [sections],
  )
  const [activeId, setActiveId] = useState<string>(navItems[0]?.id ?? '')
  const activeIndex = navItems.findIndex(item => item.id === activeId)
  const progressPct = navItems.length > 1 ? (activeIndex / (navItems.length - 1)) * 100 : 0

  useEffect(() => {
    const observers = navItems.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })
    return () => { observers.forEach(o => o?.disconnect()) }
  }, [navItems])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }

  const initials = getInitials(doctor.name)

  return (
    <aside className="hidden lg:block w-[220px] shrink-0 self-start sticky top-8">
      {/* Doctor identity */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700/20 text-sm font-bold text-cyan-200">
          {initials}
        </div>
        <p className="text-[13px] font-bold text-white leading-snug">Dr. {doctor.name}</p>
        <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">{doctor.specialty}</p>
      </div>

      {/* Track + nav links */}
      <nav className="relative pl-7">
        {/* Background track */}
        <div className="absolute left-[7px] top-1 bottom-1 w-[1.5px] rounded-full bg-white/10" />
        {/* Progress fill */}
        <div
          className="absolute left-[7px] top-1 w-[1.5px] rounded-full bg-cyan-300/70 transition-[height] duration-400"
          style={{ height: `${progressPct}%` }}
        />

        {navItems.map(({ id, label, icon: Icon }, idx) => {
          const active = activeId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors duration-150 mb-0.5 ${
                active ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              {/* Track dot */}
              <span
                className={`absolute -left-5 top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                  active
                    ? 'h-2.5 w-2.5 bg-cyan-300 shadow-[0_0_0_3px_rgba(103,232,249,0.2)]'
                    : 'h-1.5 w-1.5 bg-slate-600'
                }`}
              />
              {/* Number */}
              <span className={`min-w-[18px] text-[10px] font-bold tabular-nums ${active ? 'text-cyan-300' : 'text-slate-600'}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              {/* Icon */}
              <Icon size={14} className={active ? 'text-cyan-300' : 'text-slate-500'} />
              {/* Label */}
              <span className={`text-[13px] ${active ? 'font-bold text-white' : 'font-medium text-slate-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Book CTA */}
      <a
        href="#modern-book-form"
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-[13px] font-bold text-modern-ink transition hover:bg-cyan-200"
      >
        Book appointment
      </a>
    </aside>
  )
}
