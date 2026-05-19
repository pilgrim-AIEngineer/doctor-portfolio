// GalleryForm — edits the "gallery" profile section
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
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
  const snapshot = watch()
  const status = useAutoSave(snapshot, (d) => saveProfileSection('gallery', d))
  const setSection = useDraftStore((s) => s.setSection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('gallery', snapshot) }, [JSON.stringify(snapshot)])

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
