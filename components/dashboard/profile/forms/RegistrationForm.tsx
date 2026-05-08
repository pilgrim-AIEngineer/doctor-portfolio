// RegistrationForm — edits the "registration" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { registrationSectionSchema, type RegistrationSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function RegistrationForm({ data }: { data: unknown }) {
  const existing = data as RegistrationSectionInput | undefined
  const form = useForm<RegistrationSectionInput>({
    resolver: zodResolver(registrationSectionSchema),
    defaultValues: {
      nmc_number: existing?.nmc_number ?? '',
      state_council: existing?.state_council ?? '',
      validity: existing?.validity ?? '',
    },
  })
  const { register, watch, formState: { errors } } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('registration', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Medical Registration</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>NMC Registration Number</label>
        <input type="text" {...register('nmc_number')} className={INPUT} placeholder="e.g. MH/12345/2010" />
        {errors.nmc_number && <p className={ERROR}>{errors.nmc_number.message}</p>}
      </div>

      <div>
        <label className={LABEL}>State Medical Council</label>
        <input type="text" {...register('state_council')} className={INPUT} placeholder="e.g. Maharashtra Medical Council" />
        {errors.state_council && <p className={ERROR}>{errors.state_council.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Validity</label>
        <input type="text" {...register('validity')} className={INPUT} placeholder="e.g. Lifetime / 31/12/2030" />
        {errors.validity && <p className={ERROR}>{errors.validity.message}</p>}
      </div>
    </div>
  )
}
