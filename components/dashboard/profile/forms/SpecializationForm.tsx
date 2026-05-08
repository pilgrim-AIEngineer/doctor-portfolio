// SpecializationForm — edits the "specialization" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { specializationSectionSchema, type SpecializationSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function SpecializationForm({ data }: { data: unknown }) {
  const existing = data as { primary?: string; sub_specialties?: string[] } | undefined
  const form = useForm<SpecializationSectionInput>({
    resolver: zodResolver(specializationSectionSchema),
    defaultValues: {
      primary: existing?.primary ?? '',
      sub_specialties: (existing?.sub_specialties ?? []).join('\n'),
    },
  })
  const { register, watch, formState: { errors } } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('specialization', {
    primary: d.primary,
    sub_specialties: d.sub_specialties.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Specialization</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Primary specialty</label>
        <input type="text" {...register('primary')} className={INPUT} placeholder="e.g. Orthopaedic Surgery" />
        {errors.primary && <p className={ERROR}>{errors.primary.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Sub-specialties <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('sub_specialties')} rows={4} className={`${INPUT} resize-y`} placeholder={"Joint Replacement\nSports Medicine\nSpinal Surgery"} />
      </div>
    </div>
  )
}
