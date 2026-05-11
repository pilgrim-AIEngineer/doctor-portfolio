// AchievementsForm — edits the "achievements" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function AchievementsForm({ data }: { data: unknown }) {
  const existing = data as { awards?: string[]; recognitions?: string[] } | undefined
  const [awards, setAwards] = useState<string[]>(existing?.awards ?? [])
  const [recognitions, setRecognitions] = useState<string[]>(existing?.recognitions ?? [])

  const formData = { awards, recognitions }
  const status = useAutoSave(formData, (d) => saveProfileSection('achievements', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Awards</label>
        <TagChipInput value={awards} onChange={setAwards} placeholder="e.g. Best Surgeon Award — IMA 2022" />
      </div>
      <div>
        <label className={LABEL}>Recognitions</label>
        <TagChipInput value={recognitions} onChange={setRecognitions} placeholder="e.g. Top Doctor — Practo 2023" />
      </div>
    </div>
  )
}
