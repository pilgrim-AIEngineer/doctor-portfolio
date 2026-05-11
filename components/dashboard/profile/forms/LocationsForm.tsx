// LocationsForm — edits the "locations" profile section (Pro only)
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { LocationEntry } from '@/types/Profile'
import { LOCATIONS_MAX, PHONE_PREFIX } from '@/lib/constants'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyLocation = (): LocationEntry => ({
  name: '',
  address: '',
  phone: '',
  timings: '',
  map_url: '',
  is_primary: false,
})

function LocationCard({
  item,
  index,
  onChange,
}: {
  item: LocationEntry
  index: number
  onChange: (index: number, updated: LocationEntry) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id={`primary-${index}`}
          checked={item.is_primary}
          onChange={() => onChange(index, { ...item, is_primary: true })}
          className="h-4 w-4 text-brand-600 border-gray-300 focus:ring-brand-500"
        />
        <label htmlFor={`primary-${index}`} className="text-xs text-gray-600">Primary location</label>
      </div>
      <div>
        <label className={LABEL}>Clinic / Hospital name</label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange(index, { ...item, name: e.target.value })}
          className={INPUT}
          placeholder="e.g. Apollo Clinic, Bandra"
        />
      </div>
      <div>
        <label className={LABEL}>Address</label>
        <textarea
          value={item.address}
          onChange={(e) => onChange(index, { ...item, address: e.target.value })}
          rows={2}
          className={`${INPUT} resize-y`}
          placeholder="12, Medical Complex, MG Road, Mumbai — 400001"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Phone ({PHONE_PREFIX})</label>
          <input
            type="tel"
            value={item.phone}
            onChange={(e) => onChange(index, { ...item, phone: e.target.value })}
            className={INPUT}
            maxLength={10}
            placeholder="9876543210"
          />
        </div>
        <div>
          <label className={LABEL}>Timings</label>
          <input
            type="text"
            value={item.timings}
            onChange={(e) => onChange(index, { ...item, timings: e.target.value })}
            className={INPUT}
            placeholder="Mon–Sat: 10am–1pm"
          />
        </div>
      </div>
      <div>
        <label className={LABEL}>Google Maps URL <span className="text-gray-400">(optional)</span></label>
        <input
          type="url"
          value={item.map_url ?? ''}
          onChange={(e) => onChange(index, { ...item, map_url: e.target.value })}
          className={INPUT}
          placeholder="https://maps.google.com/…"
        />
      </div>
    </div>
  )
}

export default function LocationsForm({ data }: { data: unknown }) {
  const existing = data as { locations?: LocationEntry[] } | undefined
  const [locations, setLocations] = useState<LocationEntry[]>(existing?.locations ?? [])

  function updateLocation(index: number, updated: LocationEntry) {
    setLocations((prev) =>
      prev.map((loc, i) => {
        if (i === index) return updated
        if (updated.is_primary) return { ...loc, is_primary: false }
        return loc
      })
    )
  }

  const status = useAutoSave({ locations }, (d) => saveProfileSection('locations', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Clinic Locations</h2>
        <SaveStatus status={status} />
      </div>
      <CardArrayInput
        items={locations}
        onAdd={() => setLocations((prev) => [...prev, emptyLocation()])}
        onRemove={(i) => setLocations((prev) => prev.filter((_, idx) => idx !== i))}
        renderCard={(item, i) => (
          <LocationCard item={item} index={i} onChange={updateLocation} />
        )}
        addLabel="Add location"
        maxItems={LOCATIONS_MAX}
      />
    </div>
  )
}
