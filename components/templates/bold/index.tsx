// Bold template — dark navy and gold premium portfolio layout with serif headings
import type { DoctorProfile } from '@/types/DoctorProfile'
import type {
  PersonalSection,
  AppointmentSection,
  ExperienceSection,
  ServicesSection,
  SpecializationSection,
} from '@/types/Profile'
import BoldHero from './Hero'
import BoldStats from './Stats'
import BoldSections from './Sections'
import BoldAppointmentCTA from './AppointmentCTA'

interface BoldTemplateProps {
  profile: DoctorProfile
}

export default function BoldTemplate({ profile }: BoldTemplateProps) {
  const { doctor, sections } = profile
  return (
    <div className="min-h-screen bg-navy text-white pb-24 md:pb-0">
      <BoldHero doctor={doctor} personal={sections.personal as PersonalSection | undefined} />
      <BoldStats
        experience={sections.experience as ExperienceSection | undefined}
        services={sections.services as ServicesSection | undefined}
        specialization={sections.specialization as SpecializationSection | undefined}
      />
      <BoldSections sections={sections} />
      <BoldAppointmentCTA
        appointment={sections.appointment as AppointmentSection | undefined}
        doctor={doctor}
      />
    </div>
  )
}
