// ResearchForm — edits the "research" profile section
'use client'

import { useState, useEffect } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function ResearchForm({ data }: { data: unknown }) {
  const existing = data as { publications?: string[]; conferences?: string[] } | undefined
  const [publications, setPublications] = useState<string[]>(existing?.publications ?? [])
  const [conferences, setConferences] = useState<string[]>(existing?.conferences ?? [])

  const formData = { publications, conferences }
  const status = useAutoSave(formData, (d) => saveProfileSection('research', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('research', formData) }, [JSON.stringify(formData)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Research</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Publications</label>
        <TagChipInput value={publications} onChange={setPublications} placeholder="e.g. Journal of Cardiology, 2022" />
      </div>
      <div>
        <label className={LABEL}>Conferences</label>
        <TagChipInput value={conferences} onChange={setConferences} placeholder="e.g. AICC Annual Conference 2023" />
      </div>
    </div>
  )
}
