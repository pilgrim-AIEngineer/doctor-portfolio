// GalleryForm — edits the "gallery" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { gallerySectionSchema, type GallerySectionInput } from '@/lib/validations/profile'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function GalleryForm({ data }: { data: unknown }) {
  const existing = data as { images?: string[] } | undefined
  const form = useForm<GallerySectionInput>({
    resolver: zodResolver(gallerySectionSchema),
    defaultValues: {
      images: (existing?.images ?? []).join('\n'),
    },
  })
  const { register, watch } = form
  const status = useAutoSave(watch(), (d) => saveProfileSection('gallery', {
    images: d.images.split('\n').filter(Boolean),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
        <SaveStatus status={status} />
      </div>

      <p className="text-sm text-gray-500">
        Paste Cloudinary or other image URLs, one per line. Upload images via Cloudinary and paste the URL here.
      </p>

      <div>
        <label className={LABEL}>Image URLs <span className="text-gray-400 font-normal">(one per line)</span></label>
        <textarea
          {...register('images')}
          rows={6}
          className={INPUT}
          placeholder={"https://res.cloudinary.com/…/clinic-photo.jpg\nhttps://res.cloudinary.com/…/team-photo.jpg"}
        />
      </div>
    </div>
  )
}
