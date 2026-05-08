// QualificationsForm — edits the "qualifications" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { qualificationsSectionSchema, type QualificationsSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function QualificationsForm({ data }: { data: unknown }) {
  const existing = data as { degrees?: string[]; fellowships?: string[] } | undefined
  const form = useForm<QualificationsSectionInput>({
    resolver: zodResolver(qualificationsSectionSchema),
    defaultValues: {
      degrees: (existing?.degrees ?? []).join('\n'),
      fellowships: (existing?.fellowships ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('qualifications', {
    degrees: d.degrees.split('\n').filter(Boolean),
    fellowships: d.fellowships.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Qualifications</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Degrees <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('degrees')} rows={4} className={INPUT} placeholder={"MBBS — AIIMS Delhi\nMS (Orthopaedics) — PGI Chandigarh"} />
      </div>

      <div>
        <label className={LABEL}>Fellowships <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('fellowships')} rows={3} className={INPUT} placeholder={"Fellowship in Joint Replacement — London"} />
      </div>
    </div>
  )
}
