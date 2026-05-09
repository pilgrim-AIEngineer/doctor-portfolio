// Error boundary for the public portfolio route segment
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PortfolioError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[PortfolioError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md w-full text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Something went wrong loading this portfolio
        </h2>
        <p className="text-sm text-gray-500">Please try again in a moment.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
