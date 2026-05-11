// InsuranceForm — edits the "insurance" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function InsuranceForm({ data }: { data: unknown }) {
  const existing = data as { panels?: string[] } | undefined
  const [panels, setPanels] = useState<string[]>(existing?.panels ?? [])

  const status = useAutoSave({ panels }, (d) => saveProfileSection('insurance', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Insurance</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Insurance panels accepted</label>
        <TagChipInput value={panels} onChange={setPanels} placeholder="e.g. Star Health, ICICI Lombard" />
      </div>
    </div>
  )
}
