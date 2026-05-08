// Email address input — step 1 of the auth flow
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema } from '@/lib/validations/profile'
import type { AuthInput } from '@/lib/validations/profile'
import { sendMagicLink } from '@/app/actions/auth'

interface Props {
  onEmailSent: (email: string) => void
}

export default function EmailStep({ onEmailSent }: Props) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthInput>({ resolver: zodResolver(authSchema) })

  function onSubmit(data: AuthInput) {
    const formData = new FormData()
    formData.append('email', data.email)

    startTransition(async () => {
      const result = await sendMagicLink(formData)
      if (result.error) {
        setError('email', { message: result.error })
      } else {
        onEmailSent(data.email)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          {...register('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="doctor@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending && (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isPending ? 'Sending link…' : 'Send login link'}
      </button>
    </form>
  )
}
