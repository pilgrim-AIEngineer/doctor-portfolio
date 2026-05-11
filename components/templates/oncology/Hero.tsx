// Oncology template hero - cinematic specialist opening with luminous trust signals
import Image from 'next/image'
import {
  CalendarDays,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import {
  getContactLinks,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'

interface HeroProps {
  doctor: Doctor
  sections: TemplateSections
}

export default function OncologyHero({ doctor, sections }: HeroProps) {
  const { personal, clinicInfo, appointment, experience, specialization, services } = sections
  const contact = getContactLinks(appointment, doctor)
  const careAreas = getSpecializationCount(specialization) + getServiceCount(services)

  return (
    <header className="relative overflow-hidden bg-oncology-midnight text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,theme(colors.oncology.teal/0.28),transparent_28%),radial-gradient(circle_at_82%_22%,theme(colors.brand.600/0.34),transparent_32%),linear-gradient(135deg,theme(colors.oncology.midnight),theme(colors.oncology.panel)_42%,theme(colors.oncology.cobalt))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.white/0.06)_1px,transparent_1px),linear-gradient(theme(colors.white/0.05)_1px,transparent_1px)] bg-[size:58px_58px] opacity-45" />
      <div className="absolute -left-32 top-24 h-72 w-72 rounded-full border border-oncology-aura/20" />
      <div className="absolute right-[-120px] top-16 h-[36rem] w-[36rem] rounded-full border border-oncology-teal/20 animate-oncology-pulse" />

      <div className="relative border-b border-white/10 bg-white/[0.04] px-6 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-semibold text-slate-200 md:flex-row md:items-center md:justify-between">
          <a href={contact.telUrl} className="inline-flex w-fit items-center gap-2 text-oncology-aura">
            <Phone size={15} />
            {contact.formattedPhone}
          </a>
          <div className="flex flex-wrap gap-3">
            {clinicInfo?.address && (
              <span className="inline-flex items-center gap-2 text-slate-300">
                <MapPin size={15} className="text-oncology-gold" />
                {clinicInfo.address}
              </span>
            )}
            {doctor.is_verified && (
              <span className="inline-flex items-center gap-2 rounded-full border border-oncology-teal/30 bg-oncology-teal/10 px-3 py-1 text-xs font-bold uppercase text-oncology-aura">
                <ShieldCheck size={14} />
                NMC Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <div className="animate-template-rise">
          <div className="mb-8 h-1.5 w-28 rounded-full bg-gradient-to-r from-oncology-gold via-oncology-teal to-oncology-aura shadow-oncology" />
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
            Dr. {doctor.name}
          </h1>
          <p className="mt-5 max-w-2xl text-2xl font-semibold text-oncology-aura md:text-3xl">
            {specialization?.primary ?? doctor.specialty}
          </p>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">
            {personal?.tagline ??
              `Cancer care planned with precision, clarity, and rapid clinic access for every treatment decision.`}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#oncology-booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-oncology-gold px-6 py-3.5 text-sm font-bold text-oncology-midnight shadow-oncology-gold transition hover:bg-gold-300">
              <CalendarDays size={17} />
              Request appointment
            </a>
            <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-oncology-teal/40 bg-oncology-teal/10 px-6 py-3.5 text-sm font-bold text-oncology-aura shadow-oncology transition hover:bg-oncology-teal/20">
              <Phone size={17} />
              WhatsApp clinic
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <HeroStat value={experience?.years ? `${experience.years}+` : 'Direct'} label="Years in cancer care" />
            <HeroStat value={careAreas ? `${careAreas}+` : 'Focused'} label="Treatment areas" />
            <HeroStat value={clinicInfo?.timings ?? 'Priority'} label="Clinic access" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px] animate-template-rise [animation-delay:140ms]">
          <div className="absolute left-6 top-8 h-64 w-64 rounded-full border border-oncology-aura/25" />
          <div className="absolute right-6 top-14 h-44 w-44 rounded-full border border-oncology-gold/20" />
          <div className="relative rounded-[2.25rem] border border-white/20 bg-white/[0.08] p-4 shadow-glass backdrop-blur-2xl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-oncology-teal/25 bg-oncology-midnight/70 px-4 py-3 text-sm font-semibold text-oncology-aura shadow-oncology backdrop-blur">
              <span className="flex items-center gap-2">
                <Stethoscope size={15} />
                Precision oncology
              </span>
              <span className="flex items-center gap-2 text-oncology-gold">
                <Sparkles size={15} />
                Treatment focus
              </span>
            </div>
            <div className="relative aspect-[0.92] overflow-hidden bg-gradient-to-br from-oncology-panel to-oncology-cobalt [border-radius:58%_42%_52%_48%/44%_54%_46%_56%]">
              {personal?.photo ? (
                <Image
                  src={personal.photo}
                  alt={`Dr. ${doctor.name}`}
                  fill
                  sizes="(max-width: 768px) 86vw, 430px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl font-semibold text-oncology-aura/30">
                  Dr
                </div>
              )}
            </div>
            {experience?.current_affiliation && (
              <div className="mt-4 rounded-3xl border border-oncology-gold/25 bg-oncology-gold/10 px-5 py-3 text-sm font-semibold leading-6 text-gold-50">
                {experience.current_affiliation}
              </div>
            )}
          </div>
        </div>
      </section>
    </header>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-4 shadow-glass backdrop-blur-xl">
      <p className="text-2xl font-semibold text-oncology-gold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-slate-300">{label}</p>
    </div>
  )
}
