// ResearchForm — edits the "research" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { researchSectionSchema, type ResearchSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function ResearchForm({ data }: { data: unknown }) {
  const existing = data as { publications?: string[]; conferences?: string[] } | undefined
  const form = useForm<ResearchSectionInput>({
    resolver: zodResolver(researchSectionSchema),
    defaultValues: {
      publications: (existing?.publications ?? []).join('\n'),
      conferences: (existing?.conferences ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('research', {
    publications: d.publications.split('\n').filter(Boolean),
    conferences: d.conferences.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Research</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Publications <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('publications')} rows={5} className={INPUT} placeholder={"Outcomes of TKR in Indian patients — IJOO 2021\nMinimally Invasive Hip Surgery — JBJS 2019"} />
      </div>

      <div>
        <label className={LABEL}>Conferences attended / presented <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('conferences')} rows={4} className={INPUT} placeholder={"AAOS Annual Meeting — San Diego 2023\nISOA Conference — Hyderabad 2022"} />
      </div>
    </div>
  )
}
