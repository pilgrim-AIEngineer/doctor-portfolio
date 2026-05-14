// Bold template - premium navy and gold editorial portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'
import { getTemplateSections } from '@/components/templates/shared'
import BoldHero from './Hero'
import BoldStats from './Stats'
import BoldSections from './Sections'
import BoldAppointmentCTA from './AppointmentCTA'

interface BoldTemplateProps {
  profile: DoctorProfile
}

export default function BoldTemplate({ profile }: BoldTemplateProps) {
  const { doctor, sections } = profile
  const templateSections = getTemplateSections(sections)

  return (
    <div className="min-h-screen bg-navy text-white pb-24 md:pb-0">
      <BoldHero doctor={doctor} sections={templateSections} />
      <BoldStats sections={templateSections} />
      <BoldSections sections={templateSections} />
      <BoldAppointmentCTA appointment={templateSections.appointment} doctor={doctor} fees={templateSections.fees} />
    </div>
  )
}
