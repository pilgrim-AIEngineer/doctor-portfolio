// Classic template section renderers — all profile sections in display order
import Image from 'next/image'
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { UPLOAD_GALLERY_MAX_IMAGES } from '@/lib/constants'
import type {
  SectionKey,
  PersonalSection,
  QualificationsSection,
  SpecializationSection,
  ExperienceSection,
  ServicesSection,
  ClinicInfoSection,
  SocialSection,
} from '@/types/Profile'

interface SectionsProps {
  sections: Partial<Record<SectionKey, unknown>>
}

interface AchievementsData {
  awards?: string[]
  recognitions?: string[]
}
interface GalleryData {
  images?: string[]
}
interface LanguagesData {
  spoken?: string[]
}
interface InsuranceData {
  panels?: string[]
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-10 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </section>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-block bg-brand-50 text-brand-700 text-sm px-3 py-1 rounded-full">
      {label}
    </span>
  )
}

function AboutBlock({ personal }: { personal: PersonalSection }) {
  if (!personal.about) return null
  return (
    <SectionBlock title="About">
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{personal.about}</p>
    </SectionBlock>
  )
}

function QualificationsBlock({ data }: { data: QualificationsSection }) {
  const hasDegrees = data.degrees?.length > 0
  const hasFellowships = data.fellowships?.length > 0
  if (!hasDegrees && !hasFellowships) return null
  return (
    <SectionBlock title="Qualifications">
      {hasDegrees && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Degrees</p>
          <ul className="space-y-1 text-gray-700">
            {data.degrees.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}
      {hasFellowships && (
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Fellowships</p>
          <ul className="space-y-1 text-gray-700">
            {data.fellowships.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}
    </SectionBlock>
  )
}

function SpecializationBlock({ data }: { data: SpecializationSection }) {
  return (
    <SectionBlock title="Specialization">
      <p className="text-gray-800 font-medium mb-3">{data.primary}</p>
      {data.sub_specialties?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.sub_specialties.map((s, i) => <Pill key={i} label={s} />)}
        </div>
      )}
    </SectionBlock>
  )
}

function ExperienceBlock({ data }: { data: ExperienceSection }) {
  return (
    <SectionBlock title="Experience">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-brand-700">{data.years}</span>
        <span className="text-gray-600">years of experience</span>
      </div>
      {data.current_affiliation && (
        <p className="text-gray-800 font-medium mb-3">{data.current_affiliation}</p>
      )}
      {data.hospitals?.length > 0 && (
        <ul className="space-y-1 text-gray-700">
          {data.hospitals.map((h, i) => <li key={i}>• {h}</li>)}
        </ul>
      )}
    </SectionBlock>
  )
}

function ServicesBlock({ data }: { data: ServicesSection }) {
  const hasTreatments = data.treatments?.length > 0
  const hasProcedures = data.procedures?.length > 0
  const hasConsultation = data.consultation_types?.length > 0
  if (!hasTreatments && !hasProcedures && !hasConsultation) return null
  return (
    <SectionBlock title="Services">
      {hasTreatments && (
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-500 mb-2">Treatments</p>
          <div className="flex flex-wrap gap-2">
            {data.treatments.map((t, i) => <Pill key={i} label={t} />)}
          </div>
        </div>
      )}
      {hasProcedures && (
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-500 mb-2">Procedures</p>
          <div className="flex flex-wrap gap-2">
            {data.procedures.map((p, i) => <Pill key={i} label={p} />)}
          </div>
        </div>
      )}
      {hasConsultation && (
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Consultation Types</p>
          <div className="flex flex-wrap gap-2">
            {data.consultation_types.map((c, i) => <Pill key={i} label={c} />)}
          </div>
        </div>
      )}
    </SectionBlock>
  )
}

function ClinicBlock({ data }: { data: ClinicInfoSection }) {
  return (
    <SectionBlock title="Clinic Information">
      <div className="space-y-3 text-gray-700">
        {data.address && (
          <div className="flex gap-2">
            <MapPin size={18} className="shrink-0 text-brand-600 mt-0.5" />
            <span>{data.address}</span>
          </div>
        )}
        {data.timings && (
          <div className="flex gap-2">
            <Clock size={18} className="shrink-0 text-brand-600 mt-0.5" />
            <span>{data.timings}</span>
          </div>
        )}
        {data.phone && (
          <a href={`tel:${data.phone}`} className="flex gap-2 hover:text-brand-700">
            <Phone size={18} className="shrink-0 text-brand-600 mt-0.5" />
            {data.phone}
          </a>
        )}
        {data.map_url && (
          <a
            href={data.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 text-brand-700 hover:underline underline-offset-2"
          >
            <ExternalLink size={18} className="shrink-0 mt-0.5" />
            View on Map
          </a>
        )}
      </div>
    </SectionBlock>
  )
}

function AchievementsBlock({ data }: { data: AchievementsData }) {
  const all = [...(data.awards ?? []), ...(data.recognitions ?? [])]
  if (!all.length) return null
  return (
    <SectionBlock title="Achievements & Awards">
      <ul className="space-y-2">
        {all.map((a, i) => (
          <li key={i} className="flex gap-2 text-gray-700">
            <span className="text-gold-500 shrink-0">★</span>
            {a}
          </li>
        ))}
      </ul>
    </SectionBlock>
  )
}

function GalleryBlock({ data }: { data: GalleryData }) {
  const images = data.images?.slice(0, UPLOAD_GALLERY_MAX_IMAGES) ?? []
  if (!images.length) return null
  return (
    <SectionBlock title="Gallery">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </SectionBlock>
  )
}

function LanguagesBlock({ data }: { data: LanguagesData }) {
  if (!data.spoken?.length) return null
  return (
    <SectionBlock title="Languages Spoken">
      <div className="flex flex-wrap gap-2">
        {data.spoken.map((l, i) => <Pill key={i} label={l} />)}
      </div>
    </SectionBlock>
  )
}

function InsuranceBlock({ data }: { data: InsuranceData }) {
  if (!data.panels?.length) return null
  return (
    <SectionBlock title="Insurance Accepted">
      <div className="flex flex-wrap gap-2">
        {data.panels.map((p, i) => <Pill key={i} label={p} />)}
      </div>
    </SectionBlock>
  )
}

function SocialBlock({ data }: { data: SocialSection }) {
  const links = [
    { label: 'YouTube', url: data.youtube },
    { label: 'Instagram', url: data.instagram },
    { label: 'LinkedIn', url: data.linkedin },
    { label: 'Twitter', url: data.twitter },
  ].filter((l): l is { label: string; url: string } => !!l.url)

  if (!links.length) return null
  return (
    <SectionBlock title="Connect Online">
      <div className="flex flex-wrap gap-3">
        {links.map(({ label, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-200 hover:border-brand-300 text-gray-600 hover:text-brand-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ExternalLink size={14} />
            {label}
          </a>
        ))}
      </div>
    </SectionBlock>
  )
}

export default function ClassicSections({ sections }: SectionsProps) {
  const personal = sections.personal as PersonalSection | undefined
  const qualifications = sections.qualifications as QualificationsSection | undefined
  const specialization = sections.specialization as SpecializationSection | undefined
  const experience = sections.experience as ExperienceSection | undefined
  const services = sections.services as ServicesSection | undefined
  const clinicInfo = sections.clinic_info as ClinicInfoSection | undefined
  const achievements = sections.achievements as AchievementsData | undefined
  const gallery = sections.gallery as GalleryData | undefined
  const languages = sections.languages as LanguagesData | undefined
  const insurance = sections.insurance as InsuranceData | undefined
  const social = sections.social as SocialSection | undefined

  return (
    <div>
      {personal && <AboutBlock personal={personal} />}
      {qualifications && <QualificationsBlock data={qualifications} />}
      {specialization && <SpecializationBlock data={specialization} />}
      {experience && <ExperienceBlock data={experience} />}
      {services && <ServicesBlock data={services} />}
      {clinicInfo && <ClinicBlock data={clinicInfo} />}
      {achievements && <AchievementsBlock data={achievements} />}
      {gallery && <GalleryBlock data={gallery} />}
      {languages && <LanguagesBlock data={languages} />}
      {insurance && <InsuranceBlock data={insurance} />}
      {social && <SocialBlock data={social} />}
    </div>
  )
}
