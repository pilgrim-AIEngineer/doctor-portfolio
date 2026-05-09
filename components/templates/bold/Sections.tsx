// Bold template section renderers — dark navy cards with gold accents and serif headings
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { UPLOAD_GALLERY_MAX_IMAGES } from '@/lib/constants'
import GalleryLightbox from '@/components/templates/classic/GalleryLightbox'
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6">
      <section className="bg-navy-light rounded-2xl border border-white/10 px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-gold-300 rounded-full shrink-0" />
          <h2 className="font-serif text-xl font-bold text-white">{title}</h2>
        </div>
        {children}
      </section>
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-gold-300/10 text-gold-300 text-sm px-3.5 py-1.5 rounded-full border border-gold-300/30 font-medium">
      {label}
    </span>
  )
}

function AboutBlock({ personal }: { personal: PersonalSection }) {
  if (!personal.about) return null
  return (
    <SectionCard title="About">
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{personal.about}</p>
    </SectionCard>
  )
}

function QualificationsBlock({ data }: { data: QualificationsSection }) {
  const hasDegrees = data.degrees?.length > 0
  const hasFellowships = data.fellowships?.length > 0
  if (!hasDegrees && !hasFellowships) return null
  return (
    <SectionCard title="Qualifications">
      {hasDegrees && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Degrees</p>
          <ul className="space-y-2">
            {data.degrees.map((d, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <span className="w-2 h-2 bg-gold-300 rounded-full shrink-0 mt-1.5" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasFellowships && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fellowships</p>
          <ul className="space-y-2">
            {data.fellowships.map((f, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <span className="w-2 h-2 bg-gold-300/50 rounded-full shrink-0 mt-1.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  )
}

function SpecializationBlock({ data }: { data: SpecializationSection }) {
  return (
    <SectionCard title="Specialization">
      <p className="text-white font-semibold text-base mb-4">{data.primary}</p>
      {data.sub_specialties?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.sub_specialties.map((s, i) => <Pill key={i} label={s} />)}
        </div>
      )}
    </SectionCard>
  )
}

function ExperienceBlock({ data }: { data: ExperienceSection }) {
  return (
    <SectionCard title="Experience">
      <div className="inline-flex items-center gap-4 bg-gold-300/10 border border-gold-300/30 rounded-xl px-6 py-4 mb-5">
        <span className="font-serif text-5xl font-bold text-gold-300 leading-none">{data.years}</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-gold-300 leading-tight">Years of</p>
          <p className="text-sm font-semibold text-gold-300 leading-tight">Experience</p>
        </div>
      </div>
      {data.current_affiliation && (
        <p className="text-white font-semibold mb-3">{data.current_affiliation}</p>
      )}
      {data.hospitals?.length > 0 && (
        <ul className="space-y-2 text-gray-300">
          {data.hospitals.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-2 h-2 bg-gold-300 rounded-full shrink-0 mt-1.5" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

function ServicesBlock({ data }: { data: ServicesSection }) {
  const hasTreatments = data.treatments?.length > 0
  const hasProcedures = data.procedures?.length > 0
  const hasConsultation = data.consultation_types?.length > 0
  if (!hasTreatments && !hasProcedures && !hasConsultation) return null
  return (
    <SectionCard title="Services">
      {hasTreatments && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Treatments</p>
          <div className="flex flex-wrap gap-2">
            {data.treatments.map((t, i) => <Pill key={i} label={t} />)}
          </div>
        </div>
      )}
      {hasProcedures && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Procedures</p>
          <div className="flex flex-wrap gap-2">
            {data.procedures.map((p, i) => <Pill key={i} label={p} />)}
          </div>
        </div>
      )}
      {hasConsultation && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Consultation Types</p>
          <div className="flex flex-wrap gap-2">
            {data.consultation_types.map((c, i) => <Pill key={i} label={c} />)}
          </div>
        </div>
      )}
    </SectionCard>
  )
}

function ClinicBlock({ data }: { data: ClinicInfoSection }) {
  return (
    <SectionCard title="Clinic Information">
      <div className="space-y-3">
        {data.address && (
          <div className="flex gap-3 bg-white/5 rounded-xl p-3">
            <MapPin size={18} className="shrink-0 text-gold-300 mt-0.5" />
            <span className="text-gray-300">{data.address}</span>
          </div>
        )}
        {data.timings && (
          <div className="flex gap-3 bg-white/5 rounded-xl p-3">
            <Clock size={18} className="shrink-0 text-gold-300 mt-0.5" />
            <span className="text-gray-300">{data.timings}</span>
          </div>
        )}
        {data.phone && (
          <a href={`tel:${data.phone}`} className="flex gap-3 bg-white/5 hover:bg-gold-300/10 rounded-xl p-3 transition-colors">
            <Phone size={18} className="shrink-0 text-gold-300 mt-0.5" />
            <span className="text-gray-300">{data.phone}</span>
          </a>
        )}
        {data.map_url && (
          <a
            href={data.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 bg-gold-300/10 hover:bg-gold-300/20 rounded-xl p-3 text-gold-300 transition-colors"
          >
            <ExternalLink size={18} className="shrink-0 mt-0.5" />
            View on Map
          </a>
        )}
      </div>
    </SectionCard>
  )
}

function AchievementsBlock({ data }: { data: AchievementsData }) {
  const all = [...(data.awards ?? []), ...(data.recognitions ?? [])]
  if (!all.length) return null
  return (
    <SectionCard title="Achievements & Awards">
      <ul className="space-y-3">
        {all.map((a, i) => (
          <li key={i} className="flex gap-3 items-start bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <span className="text-gold-300 shrink-0 text-lg leading-snug">★</span>
            <span className="text-gray-300 leading-relaxed">{a}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function GalleryBlock({ data }: { data: GalleryData }) {
  const images = data.images?.slice(0, UPLOAD_GALLERY_MAX_IMAGES) ?? []
  if (!images.length) return null
  return (
    <SectionCard title="Gallery">
      <GalleryLightbox images={images} />
    </SectionCard>
  )
}

function LanguagesBlock({ data }: { data: LanguagesData }) {
  if (!data.spoken?.length) return null
  return (
    <SectionCard title="Languages Spoken">
      <div className="flex flex-wrap gap-2">
        {data.spoken.map((l, i) => <Pill key={i} label={l} />)}
      </div>
    </SectionCard>
  )
}

function InsuranceBlock({ data }: { data: InsuranceData }) {
  if (!data.panels?.length) return null
  return (
    <SectionCard title="Insurance Accepted">
      <div className="flex flex-wrap gap-2">
        {data.panels.map((p, i) => <Pill key={i} label={p} />)}
      </div>
    </SectionCard>
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
    <SectionCard title="Connect Online">
      <div className="flex flex-wrap gap-3">
        {links.map(({ label, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 hover:bg-gold-300/10 border border-white/10 hover:border-gold-300/30 text-gray-300 hover:text-gold-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <ExternalLink size={14} />
            {label}
          </a>
        ))}
      </div>
    </SectionCard>
  )
}

export default function BoldSections({ sections }: SectionsProps) {
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
    <div className="bg-navy py-8 space-y-5">
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
