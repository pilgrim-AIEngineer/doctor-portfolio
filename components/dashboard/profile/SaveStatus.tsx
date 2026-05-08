// SaveStatus — inline save indicator shown in each profile section form
'use client'

import { Check, Loader2, X } from 'lucide-react'
import type { SaveStatus as Status } from '@/hooks/useAutoSave'

export default function SaveStatus({ status }: { status: Status }) {
  if (status === 'idle') return null

  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1 text-xs text-gray-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    )
  }

  if (status === 'saved') {
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <Check className="h-3 w-3" />
        Saved
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1 text-xs text-red-600">
      <X className="h-3 w-3" />
      Save failed
    </span>
  )
}
