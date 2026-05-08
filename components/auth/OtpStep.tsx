// Check-your-email confirmation — step 2 of the magic-link auth flow
'use client'

import { useTransition } from 'react'
import { sendMagicLink } from '@/app/actions/auth'

interface Props {
  email: string
  onChangeEmail: () => void
}

export default function CheckEmailStep({ email, onChangeEmail }: Props) {
  const [isPending, startTransition] = useTransition()

  function resend() {
    const formData = new FormData()
    formData.append('email', email)
    startTransition(async () => { await sendMagicLink(formData) })
  }

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900">Check your inbox</p>
        <p className="mt-1 text-sm text-gray-500">
          We sent a login link to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <p className="text-xs text-gray-400">
        Click the link in the email to sign in. It expires in 10 minutes.
      </p>

      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={resend}
          disabled={isPending}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Resending…' : 'Resend link'}
        </button>

        <button
          type="button"
          onClick={onChangeEmail}
          className="w-full text-sm text-brand-600 hover:underline"
        >
          Use a different email
        </button>
      </div>
    </div>
  )
}
