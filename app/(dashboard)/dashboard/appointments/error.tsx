// Error boundary for the appointments route segment
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppointmentsError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[AppointmentsError]', error)
  }, [error])

  return (
    <div className="max-w-3xl mx-auto p-6 flex items-center justify-center min-h-64">
      <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md w-full text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Could not load appointments</h2>
        <p className="text-sm text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Try again
          </button>
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
