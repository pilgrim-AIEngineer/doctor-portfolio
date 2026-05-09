// Classic template section renderers — all profile sections in display order
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { UPLOAD_GALLERY_MAX_IMAGES } from '@/lib/constants'
import GalleryLightbox from './GalleryLightbox'
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
    <div className="max-w-3xl mx-auto px-4 md:px-6">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-brand-600 rounded-full shrink-0" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </section>
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-brand-50 text-brand-700 text-sm px-3.5 py-1.5 rounded-full border border-brand-100 font-medium">
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
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Degrees</p>
          <ul className="space-y-2">
            {data.degrees.map((d, i) => (
              <li key={i} className="flex gap-3 text-gray-800">
                <span className="w-2 h-2 bg-brand-500 rounded-full shrink-0 mt-1.5" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasFellowships && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fellowships</p>
          <ul className="space-y-2">
            {data.fellowships.map((f, i) => (
              <li key={i} className="flex gap-3 text-gray-800">
                <span className="w-2 h-2 bg-brand-300 rounded-full shrink-0 mt-1.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionBlock>
  )
}

function SpecializationBlock({ data }: { data: SpecializationSection }) {
  return (
    <SectionBlock title="Specialization">
      <p className="text-gray-900 font-semibold text-base mb-4">{data.primary}</p>
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
      <div className="inline-flex items-center gap-4 bg-brand-50 border border-brand-100 rounded-xl px-6 py-4 mb-5">
        <span className="text-5xl font-extrabold text-brand-700 leading-none">{data.years}</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-brand-700 leading-tight">Years of</p>
          <p className="text-sm font-semibold text-brand-700 leading-tight">Experience</p>
        </div>
      </div>
      {data.current_affiliation && (
        <p className="text-gray-800 font-semibold mb-3">{data.current_affiliation}</p>
      )}
      {data.hospitals?.length > 0 && (
        <ul className="space-y-2 text-gray-700">
          {data.hospitals.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-2 h-2 bg-brand-400 rounded-full shrink-0 mt-1.5" />
              {h}
            </li>
          ))}
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
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Treatments</p>
          <div className="flex flex-wrap gap-2">
            {data.treatments.map((t, i) => <Pill key={i} label={t} />)}
          </div>
        </div>
      )}
      {hasProcedures && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Procedures</p>
          <div className="flex flex-wrap gap-2">
            {data.procedures.map((p, i) => <Pill key={i} label={p} />)}
          </div>
        </div>
      )}
      {hasConsultation && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Consultation Types</p>
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
      <div className="space-y-3">
        {data.address && (
          <div className="flex gap-3 bg-gray-50 rounded-xl p-3">
            <MapPin size={18} className="shrink-0 text-brand-600 mt-0.5" />
            <span className="text-gray-700">{data.address}</span>
          </div>
        )}
        {data.timings && (
          <div className="flex gap-3 bg-gray-50 rounded-xl p-3">
            <Clock size={18} className="shrink-0 text-brand-600 mt-0.5" />
            <span className="text-gray-700">{data.timings}</span>
          </div>
        )}
        {data.phone && (
          <a href={`tel:${data.phone}`} className="flex gap-3 bg-gray-50 hover:bg-brand-50 rounded-xl p-3 transition-colors">
            <Phone size={18} className="shrink-0 text-brand-600 mt-0.5" />
            <span className="text-gray-700">{data.phone}</span>
          </a>
        )}
        {data.map_url && (
          <a
            href={data.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 bg-brand-50 hover:bg-brand-100 rounded-xl p-3 text-brand-700 transition-colors"
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
      <ul className="space-y-3">
        {all.map((a, i) => (
          <li key={i} className="flex gap-3 items-start bg-gold-50 border border-gold-100 rounded-xl px-4 py-3">
            <span className="text-gold-500 shrink-0 text-lg leading-snug">★</span>
            <span className="text-gray-700 leading-relaxed">{a}</span>
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
      <GalleryLightbox images={images} />
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
            className="flex items-center gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 text-gray-600 hover:text-brand-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
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
    <div className="bg-gray-50 py-6 space-y-4">
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
