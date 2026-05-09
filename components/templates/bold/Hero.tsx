// Bold template hero — dark navy with serif heading and gold-ringed doctor photo
import Image from 'next/image'
import type { Doctor } from '@/types/Doctor'
import type { PersonalSection } from '@/types/Profile'

interface HeroProps {
  doctor: Doctor
  personal?: PersonalSection
}

export default function BoldHero({ doctor, personal }: HeroProps) {
  return (
    <section className="bg-navy text-white border-b border-gold-300/30">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        {personal?.photo && (
          <div className="relative w-36 h-36 mb-8 shrink-0">
            <Image
              src={personal.photo}
              alt={`Dr. ${doctor.name}`}
              fill
              sizes="144px"
              priority
              className="rounded-full object-cover border-4 border-gold-300 shadow-2xl"
            />
          </div>
        )}
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight tracking-wide">
          Dr. {doctor.name}
        </h1>
        <p className="mt-3 text-gold-300 text-lg tracking-widest uppercase font-sans">
          {doctor.specialty}
        </p>
        {doctor.is_verified && (
          <span className="inline-flex items-center gap-2 mt-5 text-xs border border-gold-300 text-gold-300 px-4 py-1.5 rounded-full font-medium">
            <span className="w-3.5 h-3.5 bg-gold-300 rounded-full flex items-center justify-center text-[9px] font-bold text-navy">✓</span>
            NMC Verified
          </span>
        )}
        {personal?.tagline && (
          <p className="mt-5 text-base text-gray-300 max-w-2xl leading-relaxed italic">
            &ldquo;{personal.tagline}&rdquo;
          </p>
        )}
      </div>
    </section>
  )
}
