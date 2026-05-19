// Bold template hero - luxury editorial opening with gold verified treatment
import Image from 'next/image'
import { CalendarDays, Phone, ShieldCheck } from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import { getContactLinks, getInitials, type TemplateSections } from '@/components/templates/shared'

interface HeroProps {
  doctor: Doctor
  sections: TemplateSections
}

export default function BoldHero({ doctor, sections }: HeroProps) {
  const { personal, appointment } = sections
  const contact = getContactLinks(appointment, doctor)

  return (
    <section id="section-personal" className="relative overflow-hidden bg-navy-dark">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-gold-300/10 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div className="relative order-2 animate-template-rise md:order-1">
          <div className="absolute -left-5 -top-5 h-48 w-48 rounded-full border border-gold-300/20" />
          <div className="relative overflow-hidden rounded-t-full border border-gold-300/40 bg-navy-light p-3 shadow-gold">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-navy">
              {personal?.photo ? (
                <Image
                  src={personal.photo}
                  alt={`Dr. ${doctor.name}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-gold-300/40 bg-gold-300/10 font-serif text-4xl font-bold text-gold-300">
                    {getInitials(doctor.name)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center animate-template-rise [animation-delay:140ms] md:order-2">
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border-y border-gold-300/40 py-2 text-sm font-semibold text-gold-300">
              {doctor.specialty}
            </span>
            {doctor.is_verified ? (
              <span className="inline-flex items-center gap-2 border-y border-gold-300/40 py-2 text-sm font-semibold text-gold-300">
                <ShieldCheck size={16} />
                NMC Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 border-y border-gold-300/20 py-2 text-sm font-medium text-gray-400">
                NMC: {doctor.nmc_number}
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold leading-none tracking-tight text-white sm:text-5xl md:text-7xl">
            Dr. {doctor.name}
          </h1>
          {personal?.tagline && (
            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">{personal.tagline}</p>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#bold-book-form" className="inline-flex items-center gap-2 rounded-none bg-gold-300 px-6 py-3 text-sm font-bold text-navy transition hover:bg-gold-400">
              <CalendarDays size={17} />
              Book appointment
            </a>
            <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gold-300/40 px-6 py-3 text-sm font-semibold text-gold-300 transition hover:bg-gold-300/10">
              <Phone size={17} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
