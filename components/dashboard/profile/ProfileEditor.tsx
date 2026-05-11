// ProfileEditor — two-column shell: left nav + right form pane
'use client'

import { useState } from 'react'
import type { SectionKey, SectionMeta } from '@/types/Profile'
import { PROFILE_GROUPS } from '@/lib/constants'
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
