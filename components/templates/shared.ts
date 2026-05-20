// Shared template presentation helpers; no fetching, mutations, or persisted data reshaping
import { UPLOAD_GALLERY_MAX_IMAGES } from '@/lib/constants'
import { formatIndianPhone } from '@/lib/utils'
import type { Doctor } from '@/types/Doctor'
import type {
  AppointmentSection,
  ClinicInfoSection,
  ExperienceSection,
  FAQSection,
  FeesSection,
  HospitalEntry,
  LocationsSection,
  PersonalSection,
  QualificationEntry,
  QualificationsSection,
  SectionKey,
  ServicesSection,
  SocialSection,
  SpecializationSection,
  TestimonialEntry,
} from '@/types/Profile'

export interface AchievementsData {
  awards?: string[]
  recognitions?: string[]
}

export interface GalleryData {
  images?: string[]
}

export interface LanguagesData {
  spoken?: string[]
}

export interface InsuranceData {
  panels?: string[]
}

export interface ResearchData {
  publications?: string[]
  conferences?: string[]
}

export interface TestimonialsData {
  reviews?: TestimonialEntry[]
}

export interface TemplateSections {
  personal?: PersonalSection
  qualifications?: QualificationsSection
  specialization?: SpecializationSection
  experience?: ExperienceSection
  services?: ServicesSection
  clinicInfo?: ClinicInfoSection
  appointment?: AppointmentSection
  achievements?: AchievementsData
  gallery?: GalleryData
  languages?: LanguagesData
  insurance?: InsuranceData
  social?: SocialSection
  research?: ResearchData
  testimonials?: TestimonialsData
  fees?: FeesSection
  locations?: LocationsSection
  faq?: FAQSection
}

export function getTemplateSections(
  sections: Partial<Record<SectionKey, unknown>>,
): TemplateSections {
  return {
    personal: sections.personal as PersonalSection | undefined,
    qualifications: sections.qualifications as QualificationsSection | undefined,
    specialization: sections.specialization as SpecializationSection | undefined,
    experience: sections.experience as ExperienceSection | undefined,
    services: sections.services as ServicesSection | undefined,
    clinicInfo: sections.clinic_info as ClinicInfoSection | undefined,
    appointment: sections.appointment as AppointmentSection | undefined,
    achievements: sections.achievements as AchievementsData | undefined,
    gallery: sections.gallery as GalleryData | undefined,
    languages: sections.languages as LanguagesData | undefined,
    insurance: sections.insurance as InsuranceData | undefined,
    social: sections.social as SocialSection | undefined,
    research: sections.research as ResearchData | undefined,
    testimonials: sections.testimonials as TestimonialsData | undefined,
    fees: sections.fees as FeesSection | undefined,
    locations: sections.locations as LocationsSection | undefined,
    faq: sections.faq as FAQSection | undefined,
  }
}

export function hasItems<T>(items?: T[]): items is T[] {
  return Array.isArray(items) && items.length > 0
}

export function getGalleryImages(gallery?: GalleryData): string[] {
  return gallery?.images?.slice(0, UPLOAD_GALLERY_MAX_IMAGES) ?? []
}

export function getAchievementItems(achievements?: AchievementsData): string[] {
  return [...(achievements?.awards ?? []), ...(achievements?.recognitions ?? [])]
}

export function getServiceCount(services?: ServicesSection): number {
  return (
    (services?.treatments?.length ?? 0) +
    (services?.procedures?.length ?? 0) +
    (services?.consultation_types?.length ?? 0)
  )
}

export function getSpecializationCount(specialization?: SpecializationSection): number {
  return (specialization?.sub_specialties?.length ?? 0) + (specialization?.primary ? 1 : 0)
}

export function getSocialLinks(social?: SocialSection) {
  return [
    { label: 'YouTube', url: social?.youtube },
    { label: 'Instagram', url: social?.instagram },
    { label: 'LinkedIn', url: social?.linkedin },
    { label: 'Twitter', url: social?.twitter },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url))
}

export function getContactLinks(appointment: AppointmentSection | undefined, doctor: Doctor) {
  const formattedPhone = formatIndianPhone(appointment?.whatsapp ?? doctor.phone)
  const waNumber = formattedPhone.replace('+', '')
  const waText = encodeURIComponent(
    `Hello Dr. ${doctor.name}, I would like to book an appointment.`,
  )

  return {
    formattedPhone,
    waUrl: `https://wa.me/${waNumber}?text=${waText}`,
    telUrl: `tel:${formattedPhone}`,
    practoUrl: appointment?.practo_url,
    formEnabled: appointment?.booking_form_enabled === true,
  }
}

export function getPreviewMissingSections(sections: TemplateSections): string[] {
  const missing: string[] = []
  if (!sections.personal?.about) missing.push('about')
  if (!sections.services) missing.push('services')
  if (!sections.clinicInfo) missing.push('clinic')
  if (!sections.appointment) missing.push('appointment')
  return missing
}

export function computeExperienceYears(experience?: ExperienceSection, personal?: PersonalSection): number {
  if (personal?.years_of_experience != null) return personal.years_of_experience
  if (!experience?.hospitals?.length) return 0
  const minYear = Math.min(...experience.hospitals.map((h: HospitalEntry) => h.from_year))
  return Math.max(0, new Date().getFullYear() - minYear)
}

export function getHospitalItems(experience?: ExperienceSection): string[] {
  return (experience?.hospitals ?? []).map(
    (h: HospitalEntry) =>
      `${h.role} at ${h.hospital}, ${h.location} (${h.from_year}–${h.to_year ?? 'Present'})`,
  )
}

export function getQualificationItems(entries: QualificationEntry[]): string[] {
  return entries.map((e: QualificationEntry) => `${e.degree}, ${e.institution} (${e.year})`)
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'DR'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getVisibleSectionIds(sections: TemplateSections): string[] {
  const checks: [string, boolean][] = [
    ['section-personal',      !!sections.personal?.about],
    ['section-qualifications', !!(sections.qualifications?.degrees?.length || sections.qualifications?.fellowships?.length)],
    ['section-specialization', !!sections.specialization],
    ['section-experience',    !!sections.experience],
    ['section-services',      !!(sections.services?.treatments?.length || sections.services?.procedures?.length)],
    ['section-clinic_info',   !!(sections.locations?.locations?.length || sections.clinicInfo)],
    ['section-achievements',  !!(sections.achievements?.awards?.length || sections.achievements?.recognitions?.length)],
    ['section-gallery',       !!sections.gallery?.images?.length],
    ['section-languages',     !!(sections.languages?.spoken?.length || sections.insurance?.panels?.length || getSocialLinks(sections.social).length)],
  ]
  return checks.filter(([, hasContent]) => hasContent).map(([id]) => id)
}
