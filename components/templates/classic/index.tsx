// Classic template — clean blue-and-white portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'
import type { PersonalSection, AppointmentSection } from '@/types/Profile'
import ClassicHero from './Hero'
import ClassicSections from './Sections'
import AppointmentCTA from './AppointmentCTA'

interface ClassicTemplateProps {
  profile: DoctorProfile
}

export default function ClassicTemplate({ profile }: ClassicTemplateProps) {
  const { doctor, sections } = profile
  const personal = sections.personal as PersonalSection | undefined
  const appointment = sections.appointment as AppointmentSection | undefined

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <ClassicHero doctor={doctor} personal={personal} />
      <ClassicSections sections={sections} />
      <AppointmentCTA appointment={appointment} doctor={doctor} />
    </div>
  )
}
