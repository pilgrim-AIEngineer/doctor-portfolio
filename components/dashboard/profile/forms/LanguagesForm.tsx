// LanguagesForm — edits the "languages" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function LanguagesForm({ data }: { data: unknown }) {
  const existing = data as { spoken?: string[] } | undefined
  const [spoken, setSpoken] = useState<string[]>(existing?.spoken ?? [])

  const status = useAutoSave({ spoken }, (d) => saveProfileSection('languages', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Languages</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Languages spoken</label>
        <TagChipInput value={spoken} onChange={setSpoken} placeholder="e.g. Hindi, English, Marathi" />
      </div>
    </div>
  )
}
