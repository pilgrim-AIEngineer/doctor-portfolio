// InsuranceForm — edits the "insurance" profile section
'use client'

import { useState, useEffect } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function InsuranceForm({ data }: { data: unknown }) {
  const existing = data as { panels?: string[] } | undefined
  const [panels, setPanels] = useState<string[]>(existing?.panels ?? [])
  const setSection = useDraftStore((s) => s.setSection)

  const status = useAutoSave({ panels }, (d) => saveProfileSection('insurance', d))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('insurance', { panels }) }, [JSON.stringify(panels)])

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
