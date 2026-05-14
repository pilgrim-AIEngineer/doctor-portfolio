// Oncology template - premium cancer specialist public portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'
import { getTemplateSections } from '@/components/templates/shared'
import OncologyHero from './Hero'
import OncologySections from './Sections'
import OncologyAppointmentCTA from './AppointmentCTA'

interface OncologyTemplateProps {
  profile: DoctorProfile
}

export default function OncologyTemplate({ profile }: OncologyTemplateProps) {
  const { doctor, sections } = profile
  const templateSections = getTemplateSections(sections)

  return (
    <div className="min-h-screen bg-oncology-midnight text-white pb-24 md:pb-0">
      <OncologyHero doctor={doctor} sections={templateSections} />
      <OncologySections doctor={doctor} sections={templateSections} />
      <OncologyAppointmentCTA appointment={templateSections.appointment} doctor={doctor} fees={templateSections.fees} />
    </div>
  )
}
