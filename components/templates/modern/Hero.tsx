// Modern template hero — full-width diagonal gradient with large rounded doctor photo
import Image from 'next/image'
import type { Doctor } from '@/types/Doctor'
import type { PersonalSection } from '@/types/Profile'

interface HeroProps {
  doctor: Doctor
  personal?: PersonalSection
}

export default function ModernHero({ doctor, personal }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 text-white">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        {personal?.photo && (
          <div className="relative w-40 h-40 mb-6 shrink-0">
            <Image
              src={personal.photo}
              alt={`Dr. ${doctor.name}`}
              fill
              sizes="160px"
              priority
              className="rounded-2xl object-cover border-4 border-white/80 shadow-2xl"
            />
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Dr. {doctor.name}</h1>
        <p className="mt-2 text-lg text-brand-200 font-light">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-flex items-center gap-2 mt-4 text-xs bg-white/10 border border-white/20 px-4 py-1.5 rounded-full font-medium">
            <span className="w-3.5 h-3.5 bg-green-400 rounded-full flex items-center justify-center text-[9px] font-bold">✓</span>
            NMC Verified
          </span>
        )}
        {personal?.tagline && (
          <p className="mt-5 text-base text-brand-100 max-w-2xl leading-relaxed italic">
            &ldquo;{personal.tagline}&rdquo;
          </p>
        )}
      </div>
    </section>
  )
}
