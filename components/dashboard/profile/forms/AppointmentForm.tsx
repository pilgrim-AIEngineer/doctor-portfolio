// AppointmentForm — edits the "appointment" profile section
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import { appointmentSectionSchema, type AppointmentSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'
import { PHONE_PREFIX } from '@/lib/constants'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function AppointmentForm({ data }: { data: unknown }) {
  const existing = data as AppointmentSectionInput | undefined
  const form = useForm<AppointmentSectionInput>({
    resolver: zodResolver(appointmentSectionSchema),
    defaultValues: {
      whatsapp: existing?.whatsapp ?? '',
      practo_url: existing?.practo_url ?? '',
      booking_form_enabled: existing?.booking_form_enabled ?? false,
    },
  })
  const { register, watch, formState: { errors } } = form
  const snapshot = watch()
  const status = useAutoSave(snapshot, (d) => saveProfileSection('appointment', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('appointment', snapshot) }, [JSON.stringify(snapshot)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Appointment Settings</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>WhatsApp number <span className="text-gray-400 font-normal">({PHONE_PREFIX})</span></label>
        <input type="tel" {...register('whatsapp')} className={INPUT} maxLength={10} placeholder="9876543210" />
        {errors.whatsapp && <p className={ERROR}>{errors.whatsapp.message}</p>}
        <p className="mt-1 text-xs text-gray-400">Mandatory — this is how most patients will contact you.</p>
      </div>

      <div>
        <label className={LABEL}>Practo / booking page URL</label>
        <input type="url" {...register('practo_url')} className={INPUT} placeholder="https://www.practo.com/…" />
        {errors.practo_url && <p className={ERROR}>{errors.practo_url.message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="booking_form"
          type="checkbox"
          {...register('booking_form_enabled')}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <label htmlFor="booking_form" className="text-sm font-medium text-gray-700">
          Enable built-in appointment request form on portfolio
        </label>
      </div>
    </div>
  )
}
