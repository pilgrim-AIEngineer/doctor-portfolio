// Classic template — clean blue-and-white portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'

interface ClassicTemplateProps {
  profile: DoctorProfile
}

export default function ClassicTemplate({ profile }: ClassicTemplateProps) {
  const { doctor } = profile

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-brand-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Dr. {doctor.name}</h1>
        <p className="text-xl text-brand-100">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-block mt-3 text-xs bg-white/20 px-3 py-1 rounded-full">
            ✓ NMC Verified
          </span>
        )}
      </section>
      {/* Hero, Sections, AppointmentCTA components added per section */}
    </div>
  )
}
