// Modern template hero - split composition with glass contact rail
import Image from 'next/image'
import { ArrowDown, CalendarDays, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import {
  computeExperienceYears,
  getContactLinks,
  getInitials,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'

interface HeroProps {
  doctor: Doctor
  sections: TemplateSections
}

export default function ModernHero({ doctor, sections }: HeroProps) {
  const { personal, appointment, experience, services, specialization } = sections
  const contact = getContactLinks(appointment, doctor)

  return (
    <section id="section-personal" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,theme(colors.brand.700),transparent_34%),radial-gradient(circle_at_80%_10%,theme(colors.modern.cyan),transparent_24%)] opacity-50" />
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
          <div className="relative grid gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-glass backdrop-blur-xl md:grid-cols-[1fr_0.72fr]">
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
            <div className="grid gap-4">
              <Metric value={computeExperienceYears(experience, personal)} label="years" />
              <Metric value={getServiceCount(services)} label="services" />
              <Metric value={getSpecializationCount(specialization)} label="focus areas" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-white/10 animate-template-sheen" />
                <p className="relative text-sm font-semibold text-cyan-100">Fast appointment access</p>
                <p className="relative mt-2 text-xs leading-5 text-slate-300">
                  WhatsApp, call, or request a callback from one profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-4xl font-semibold text-cyan-200">{value}</p>
      <p className="mt-2 text-xs font-bold uppercase text-slate-400">{label}</p>
    </div>
  )
}
