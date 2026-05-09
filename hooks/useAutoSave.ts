// Debounced auto-save hook for profile section forms
'use client'

import { useEffect, useRef, useState } from 'react'
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
  // Refs keep the timer closure current without triggering extra effects
  const saveFnRef = useRef(saveFn)
  const dataRef = useRef(data)
  saveFnRef.current = saveFn
  dataRef.current = data

  // Serialize to detect real value changes vs new object references from watch()
  const serialized = JSON.stringify(data)
  const prevSerializedRef = useRef(serialized)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevSerializedRef.current = serialized
      return
    }
    if (!enabled) return
    if (serialized === prevSerializedRef.current) return
    prevSerializedRef.current = serialized

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setStatus('saving')
      const result = await saveFnRef.current(dataRef.current)
      setStatus(result.error ? 'error' : 'saved')
      setTimeout(() => setStatus('idle'), 2000)
    }, AUTOSAVE_DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [serialized, enabled])

  return status
}
