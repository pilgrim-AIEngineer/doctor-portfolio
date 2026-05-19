// ClinicInfoForm — edits the "clinic_info" profile section
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import { clinicInfoSectionSchema, type ClinicInfoSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'
import { PHONE_PREFIX } from '@/lib/constants'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function ClinicInfoForm({ data }: { data: unknown }) {
  const existing = data as ClinicInfoSectionInput | undefined
  const form = useForm<ClinicInfoSectionInput>({
    resolver: zodResolver(clinicInfoSectionSchema),
    defaultValues: {
      address: existing?.address ?? '',
      map_url: existing?.map_url ?? '',
      timings: existing?.timings ?? '',
      phone: existing?.phone ?? '',
    },
  })
  const { register, watch, formState: { errors } } = form
  const snapshot = watch()
  const status = useAutoSave(snapshot, (d) => saveProfileSection('clinic_info', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('clinic_info', snapshot) }, [JSON.stringify(snapshot)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Clinic Information</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Clinic address</label>
        <textarea {...register('address')} rows={3} className={`${INPUT} resize-y`} placeholder="12, Medical Complex, MG Road, Pune — 411001" />
        {errors.address && <p className={ERROR}>{errors.address.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Google Maps URL</label>
        <input type="url" {...register('map_url')} className={INPUT} placeholder="https://maps.google.com/…" />
        {errors.map_url && <p className={ERROR}>{errors.map_url.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Clinic timings</label>
        <input type="text" {...register('timings')} className={INPUT} placeholder="Mon–Sat: 10am–1pm, 5pm–8pm" />
        {errors.timings && <p className={ERROR}>{errors.timings.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Clinic phone <span className="text-gray-400 font-normal">({PHONE_PREFIX})</span></label>
        <input type="tel" {...register('phone')} className={INPUT} maxLength={10} placeholder="9876543210" />
        {errors.phone && <p className={ERROR}>{errors.phone.message}</p>}
      </div>
    </div>
  )
}
