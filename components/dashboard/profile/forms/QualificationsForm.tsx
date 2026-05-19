// QualificationsForm — edits the "qualifications" profile section
'use client'

import { useState, useEffect } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import type { QualificationEntry } from '@/types/Profile'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): QualificationEntry => ({ degree: '', institution: '', year: new Date().getFullYear() })

function QualCard({
  item,
  index,
  onChange,
}: {
  item: QualificationEntry
  index: number
  onChange: (index: number, updated: QualificationEntry) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className={LABEL}>Degree / Title</label>
        <input
          type="text"
          value={item.degree}
          onChange={(e) => onChange(index, { ...item, degree: e.target.value })}
          className={INPUT}
          placeholder="e.g. MS (Orthopaedics)"
        />
      </div>
      <div>
        <label className={LABEL}>Institution</label>
        <input
          type="text"
          value={item.institution}
          onChange={(e) => onChange(index, { ...item, institution: e.target.value })}
          className={INPUT}
          placeholder="e.g. AIIMS Delhi"
        />
      </div>
      <div>
        <label className={LABEL}>Year</label>
        <input
          type="number"
          value={item.year}
          onChange={(e) => onChange(index, { ...item, year: parseInt(e.target.value) || 2000 })}
          className={INPUT}
          min={1950}
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  )
}

export default function QualificationsForm({ data }: { data: unknown }) {
  const existing = data as { degrees?: QualificationEntry[]; fellowships?: QualificationEntry[] } | undefined
  const [degrees, setDegrees] = useState<QualificationEntry[]>(existing?.degrees ?? [])
  const [fellowships, setFellowships] = useState<QualificationEntry[]>(existing?.fellowships ?? [])

  function updateDegree(index: number, updated: QualificationEntry) {
    setDegrees((prev) => prev.map((d, i) => (i === index ? updated : d)))
  }
  function updateFellowship(index: number, updated: QualificationEntry) {
    setFellowships((prev) => prev.map((f, i) => (i === index ? updated : f)))
  }

  const formData = { degrees, fellowships }
  const status = useAutoSave(formData, (d) => saveProfileSection('qualifications', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('qualifications', formData) }, [JSON.stringify(formData)])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Qualifications</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Degrees</p>
        <CardArrayInput
          items={degrees}
          onAdd={() => setDegrees((prev) => [...prev, emptyEntry()])}
          onRemove={(i) => setDegrees((prev) => prev.filter((_, idx) => idx !== i))}
          renderCard={(item, i) => <QualCard item={item} index={i} onChange={updateDegree} />}
          addLabel="Add degree"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Fellowships</p>
        <CardArrayInput
          items={fellowships}
          onAdd={() => setFellowships((prev) => [...prev, emptyEntry()])}
          onRemove={(i) => setFellowships((prev) => prev.filter((_, idx) => idx !== i))}
          renderCard={(item, i) => <QualCard item={item} index={i} onChange={updateFellowship} />}
          addLabel="Add fellowship"
        />
      </div>
    </div>
  )
}
