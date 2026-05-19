// PersonalForm — edits the "personal" profile section
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import { personalSectionSchema, type PersonalSectionInput } from '@/lib/validations/profile'
import { ABOUT_MAX_CHARS } from '@/lib/constants'
import SaveStatus from '../SaveStatus'
import ProfilePhotoUpload from '../ProfilePhotoUpload'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function PersonalForm({ data }: { data: unknown }) {
  const existing = data as PersonalSectionInput | undefined
  const form = useForm<PersonalSectionInput>({
    resolver: zodResolver(personalSectionSchema),
    defaultValues: {
      name: existing?.name ?? '',
      photo: existing?.photo ?? '',
      cover_image: existing?.cover_image ?? '',
      tagline: existing?.tagline ?? '',
      about: existing?.about ?? '',
      years_of_experience: existing?.years_of_experience ?? undefined,
    },
  })
  const { register, watch, setValue, formState: { errors } } = form
  const about = watch('about') ?? ''
  const snapshot = watch()
  const status = useAutoSave(snapshot, (d) => saveProfileSection('personal', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('personal', snapshot) }, [JSON.stringify(snapshot)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Personal</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Full name</label>
        <input type="text" {...register('name')} className={INPUT} />
        {errors.name && <p className={ERROR}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Profile photo</label>
        <ProfilePhotoUpload
          value={watch('photo') ?? ''}
          onChange={(url) => setValue('photo', url, { shouldDirty: true })}
        />
        {errors.photo && <p className={ERROR}>{errors.photo.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Tagline <span className="text-gray-400 font-normal">(max 120 chars)</span></label>
        <input type="text" {...register('tagline')} className={INPUT} placeholder="e.g. 15+ years in cardiac surgery" />
        {errors.tagline && <p className={ERROR}>{errors.tagline.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Years of experience</label>
        <input
          type="number"
          {...register('years_of_experience', { valueAsNumber: true })}
          min={0}
          max={80}
          className={INPUT}
          placeholder="e.g. 15"
        />
        {errors.years_of_experience && <p className={ERROR}>{errors.years_of_experience.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={LABEL} style={{ marginBottom: 0 }}>About</label>
          <span className={`text-xs ${about.length > ABOUT_MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-gray-400'}`}>
            {about.length}/{ABOUT_MAX_CHARS}
          </span>
        </div>
        <textarea
          {...register('about')}
          rows={5}
          maxLength={ABOUT_MAX_CHARS}
          className={`${INPUT} resize-y`}
          placeholder="Write a short bio…"
        />
        {errors.about && <p className={ERROR}>{errors.about.message}</p>}
      </div>
    </div>
  )
}
