// ServicesForm — edits the "services" profile section
'use client'

import { useState, useEffect } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function ServicesForm({ data }: { data: unknown }) {
  const existing = data as { treatments?: string[]; procedures?: string[]; consultation_types?: string[] } | undefined
  const [treatments, setTreatments] = useState<string[]>(existing?.treatments ?? [])
  const [procedures, setProcedures] = useState<string[]>(existing?.procedures ?? [])
  const [consultationTypes, setConsultationTypes] = useState<string[]>(existing?.consultation_types ?? [])

  const formData = { treatments, procedures, consultation_types: consultationTypes }
  const status = useAutoSave(formData, (d) => saveProfileSection('services', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('services', formData) }, [JSON.stringify(formData)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Services</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Treatments offered</label>
        <TagChipInput value={treatments} onChange={setTreatments} placeholder="e.g. Knee Replacement" />
      </div>
      <div>
        <label className={LABEL}>Procedures</label>
        <TagChipInput value={procedures} onChange={setProcedures} placeholder="e.g. Arthroscopy" />
      </div>
      <div>
        <label className={LABEL}>Consultation types</label>
        <TagChipInput value={consultationTypes} onChange={setConsultationTypes} placeholder="e.g. In-clinic" />
      </div>
    </div>
  )
}
