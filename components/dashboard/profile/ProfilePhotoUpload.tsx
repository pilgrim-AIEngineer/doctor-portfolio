// Profile photo uploader with square-crop modal — used in PersonalForm
'use client'

import { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/app/actions/upload'
import { getCroppedImg } from '@/lib/cropImage'
import { UPLOAD_ACCEPTED_TYPES, UPLOAD_MAX_SIZE_BYTES } from '@/lib/constants'

interface Props {
  value: string
  onChange: (url: string) => void
}

export default function ProfilePhotoUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileSelect(file: File) {
    setError(null)
    const accepted = (UPLOAD_ACCEPTED_TYPES as readonly string[]).includes(file.type)
    if (!accepted) { setError('Only JPEG, PNG, and WebP images are allowed'); return }
    if (file.size > UPLOAD_MAX_SIZE_BYTES) { setError('File must be under 5 MB'); return }

    const reader = new FileReader()
    reader.onload = (e) => setRawSrc(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleConfirmCrop() {
    if (!rawSrc || !croppedAreaPixels) return
    setError(null)
    setUploading(true)
    try {
      const blob = await getCroppedImg(rawSrc, croppedAreaPixels)
      const formData = new FormData()
      formData.append('file', blob, 'profile-photo.jpg')
      const result = await uploadImage(formData, 'profiles')
      if (result.error) { setError(result.error); return }
      onChange(result.data!.url)
      setRawSrc(null)
    } catch {
      setError('Unexpected error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Drop zone / current photo */}
      <div
        className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-300 hover:border-brand-500 cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <Image src={value} alt="Profile photo" fill className="object-cover" sizes="112px" />
        ) : (
          <Upload className="w-6 h-6 text-gray-400" />
        )}
      </div>

      <p className="text-xs text-gray-500">Click or drag to upload. Square crop applied automatically.</p>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
      />

      {/* Crop modal */}
      {rawSrc && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-xl">
            <div className="relative h-72 bg-gray-900">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4 space-y-3">
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setRawSrc(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleConfirmCrop}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Uploading…' : 'Use this crop'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
