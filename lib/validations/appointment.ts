// Zod schema for patient-facing appointment booking form
import { z } from 'zod'

export const bookingFormSchema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  patient_phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  message: z.string().max(500, 'Message must be under 500 characters').optional(),
})

export type BookingFormInput = z.infer<typeof bookingFormSchema>
