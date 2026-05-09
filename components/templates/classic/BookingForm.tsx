// Patient-facing booking form — sends appointment request to doctor
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle } from 'lucide-react'
import { bookingFormSchema, type BookingFormInput } from '@/lib/validations/appointment'
import { createAppointment } from '@/app/actions/appointment'
import { PHONE_PREFIX } from '@/lib/constants'

interface BookingFormProps {
  doctorId: string
  doctorEmail: string
}

export default function BookingForm({ doctorId, doctorEmail }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormInput>({ resolver: zodResolver(bookingFormSchema) })

  async function onSubmit(values: BookingFormInput) {
    setServerError(null)
    const result = await createAppointment({
      doctorId,
      doctorEmail,
      patientName: values.patient_name,
      patientPhone: values.patient_phone,
      message: values.message,
    })
    if (result.error) {
      setServerError(result.error)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-5 py-4">
        <CheckCircle size={20} className="text-green-600 shrink-0" />
        <p className="text-sm text-green-800 font-medium">
          Request sent! The doctor will contact you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          {...register('patient_name')}
          placeholder="Full name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {errors.patient_name && (
          <p className="mt-1 text-xs text-red-600">{errors.patient_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-sm text-gray-500">
            {PHONE_PREFIX}
          </span>
          <input
            {...register('patient_phone')}
            placeholder="9876543210"
            maxLength={10}
            className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        {errors.patient_phone && (
          <p className="mt-1 text-xs text-red-600">{errors.patient_phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register('message')}
          placeholder="Describe your concern or preferred time…"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
      >
        <Send size={15} />
        {isSubmitting ? 'Sending…' : 'Send Request'}
      </button>
    </form>
  )
}
