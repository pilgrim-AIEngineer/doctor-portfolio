// Debounced auto-save hook for profile section forms
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AUTOSAVE_DEBOUNCE_MS } from '@/lib/constants'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<{ error?: string }>,
  enabled = true
): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)
  const stableSave = useCallback(saveFn, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!enabled) return

    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('saving')

    timerRef.current = setTimeout(async () => {
      const result = await stableSave(data)
      setStatus(result.error ? 'error' : 'saved')
      setTimeout(() => setStatus('idle'), 2000)
    }, AUTOSAVE_DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, enabled, stableSave])

  return status
}
