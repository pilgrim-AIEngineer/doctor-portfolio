// Classic template sections - open clinical bands with refined content rhythm
import type { ReactNode } from 'react'
import {
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  Languages,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
} from 'lucide-react'
import type { LocationEntry } from '@/types/Profile'
import GalleryLightbox from './GalleryLightbox'
import {
  computeExperienceYears,
  getAchievementItems,
  getGalleryImages,
  getHospitalItems,
  getQualificationItems,
  getSocialLinks,
  hasItems,
  type TemplateSections,
} from '@/components/templates/shared'

interface SectionsProps {
  sections: TemplateSections
}

function SectionBand({
  title,
  icon,
  children,
  wide = false,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
  wide?: boolean
}) {
  return (
    <section className={wide ? 'md:col-span-2' : undefined}>
      <div className="rounded-[1.75rem] border border-clinical-line bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-clinical md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-clinical-soft text-brand-700">
            {icon}
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-clinical-ink">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700">
      {label}
    </span>
  )
}

function ListItems({ items, accent = 'bg-brand-500' }: { items?: string[]; accent?: string }) {
  if (!hasItems(items)) return null
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-gray-700">
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accent}`} />
          <span className="leading-7">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function About({ sections }: SectionsProps) {
  if (!sections.personal?.about) return null
  return (
    <SectionBand title="About" icon={<HeartPulse size={20} />} wide>
      <p className="max-w-4xl whitespace-pre-line text-lg leading-8 text-gray-700">
        {sections.personal.about}
      </p>
    </SectionBand>
  )
}

function Qualifications({ sections }: SectionsProps) {
  const data = sections.qualifications
  if (!data || (!data.degrees?.length && !data.fellowships?.length)) return null
  const degrees = getQualificationItems(data.degrees ?? [])
  const fellowships = getQualificationItems(data.fellowships ?? [])
  return (
    <SectionBand title="Qualifications" icon={<GraduationCap size={20} />}>
      <div className="space-y-6">
        <ListItems items={degrees} />
        <ListItems items={fellowships} accent="bg-brand-300" />
      </div>
    </SectionBand>
  )
}

function Specialization({ sections }: SectionsProps) {
  const data = sections.specialization
  if (!data) return null
  return (
    <SectionBand title="Specialization" icon={<Stethoscope size={20} />}>
      <p className="mb-4 text-lg font-semibold text-clinical-ink">{data.primary}</p>
      <div className="flex flex-wrap gap-2">
        {data.sub_specialties.map((item) => <Pill key={item} label={item} />)}
      </div>
    </SectionBand>
  )
}

function Experience({ sections }: SectionsProps) {
  const data = sections.experience
  if (!data) return null
  const years = computeExperienceYears(data)
  const hospitalItems = getHospitalItems(data)
  return (
    <SectionBand title="Experience" icon={<BookOpen size={20} />}>
      {years > 0 && (
        <div className="mb-5 inline-flex items-end gap-3 rounded-2xl bg-clinical-soft px-5 py-4">
          <span className="text-5xl font-semibold text-brand-700">{years}</span>
          <span className="pb-1 text-sm font-semibold uppercase text-gray-500">years</span>
        </div>
      )}
      {data.current_affiliation && (
        <p className="mb-4 font-semibold text-clinical-ink">{data.current_affiliation}</p>
      )}
      <ListItems items={hospitalItems} />
    </SectionBand>
  )
}

function Services({ sections }: SectionsProps) {
  const data = sections.services
  if (!data) return null
  const groups = [
    { title: 'Treatments', items: data.treatments },
    { title: 'Procedures', items: data.procedures },
    { title: 'Consultation', items: data.consultation_types },
  ].filter((group) => hasItems(group.items))
  if (!groups.length) return null

  return (
    <SectionBand title="Services" icon={<Shield size={20} />} wide>
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="rounded-2xl bg-clinical-soft p-5">
            <p className="mb-3 text-xs font-bold uppercase text-brand-700">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => <Pill key={item} label={item} />)}
            </div>
          </div>
        ))}
      </div>
    </SectionBand>
  )
}

function LocationCard({ loc }: { loc: LocationEntry }) {
  return (
    <div className="rounded-2xl border border-clinical-line bg-clinical-soft p-4 space-y-2">
      <p className="font-semibold text-clinical-ink">{loc.name}</p>
      <InfoRow icon={<MapPin size={18} />} text={loc.address} />
      <InfoRow icon={<Clock size={18} />} text={loc.timings} />
      <InfoLink icon={<Phone size={18} />} href={`tel:${loc.phone}`} text={loc.phone} />
      {loc.map_url && <InfoLink icon={<ExternalLink size={18} />} href={loc.map_url} text="Get Directions" />}
    </div>
  )
}

function Clinic({ sections }: SectionsProps) {
  const locationEntries = sections.locations?.locations
  if (locationEntries && locationEntries.length > 0) {
    const sorted = [...locationEntries].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    return (
      <SectionBand title="Clinic" icon={<MapPin size={20} />}>
        <div className="space-y-4">
          {sorted.map((loc) => <LocationCard key={loc.name} loc={loc} />)}
        </div>
      </SectionBand>
    )
  }
  const data = sections.clinicInfo
  if (!data) return null
  return (
    <SectionBand title="Clinic" icon={<MapPin size={20} />}>
      <div className="space-y-3 text-gray-700">
        {data.address && <InfoRow icon={<MapPin size={18} />} text={data.address} />}
        {data.timings && <InfoRow icon={<Clock size={18} />} text={data.timings} />}
        {data.phone && <InfoLink icon={<Phone size={18} />} href={`tel:${data.phone}`} text={data.phone} />}
        {data.map_url && <InfoLink icon={<ExternalLink size={18} />} href={data.map_url} text="View on Map" />}
      </div>
    </SectionBand>
  )
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-clinical-soft p-4">
      <span className="shrink-0 text-brand-700">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function InfoLink({ icon, href, text }: { icon: ReactNode; href: string; text: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex gap-3 rounded-2xl bg-clinical-soft p-4 text-brand-700 transition hover:bg-brand-50">
      <span className="shrink-0">{icon}</span>
      <span>{text}</span>
    </a>
  )
}

function Achievements({ sections }: SectionsProps) {
  const items = getAchievementItems(sections.achievements)
  if (!items.length) return null
  return (
    <SectionBand title="Achievements" icon={<Award size={20} />}>
      <ListItems items={items} accent="bg-gold-400" />
    </SectionBand>
  )
}

function Gallery({ sections }: SectionsProps) {
  const images = getGalleryImages(sections.gallery)
  if (!images.length) return null
  return (
    <SectionBand title="Gallery" icon={<BookOpen size={20} />} wide>
      <GalleryLightbox images={images} />
    </SectionBand>
  )
}

function Extras({ sections }: SectionsProps) {
  const socialLinks = getSocialLinks(sections.social)
  const hasExtras = hasItems(sections.languages?.spoken) || hasItems(sections.insurance?.panels) || socialLinks.length > 0
  if (!hasExtras) return null
  return (
    <SectionBand title="More Information" icon={<Languages size={20} />} wide>
      <div className="grid gap-5 md:grid-cols-3">
        <PillGroup title="Languages" items={sections.languages?.spoken} />
        <PillGroup title="Insurance" items={sections.insurance?.panels} />
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-gray-500">Connect</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-brand-700">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionBand>
  )
}

function PillGroup({ title, items }: { title: string; items?: string[] }) {
  if (!hasItems(items)) return null
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase text-gray-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <Pill key={item} label={item} />)}
      </div>
    </div>
  )
}

export default function ClassicSections({ sections }: SectionsProps) {
  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-6 py-10 md:grid-cols-2 md:py-14">
      <About sections={sections} />
      <Qualifications sections={sections} />
      <Specialization sections={sections} />
      <Experience sections={sections} />
      <Clinic sections={sections} />
      <Services sections={sections} />
      <Achievements sections={sections} />
      <Gallery sections={sections} />
      <Extras sections={sections} />
    </main>
  )
}
