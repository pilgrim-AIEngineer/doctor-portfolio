// Live portfolio preview panel — renders the doctor's selected template from draft store data
'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDraftStore } from '@/hooks/useDraftStore'
import type { Doctor } from '@/types/Doctor'
import type { Template } from '@/types/Template'
import type { DoctorProfile } from '@/types/DoctorProfile'
import type { SectionKey } from '@/types/Profile'

const ClassicTemplate = dynamic(() => import('@/components/templates/classic'))
const ModernTemplate = dynamic(() => import('@/components/templates/modern'))
const BoldTemplate = dynamic(() => import('@/components/templates/bold'))
const OncologyTemplate = dynamic(() => import('@/components/templates/oncology'))

interface ProfilePreviewPanelProps {
  doctor: Doctor
  template: Template
  activeSection: SectionKey
}

function TemplateRenderer({ profile }: { profile: DoctorProfile }) {
  if (profile.template.name === 'modern') return <ModernTemplate profile={profile} />
  if (profile.template.name === 'bold') return <BoldTemplate profile={profile} />
  if (profile.template.name === 'oncology') return <OncologyTemplate profile={profile} />
  return <ClassicTemplate profile={profile} />
}

export default function ProfilePreviewPanel({ doctor, template, activeSection }: ProfilePreviewPanelProps) {
  const sections = useDraftStore((s) => s.sections)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const personal = sections.personal as { name?: string } | undefined
  const displayName = personal?.name?.trim() || doctor.name
  const profile: DoctorProfile = { doctor: { ...doctor, name: displayName }, sections, template }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setScale(Math.min(1, Math.max(0.4, width / 768)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const target = document.getElementById(`section-${activeSection}`)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeSection])

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto bg-gray-100">
      <div
        className="bg-white origin-top-left"
        style={{
          width: '768px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          minHeight: `${100 / scale}%`,
        }}
      >
        <TemplateRenderer profile={profile} />
      </div>
    </div>
  )
}
