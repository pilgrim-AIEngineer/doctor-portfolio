// AchievementsForm — edits the "achievements" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { achievementsSectionSchema, type AchievementsSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function AchievementsForm({ data }: { data: unknown }) {
  const existing = data as { awards?: string[]; recognitions?: string[] } | undefined
  const form = useForm<AchievementsSectionInput>({
    resolver: zodResolver(achievementsSectionSchema),
    defaultValues: {
      awards: (existing?.awards ?? []).join('\n'),
      recognitions: (existing?.recognitions ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('achievements', {
    awards: d.awards.split('\n').filter(Boolean),
    recognitions: d.recognitions.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Awards <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('awards')} rows={4} className={INPUT} placeholder={"Best Surgeon Award — IMA 2022\nFellow of Royal College of Surgeons"} />
      </div>

      <div>
        <label className={LABEL}>Recognitions <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea {...register('recognitions')} rows={3} className={INPUT} placeholder={"Featured in Times Health\nTop Doctor — Practo 2023"} />
      </div>
    </div>
  )
}
