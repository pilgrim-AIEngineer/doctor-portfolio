// Minimal fixed-position toast for success and error feedback
'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600'

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 ${bg} text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium`}>
      {message}
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white leading-none">✕</button>
    </div>
  )
}
