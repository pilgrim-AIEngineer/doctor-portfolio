// Profile section row type and per-section data shapes
import type { SECTION_KEYS } from '@/lib/constants'

export type SectionKey = (typeof SECTION_KEYS)[number]

export interface ProfileSection {
  id: string
  doctor_id: string
  section_key: SectionKey
  data: unknown
  is_visible: boolean
  display_order: number
  updated_at: string
}

export interface SectionMeta {
  section_key: SectionKey
  is_visible: boolean
  display_order: number
}

export interface PersonalSection {
  name: string
  photo?: string
  cover_image?: string
  tagline?: string
  about?: string
  years_of_experience?: number
}

export interface QualificationEntry {
  degree: string
  institution: string
  year: number
}

export interface QualificationsSection {
  degrees: QualificationEntry[]
  fellowships: QualificationEntry[]
}

export interface RegistrationSection {
  nmc_number: string
  state_council: string
  validity: string
}

export interface SpecializationSection {
  primary: string
  sub_specialties: string[]
}

export interface HospitalEntry {
  role: string
  hospital: string
  location: string
  from_year: number
  to_year: number | null
}

export interface ExperienceSection {
  hospitals: HospitalEntry[]
  current_affiliation: string
}

export interface ServicesSection {
  treatments: string[]
  procedures: string[]
  consultation_types: string[]
}

export interface ClinicInfoSection {
  address: string
  map_url?: string
  timings: string
  phone: string
}

export interface LocationEntry {
  name: string
  address: string
  phone: string
  timings: string
  map_url?: string
  is_primary: boolean
}

export interface LocationsSection {
  locations: LocationEntry[]
}

export interface FeesSection {
  consultation_fee: number
  followup_fee?: number
  fee_note?: string
}

export interface FAQEntry {
  question: string
  answer: string
}

export interface FAQSection {
  items: FAQEntry[]
}

export interface TestimonialEntry {
  patient_name: string
  review: string
  rating: 1 | 2 | 3 | 4 | 5
}

export interface TestimonialsSection {
  reviews: TestimonialEntry[]
}

export interface AppointmentSection {
  whatsapp: string
  practo_url?: string
  booking_form_enabled: boolean
}

export interface SocialSection {
  youtube?: string
  instagram?: string
  linkedin?: string
  twitter?: string
}
