// Client toggle that calls togglePublish server action and updates UI optimistically
'use client'

import { useState, useTransition } from 'react'
import { Globe, EyeOff } from 'lucide-react'
import { togglePublish } from '@/app/actions/profile'

interface Props {
  isPublished: boolean
  portfolioUrl: string
}

export default function PublishToggle({ isPublished, portfolioUrl }: Props) {
  const [published, setPublished] = useState(isPublished)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleToggle() {
    const next = !published
    setPublished(next)
    setError(null)

    startTransition(async () => {
      const result = await togglePublish(next)
      if (result.error) {
        setPublished(!next)
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          {published ? (
            <Globe className="w-5 h-5 text-green-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {published ? 'Published' : 'Not published'}
            </p>
            <p className="text-xs text-gray-500">
              {published
                ? 'Your portfolio is visible to the public.'
                : 'Your portfolio is hidden from visitors.'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
            published ? 'bg-brand-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={published}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
              published ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {published && (
        <p className="text-xs text-gray-500 px-1">
          Live at:{' '}
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline break-all"
          >
            {portfolioUrl}
          </a>
        </p>
      )}

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  )
}
