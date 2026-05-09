// GalleryForm — edits the "gallery" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { gallerySectionSchema, type GallerySectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'
import ImageUploader from '../ImageUploader'

export default function GalleryForm({ data }: { data: unknown }) {
  const existing = data as { images?: string[] } | undefined
  const form = useForm<GallerySectionInput>({
    resolver: zodResolver(gallerySectionSchema),
    defaultValues: {
      images: existing?.images ?? [],
    },
  })
  const { watch, setValue } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('gallery', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
        <SaveStatus status={status} />
      </div>

      <ImageUploader
        value={watch('images')}
        onChange={(urls) => setValue('images', urls, { shouldDirty: true })}
      />
    </div>
  )
}
