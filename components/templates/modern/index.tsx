// Modern template — minimal light-gray portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'

interface ModernTemplateProps {
  profile: DoctorProfile
}

export default function ModernTemplate({ profile }: ModernTemplateProps) {
  const { doctor } = profile

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-light text-gray-900 mb-3">Dr. {doctor.name}</h1>
        <p className="text-lg text-gray-500">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-block mt-4 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            ✓ NMC Verified
          </span>
        )}
      </section>
      {/* Sections and AppointmentCTA added per section */}
    </div>
  )
}
