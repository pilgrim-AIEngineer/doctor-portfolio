// LanguagesForm — edits the "languages" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { languagesSectionSchema, type LanguagesSectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function LanguagesForm({ data }: { data: unknown }) {
  const existing = data as { spoken?: string[] } | undefined
  const form = useForm<LanguagesSectionInput>({
    resolver: zodResolver(languagesSectionSchema),
    defaultValues: {
      spoken: (existing?.spoken ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('languages', {
    spoken: d.spoken.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Languages</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Languages spoken <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea
          {...register('spoken')}
          rows={4}
          className={INPUT}
          placeholder={"English\nHindi\nMarathi"}
        />
      </div>
    </div>
  )
}
