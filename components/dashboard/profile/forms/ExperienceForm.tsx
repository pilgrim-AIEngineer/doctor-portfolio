// ExperienceForm — edits the "experience" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { experienceSectionSchema, type ExperienceSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function ExperienceForm({ data }: { data: unknown }) {
  const existing = data as { years?: number; current_affiliation?: string; hospitals?: string[] } | undefined
  const form = useForm<ExperienceSectionInput>({
    resolver: zodResolver(experienceSectionSchema),
    defaultValues: {
      years: existing?.years ?? 0,
      current_affiliation: existing?.current_affiliation ?? '',
      hospitals: (existing?.hospitals ?? []).join('\n'),
    },
  })
  const { register, watch, formState: { errors } } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('experience', {
    years: d.years,
    current_affiliation: d.current_affiliation,
    hospitals: d.hospitals.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Years of experience</label>
        <input type="number" {...register('years', { valueAsNumber: true })} min={0} max={60} className={INPUT} />
        {errors.years && <p className={ERROR}>{errors.years.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Current affiliation</label>
        <input type="text" {...register('current_affiliation')} className={INPUT} placeholder="e.g. Apollo Hospitals, Mumbai" />
      </div>

      <div>
        <label className={LABEL}>Hospitals worked at <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('hospitals')} rows={4} className={`${INPUT} resize-y`} placeholder={"Apollo Hospitals, Mumbai\nFortis, Delhi"} />
      </div>
    </div>
  )
}
