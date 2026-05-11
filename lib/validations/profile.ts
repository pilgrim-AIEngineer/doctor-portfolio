// Zod schemas for all profile section forms
import { z } from 'zod'
import {
  ABOUT_MAX_CHARS,
  FAQ_ANSWER_MAX_CHARS,
  FAQ_MAX_ITEMS,
  FEE_NOTE_MAX_CHARS,
  LOCATIONS_MAX,
  TESTIMONIAL_REVIEW_MAX_CHARS,
} from '@/lib/constants'

export const personalSectionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photo: z.string().url().optional().or(z.literal('')),
  cover_image: z.string().url().optional().or(z.literal('')),
  tagline: z.string().max(120, 'Keep tagline under 120 characters').optional(),
  about: z.string().max(ABOUT_MAX_CHARS, `About must be under ${ABOUT_MAX_CHARS} characters`).optional(),
})
export type PersonalSectionInput = z.infer<typeof personalSectionSchema>

export const registrationSectionSchema = z.object({
  nmc_number: z.string().min(1, 'NMC registration number is required'),
  state_council: z.string().min(1, 'State medical council is required'),
  validity: z.string().min(1, 'Validity date is required'),
})
export type RegistrationSectionInput = z.infer<typeof registrationSectionSchema>

export const qualificationEntrySchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  year: z.number().int().min(1950).max(new Date().getFullYear()),
})

export const qualificationsSectionSchema = z.object({
  degrees: z.array(qualificationEntrySchema),
  fellowships: z.array(qualificationEntrySchema),
})
export type QualificationsSectionInput = z.infer<typeof qualificationsSectionSchema>

export const specializationSectionSchema = z.object({
  primary: z.string().min(1, 'Primary specialty is required'),
  sub_specialties: z.array(z.string().min(1)),
})
export type SpecializationSectionInput = z.infer<typeof specializationSectionSchema>

export const hospitalEntrySchema = z.object({
  role: z.string().min(1, 'Role is required'),
  hospital: z.string().min(1, 'Hospital name is required'),
  location: z.string().min(1, 'City is required'),
  from_year: z.number().int().min(1950).max(new Date().getFullYear()),
  to_year: z.number().int().min(1950).max(new Date().getFullYear()).nullable(),
})

export const experienceSectionSchema = z.object({
  current_affiliation: z.string(),
  hospitals: z.array(hospitalEntrySchema),
})
export type ExperienceSectionInput = z.infer<typeof experienceSectionSchema>

export const servicesSectionSchema = z.object({
  treatments: z.array(z.string().min(1)),
  procedures: z.array(z.string().min(1)),
  consultation_types: z.array(z.string().min(1)),
})
export type ServicesSectionInput = z.infer<typeof servicesSectionSchema>

export const achievementsSectionSchema = z.object({
  awards: z.array(z.string().min(1)),
  recognitions: z.array(z.string().min(1)),
})
export type AchievementsSectionInput = z.infer<typeof achievementsSectionSchema>

export const researchSectionSchema = z.object({
  publications: z.array(z.string().min(1)),
  conferences: z.array(z.string().min(1)),
})
export type ResearchSectionInput = z.infer<typeof researchSectionSchema>

export const testimonialEntrySchema = z.object({
  patient_name: z.string().min(1, 'Patient name is required'),
  review: z.string().min(1).max(TESTIMONIAL_REVIEW_MAX_CHARS),
  rating: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
})

export const testimonialsSectionSchema = z.object({
  reviews: z.array(testimonialEntrySchema),
})
export type TestimonialsSectionInput = z.infer<typeof testimonialsSectionSchema>

export const gallerySectionSchema = z.object({
  images: z.array(z.string().url()),
})
export type GallerySectionInput = z.infer<typeof gallerySectionSchema>

export const clinicInfoSectionSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  map_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  timings: z.string().min(1, 'Clinic timings are required'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
})
export type ClinicInfoSectionInput = z.infer<typeof clinicInfoSectionSchema>

export const appointmentSectionSchema = z.object({
  whatsapp: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit WhatsApp number'),
  practo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  booking_form_enabled: z.boolean(),
})
export type AppointmentSectionInput = z.infer<typeof appointmentSectionSchema>

export const insuranceSectionSchema = z.object({
  panels: z.array(z.string().min(1)),
})
export type InsuranceSectionInput = z.infer<typeof insuranceSectionSchema>

export const languagesSectionSchema = z.object({
  spoken: z.array(z.string().min(1)),
})
export type LanguagesSectionInput = z.infer<typeof languagesSectionSchema>

export const socialSectionSchema = z.object({
  youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  instagram: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})
export type SocialSectionInput = z.infer<typeof socialSectionSchema>

export const feesSectionSchema = z.object({
  consultation_fee: z.number().int().min(0, 'Fee must be a positive number'),
  followup_fee: z.number().int().min(0).optional(),
  fee_note: z.string().max(FEE_NOTE_MAX_CHARS).optional(),
})
export type FeesSectionInput = z.infer<typeof feesSectionSchema>

export const locationEntrySchema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  timings: z.string().min(1, 'Timings are required'),
  map_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_primary: z.boolean(),
})

export const locationsSectionSchema = z.object({
  locations: z.array(locationEntrySchema).max(LOCATIONS_MAX),
})
export type LocationsSectionInput = z.infer<typeof locationsSectionSchema>

export const faqEntrySchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required').max(FAQ_ANSWER_MAX_CHARS),
})

export const faqSectionSchema = z.object({
  items: z.array(faqEntrySchema).max(FAQ_MAX_ITEMS),
})
export type FAQSectionInput = z.infer<typeof faqSectionSchema>

// Auth schemas (unchanged)
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
export type AuthInput = z.infer<typeof authSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
