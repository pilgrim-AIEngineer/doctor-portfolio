// Profile section row type and per-section data shapes
import type { SECTION_KEYS } from '@/lib/constants'

export type SectionKey = (typeof SECTION_KEYS)[number]

export interface ProfileSection {
  id: string
  doctor_id: string
  section_key: SectionKey
  data: unknown
  updated_at: string
}

export interface PersonalSection {
  name: string
  photo?: string
  tagline?: string
  about?: string
}

export interface QualificationsSection {
  degrees: string[]
  fellowships: string[]
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

export interface ExperienceSection {
  years: number
  hospitals: string[]
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
