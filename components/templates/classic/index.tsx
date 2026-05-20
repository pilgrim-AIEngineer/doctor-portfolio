// Classic template - clinical editorial portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'
import { getTemplateSections, getVisibleSectionIds } from '@/components/templates/shared'
import ClassicHero from './Hero'
import ClassicSections from './Sections'
import AppointmentCTA from './AppointmentCTA'
import SectionNav from './SectionNav'

interface ClassicTemplateProps {
  profile: DoctorProfile
}

export default function ClassicTemplate({ profile }: ClassicTemplateProps) {
  const { doctor, sections } = profile
  const templateSections = getTemplateSections(sections)
  const sectionIds = getVisibleSectionIds(templateSections)

  return (
    <div className="min-h-screen bg-clinical-mist text-gray-900 pb-24 md:pb-0">
      <ClassicHero doctor={doctor} sections={templateSections} />
      <SectionNav sectionIds={sectionIds} />
      <ClassicSections sections={templateSections} />
      <AppointmentCTA appointment={templateSections.appointment} doctor={doctor} fees={templateSections.fees} />
    </div>
  )
}
