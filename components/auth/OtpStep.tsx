// OTP verification — step 2 of the email OTP auth flow
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { otpSchema } from '@/lib/validations/profile'
import { verifyEmailOtp, sendEmailOtp } from '@/app/actions/auth'

type OtpInput = z.infer<typeof otpSchema>

interface Props {
  email: string
  onChangeEmail: () => void
}

export default function OtpStep({ email, onChangeEmail }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isResending, startResendTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OtpInput>({ resolver: zodResolver(otpSchema) })

  function onSubmit(data: OtpInput) {
    startTransition(async () => {
      const result = await verifyEmailOtp(email, data.otp)
      if (result?.error) {
        setError('otp', { message: result.error })
      }
      // On success, server-side redirect handles navigation
    })
  }

  function resend() {
    const formData = new FormData()
    formData.append('email', email)
    startResendTransition(async () => {
      await sendEmailOtp(formData)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-900">Enter your code</p>
        <p className="mt-1 text-sm text-gray-500">
          We sent an 8-digit code to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('otp')}
            type="text"
            inputMode="numeric"
            maxLength={8}
            autoComplete="one-time-code"
            placeholder="12345678"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>
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
          {isPending ? 'Verifying…' : 'Verify'}
        </button>
      </form>

      <div className="space-y-2">
        <button
          type="button"
          onClick={resend}
          disabled={isResending}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isResending ? 'Resending…' : 'Resend code'}
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
