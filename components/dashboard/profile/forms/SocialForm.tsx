// SocialForm — edits the "social" profile section
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import { socialSectionSchema, type SocialSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function SocialForm({ data }: { data: unknown }) {
  const existing = data as SocialSectionInput | undefined
  const form = useForm<SocialSectionInput>({
    resolver: zodResolver(socialSectionSchema),
    defaultValues: {
      youtube: existing?.youtube ?? '',
      instagram: existing?.instagram ?? '',
      linkedin: existing?.linkedin ?? '',
      twitter: existing?.twitter ?? '',
    },
  })
  const { register, watch, formState: { errors } } = form
  const snapshot = watch()
  const status = useAutoSave(snapshot, (d) => saveProfileSection('social', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('social', snapshot) }, [JSON.stringify(snapshot)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
        <SaveStatus status={status} />
      </div>

      {(['youtube', 'instagram', 'linkedin', 'twitter'] as const).map((platform) => (
        <div key={platform}>
          <label className={LABEL} style={{ textTransform: 'capitalize' }}>{platform}</label>
          <input
            type="url"
            {...register(platform)}
            className={INPUT}
            placeholder={`https://www.${platform}.com/…`}
          />
          {errors[platform] && <p className={ERROR}>{errors[platform]?.message}</p>}
        </div>
      ))}
    </div>
  )
}
