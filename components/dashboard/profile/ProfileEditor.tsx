// ProfileEditor — client shell that manages tab state and renders the active section form
'use client'

import { useState } from 'react'
import type { SectionKey } from '@/types/Profile'
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
import EmptySectionState from '@/components/dashboard/EmptySectionState'

interface FormProps { data: unknown }

const FORMS: Record<SectionKey, React.ComponentType<FormProps>> = {
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

const TABS: Array<{ key: SectionKey; label: string; fullLabel: string }> = [
  { key: 'personal',       label: 'Personal',  fullLabel: 'personal info' },
  { key: 'qualifications', label: 'Quals',     fullLabel: 'qualifications' },
  { key: 'registration',   label: 'Reg',       fullLabel: 'registration details' },
  { key: 'specialization', label: 'Spec',      fullLabel: 'specialization' },
  { key: 'experience',     label: 'Exp',       fullLabel: 'experience' },
  { key: 'services',       label: 'Services',  fullLabel: 'services' },
  { key: 'achievements',   label: 'Awards',    fullLabel: 'achievements' },
  { key: 'research',       label: 'Research',  fullLabel: 'research' },
  { key: 'testimonials',   label: 'Reviews',   fullLabel: 'testimonials' },
  { key: 'gallery',        label: 'Gallery',   fullLabel: 'gallery' },
  { key: 'clinic_info',    label: 'Clinic',    fullLabel: 'clinic info' },
  { key: 'appointment',    label: 'Appt',      fullLabel: 'appointment details' },
  { key: 'insurance',      label: 'Insurance', fullLabel: 'insurance info' },
  { key: 'languages',      label: 'Languages', fullLabel: 'languages' },
  { key: 'social',         label: 'Social',    fullLabel: 'social links' },
  { key: 'fees',           label: 'Fees',      fullLabel: 'consultation fees' },
  { key: 'locations',      label: 'Locations', fullLabel: 'clinic locations' },
  { key: 'faq',            label: 'FAQ',       fullLabel: 'frequently asked questions' },
]

interface Props {
  sections: Partial<Record<SectionKey, unknown>>
}

export default function ProfileEditor({ sections }: Props) {
  const [activeTab, setActiveTab] = useState<SectionKey>('personal')
  const ActiveForm = FORMS[activeTab]
  const activeTabMeta = TABS.find((t) => t.key === activeTab)!
  const isEmpty = sections[activeTab] == null

  return (
    <div>
      {/* Tab bar — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-6 px-6 mb-6">
        <div className="flex gap-0.5 border-b border-gray-200 min-w-max">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === key
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
              {sections[key] == null && (
                <span className="absolute top-2 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active form — shows empty state banner when section has no saved data */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isEmpty && <EmptySectionState sectionLabel={activeTabMeta.fullLabel} />}
        <ActiveForm data={sections[activeTab]} />
      </div>
    </div>
  )
}
