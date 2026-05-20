// Classic template hero — photo-banner mobile layout, refined 2-col desktop
import Image from 'next/image'
import { CalendarDays, MapPin, Phone, ShieldCheck, Stethoscope } from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import {
  computeExperienceYears,
  getContactLinks,
  getInitials,
  type TemplateSections,
} from '@/components/templates/shared'

interface HeroProps {
  doctor: Doctor
  sections: TemplateSections
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-center">
      <p className="text-lg font-bold text-brand-700">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  )
}

export default function ClassicHero({ doctor, sections }: HeroProps) {
  const { personal, clinicInfo, appointment, experience, fees } = sections
  const contact = getContactLinks(appointment, doctor)
  const years = computeExperienceYears(experience, personal)
  const fee = fees?.consultation_fee

  const stats: { value: string; label: string }[] = []
  if (years > 0) stats.push({ value: String(years), label: 'Yrs Exp' })
  if (fee) stats.push({ value: `₹${fee}`, label: 'Consult' })

  const primaryAddress =
    sections.locations?.locations?.find((l) => l.is_primary)?.address ??
    sections.locations?.locations?.[0]?.address ??
    clinicInfo?.address

  return (
    <section id="section-personal">

      {/* ── MOBILE: photo banner first ─────────────────────── */}
      <div className="md:hidden">
        {/* Banner */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
          {personal?.photo ? (
            <Image
              src={personal.photo}
              alt={`Dr. ${doctor.name}`}
              fill
              sizes="100vw"
              priority
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-200 to-brand-300">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-600 text-3xl font-bold text-white shadow-lg">
                {getInitials(doctor.name)}
              </div>
            </div>
          )}
          {/* Fade to white at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
          {/* NMC badge */}
          {doctor.is_verified && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-green-700 shadow-md">
              <ShieldCheck size={13} className="text-green-600" />
              NMC Verified
            </div>
          )}
        </div>

        {/* Identity block */}
        <div className="bg-white px-5 pb-7 pt-3">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
            <Stethoscope size={12} />
            {doctor.specialty}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dr. {doctor.name}
          </h1>
          {experience?.current_affiliation && (
            <p className="mt-1 text-sm font-semibold text-brand-700">
              {experience.current_affiliation}
            </p>
          )}
          {primaryAddress && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} className="shrink-0 text-brand-500" />
              {primaryAddress}
            </p>
          )}
          {stats.length > 0 && (
            <div className="mt-4 flex gap-2.5">
              {stats.map((s) => <StatChip key={s.label} {...s} />)}
            </div>
          )}
          {personal?.tagline && (
            <p className="mt-4 border-l-[3px] border-brand-500 pl-3.5 text-sm italic leading-6 text-gray-600">
              {personal.tagline}
            </p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <a
              href={contact.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white"
            >
              <Phone size={15} />
              WhatsApp
            </a>
            <a
              href="#classic-book-form"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 text-sm font-bold text-white"
            >
              <CalendarDays size={15} />
              Book Now
            </a>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: refined 2-col grid ───────────────────── */}
      <div className="relative hidden overflow-hidden bg-white md:block">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.clinical.line)_1px,transparent_1px),linear-gradient(theme(colors.clinical.line)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.2fr_0.8fr]">

          {/* Left: text */}
          <div className="animate-template-rise">
            <div className="mb-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
                <Stethoscope size={14} />
                {doctor.specialty}
              </span>
              {doctor.is_verified ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-bold text-green-700">
                  <ShieldCheck size={14} />
                  NMC Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-500">
                  NMC: {doctor.nmc_number}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-bold leading-none tracking-tight text-gray-900">
              Dr. {doctor.name}
            </h1>
            {experience?.current_affiliation && (
              <p className="mt-3 text-xl font-semibold text-brand-700">
                {experience.current_affiliation}
              </p>
            )}
            {personal?.tagline && (
              <p className="mt-6 max-w-2xl border-l-4 border-brand-500 pl-5 text-base italic leading-7 text-gray-600">
                {personal.tagline}
              </p>
            )}
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#classic-book-form"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-clinical transition hover:bg-brand-800"
              >
                <CalendarDays size={16} />
                Book appointment
              </a>
              <a
                href={contact.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-6 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
              >
                <Phone size={16} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right: photo card */}
          <div className="animate-template-rise [animation-delay:140ms]">
            <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-3 shadow-clinical">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-brand-50">
                {personal?.photo ? (
                  <Image
                    src={personal.photo}
                    alt={`Dr. ${doctor.name}`}
                    fill
                    sizes="(max-width: 1280px) 380px, 420px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-600 text-4xl font-bold text-white">
                      {getInitials(doctor.name)}
                    </div>
                  </div>
                )}
              </div>
              {stats.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {stats.map((s) => <StatChip key={s.label} {...s} />)}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
