# Profile Editor Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the doctor profile editor into a two-column layout with accordion group navigation, section visibility/ordering controls, Profile Strength score, structured card-array forms, tag chip inputs, and three new Pro sections (Fees, Locations, FAQ).

**Architecture:** Left sticky nav holds accordion groups with completion dots, visibility toggles, and reorder arrows. Right pane renders the active form. Section visibility (`is_visible`) and order (`display_order`) are new columns on the `profiles` table, stored globally and applied to the public portfolio query. Two shared components (`TagChipInput`, `CardArrayInput`) replace all "one per line" textarea patterns.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Supabase (PostgreSQL), react-hook-form + zod, Tailwind CSS, lucide-react icons.

---

## File Map

**Create:**
- `supabase/migrations/006_section_controls.sql`
- `components/dashboard/profile/TagChipInput.tsx`
- `components/dashboard/profile/CardArrayInput.tsx`
- `components/dashboard/ProfileSideNav.tsx`
- `components/dashboard/ProfileStrength.tsx`
- `components/dashboard/profile/forms/FeesForm.tsx`
- `components/dashboard/profile/forms/LocationsForm.tsx`
- `components/dashboard/profile/forms/FAQForm.tsx`

**Modify:**
- `lib/constants.ts` — add PROFILE_GROUPS, SECTION_KEYS additions
- `types/Profile.ts` — update QualificationsSection, ExperienceSection, TestimonialsSection; add FeesSection, LocationsSection, FAQSection
- `lib/validations/profile.ts` — update/add zod schemas
- `app/actions/profile.ts` — add updateSectionOrder, update getProfileSections to include is_visible/display_order
- `app/(dashboard)/dashboard/profile/page.tsx` — two-column layout
- `components/dashboard/profile/forms/PersonalForm.tsx` — add cover_image, char counter
- `components/dashboard/profile/forms/QualificationsForm.tsx` — card array
- `components/dashboard/profile/forms/ExperienceForm.tsx` — card array, remove years field
- `components/dashboard/profile/forms/TestimonialsForm.tsx` — card array + star picker
- `components/dashboard/profile/forms/ServicesForm.tsx` — tag chips
- `components/dashboard/profile/forms/AchievementsForm.tsx` — tag chips
- `components/dashboard/profile/forms/ResearchForm.tsx` — tag chips
- `components/dashboard/profile/forms/SpecializationForm.tsx` — tag chips for sub_specialties
- `components/dashboard/profile/forms/InsuranceForm.tsx` — tag chip
- `components/dashboard/profile/forms/LanguagesForm.tsx` — tag chip
- `app/dr/[slug]/page.tsx` — filter by is_visible, sort by display_order, add FAQ JSON-LD
- `components/templates/shared.ts` — add getTemplateSections mappings for fees/locations/faq

---

## Task 1: DB Migration — section controls

**Files:**
- Create: `supabase/migrations/006_section_controls.sql`

- [ ] **Step 1: Write migration**

```sql
-- Add section visibility and ordering controls to profiles table
alter table profiles add column if not exists is_visible boolean not null default true;
alter table profiles add column if not exists display_order integer not null default 0;
```

Save to `supabase/migrations/006_section_controls.sql`.

- [ ] **Step 2: Apply migration**

```bash
npx supabase db push
```

Expected: migration applied with no errors.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/006_section_controls.sql
git commit -m "feat: add is_visible and display_order to profiles table"
```

---

## Task 2: Constants and Types

**Files:**
- Modify: `lib/constants.ts`
- Modify: `types/Profile.ts`

- [ ] **Step 1: Update SECTION_KEYS in `lib/constants.ts`**

Replace the existing `SECTION_KEYS` array and add `PROFILE_GROUPS`:

```typescript
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
export const ABOUT_MAX_CHARS = 500
export const LOCATIONS_MAX = 5
export const FAQ_MAX_ITEMS = 10
export const FEE_NOTE_MAX_CHARS = 200
export const FAQ_ANSWER_MAX_CHARS = 400
export const TESTIMONIAL_REVIEW_MAX_CHARS = 300
```

- [ ] **Step 2: Update `types/Profile.ts`**

Replace the entire file:

```typescript
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: errors only in files that used the old types (those will be fixed in later tasks). Zero errors in `lib/constants.ts` and `types/Profile.ts` themselves.

- [ ] **Step 4: Commit**

```bash
git add lib/constants.ts types/Profile.ts
git commit -m "feat: add fees/locations/faq section keys and updated profile types"
```

---

## Task 3: Zod Schema Updates

**Files:**
- Modify: `lib/validations/profile.ts`

- [ ] **Step 1: Replace file content**

```typescript
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
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors in `lib/validations/profile.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/validations/profile.ts
git commit -m "feat: update zod schemas for structured card arrays and new sections"
```

---

## Task 4: Server Action — updateSectionOrder

**Files:**
- Modify: `app/actions/profile.ts`

- [ ] **Step 1: Update `getProfileSections` to fetch new columns**

In `app/actions/profile.ts`, change the select string in `getProfileSections`:

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('section_key, data, is_visible, display_order, updated_at')
  .eq('doctor_id', user.id)
```

- [ ] **Step 2: Add `updateSectionOrder` action**

Add after `getProfileSections`:

```typescript
export async function updateSectionOrder(
  updates: { section_key: string; display_order: number; is_visible: boolean }[]
): Promise<{ data?: unknown; error?: string }> {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Not authenticated' }

    const rows = updates.map((u) => ({
      doctor_id: user.id,
      section_key: u.section_key,
      data: {},
      is_visible: u.is_visible,
      display_order: u.display_order,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('profiles')
      .upsert(rows, { onConflict: 'doctor_id,section_key', ignoreDuplicates: false })

    if (error) {
      console.error('[updateSectionOrder]', error.message)
      return { error: 'Failed to update section order.' }
    }

    const { data: doctorRow } = await supabase
      .from('doctors')
      .select('slug')
      .eq('id', user.id)
      .single()

    if (doctorRow?.slug) revalidatePath(`/dr/${doctorRow.slug}`)

    return { data: true }
  } catch (err) {
    console.error('[updateSectionOrder] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/actions/profile.ts
git commit -m "feat: add updateSectionOrder server action and fetch is_visible/display_order"
```

---

## Task 5: TagChipInput shared component

**Files:**
- Create: `components/dashboard/profile/TagChipInput.tsx`

- [ ] **Step 1: Create component**

```typescript
// TagChipInput — type a value, press Enter or comma to add it as a removable chip
'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagChipInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export default function TagChipInput({ value, onChange, placeholder }: TagChipInputProps) {
  const [input, setInput] = useState('')

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag || value.includes(tag)) return
    onChange([...value, tag])
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-[42px] w-full rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent flex flex-wrap gap-1.5">
      {value.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="hover:text-brand-900 focus:outline-none"
            aria-label={`Remove ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={value.length === 0 ? (placeholder ?? 'Type and press Enter') : ''}
        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/profile/TagChipInput.tsx
git commit -m "feat: add TagChipInput shared component"
```

---

## Task 6: CardArrayInput shared component

**Files:**
- Create: `components/dashboard/profile/CardArrayInput.tsx`

- [ ] **Step 1: Create component**

```typescript
// CardArrayInput — renders an add/remove list of cards; children receive per-card field renderers
'use client'

import { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface CardArrayInputProps<T> {
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderCard: (item: T, index: number) => ReactNode
  addLabel?: string
  maxItems?: number
}

export default function CardArrayInput<T>({
  items,
  onAdd,
  onRemove,
  renderCard,
  addLabel = 'Add item',
  maxItems,
}: CardArrayInputProps<T>) {
  const atMax = maxItems !== undefined && items.length >= maxItems

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {renderCard(item, i)}
        </div>
      ))}
      {!atMax && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
      {atMax && (
        <p className="text-xs text-gray-400">Maximum of {maxItems} items reached.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/profile/CardArrayInput.tsx
git commit -m "feat: add CardArrayInput shared component"
```

---

## Task 7: Tag-chip form upgrades (6 forms)

**Files:**
- Modify: `components/dashboard/profile/forms/ServicesForm.tsx`
- Modify: `components/dashboard/profile/forms/AchievementsForm.tsx`
- Modify: `components/dashboard/profile/forms/ResearchForm.tsx`
- Modify: `components/dashboard/profile/forms/SpecializationForm.tsx`
- Modify: `components/dashboard/profile/forms/InsuranceForm.tsx`
- Modify: `components/dashboard/profile/forms/LanguagesForm.tsx`

- [ ] **Step 1: Rewrite `ServicesForm.tsx`**

```typescript
// ServicesForm — edits the "services" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function ServicesForm({ data }: { data: unknown }) {
  const existing = data as { treatments?: string[]; procedures?: string[]; consultation_types?: string[] } | undefined
  const [treatments, setTreatments] = useState<string[]>(existing?.treatments ?? [])
  const [procedures, setProcedures] = useState<string[]>(existing?.procedures ?? [])
  const [consultationTypes, setConsultationTypes] = useState<string[]>(existing?.consultation_types ?? [])

  const formData = { treatments, procedures, consultation_types: consultationTypes }
  const status = useAutoSave(formData, (d) => saveProfileSection('services', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Services</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Treatments offered</label>
        <TagChipInput value={treatments} onChange={setTreatments} placeholder="e.g. Knee Replacement" />
      </div>
      <div>
        <label className={LABEL}>Procedures</label>
        <TagChipInput value={procedures} onChange={setProcedures} placeholder="e.g. Arthroscopy" />
      </div>
      <div>
        <label className={LABEL}>Consultation types</label>
        <TagChipInput value={consultationTypes} onChange={setConsultationTypes} placeholder="e.g. In-clinic" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `AchievementsForm.tsx`**

```typescript
// AchievementsForm — edits the "achievements" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function AchievementsForm({ data }: { data: unknown }) {
  const existing = data as { awards?: string[]; recognitions?: string[] } | undefined
  const [awards, setAwards] = useState<string[]>(existing?.awards ?? [])
  const [recognitions, setRecognitions] = useState<string[]>(existing?.recognitions ?? [])

  const formData = { awards, recognitions }
  const status = useAutoSave(formData, (d) => saveProfileSection('achievements', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Awards</label>
        <TagChipInput value={awards} onChange={setAwards} placeholder="e.g. Best Surgeon Award — IMA 2022" />
      </div>
      <div>
        <label className={LABEL}>Recognitions</label>
        <TagChipInput value={recognitions} onChange={setRecognitions} placeholder="e.g. Top Doctor — Practo 2023" />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `ResearchForm.tsx`**

```typescript
// ResearchForm — edits the "research" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function ResearchForm({ data }: { data: unknown }) {
  const existing = data as { publications?: string[]; conferences?: string[] } | undefined
  const [publications, setPublications] = useState<string[]>(existing?.publications ?? [])
  const [conferences, setConferences] = useState<string[]>(existing?.conferences ?? [])

  const formData = { publications, conferences }
  const status = useAutoSave(formData, (d) => saveProfileSection('research', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Research</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Publications</label>
        <TagChipInput value={publications} onChange={setPublications} placeholder="e.g. Journal of Cardiology, 2022" />
      </div>
      <div>
        <label className={LABEL}>Conferences</label>
        <TagChipInput value={conferences} onChange={setConferences} placeholder="e.g. AICC Annual Conference 2023" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `SpecializationForm.tsx`**

```typescript
// SpecializationForm — edits the "specialization" profile section
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { specializationSectionSchema } from '@/lib/validations/profile'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function SpecializationForm({ data }: { data: unknown }) {
  const existing = data as { primary?: string; sub_specialties?: string[] } | undefined
  const [subSpecialties, setSubSpecialties] = useState<string[]>(existing?.sub_specialties ?? [])
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(specializationSectionSchema),
    defaultValues: { primary: existing?.primary ?? '', sub_specialties: [] },
  })
  const primary = watch('primary')
  const formData = { primary, sub_specialties: subSpecialties }
  const status = useAutoSave(formData, (d) => saveProfileSection('specialization', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Specialization</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Primary specialty</label>
        <input type="text" {...register('primary')} className={INPUT} placeholder="e.g. Orthopaedic Surgery" />
        {errors.primary && <p className={ERROR}>{errors.primary.message}</p>}
      </div>
      <div>
        <label className={LABEL}>Sub-specialties</label>
        <TagChipInput value={subSpecialties} onChange={setSubSpecialties} placeholder="e.g. Joint Replacement" />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Rewrite `InsuranceForm.tsx`**

```typescript
// InsuranceForm — edits the "insurance" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function InsuranceForm({ data }: { data: unknown }) {
  const existing = data as { panels?: string[] } | undefined
  const [panels, setPanels] = useState<string[]>(existing?.panels ?? [])

  const status = useAutoSave({ panels }, (d) => saveProfileSection('insurance', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Insurance</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Insurance panels accepted</label>
        <TagChipInput value={panels} onChange={setPanels} placeholder="e.g. Star Health, ICICI Lombard" />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Rewrite `LanguagesForm.tsx`**

```typescript
// LanguagesForm — edits the "languages" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import TagChipInput from '../TagChipInput'
import SaveStatus from '../SaveStatus'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1'

export default function LanguagesForm({ data }: { data: unknown }) {
  const existing = data as { spoken?: string[] } | undefined
  const [spoken, setSpoken] = useState<string[]>(existing?.spoken ?? [])

  const status = useAutoSave({ spoken }, (d) => saveProfileSection('languages', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Languages</h2>
        <SaveStatus status={status} />
      </div>
      <div>
        <label className={LABEL}>Languages spoken</label>
        <TagChipInput value={spoken} onChange={setSpoken} placeholder="e.g. Hindi, English, Marathi" />
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add components/dashboard/profile/forms/ServicesForm.tsx \
  components/dashboard/profile/forms/AchievementsForm.tsx \
  components/dashboard/profile/forms/ResearchForm.tsx \
  components/dashboard/profile/forms/SpecializationForm.tsx \
  components/dashboard/profile/forms/InsuranceForm.tsx \
  components/dashboard/profile/forms/LanguagesForm.tsx
git commit -m "feat: replace textarea lists with TagChipInput in 6 forms"
```

---

## Task 8: Card-array form upgrades (Qualifications, Experience, Testimonials)

**Files:**
- Modify: `components/dashboard/profile/forms/QualificationsForm.tsx`
- Modify: `components/dashboard/profile/forms/ExperienceForm.tsx`
- Modify: `components/dashboard/profile/forms/TestimonialsForm.tsx`

- [ ] **Step 1: Rewrite `QualificationsForm.tsx`**

```typescript
// QualificationsForm — edits the "qualifications" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { QualificationEntry } from '@/types/Profile'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): QualificationEntry => ({ degree: '', institution: '', year: new Date().getFullYear() })

function QualCard({
  item,
  index,
  onChange,
}: {
  item: QualificationEntry
  index: number
  onChange: (index: number, updated: QualificationEntry) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 pr-6">
      <div className="col-span-2">
        <label className={LABEL}>Degree / Title</label>
        <input
          type="text"
          value={item.degree}
          onChange={(e) => onChange(index, { ...item, degree: e.target.value })}
          className={INPUT}
          placeholder="e.g. MS (Orthopaedics)"
        />
      </div>
      <div>
        <label className={LABEL}>Institution</label>
        <input
          type="text"
          value={item.institution}
          onChange={(e) => onChange(index, { ...item, institution: e.target.value })}
          className={INPUT}
          placeholder="e.g. AIIMS Delhi"
        />
      </div>
      <div>
        <label className={LABEL}>Year</label>
        <input
          type="number"
          value={item.year}
          onChange={(e) => onChange(index, { ...item, year: parseInt(e.target.value) || 2000 })}
          className={INPUT}
          min={1950}
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  )
}

export default function QualificationsForm({ data }: { data: unknown }) {
  const existing = data as { degrees?: QualificationEntry[]; fellowships?: QualificationEntry[] } | undefined
  const [degrees, setDegrees] = useState<QualificationEntry[]>(existing?.degrees ?? [])
  const [fellowships, setFellowships] = useState<QualificationEntry[]>(existing?.fellowships ?? [])

  function updateDegree(index: number, updated: QualificationEntry) {
    setDegrees((prev) => prev.map((d, i) => (i === index ? updated : d)))
  }
  function updateFellowship(index: number, updated: QualificationEntry) {
    setFellowships((prev) => prev.map((f, i) => (i === index ? updated : f)))
  }

  const formData = { degrees, fellowships }
  const status = useAutoSave(formData, (d) => saveProfileSection('qualifications', d))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Qualifications</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Degrees</p>
        <CardArrayInput
          items={degrees}
          onAdd={() => setDegrees((prev) => [...prev, emptyEntry()])}
          onRemove={(i) => setDegrees((prev) => prev.filter((_, idx) => idx !== i))}
          renderCard={(item, i) => <QualCard item={item} index={i} onChange={updateDegree} />}
          addLabel="Add degree"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Fellowships</p>
        <CardArrayInput
          items={fellowships}
          onAdd={() => setFellowships((prev) => [...prev, emptyEntry()])}
          onRemove={(i) => setFellowships((prev) => prev.filter((_, idx) => idx !== i))}
          renderCard={(item, i) => <QualCard item={item} index={i} onChange={updateFellowship} />}
          addLabel="Add fellowship"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `ExperienceForm.tsx`**

```typescript
// ExperienceForm — edits the "experience" profile section
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { HospitalEntry } from '@/types/Profile'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): HospitalEntry => ({
  role: '',
  hospital: '',
  location: '',
  from_year: new Date().getFullYear(),
  to_year: null,
})

function HospitalCard({
  item,
  index,
  onChange,
}: {
  item: HospitalEntry
  index: number
  onChange: (index: number, updated: HospitalEntry) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 pr-6">
      <div className="col-span-2">
        <label className={LABEL}>Role / Designation</label>
        <input
          type="text"
          value={item.role}
          onChange={(e) => onChange(index, { ...item, role: e.target.value })}
          className={INPUT}
          placeholder="e.g. Senior Consultant"
        />
      </div>
      <div>
        <label className={LABEL}>Hospital / Institution</label>
        <input
          type="text"
          value={item.hospital}
          onChange={(e) => onChange(index, { ...item, hospital: e.target.value })}
          className={INPUT}
          placeholder="e.g. Apollo Hospitals"
        />
      </div>
      <div>
        <label className={LABEL}>City</label>
        <input
          type="text"
          value={item.location}
          onChange={(e) => onChange(index, { ...item, location: e.target.value })}
          className={INPUT}
          placeholder="e.g. Mumbai"
        />
      </div>
      <div>
        <label className={LABEL}>From year</label>
        <input
          type="number"
          value={item.from_year}
          onChange={(e) => onChange(index, { ...item, from_year: parseInt(e.target.value) || 2000 })}
          className={INPUT}
          min={1950}
          max={new Date().getFullYear()}
        />
      </div>
      <div>
        <label className={LABEL}>To year <span className="text-gray-400">(blank = present)</span></label>
        <input
          type="number"
          value={item.to_year ?? ''}
          onChange={(e) =>
            onChange(index, { ...item, to_year: e.target.value ? parseInt(e.target.value) : null })
          }
          className={INPUT}
          min={1950}
          max={new Date().getFullYear()}
          placeholder="Present"
        />
      </div>
    </div>
  )
}

export default function ExperienceForm({ data }: { data: unknown }) {
  const existing = data as { hospitals?: HospitalEntry[]; current_affiliation?: string } | undefined
  const [hospitals, setHospitals] = useState<HospitalEntry[]>(existing?.hospitals ?? [])
  const [currentAffiliation, setCurrentAffiliation] = useState(existing?.current_affiliation ?? '')

  function updateHospital(index: number, updated: HospitalEntry) {
    setHospitals((prev) => prev.map((h, i) => (i === index ? updated : h)))
  }

  const formData = { hospitals, current_affiliation: currentAffiliation }
  const status = useAutoSave(formData, (d) => saveProfileSection('experience', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current affiliation</label>
        <input
          type="text"
          value={currentAffiliation}
          onChange={(e) => setCurrentAffiliation(e.target.value)}
          className={INPUT}
          placeholder="e.g. Apollo Hospitals, Mumbai"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Positions held</p>
        <CardArrayInput
          items={hospitals}
          onAdd={() => setHospitals((prev) => [...prev, emptyEntry()])}
          onRemove={(i) => setHospitals((prev) => prev.filter((_, idx) => idx !== i))}
          renderCard={(item, i) => <HospitalCard item={item} index={i} onChange={updateHospital} />}
          addLabel="Add position"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `TestimonialsForm.tsx`**

```typescript
// TestimonialsForm — edits the "testimonials" profile section
'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { TestimonialEntry } from '@/types/Profile'
import { TESTIMONIAL_REVIEW_MAX_CHARS } from '@/lib/constants'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): TestimonialEntry => ({ patient_name: '', review: '', rating: 5 })

function TestimonialCard({
  item,
  index,
  onChange,
}: {
  item: TestimonialEntry
  index: number
  onChange: (index: number, updated: TestimonialEntry) => void
}) {
  return (
    <div className="space-y-3 pr-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Patient name</label>
          <input
            type="text"
            value={item.patient_name}
            onChange={(e) => onChange(index, { ...item, patient_name: e.target.value })}
            className={INPUT}
            placeholder="e.g. Ramesh K."
          />
        </div>
        <div>
          <label className={LABEL}>Rating</label>
          <div className="flex gap-1 mt-1">
            {([1, 2, 3, 4, 5] as const).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(index, { ...item, rating: star })}
                aria-label={`${star} star`}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className={LABEL}>Review <span className="text-gray-400">({item.review.length}/{TESTIMONIAL_REVIEW_MAX_CHARS})</span></label>
        <textarea
          value={item.review}
          onChange={(e) => onChange(index, { ...item, review: e.target.value })}
          rows={3}
          maxLength={TESTIMONIAL_REVIEW_MAX_CHARS}
          className={`${INPUT} resize-y`}
          placeholder="Excellent doctor, very thorough and caring."
        />
      </div>
    </div>
  )
}

export default function TestimonialsForm({ data }: { data: unknown }) {
  const existing = data as { reviews?: TestimonialEntry[] } | undefined
  const [reviews, setReviews] = useState<TestimonialEntry[]>(existing?.reviews ?? [])

  function updateReview(index: number, updated: TestimonialEntry) {
    setReviews((prev) => prev.map((r, i) => (i === index ? updated : r)))
  }

  const status = useAutoSave({ reviews }, (d) => saveProfileSection('testimonials', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Patient Reviews</h2>
        <SaveStatus status={status} />
      </div>
      <CardArrayInput
        items={reviews}
        onAdd={() => setReviews((prev) => [...prev, emptyEntry()])}
        onRemove={(i) => setReviews((prev) => prev.filter((_, idx) => idx !== i))}
        renderCard={(item, i) => <TestimonialCard item={item} index={i} onChange={updateReview} />}
        addLabel="Add review"
      />
    </div>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/profile/forms/QualificationsForm.tsx \
  components/dashboard/profile/forms/ExperienceForm.tsx \
  components/dashboard/profile/forms/TestimonialsForm.tsx
git commit -m "feat: upgrade qualifications, experience, testimonials to card array forms"
```

---

## Task 9: PersonalForm upgrade

**Files:**
- Modify: `components/dashboard/profile/forms/PersonalForm.tsx`

- [ ] **Step 1: Add cover_image field and char counter to about**

Replace the file:

```typescript
// PersonalForm — edits the "personal" profile section
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { personalSectionSchema, type PersonalSectionInput } from '@/lib/validations/profile'
import { ABOUT_MAX_CHARS } from '@/lib/constants'
import SaveStatus from '../SaveStatus'
import ProfilePhotoUpload from '../ProfilePhotoUpload'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function PersonalForm({ data }: { data: unknown }) {
  const existing = data as PersonalSectionInput | undefined
  const form = useForm<PersonalSectionInput>({
    resolver: zodResolver(personalSectionSchema),
    defaultValues: {
      name: existing?.name ?? '',
      photo: existing?.photo ?? '',
      cover_image: existing?.cover_image ?? '',
      tagline: existing?.tagline ?? '',
      about: existing?.about ?? '',
    },
  })
  const { register, watch, setValue, formState: { errors } } = form
  const about = watch('about') ?? ''
  const status = useAutoSave(watch(), (d) => saveProfileSection('personal', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Personal</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className={LABEL}>Full name</label>
        <input type="text" {...register('name')} className={INPUT} />
        {errors.name && <p className={ERROR}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Profile photo</label>
        <ProfilePhotoUpload
          value={watch('photo') ?? ''}
          onChange={(url) => setValue('photo', url, { shouldDirty: true })}
        />
        {errors.photo && <p className={ERROR}>{errors.photo.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Cover image <span className="text-gray-400 font-normal">(banner for Bold &amp; Oncology templates)</span></label>
        <ProfilePhotoUpload
          value={watch('cover_image') ?? ''}
          onChange={(url) => setValue('cover_image', url, { shouldDirty: true })}
        />
        {errors.cover_image && <p className={ERROR}>{errors.cover_image.message}</p>}
      </div>

      <div>
        <label className={LABEL}>Tagline <span className="text-gray-400 font-normal">(max 120 chars)</span></label>
        <input type="text" {...register('tagline')} className={INPUT} placeholder="e.g. 15+ years in cardiac surgery" />
        {errors.tagline && <p className={ERROR}>{errors.tagline.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={LABEL} style={{ marginBottom: 0 }}>About</label>
          <span className={`text-xs ${about.length > ABOUT_MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-gray-400'}`}>
            {about.length}/{ABOUT_MAX_CHARS}
          </span>
        </div>
        <textarea
          {...register('about')}
          rows={5}
          maxLength={ABOUT_MAX_CHARS}
          className={`${INPUT} resize-y`}
          placeholder="Write a short bio…"
        />
        {errors.about && <p className={ERROR}>{errors.about.message}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/profile/forms/PersonalForm.tsx
git commit -m "feat: add cover_image field and char counter to PersonalForm"
```

---

## Task 10: New forms — Fees, Locations, FAQ

**Files:**
- Create: `components/dashboard/profile/forms/FeesForm.tsx`
- Create: `components/dashboard/profile/forms/LocationsForm.tsx`
- Create: `components/dashboard/profile/forms/FAQForm.tsx`

- [ ] **Step 1: Create `FeesForm.tsx`**

```typescript
// FeesForm — edits the "fees" profile section (Pro only)
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { feesSectionSchema, type FeesSectionInput } from '@/lib/validations/profile'
import { FEE_NOTE_MAX_CHARS } from '@/lib/constants'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-600'

export default function FeesForm({ data }: { data: unknown }) {
  const existing = data as FeesSectionInput | undefined
  const { register, watch, formState: { errors } } = useForm<FeesSectionInput>({
    resolver: zodResolver(feesSectionSchema),
    defaultValues: {
      consultation_fee: existing?.consultation_fee ?? 0,
      followup_fee: existing?.followup_fee ?? undefined,
      fee_note: existing?.fee_note ?? '',
    },
  })
  const status = useAutoSave(watch(), (d) => saveProfileSection('fees', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Consultation Fees</h2>
        <SaveStatus status={status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Consultation fee (₹)</label>
          <input
            type="number"
            {...register('consultation_fee', { valueAsNumber: true })}
            min={0}
            className={INPUT}
            placeholder="500"
          />
          {errors.consultation_fee && <p className={ERROR}>{errors.consultation_fee.message}</p>}
        </div>
        <div>
          <label className={LABEL}>Follow-up fee (₹) <span className="text-gray-400 font-normal">optional</span></label>
          <input
            type="number"
            {...register('followup_fee', { valueAsNumber: true })}
            min={0}
            className={INPUT}
            placeholder="300"
          />
        </div>
      </div>

      <div>
        <label className={LABEL}>Fee note <span className="text-gray-400 font-normal">(max {FEE_NOTE_MAX_CHARS} chars)</span></label>
        <input
          type="text"
          {...register('fee_note')}
          maxLength={FEE_NOTE_MAX_CHARS}
          className={INPUT}
          placeholder="e.g. Includes prescription. Online consultations ₹200 off."
        />
        {errors.fee_note && <p className={ERROR}>{errors.fee_note.message}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `LocationsForm.tsx`**

```typescript
// LocationsForm — edits the "locations" profile section (Pro only)
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { LocationEntry } from '@/types/Profile'
import { LOCATIONS_MAX, PHONE_PREFIX } from '@/lib/constants'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyLocation = (): LocationEntry => ({
  name: '',
  address: '',
  phone: '',
  timings: '',
  map_url: '',
  is_primary: false,
})

function LocationCard({
  item,
  index,
  allItems,
  onChange,
}: {
  item: LocationEntry
  index: number
  allItems: LocationEntry[]
  onChange: (index: number, updated: LocationEntry) => void
}) {
  function setPrimary() {
    // Handled by parent — just signal intent via onChange with is_primary: true
    onChange(index, { ...item, is_primary: true })
  }

  return (
    <div className="space-y-3 pr-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={`primary-${index}`}
            checked={item.is_primary}
            onChange={setPrimary}
            className="h-4 w-4 text-brand-600 border-gray-300 focus:ring-brand-500"
          />
          <label htmlFor={`primary-${index}`} className="text-xs text-gray-600">Primary location</label>
        </div>
      </div>
      <div>
        <label className={LABEL}>Clinic / Hospital name</label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange(index, { ...item, name: e.target.value })}
          className={INPUT}
          placeholder="e.g. Apollo Clinic, Bandra"
        />
      </div>
      <div>
        <label className={LABEL}>Address</label>
        <textarea
          value={item.address}
          onChange={(e) => onChange(index, { ...item, address: e.target.value })}
          rows={2}
          className={`${INPUT} resize-y`}
          placeholder="12, Medical Complex, MG Road, Mumbai — 400001"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Phone ({PHONE_PREFIX})</label>
          <input
            type="tel"
            value={item.phone}
            onChange={(e) => onChange(index, { ...item, phone: e.target.value })}
            className={INPUT}
            maxLength={10}
            placeholder="9876543210"
          />
        </div>
        <div>
          <label className={LABEL}>Timings</label>
          <input
            type="text"
            value={item.timings}
            onChange={(e) => onChange(index, { ...item, timings: e.target.value })}
            className={INPUT}
            placeholder="Mon–Sat: 10am–1pm"
          />
        </div>
      </div>
      <div>
        <label className={LABEL}>Google Maps URL <span className="text-gray-400">(optional)</span></label>
        <input
          type="url"
          value={item.map_url ?? ''}
          onChange={(e) => onChange(index, { ...item, map_url: e.target.value })}
          className={INPUT}
          placeholder="https://maps.google.com/…"
        />
      </div>
    </div>
  )
}

export default function LocationsForm({ data }: { data: unknown }) {
  const existing = data as { locations?: LocationEntry[] } | undefined
  const [locations, setLocations] = useState<LocationEntry[]>(existing?.locations ?? [])

  function updateLocation(index: number, updated: LocationEntry) {
    setLocations((prev) =>
      prev.map((loc, i) => {
        if (i === index) return updated
        // If new primary set, clear others
        if (updated.is_primary) return { ...loc, is_primary: false }
        return loc
      })
    )
  }

  const status = useAutoSave({ locations }, (d) => saveProfileSection('locations', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Clinic Locations</h2>
        <SaveStatus status={status} />
      </div>
      <CardArrayInput
        items={locations}
        onAdd={() => setLocations((prev) => [...prev, emptyLocation()])}
        onRemove={(i) => setLocations((prev) => prev.filter((_, idx) => idx !== i))}
        renderCard={(item, i) => (
          <LocationCard item={item} index={i} allItems={locations} onChange={updateLocation} />
        )}
        addLabel="Add location"
        maxItems={LOCATIONS_MAX}
      />
    </div>
  )
}
```

- [ ] **Step 3: Create `FAQForm.tsx`**

```typescript
// FAQForm — edits the "faq" profile section (Pro only)
'use client'

import { useState } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { FAQEntry } from '@/types/Profile'
import { FAQ_MAX_ITEMS, FAQ_ANSWER_MAX_CHARS } from '@/lib/constants'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): FAQEntry => ({ question: '', answer: '' })

function FAQCard({
  item,
  index,
  onChange,
}: {
  item: FAQEntry
  index: number
  onChange: (index: number, updated: FAQEntry) => void
}) {
  return (
    <div className="space-y-3 pr-6">
      <div>
        <label className={LABEL}>Question</label>
        <input
          type="text"
          value={item.question}
          onChange={(e) => onChange(index, { ...item, question: e.target.value })}
          className={INPUT}
          placeholder="e.g. Do you offer online consultations?"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={LABEL} style={{ marginBottom: 0 }}>Answer</label>
          <span className="text-xs text-gray-400">{item.answer.length}/{FAQ_ANSWER_MAX_CHARS}</span>
        </div>
        <textarea
          value={item.answer}
          onChange={(e) => onChange(index, { ...item, answer: e.target.value })}
          rows={3}
          maxLength={FAQ_ANSWER_MAX_CHARS}
          className={`${INPUT} resize-y`}
          placeholder="Yes, I offer online video consultations via…"
        />
      </div>
    </div>
  )
}

export default function FAQForm({ data }: { data: unknown }) {
  const existing = data as { items?: FAQEntry[] } | undefined
  const [items, setItems] = useState<FAQEntry[]>(existing?.items ?? [])

  function updateItem(index: number, updated: FAQEntry) {
    setItems((prev) => prev.map((item, i) => (i === index ? updated : item)))
  }

  const status = useAutoSave({ items }, (d) => saveProfileSection('faq', d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
        <SaveStatus status={status} />
      </div>
      <p className="text-sm text-gray-500">Common patient questions shown on your portfolio. Helps with SEO.</p>
      <CardArrayInput
        items={items}
        onAdd={() => setItems((prev) => [...prev, emptyEntry()])}
        onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
        renderCard={(item, i) => <FAQCard item={item} index={i} onChange={updateItem} />}
        addLabel="Add question"
        maxItems={FAQ_MAX_ITEMS}
      />
    </div>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/profile/forms/FeesForm.tsx \
  components/dashboard/profile/forms/LocationsForm.tsx \
  components/dashboard/profile/forms/FAQForm.tsx
git commit -m "feat: add Fees, Locations, and FAQ forms"
```

---

## Task 11: ProfileStrength component

**Files:**
- Create: `components/dashboard/ProfileStrength.tsx`

- [ ] **Step 1: Create component**

```typescript
// ProfileStrength — weighted profile completion score with nudge copy
'use client'

import type { SectionKey } from '@/types/Profile'

const WEIGHTS: Partial<Record<SectionKey, number>> = {
  personal: 15,
  specialization: 10,
  experience: 10,
  services: 10,
  clinic_info: 10,
  qualifications: 8,
  fees: 7,
  appointment: 7,
  testimonials: 7,
  achievements: 5,
  gallery: 4,
  research: 3,
  faq: 3,
  insurance: 1,
  languages: 1,
  social: 1,
  registration: 1,
}

const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)

function isFilled(key: SectionKey, data: unknown): boolean {
  if (data == null) return false
  if (key === 'personal') {
    const d = data as { name?: string }
    return Boolean(d?.name)
  }
  if (key === 'fees') {
    const d = data as { consultation_fee?: number }
    return typeof d?.consultation_fee === 'number'
  }
  if (Array.isArray((data as Record<string, unknown>)?.reviews)) {
    return ((data as { reviews: unknown[] }).reviews).length > 0
  }
  if (Array.isArray((data as Record<string, unknown>)?.items)) {
    return ((data as { items: unknown[] }).items).length > 0
  }
  if (Array.isArray((data as Record<string, unknown>)?.hospitals)) {
    return ((data as { hospitals: unknown[] }).hospitals).length > 0
  }
  return true
}

function getNudge(sections: Partial<Record<SectionKey, unknown>>, score: number): string {
  if (score >= 80) return 'Great profile! Keep it updated.'
  const personal = sections.personal as { photo?: string } | undefined
  if (!personal?.photo) return 'Add a profile photo — it\'s the first thing patients see.'
  if (!sections.fees) return 'Add your consultation fees — patients always want to know.'
  if (!sections.testimonials) return 'Add patient reviews to build trust with new patients.'
  if (!sections.services) return 'Add your services so patients know what you treat.'
  return 'Fill in more sections to strengthen your profile.'
}

interface ProfileStrengthProps {
  sections: Partial<Record<SectionKey, unknown>>
}

export default function ProfileStrength({ sections }: ProfileStrengthProps) {
  const score = Math.round(
    (Object.entries(WEIGHTS) as [SectionKey, number][]).reduce((acc, [key, weight]) => {
      return acc + (isFilled(key, sections[key]) ? weight : 0)
    }, 0) /
      TOTAL_WEIGHT *
      100
  )

  const color =
    score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-brand-500' : 'bg-amber-400'

  return (
    <div className="px-3 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-600">Profile Strength</span>
        <span className="text-xs font-semibold text-gray-800">{score}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-500">{getNudge(sections, score)}</p>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/ProfileStrength.tsx
git commit -m "feat: add ProfileStrength component with weighted score and nudge copy"
```

---

## Task 12: ProfileSideNav component

**Files:**
- Create: `components/dashboard/ProfileSideNav.tsx`

- [ ] **Step 1: Create component**

```typescript
// ProfileSideNav — accordion group nav with visibility toggles, reorder arrows, completion dots
'use client'

import { useState, useCallback, useTransition } from 'react'
import { Eye, EyeOff, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Lock } from 'lucide-react'
import { updateSectionOrder } from '@/app/actions/profile'
import { PROFILE_GROUPS, PRO_ONLY_SECTIONS, SECTION_LABELS, SECTION_ORDER_DEBOUNCE_MS } from '@/lib/constants'
import type { SectionKey, SectionMeta } from '@/types/Profile'

interface ProfileSideNavProps {
  sections: Partial<Record<SectionKey, unknown>>
  sectionMeta: SectionMeta[]
  activeSection: SectionKey
  doctorPlan: string
  onSelect: (key: SectionKey) => void
  onProGate: () => void
}

function buildMetaMap(metas: SectionMeta[]): Record<string, SectionMeta> {
  const map: Record<string, SectionMeta> = {}
  for (const m of metas) map[m.section_key] = m
  return map
}

export default function ProfileSideNav({
  sections,
  sectionMeta,
  activeSection,
  doctorPlan,
  onSelect,
  onProGate,
}: ProfileSideNavProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['identity', 'practice']))
  const [meta, setMeta] = useState<Record<string, SectionMeta>>(() => buildMetaMap(sectionMeta))
  const [, startTransition] = useTransition()

  const isPro = doctorPlan === 'pro'

  function toggleGroup(key: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const syncToServer = useCallback(
    (updatedMeta: Record<string, SectionMeta>) => {
      const updates = Object.values(updatedMeta).map((m) => ({
        section_key: m.section_key,
        display_order: m.display_order,
        is_visible: m.is_visible,
      }))
      startTransition(() => {
        updateSectionOrder(updates)
      })
    },
    []
  )

  function toggleVisibility(sectionKey: SectionKey) {
    setMeta((prev) => {
      const current = prev[sectionKey]
      const updated = {
        ...prev,
        [sectionKey]: { ...current, is_visible: !current?.is_visible },
      }
      syncToServer(updated)
      return updated
    })
  }

  function moveSection(groupSections: readonly string[], sectionKey: string, direction: 'up' | 'down') {
    const orderedInGroup = [...groupSections].sort(
      (a, b) => (meta[a]?.display_order ?? 0) - (meta[b]?.display_order ?? 0)
    )
    const idx = orderedInGroup.indexOf(sectionKey)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= orderedInGroup.length) return

    const aKey = orderedInGroup[idx]
    const bKey = orderedInGroup[swapIdx]
    const aOrder = meta[aKey]?.display_order ?? 0
    const bOrder = meta[bKey]?.display_order ?? 0

    setMeta((prev) => {
      const updated = {
        ...prev,
        [aKey]: { ...prev[aKey], display_order: bOrder },
        [bKey]: { ...prev[bKey], display_order: aOrder },
      }
      syncToServer(updated)
      return updated
    })
  }

  return (
    <nav className="w-56 flex-shrink-0">
      {PROFILE_GROUPS.map((group) => {
        const isOpen = openGroups.has(group.key)
        const orderedSections = [...group.sections].sort(
          (a, b) => (meta[a]?.display_order ?? 0) - (meta[b]?.display_order ?? 0)
        )

        return (
          <div key={group.key} className="mb-1">
            <button
              onClick={() => toggleGroup(group.key)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors"
            >
              {group.label}
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {isOpen && (
              <div className="ml-1 space-y-0.5">
                {orderedSections.map((sectionKey, idx) => {
                  const key = sectionKey as SectionKey
                  const isActive = activeSection === key
                  const isFilled = sections[key] != null
                  const isVisible = meta[key]?.is_visible ?? true
                  const isProOnly = PRO_ONLY_SECTIONS.includes(sectionKey)
                  const isLocked = isProOnly && !isPro

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer group ${
                        isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => {
                        if (isLocked) { onProGate(); return }
                        onSelect(key)
                      }}
                    >
                      {/* Completion dot */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isFilled ? 'bg-brand-500' : 'bg-gray-300'
                        }`}
                      />

                      <span className="flex-1 text-sm truncate">{SECTION_LABELS[sectionKey]}</span>

                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <div className="hidden group-hover:flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveSection(group.sections, sectionKey, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                            aria-label="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveSection(group.sections, sectionKey, 'down')}
                            disabled={idx === orderedSections.length - 1}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                            aria-label="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => toggleVisibility(key)}
                            className="p-0.5 text-gray-400 hover:text-gray-600"
                            aria-label={isVisible ? 'Hide section' : 'Show section'}
                          >
                            {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/ProfileSideNav.tsx
git commit -m "feat: add ProfileSideNav with accordion groups, visibility toggles, and reordering"
```

---

## Task 13: Two-column profile page layout

**Files:**
- Modify: `app/(dashboard)/dashboard/profile/page.tsx`
- Modify: `components/dashboard/profile/ProfileEditor.tsx`

- [ ] **Step 1: Update `getProfileSections` call and rewrite page**

Replace `app/(dashboard)/dashboard/profile/page.tsx`:

```typescript
// Profile editor page — two-column layout with side nav and active form pane
import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getProfileSections } from '@/app/actions/profile'
import { createServerClient } from '@/lib/supabase/server'
import type { ProfileSection, SectionKey, SectionMeta } from '@/types/Profile'
import ProfileEditor from '@/components/dashboard/profile/ProfileEditor'

export const metadata: Metadata = { title: 'Edit Profile' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [sectionsResult, doctorResult] = await Promise.all([
    getProfileSections(),
    supabase.from('doctors').select('slug, plan').eq('id', user!.id).single(),
  ])

  const sections: Partial<Record<SectionKey, unknown>> = {}
  const sectionMeta: SectionMeta[] = []

  if (sectionsResult.data) {
    for (const row of sectionsResult.data as ProfileSection[]) {
      sections[row.section_key] = row.data
      sectionMeta.push({
        section_key: row.section_key,
        is_visible: row.is_visible,
        display_order: row.display_order,
      })
    }
  }

  const slug = doctorResult.data?.slug as string | undefined
  const plan = (doctorResult.data?.plan as string) ?? 'free'

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        {slug && (
          <Link
            href={`/dr/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Preview <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>
      <ProfileEditor
        sections={sections}
        sectionMeta={sectionMeta}
        doctorPlan={plan}
      />
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `ProfileEditor.tsx`**

Replace `components/dashboard/profile/ProfileEditor.tsx`:

```typescript
// ProfileEditor — two-column shell: left nav + right form pane
'use client'

import { useState } from 'react'
import type { SectionKey, SectionMeta } from '@/types/Profile'
import { PROFILE_GROUPS, SECTION_KEYS } from '@/lib/constants'
import ProfileSideNav from '@/components/dashboard/ProfileSideNav'
import ProfileStrength from '@/components/dashboard/ProfileStrength'
import PersonalForm from './forms/PersonalForm'
import QualificationsForm from './forms/QualificationsForm'
import RegistrationForm from './forms/RegistrationForm'
import SpecializationForm from './forms/SpecializationForm'
import ExperienceForm from './forms/ExperienceForm'
import ServicesForm from './forms/ServicesForm'
import AchievementsForm from './forms/AchievementsForm'
import ResearchForm from './forms/ResearchForm'
import TestimonialsForm from './forms/TestimonialsForm'
import GalleryForm from './forms/GalleryForm'
import ClinicInfoForm from './forms/ClinicInfoForm'
import AppointmentForm from './forms/AppointmentForm'
import InsuranceForm from './forms/InsuranceForm'
import LanguagesForm from './forms/LanguagesForm'
import SocialForm from './forms/SocialForm'
import FeesForm from './forms/FeesForm'
import LocationsForm from './forms/LocationsForm'
import FAQForm from './forms/FAQForm'

type FormComponent = React.ComponentType<{ data: unknown }>

const FORMS: Record<SectionKey, FormComponent> = {
  personal: PersonalForm,
  qualifications: QualificationsForm,
  registration: RegistrationForm,
  specialization: SpecializationForm,
  experience: ExperienceForm,
  services: ServicesForm,
  achievements: AchievementsForm,
  research: ResearchForm,
  testimonials: TestimonialsForm,
  gallery: GalleryForm,
  clinic_info: ClinicInfoForm,
  appointment: AppointmentForm,
  insurance: InsuranceForm,
  languages: LanguagesForm,
  social: SocialForm,
  fees: FeesForm,
  locations: LocationsForm,
  faq: FAQForm,
}

interface Props {
  sections: Partial<Record<SectionKey, unknown>>
  sectionMeta: SectionMeta[]
  doctorPlan: string
}

export default function ProfileEditor({ sections, sectionMeta, doctorPlan }: Props) {
  const [activeSection, setActiveSection] = useState<SectionKey>('personal')
  const [showProGate, setShowProGate] = useState(false)
  const ActiveForm = FORMS[activeSection]

  return (
    <>
      {/* Mobile: group chips */}
      <div className="md:hidden overflow-x-auto -mx-6 px-6 mb-4">
        <div className="flex gap-2 min-w-max">
          {PROFILE_GROUPS.map((group) => (
            <button
              key={group.key}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700 whitespace-nowrap"
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: two-column */}
      <div className="flex gap-6">
        <div className="hidden md:flex flex-col w-56 flex-shrink-0">
          <div className="sticky top-6 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <ProfileStrength sections={sections} />
            <div className="p-2">
              <ProfileSideNav
                sections={sections}
                sectionMeta={sectionMeta}
                activeSection={activeSection}
                doctorPlan={doctorPlan}
                onSelect={setActiveSection}
                onProGate={() => setShowProGate(true)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {showProGate ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro feature</h3>
              <p className="text-sm text-gray-500 mb-4">Upgrade to Pro to unlock Fees, Locations, and FAQ sections.</p>
              <a
                href="/dashboard/billing"
                className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Upgrade to Pro — ₹499/month
              </a>
              <button
                onClick={() => setShowProGate(false)}
                className="block mt-3 text-xs text-gray-400 hover:text-gray-600 mx-auto"
              >
                Go back
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ActiveForm data={sections[activeSection]} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Start dev server and verify the profile page renders correctly**

```bash
npm run dev
```

Open `http://localhost:3000/dashboard/profile`. Check:
- Two-column layout visible on desktop
- Accordion groups expand/collapse
- Clicking a section loads the correct form on the right
- Profile Strength bar renders with a score
- Tag chip inputs work (type + Enter)
- Card array forms show add/remove buttons

- [ ] **Step 5: Commit**

```bash
git add app/(dashboard)/dashboard/profile/page.tsx \
  components/dashboard/profile/ProfileEditor.tsx
git commit -m "feat: two-column profile editor with side nav, strength score, and all upgraded forms"
```

---

## Task 14: Public portfolio — filter/sort by visibility and display_order

**Files:**
- Modify: `app/dr/[slug]/page.tsx`
- Modify: `components/templates/shared.ts`

- [ ] **Step 1: Update the Supabase query in `fetchPortfolioData`**

In `app/dr/[slug]/page.tsx`, change the profiles select to include new columns and filter/sort:

```typescript
supabase
  .from('profiles')
  .select('section_key, data, is_visible, display_order')
  .eq('doctor_id', doctor.id)
  .eq('is_visible', true)
  .order('display_order', { ascending: true })
```

Remove the old `for` loop and replace with:

```typescript
const sections: Partial<Record<SectionKey, unknown>> = {}
for (const row of sectionsRes.data ?? []) {
  sections[row.section_key as SectionKey] = row.data
}
```

- [ ] **Step 2: Add FAQ JSON-LD**

Add a `buildFaqJsonLd` function below `buildJsonLd` in `app/dr/[slug]/page.tsx`:

```typescript
function buildFaqJsonLd(sections: Partial<Record<SectionKey, unknown>>) {
  const faq = sections.faq as { items?: { question: string; answer: string }[] } | undefined
  if (!faq?.items?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
```

Then in the page component, render it alongside the existing JSON-LD:

```typescript
const jsonLd = buildJsonLd(doctor, sections)
const faqJsonLd = buildFaqJsonLd(sections)
const profile: DoctorProfile = { doctor, sections, template }

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    {faqJsonLd && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    )}
    {/* template switch unchanged */}
  </>
)
```

- [ ] **Step 3: Update `getTemplateSections` in `components/templates/shared.ts`**

Add the three new section mappings at the end of the return object in `getTemplateSections`:

```typescript
fees: sections.fees as FeesSection | undefined,
locations: sections.locations as LocationsSection | undefined,
faq: sections.faq as FAQSection | undefined,
```

Also add the imports at the top of `shared.ts`:

```typescript
import type { FeesSection, LocationsSection, FAQSection } from '@/types/Profile'
```

And add the fields to the `TemplateSections` interface:

```typescript
fees?: FeesSection
locations?: LocationsSection
faq?: FAQSection
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Test public portfolio**

With dev server running, visit a doctor portfolio URL. Confirm:
- Sections hidden via the editor do not appear
- Section order reflects reordering done in the editor
- If FAQ data exists, the FAQ JSON-LD `<script>` is present in page source

- [ ] **Step 6: Commit**

```bash
git add app/dr/[slug]/page.tsx components/templates/shared.ts
git commit -m "feat: filter portfolio by is_visible, sort by display_order, add FAQ JSON-LD"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Two-column layout — Task 13
- [x] Accordion groups (4 groups) — Tasks 12, 13
- [x] Section visibility toggle — Task 12
- [x] Section reordering (within group) — Task 12
- [x] display_order / is_visible DB columns — Task 1
- [x] Profile Strength with weights and nudge — Task 11
- [x] TagChipInput — Task 5
- [x] CardArrayInput — Task 6
- [x] Services, Achievements, Research, Specialization, Insurance, Languages → tag chips — Task 7
- [x] Qualifications, Experience, Testimonials → card arrays — Task 8
- [x] PersonalForm cover_image + char counter — Task 9
- [x] Fees, Locations, FAQ new forms — Task 10
- [x] Pro plan gating — Task 13 (ProGate state in ProfileEditor)
- [x] updateSectionOrder server action — Task 4
- [x] Public portfolio filter/sort — Task 14
- [x] FAQ JSON-LD — Task 14
- [x] shared.ts TemplateSections extended — Task 14

**No placeholders found.**

**Type consistency confirmed:** `SectionMeta`, `HospitalEntry`, `QualificationEntry`, `TestimonialEntry`, `LocationEntry`, `FAQEntry`, `FeesSection` all defined in Task 2 and used consistently in Tasks 7–13.
