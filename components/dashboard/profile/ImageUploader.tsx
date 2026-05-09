// Multi-image drag-and-drop uploader — used in GalleryForm
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/app/actions/upload'
import {
  UPLOAD_ACCEPTED_TYPES,
  UPLOAD_MAX_SIZE_BYTES,
  UPLOAD_GALLERY_MAX_IMAGES,
} from '@/lib/constants'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

interface UploadingItem {
  id: string
  name: string
}

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<UploadingItem[]>([])
  const [errors, setErrors] = useState<string[]>([])

  async function handleFiles(files: FileList) {
    setErrors([])
    const remaining = UPLOAD_GALLERY_MAX_IMAGES - value.length
    const toUpload = Array.from(files).slice(0, remaining)

    if (files.length > remaining) {
      setErrors([`Max ${UPLOAD_GALLERY_MAX_IMAGES} images. Only the first ${remaining} will be uploaded.`])
    }

    const validFiles = toUpload.filter((file) => {
      const accepted = (UPLOAD_ACCEPTED_TYPES as readonly string[]).includes(file.type)
      if (!accepted) {
        setErrors((prev) => [...prev, `${file.name}: only JPEG, PNG, and WebP allowed`])
        return false
      }
      if (file.size > UPLOAD_MAX_SIZE_BYTES) {
        setErrors((prev) => [...prev, `${file.name}: must be under 5 MB`])
        return false
      }
      return true
    })

    const newUrls: string[] = []

    await Promise.all(
      validFiles.map(async (file) => {
        const id = `${Date.now()}-${Math.random()}`
        setUploading((prev) => [...prev, { id, name: file.name }])

        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadImage(formData, 'gallery')

        setUploading((prev) => prev.filter((u) => u.id !== id))

        if (result.error) {
          setErrors((prev) => [...prev, `${file.name}: ${result.error}`])
        } else {
          newUrls.push(result.data!.url)
        }
      })
    )

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls])
    }
  }

  function removeImage(index: number) {
    const next = value.filter((_, i) => i !== index)
    onChange(next)
  }

  const canUploadMore = value.length < UPLOAD_GALLERY_MAX_IMAGES

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {canUploadMore && (
        <div
          className="border-2 border-dashed border-gray-300 hover:border-brand-500 rounded-xl p-8 text-center cursor-pointer transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">Drop images here or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP · Max 5 MB each · Up to {UPLOAD_GALLERY_MAX_IMAGES} images</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files) }}
      />

      {/* Error list */}
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="text-xs text-red-600">{e}</li>
          ))}
        </ul>
      )}

      {/* Uploading indicators */}
      {uploading.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploading.map((u) => (
            <div key={u.id} className="w-24 h-24 rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-1 border border-gray-200">
              <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-brand-600 rounded-full animate-spin" />
              <span className="text-xs text-gray-500 px-1 text-center truncate w-full text-center">{u.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Thumbnail grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
              <Image src={url} alt={`Gallery image ${i + 1}`} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
