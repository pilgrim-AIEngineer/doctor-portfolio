// Portfolio status card — shows live URL, copy button, QR code, publish toggle
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Copy, Check, ExternalLink, Globe, EyeOff } from 'lucide-react'
import { togglePublish } from '@/app/actions/profile'

interface Props {
  isPublished: boolean
  portfolioUrl: string
  slug: string
}

export default function PortfolioStatusCard({ isPublished, portfolioUrl, slug }: Props) {
  const [copied, setCopied] = useState(false)
  const [published, setPublished] = useState(isPublished)
  const [isPending, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      if (timerRef.current) clearTimeout(timerRef.current)
      setCopied(true)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable or denied — silent fail is acceptable here
    }
  }

  function handlePublishToggle() {
    const next = !published
    setPublished(next)
    startTransition(async () => {
      const result = await togglePublish(next)
      if (result.error) setPublished(!next)
    })
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  published ? 'bg-green-500' : 'bg-amber-500'
                }`}
              />
              {published ? 'Live' : 'Draft'}
            </span>
          </div>

          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Your portfolio URL</p>
          <p className="font-mono text-sm font-medium text-gray-900 truncate mb-4">{portfolioUrl}</p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <Link
              href={`/dr/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-600 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              View portfolio
              <ExternalLink size={15} />
            </Link>
            <button
              onClick={handlePublishToggle}
              disabled={isPending}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                published
                  ? 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              }`}
            >
              {published ? <EyeOff size={15} /> : <Globe size={15} />}
              {published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <QRCode value={portfolioUrl} size={96} />
        </div>
      </div>
    </div>
  )
}
