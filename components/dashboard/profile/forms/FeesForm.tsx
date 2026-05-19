// FeesForm — edits the "fees" profile section (Pro only)
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import { feesSectionSchema, type FeesSectionInput } from '@/lib/validations/profile'
import { FEE_NOTE_MAX_CHARS } from '@/lib/constants'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function FeesForm({ data }: { data: unknown }) {
  const existing = data as FeesSectionInput | undefined
  const { register, watch, formState: { errors } } = useForm<FeesSectionInput>({
    resolver: zodResolver(feesSectionSchema),
    defaultValues: {
      consultation_fee: existing?.consultation_fee ?? 0,
      followup_fee: existing?.followup_fee ?? undefined,
      fee_note: existing?.fee_note ?? '',
    },
  })
  const snapshot = watch()
  const status = useAutoSave(snapshot, (d) => saveProfileSection('fees', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('fees', snapshot) }, [JSON.stringify(snapshot)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Consultation Fees</h2>
        <SaveStatus status={status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Consultation fee (₹)</label>
          <input
            type="number"
            {...register('consultation_fee', { valueAsNumber: true })}
            min={0}
            className={INPUT}
            placeholder="500"
          />
          {errors.consultation_fee && <p className={ERROR}>{errors.consultation_fee.message}</p>}
        </div>
        <div>
          <label className={LABEL}>Follow-up fee (₹) <span className="text-gray-400 font-normal">optional</span></label>
          <input
            type="number"
            {...register('followup_fee', { valueAsNumber: true })}
            min={0}
            className={INPUT}
            placeholder="300"
          />
        </div>
      </div>

      <div>
        <label className={LABEL}>Fee note <span className="text-gray-400 font-normal">(max {FEE_NOTE_MAX_CHARS} chars)</span></label>
        <input
          type="text"
          {...register('fee_note')}
          maxLength={FEE_NOTE_MAX_CHARS}
          className={INPUT}
          placeholder="e.g. Includes prescription. Online consultations ₹200 off."
        />
        {errors.fee_note && <p className={ERROR}>{errors.fee_note.message}</p>}
      </div>
    </div>
  )
}
