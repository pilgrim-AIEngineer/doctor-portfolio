// New-user onboarding form — shown after first magic-link sign-in
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema } from '@/lib/validations/profile'
import type { OnboardingInput } from '@/lib/validations/profile'
import { completeOnboarding } from '@/app/actions/auth'

export default function OnboardingStep() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingInput>({ resolver: zodResolver(onboardingSchema) })

  function onSubmit(data: OnboardingInput) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('phone', data.phone ?? '')
    formData.append('nmc_number', data.nmc_number)
    formData.append('specialty', data.specialty)

    startTransition(async () => {
      const result = await completeOnboarding(formData)
      if (result.error) setServerError(result.error)
      // on success: redirect fires server-side, component unmounts
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Dr. Rajesh Sharma"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

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
        <p className="mt-1 text-xs text-gray-500">
          Used for the WhatsApp CTA on your public portfolio.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          NMC registration number <span className="text-red-500">*</span>
        </label>
        <input
          {...register('nmc_number')}
          type="text"
          placeholder="MCI-12345-A"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.nmc_number && (
          <p className="mt-1 text-xs text-red-600">{errors.nmc_number.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          This will be verified and shown as a badge on your portfolio.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialty <span className="text-red-500">*</span>
        </label>
        <input
          {...register('specialty')}
          type="text"
          placeholder="Cardiologist"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.specialty && (
          <p className="mt-1 text-xs text-red-600">{errors.specialty.message}</p>
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
        {isPending ? 'Setting up your profile…' : 'Create my portfolio'}
      </button>
    </form>
  )
}
