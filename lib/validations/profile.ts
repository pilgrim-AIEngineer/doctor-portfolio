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
  email: z.string().email('Enter a valid email address'),
})

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
})

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit number').optional().or(z.literal('')),
  nmc_number: z.string().min(1, 'NMC registration number is required'),
  specialty: z.string().min(2, 'Specialty is required'),
})

export type PersonalSectionInput = z.infer<typeof personalSectionSchema>
export type RegistrationSectionInput = z.infer<typeof registrationSectionSchema>
export type ClinicInfoSectionInput = z.infer<typeof clinicInfoSectionSchema>
export type AppointmentSectionInput = z.infer<typeof appointmentSectionSchema>
export type AuthInput = z.infer<typeof authSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>

export const qualificationsSectionSchema = z.object({
  degrees: z.string(),
  fellowships: z.string(),
})
export type QualificationsSectionInput = z.infer<typeof qualificationsSectionSchema>

export const specializationSectionSchema = z.object({
  primary: z.string().min(1, 'Primary specialty is required'),
  sub_specialties: z.string(),
})
export type SpecializationSectionInput = z.infer<typeof specializationSectionSchema>

export const experienceSectionSchema = z.object({
  years: z.number().int().min(0).max(60),
  current_affiliation: z.string(),
  hospitals: z.string(),
})
export type ExperienceSectionInput = z.infer<typeof experienceSectionSchema>

export const servicesSectionSchema = z.object({
  treatments: z.string(),
  procedures: z.string(),
  consultation_types: z.string(),
})
export type ServicesSectionInput = z.infer<typeof servicesSectionSchema>

export const achievementsSectionSchema = z.object({
  awards: z.string(),
  recognitions: z.string(),
})
export type AchievementsSectionInput = z.infer<typeof achievementsSectionSchema>

export const researchSectionSchema = z.object({
  publications: z.string(),
  conferences: z.string(),
})
export type ResearchSectionInput = z.infer<typeof researchSectionSchema>

export const testimonialsSectionSchema = z.object({
  reviews: z.string(),
})
export type TestimonialsSectionInput = z.infer<typeof testimonialsSectionSchema>

export const gallerySectionSchema = z.object({
  images: z.string(),
})
export type GallerySectionInput = z.infer<typeof gallerySectionSchema>

export const insuranceSectionSchema = z.object({
  panels: z.string(),
})
export type InsuranceSectionInput = z.infer<typeof insuranceSectionSchema>

export const languagesSectionSchema = z.object({
  spoken: z.string(),
})
export type LanguagesSectionInput = z.infer<typeof languagesSectionSchema>

export const socialSectionSchema = z.object({
  youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  instagram: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})
export type SocialSectionInput = z.infer<typeof socialSectionSchema>
