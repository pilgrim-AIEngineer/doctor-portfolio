// ExperienceForm — edits the "experience" profile section
'use client'

import { useState, useEffect } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import type { HospitalEntry } from '@/types/Profile'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): HospitalEntry => ({
  role: '',
  hospital: '',
  location: '',
  from_year: new Date().getFullYear(),
  to_year: null,
})

function HospitalCard({
  item,
  index,
  onChange,
}: {
  item: HospitalEntry
  index: number
  onChange: (index: number, updated: HospitalEntry) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className={LABEL}>Role / Designation</label>
        <input
          type="text"
          value={item.role}
          onChange={(e) => onChange(index, { ...item, role: e.target.value })}
          className={INPUT}
          placeholder="e.g. Senior Consultant"
        />
      </div>
      <div>
        <label className={LABEL}>Hospital / Institution</label>
        <input
          type="text"
          value={item.hospital}
          onChange={(e) => onChange(index, { ...item, hospital: e.target.value })}
          className={INPUT}
          placeholder="e.g. Apollo Hospitals"
        />
      </div>
      <div>
        <label className={LABEL}>City</label>
        <input
          type="text"
          value={item.location}
          onChange={(e) => onChange(index, { ...item, location: e.target.value })}
          className={INPUT}
          placeholder="e.g. Mumbai"
        />
      </div>
      <div>
        <label className={LABEL}>From year</label>
        <input
          type="number"
          value={item.from_year}
          onChange={(e) => onChange(index, { ...item, from_year: parseInt(e.target.value) || 2000 })}
          className={INPUT}
          min={1950}
          max={new Date().getFullYear()}
        />
      </div>
      <div>
        <label className={LABEL}>To year <span className="text-gray-400">(blank = present)</span></label>
        <input
          type="number"
          value={item.to_year ?? ''}
          onChange={(e) =>
            onChange(index, { ...item, to_year: e.target.value ? parseInt(e.target.value) : null })
          }
          className={INPUT}
          min={1950}
          max={new Date().getFullYear()}
          placeholder="Present"
        />
      </div>
    </div>
  )
}

export default function ExperienceForm({ data }: { data: unknown }) {
  const existing = data as { hospitals?: HospitalEntry[]; current_affiliation?: string } | undefined
  const [hospitals, setHospitals] = useState<HospitalEntry[]>(existing?.hospitals ?? [])
  const [currentAffiliation, setCurrentAffiliation] = useState(existing?.current_affiliation ?? '')

  function updateHospital(index: number, updated: HospitalEntry) {
    setHospitals((prev) => prev.map((h, i) => (i === index ? updated : h)))
  }

  const formData = { hospitals, current_affiliation: currentAffiliation }
  const status = useAutoSave(formData, (d) => saveProfileSection('experience', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('experience', formData) }, [JSON.stringify(formData)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current affiliation</label>
        <input
          type="text"
          value={currentAffiliation}
          onChange={(e) => setCurrentAffiliation(e.target.value)}
          className={INPUT}
          placeholder="e.g. Apollo Hospitals, Mumbai"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Positions held</p>
        <CardArrayInput
          items={hospitals}
          onAdd={() => setHospitals((prev) => [...prev, emptyEntry()])}
          onRemove={(i) => setHospitals((prev) => prev.filter((_, idx) => idx !== i))}
          renderCard={(item, i) => <HospitalCard item={item} index={i} onChange={updateHospital} />}
          addLabel="Add position"
        />
      </div>
    </div>
  )
}
