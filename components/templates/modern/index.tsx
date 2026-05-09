// Modern template — card-based portfolio layout with floating appointment button
import type { DoctorProfile } from '@/types/DoctorProfile'
import type { PersonalSection, AppointmentSection } from '@/types/Profile'
import ModernHero from './Hero'
import ModernSections from './Sections'
import ModernAppointmentCTA from './AppointmentCTA'

interface ModernTemplateProps {
  profile: DoctorProfile
}

export default function ModernTemplate({ profile }: ModernTemplateProps) {
  const { doctor, sections } = profile
  const personal = sections.personal as PersonalSection | undefined
  const appointment = sections.appointment as AppointmentSection | undefined

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <ModernHero doctor={doctor} personal={personal} />
      <ModernSections sections={sections} />
      <ModernAppointmentCTA appointment={appointment} doctor={doctor} />
    </div>
  )
}
