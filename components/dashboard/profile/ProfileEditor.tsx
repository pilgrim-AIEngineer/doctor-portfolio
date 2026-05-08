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
}

const TABS: Array<{ key: SectionKey; label: string }> = [
  { key: 'personal',       label: 'Personal' },
  { key: 'qualifications', label: 'Quals' },
  { key: 'registration',   label: 'Reg' },
  { key: 'specialization', label: 'Spec' },
  { key: 'experience',     label: 'Exp' },
  { key: 'services',       label: 'Services' },
  { key: 'achievements',   label: 'Awards' },
  { key: 'research',       label: 'Research' },
  { key: 'testimonials',   label: 'Reviews' },
  { key: 'gallery',        label: 'Gallery' },
  { key: 'clinic_info',    label: 'Clinic' },
  { key: 'appointment',    label: 'Appt' },
  { key: 'insurance',      label: 'Insurance' },
  { key: 'languages',      label: 'Languages' },
  { key: 'social',         label: 'Social' },
]

interface Props {
  sections: Partial<Record<SectionKey, unknown>>
}

export default function ProfileEditor({ sections }: Props) {
  const [activeTab, setActiveTab] = useState<SectionKey>('personal')
  const ActiveForm = FORMS[activeTab]

  return (
    <div>
      {/* Tab bar — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-6 px-6 mb-6">
        <div className="flex gap-0.5 border-b border-gray-200 min-w-max">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === key
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Active form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ActiveForm data={sections[activeTab]} />
      </div>
    </div>
  )
}
