// OTP verification — step 2 of the auth flow
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema } from '@/lib/validations/profile'
import type { z } from 'zod'
import { verifyOtp } from '@/app/actions/auth'

type OtpInput = z.infer<typeof otpSchema>

interface Props {
  phone: string
  onOtpVerified: (isNewUser: boolean) => void
  onChangeNumber: () => void
}

export default function OtpStep({ phone, onOtpVerified, onChangeNumber }: Props) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OtpInput>({ resolver: zodResolver(otpSchema) })

  const maskedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`

  function onSubmit(data: OtpInput) {
    const formData = new FormData()
    formData.append('otp', data.otp)

    startTransition(async () => {
      const result = await verifyOtp(phone, formData)
      if (result.error) {
        setError('otp', { message: result.error })
      } else if (result.isNewUser) {
        onOtpVerified(true)
      }
      // existing user: redirect fires server-side, component unmounts
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-600">
        OTP sent to{' '}
        <span className="font-medium text-gray-900">{maskedPhone}</span>
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter 6-digit OTP
        </label>
        <input
          {...register('otp')}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="------"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
        {isPending ? 'Verifying…' : 'Verify OTP'}
      </button>

      <button
        type="button"
        onClick={onChangeNumber}
        className="w-full text-sm text-brand-600 hover:underline"
      >
        Change number
      </button>
    </form>
  )
}
