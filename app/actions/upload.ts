// Server action: uploads an image file to Cloudinary and returns the secure URL
'use server'

import { v2 as cloudinary } from 'cloudinary'
import {
  UPLOAD_MAX_SIZE_BYTES,
  UPLOAD_ACCEPTED_TYPES,
  CLOUDINARY_PROFILES_FOLDER,
  CLOUDINARY_GALLERY_FOLDER,
} from '@/lib/constants'
import { createServerClient } from '@/lib/supabase/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type UploadFolder = 'profiles' | 'gallery'

interface UploadResult {
  data?: { url: string; publicId: string }
  error?: string
}

export async function uploadImage(formData: FormData, folder: UploadFolder = 'profiles'): Promise<UploadResult> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    const file = formData.get('file')
    if (!(file instanceof File)) return { error: 'No file provided' }

    const acceptedType = (UPLOAD_ACCEPTED_TYPES as readonly string[]).includes(file.type)
    if (!acceptedType) return { error: 'Only JPEG, PNG, and WebP images are allowed' }

    if (file.size > UPLOAD_MAX_SIZE_BYTES) return { error: 'File must be under 5 MB' }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const cloudFolder = folder === 'gallery' ? CLOUDINARY_GALLERY_FOLDER : CLOUDINARY_PROFILES_FOLDER

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: cloudFolder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
    })

    return { data: { url: result.secure_url, publicId: result.public_id } }
  } catch (err) {
    console.error('[uploadImage]', err)
    return { error: 'Upload failed. Please try again.' }
  }
}
