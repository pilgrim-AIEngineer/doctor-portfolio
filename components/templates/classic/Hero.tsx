// Classic template hero section — doctor photo, name, specialty, NMC badge, tagline
import Image from 'next/image'
import type { Doctor } from '@/types/Doctor'
import type { PersonalSection } from '@/types/Profile'

interface HeroProps {
  doctor: Doctor
  personal?: PersonalSection
}

export default function ClassicHero({ doctor, personal }: HeroProps) {
  return (
    <section className="bg-brand-700 text-white py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {personal?.photo && (
          <div className="relative w-28 h-28 mx-auto mb-6">
            <Image
              src={personal.photo}
              alt={`Dr. ${doctor.name}`}
              fill
              sizes="112px"
              priority
              className="rounded-full object-cover border-4 border-white/30"
            />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold">Dr. {doctor.name}</h1>
        <p className="mt-2 text-lg text-brand-100">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-block mt-3 text-xs bg-white/20 px-3 py-1 rounded-full">
            ✓ NMC Verified
          </span>
        )}
        {personal?.tagline && (
          <p className="mt-4 text-base text-brand-200 max-w-xl mx-auto">{personal.tagline}</p>
        )}
      </div>
    </section>
  )
}
