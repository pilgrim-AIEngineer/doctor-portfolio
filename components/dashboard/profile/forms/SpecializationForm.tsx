// SpecializationForm — edits the "specialization" profile section
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { specializationSectionSchema } from '@/lib/validations/profile'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function SpecializationForm({ data }: { data: unknown }) {
  const existing = data as { primary?: string; sub_specialties?: string[] } | undefined
  const [subSpecialties, setSubSpecialties] = useState<string[]>(existing?.sub_specialties ?? [])
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(specializationSectionSchema),
    defaultValues: { primary: existing?.primary ?? '', sub_specialties: [] },
  })
  const primary = watch('primary')
  const formData = { primary, sub_specialties: subSpecialties }
  const status = useAutoSave(formData, (d) => saveProfileSection('specialization', d))

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
        <label className={LABEL}>Sub-specialties</label>
        <TagChipInput value={subSpecialties} onChange={setSubSpecialties} placeholder="e.g. Joint Replacement" />
      </div>
    </div>
  )
}
