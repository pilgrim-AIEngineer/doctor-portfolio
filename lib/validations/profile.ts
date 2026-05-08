// Zod schemas for all profile section forms
import { z } from 'zod'

export const personalSectionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photo: z.string().url().optional().or(z.literal('')),
  tagline: z.string().max(120, 'Keep tagline under 120 characters').optional(),
  about: z.string().max(1000, 'About must be under 1000 characters').optional(),
})

export const registrationSectionSchema = z.object({
  nmc_number: z.string().min(1, 'NMC registration number is required'),
  state_council: z.string().min(1, 'State medical council is required'),
  validity: z.string().min(1, 'Validity date is required'),
})

export const clinicInfoSectionSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  map_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  timings: z.string().min(1, 'Clinic timings are required'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
})

export const appointmentSectionSchema = z.object({
  whatsapp: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit WhatsApp number'),
  practo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  booking_form_enabled: z.boolean(),
})

export const authSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
})

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
})

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  nmc_number: z.string().min(1, 'NMC registration number is required'),
  specialty: z.string().min(2, 'Specialty is required'),
})

export type PersonalSectionInput = z.infer<typeof personalSectionSchema>
export type RegistrationSectionInput = z.infer<typeof registrationSectionSchema>
export type ClinicInfoSectionInput = z.infer<typeof clinicInfoSectionSchema>
export type AppointmentSectionInput = z.infer<typeof appointmentSectionSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
