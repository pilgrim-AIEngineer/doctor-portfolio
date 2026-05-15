// Application-wide constants — no magic strings or numbers in component files
export const APP_NAME = 'DocFolio'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
} as const

export const PLAN_PRICE = {
  PRO: 499, // ₹ per month
} as const

export const SECTION_KEYS = [
  'personal',
  'qualifications',
  'registration',
  'specialization',
  'experience',
  'services',
  'achievements',
  'research',
  'testimonials',
  'gallery',
  'clinic_info',
  'appointment',
  'insurance',
  'languages',
  'social',
  'fees',
  'locations',
  'faq',
] as const

export const PROFILE_GROUPS = [
  {
    key: 'identity',
    label: 'Identity',
    sections: ['personal', 'specialization', 'qualifications', 'registration'] as const,
  },
  {
    key: 'practice',
    label: 'Practice',
    sections: ['experience', 'services', 'clinic_info', 'fees', 'locations'] as const,
  },
  {
    key: 'credibility',
    label: 'Credibility',
    sections: ['achievements', 'research', 'gallery'] as const,
  },
  {
    key: 'patient',
    label: 'Patient',
    sections: ['testimonials', 'faq', 'insurance', 'languages'] as const,
  },
  {
    key: 'connect',
    label: 'Connect',
    sections: ['appointment', 'social'] as const,
  },
] as const

export const PRO_ONLY_SECTIONS: ReadonlyArray<string> = ['fees', 'locations', 'faq']

export const SECTION_LABELS: Record<string, string> = {
  personal: 'Personal',
  qualifications: 'Qualifications',
  registration: 'Registration',
  specialization: 'Specialization',
  experience: 'Experience',
  services: 'Services',
  achievements: 'Achievements',
  research: 'Research',
  testimonials: 'Testimonials',
  gallery: 'Gallery',
  clinic_info: 'Clinic Info',
  appointment: 'Appointment',
  insurance: 'Insurance',
  languages: 'Languages',
  social: 'Social',
  fees: 'Fees',
  locations: 'Locations',
  faq: 'FAQ',
}

export const SECTION_ORDER_DEBOUNCE_MS = 300
export const ABOUT_MAX_CHARS = 5000
export const LOCATIONS_MAX = 5
export const FAQ_MAX_ITEMS = 10
export const FEE_NOTE_MAX_CHARS = 200
export const FAQ_ANSWER_MAX_CHARS = 400
export const TESTIMONIAL_REVIEW_MAX_CHARS = 300

export const PHONE_PREFIX = '+91'
export const OTP_LENGTH = 6
export const AUTOSAVE_DEBOUNCE_MS = 1000
export const ISR_REVALIDATE_SECONDS = 3600

export const UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
export const UPLOAD_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const UPLOAD_GALLERY_MAX_IMAGES = 10
export const CLOUDINARY_PROFILES_FOLDER = 'docfolio/profiles'
export const CLOUDINARY_GALLERY_FOLDER = 'docfolio/gallery'

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PENDING: 'pending',
} as const

export const APPOINTMENT_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  CLOSED: 'closed',
} as const

export const DASHBOARD_NAV = [
  { label: 'Profile',      shortLabel: 'Profile',  href: '/dashboard/profile' },
  { label: 'Template',     shortLabel: 'Template', href: '/dashboard/template' },
  { label: 'Preview',      shortLabel: 'Preview',  href: '/dashboard/preview' },
  { label: 'Appointments', shortLabel: 'Appts',    href: '/dashboard/appointments' },
  { label: 'Billing',      shortLabel: 'Billing',  href: '/dashboard/billing' },
  { label: 'Settings',     shortLabel: 'Settings', href: '/dashboard/settings' },
] as const

export const TEMPLATE_META = {
  classic: { label: 'Classic', description: 'Clean, professional layout trusted by thousands of doctors.', tier: 'free' },
  modern:  { label: 'Modern',  description: 'Sleek contemporary design with bold typography.',             tier: 'pro'  },
  bold:    { label: 'Bold',    description: 'Vibrant and eye-catching — stand out from the crowd.',        tier: 'pro'  },
  oncology:{ label: 'Oncology Pro', description: 'Premium cancer specialist profile built for trust, treatments, and patient callbacks.', tier: 'pro' },
} as const
