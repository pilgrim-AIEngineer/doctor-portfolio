// Phone number input — step 1 of the auth flow
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema } from '@/lib/validations/profile'
import type { z } from 'zod'
import { sendOtp } from '@/app/actions/auth'

type AuthInput = z.infer<typeof authSchema>

interface Props {
  onPhoneSent: (phone: string) => void
}

export default function PhoneStep({ onPhoneSent }: Props) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthInput>({ resolver: zodResolver(authSchema) })

  function onSubmit(data: AuthInput) {
    const formData = new FormData()
    formData.append('phone', data.phone)

    startTransition(async () => {
      const result = await sendOtp(formData)
      if (result.error) {
        setError('phone', { message: result.error })
      } else {
        onPhoneSent(data.phone)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mobile number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">
            +91
          </span>
          <input
            {...register('phone')}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="98765 43210"
            className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
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
        {isPending ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </form>
  )
}
