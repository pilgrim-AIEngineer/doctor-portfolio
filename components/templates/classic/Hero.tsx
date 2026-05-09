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
    <section className="relative bg-gradient-to-br from-brand-700 to-brand-900 text-white">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        {personal?.photo && (
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src={personal.photo}
              alt={`Dr. ${doctor.name}`}
              fill
              sizes="128px"
              priority
              className="rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Dr. {doctor.name}</h1>
        <p className="mt-3 text-xl text-brand-200 font-light">{doctor.specialty}</p>
        {doctor.is_verified && (
          <span className="inline-flex items-center gap-2 mt-4 text-xs bg-white/10 border border-white/20 px-4 py-1.5 rounded-full font-medium">
            <span className="w-3.5 h-3.5 bg-green-400 rounded-full flex items-center justify-center text-[9px] font-bold">✓</span>
            NMC Verified
          </span>
        )}
        {personal?.tagline && (
          <p className="mt-5 text-base text-brand-100 max-w-xl mx-auto leading-relaxed italic">
            &ldquo;{personal.tagline}&rdquo;
          </p>
        )}
      </div>

      {/* Wave divider — transitions hero into the gray-50 sections area */}
      <svg
        viewBox="0 0 1440 56"
        className="w-full fill-gray-50 block"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M0,56 C240,0 480,40 720,20 C960,0 1200,40 1440,56 Z" />
      </svg>
    </section>
  )
}
