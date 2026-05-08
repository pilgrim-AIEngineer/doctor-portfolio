// PersonalForm — edits the "personal" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { personalSectionSchema, type PersonalSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

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
      tagline: existing?.tagline ?? '',
      about: existing?.about ?? '',
    },
  })
  const { register, watch, formState: { errors } } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('personal', d))

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
        <label className={LABEL}>Profile photo URL</label>
        <input type="url" {...register('photo')} className={INPUT} placeholder="https://…" />
        {errors.photo && <p className={ERROR}>{errors.photo.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Tagline <span className="text-gray-400 font-normal">(max 120 chars)</span></label>
        <input type="text" {...register('tagline')} className={INPUT} placeholder="e.g. 15+ years in cardiac surgery" />
        {errors.tagline && <p className={ERROR}>{errors.tagline.message}</p>}
      </div>

      <div>
        <label className={LABEL}>About</label>
        <textarea {...register('about')} rows={5} className={`${INPUT} resize-y`} placeholder="Write a short bio…" />
        {errors.about && <p className={ERROR}>{errors.about.message}</p>}
      </div>
    </div>
  )
}
