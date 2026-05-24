// Modern template - layered contemporary healthcare portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'
import { getTemplateSections } from '@/components/templates/shared'
import ModernHero from './Hero'
import ModernSections from './Sections'
import ModernAppointmentCTA from './AppointmentCTA'

interface ModernTemplateProps {
  profile: DoctorProfile
}

export default function ModernTemplate({ profile }: ModernTemplateProps) {
  const { doctor, sections } = profile
  const templateSections = getTemplateSections(sections)

  return (
    <div className="min-h-screen bg-modern-ink text-white pb-24">
      <ModernHero doctor={doctor} sections={templateSections} />
      <ModernSections sections={templateSections} doctor={doctor} />
      <ModernAppointmentCTA appointment={templateSections.appointment} doctor={doctor} fees={templateSections.fees} />
    </div>
  )
}
