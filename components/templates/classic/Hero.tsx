// Classic template hero - editorial profile opening with contact summary
import Image from 'next/image'
import { CalendarDays, MapPin, Phone, ShieldCheck } from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import { computeExperienceYears, getContactLinks, type TemplateSections } from '@/components/templates/shared'

interface HeroProps {
  doctor: Doctor
  sections: TemplateSections
}

export default function ClassicHero({ doctor, sections }: HeroProps) {
  const { personal, clinicInfo, appointment, experience } = sections
  const contact = getContactLinks(appointment, doctor)

  return (
    <section id="section-personal" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.clinical.line)_1px,transparent_1px),linear-gradient(theme(colors.clinical.line)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pb-20 md:pt-16">
        <div className="animate-template-rise">
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {doctor.is_verified && (
              <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 font-semibold text-green-700">
                <ShieldCheck size={15} />
                NMC Verified
              </span>
            )}
            {clinicInfo?.address && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-brand-600" />
                {clinicInfo.address}
              </span>
            )}
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-clinical-ink md:text-6xl">
            Dr. {doctor.name}
          </h1>
          <p className="mt-4 text-xl font-medium text-brand-700 md:text-2xl">{doctor.specialty}</p>
          {personal?.tagline && (
            <p className="mt-6 max-w-2xl border-l-4 border-brand-500 pl-5 text-lg leading-8 text-gray-700">
              {personal.tagline}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#classic-book-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-clinical transition hover:bg-brand-800"
            >
              <CalendarDays size={17} />
              Book appointment
            </a>
            <a
              href={contact.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <Phone size={17} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="relative animate-template-rise [animation-delay:140ms]">
          <div className="absolute -right-8 top-8 hidden h-56 w-56 rounded-full border border-brand-100 md:block" />
          <div className="relative rounded-[2rem] border border-clinical-line bg-white p-4 shadow-clinical">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-clinical-soft">
              {personal?.photo ? (
                <Image
                  src={personal.photo}
                  alt={`Dr. ${doctor.name}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-semibold text-brand-200">
                  Dr
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(() => {
                const years = computeExperienceYears(experience, personal)
                return years > 0 ? (
                  <div className="rounded-2xl bg-clinical-soft p-4">
                    <p className="text-3xl font-semibold text-brand-700">{years}</p>
                    <p className="text-xs font-medium uppercase text-gray-500">Years</p>
                  </div>
                ) : null
              })()}
              <div className="rounded-2xl bg-clinical-soft p-4">
                <p className="text-sm font-semibold text-clinical-ink">Direct care access</p>
                <p className="mt-1 text-xs text-gray-500">{contact.formattedPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
