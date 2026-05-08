// Bold template — high-contrast black-and-gold portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'

interface BoldTemplateProps {
  profile: DoctorProfile
}

export default function BoldTemplate({ profile }: BoldTemplateProps) {
  const { doctor } = profile

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h1 className="text-6xl font-black uppercase leading-none mb-3">Dr. {doctor.name}</h1>
        <p className="text-xl text-gold-400">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-block mt-4 text-xs text-gold-400 border border-gold-400 px-3 py-1 rounded-full">
            ✓ NMC Verified
          </span>
        )}
      </section>
      {/* Sections and AppointmentCTA added per section */}
    </div>
  )
}
