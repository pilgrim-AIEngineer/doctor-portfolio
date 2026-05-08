// ServicesForm — edits the "services" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { servicesSectionSchema, type ServicesSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function ServicesForm({ data }: { data: unknown }) {
  const existing = data as { treatments?: string[]; procedures?: string[]; consultation_types?: string[] } | undefined
  const form = useForm<ServicesSectionInput>({
    resolver: zodResolver(servicesSectionSchema),
    defaultValues: {
      treatments: (existing?.treatments ?? []).join('\n'),
      procedures: (existing?.procedures ?? []).join('\n'),
      consultation_types: (existing?.consultation_types ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('services', {
    treatments: d.treatments.split('\n').filter(Boolean),
    procedures: d.procedures.split('\n').filter(Boolean),
    consultation_types: d.consultation_types.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Services</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Treatments offered <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('treatments')} rows={4} className={INPUT} placeholder={"Knee Replacement\nHip Replacement"} />
      </div>

      <div>
        <label className={LABEL}>Procedures <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('procedures')} rows={4} className={INPUT} placeholder={"Arthroscopy\nLaparoscopy"} />
      </div>

      <div>
        <label className={LABEL}>Consultation types <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('consultation_types')} rows={3} className={INPUT} placeholder={"In-clinic\nOnline / Video\nHome visit"} />
      </div>
    </div>
  )
}
