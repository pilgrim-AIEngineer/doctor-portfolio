// Modern template hero - split composition with glass contact rail
import Image from 'next/image'
import { ArrowDown, CalendarDays, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import {
  computeExperienceYears,
  getContactLinks,
  getInitials,
  getServiceCount,
  type TemplateSections,
} from '@/components/templates/shared'

interface HeroProps {
  doctor: Doctor
  sections: TemplateSections
}

export default function ModernHero({ doctor, sections }: HeroProps) {
  const { personal, appointment, experience, services } = sections
  const contact = getContactLinks(appointment, doctor)

  return (
    <section id="section-personal" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,theme(colors.brand.700),transparent_34%),radial-gradient(circle_at_80%_10%,theme(colors.modern.cyan),transparent_24%)] opacity-50" />

      {/* Ghost year watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-[-48px] left-[28%] text-[280px] font-black leading-none text-white/[0.05] tracking-[-20px] whitespace-nowrap"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {computeExperienceYears(experience, personal)}
      </div>

      {/* ECG heartbeat decoration */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 left-12 opacity-[0.15]"
        width="260"
        height="22"
        viewBox="0 0 260 22"
      >
        <polyline
          points="0,11 30,11 42,5 54,17 63,2 75,20 87,11 140,11 152,7 164,15 173,3 185,19 197,11 260,11"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[0.95fr_1.05fr] md:py-16">
        <div className="flex flex-col justify-center animate-template-rise">
          <div className="mb-7 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            {doctor.is_verified ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1 font-semibold text-cyan-100 backdrop-blur">
                <ShieldCheck size={15} />
                NMC Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-medium text-slate-300 backdrop-blur">
                NMC: {doctor.nmc_number}
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-cyan-100">
              <Sparkles size={15} />
              {doctor.specialty}
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold leading-none tracking-tight sm:text-5xl md:text-7xl">
            Dr. {doctor.name}
          </h1>
          {personal?.tagline && (
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{personal.tagline}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <StatItem value={`${computeExperienceYears(experience, personal)}+`} label="yrs exp" />
            <div className="h-8 w-px bg-white/20" />
            <StatItem value={`${getServiceCount(services)}`} label="services" />
            {sections.fees?.consultation_fee && (
              <>
                <div className="h-8 w-px bg-white/20" />
                <StatItem value={`₹${sections.fees.consultation_fee.toLocaleString()}`} label="consult fee" />
              </>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#modern-book-form" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-modern-ink transition hover:bg-cyan-200">
              <CalendarDays size={17} />
              Book appointment
            </a>
            <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
              <Phone size={17} />
              WhatsApp
            </a>
          </div>
          <a href="#modern-sections" className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            View profile
            <ArrowDown size={16} />
          </a>
        </div>

        <div className="relative animate-template-rise [animation-delay:140ms]">
          <div className="absolute left-5 top-6 h-full w-full rounded-[2rem] border border-white/10" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-glass backdrop-blur-xl">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 bg-white/[0.04]"
                style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
              />
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] bg-modern-panel">
              {personal?.photo ? (
                <Image
                  src={personal.photo}
                  alt={`Dr. ${doctor.name}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 520px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 text-4xl font-bold text-white">
                    {getInitials(doctor.name)}
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-modern-ink/90 to-transparent p-6">
                <p className="text-sm font-medium text-cyan-200">Direct contact</p>
                <p className="mt-1 text-lg font-semibold">{contact.formattedPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-white leading-none">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  )
}
