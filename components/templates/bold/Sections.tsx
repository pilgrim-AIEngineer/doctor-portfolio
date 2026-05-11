// Bold template sections - premium navy and ivory editorial content
import type { ReactNode } from 'react'
import {
  Award,
  Clock,
  ExternalLink,
  GraduationCap,
  Images,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
  User2,
} from 'lucide-react'
import GalleryLightbox from '@/components/templates/classic/GalleryLightbox'
import {
  getAchievementItems,
  getGalleryImages,
  getSocialLinks,
  hasItems,
  type TemplateSections,
} from '@/components/templates/shared'

interface SectionsProps {
  sections: TemplateSections
}

function EditorialSection({
  title,
  icon,
  children,
  light = false,
  wide = false,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
  light?: boolean
  wide?: boolean
}) {
  const shell = light
    ? 'bg-ivory text-navy border-gold-300/30'
    : 'bg-navy-light text-white border-white/10'
  const heading = light ? 'text-navy' : 'text-white'

  return (
    <section className={wide ? 'lg:col-span-2' : undefined}>
      <div className={`h-full border p-6 shadow-gold md:p-8 ${shell}`}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center border border-gold-300/40 text-gold-400">
            {icon}
          </span>
          <h2 className={`font-serif text-2xl font-bold ${heading}`}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function GoldPill({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <span className={`inline-flex border px-3.5 py-1.5 text-sm font-semibold ${light ? 'border-gold-500/30 bg-gold-50 text-navy' : 'border-gold-300/30 bg-gold-300/10 text-gold-300'}`}>
      {label}
    </span>
  )
}

function ListItems({ items, light = false }: { items?: string[]; light?: boolean }) {
  if (!hasItems(items)) return null
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex gap-3 ${light ? 'text-gray-700' : 'text-gray-300'}`}>
          <span className="mt-2 h-2 w-2 shrink-0 bg-gold-300" />
          <span className="leading-7">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function About({ sections }: SectionsProps) {
  if (!sections.personal?.about) return null
  return (
    <EditorialSection title="Signature Care" icon={<User2 size={20} />} light wide>
      <p className="max-w-4xl whitespace-pre-line text-lg leading-8 text-gray-700">
        {sections.personal.about}
      </p>
    </EditorialSection>
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
    <EditorialSection title="Services" icon={<Stethoscope size={20} />} wide>
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="border border-gold-300/20 bg-white/5 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => <GoldPill key={item} label={item} />)}
            </div>
          </div>
        ))}
      </div>
    </EditorialSection>
  )
}

function Experience({ sections }: SectionsProps) {
  const data = sections.experience
  if (!data) return null
  return (
    <EditorialSection title="Experience" icon={<Award size={20} />}>
      <div className="mb-5 flex items-end gap-3">
        <span className="font-serif text-6xl font-bold text-gold-300">{data.years}</span>
        <span className="pb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">years</span>
      </div>
      {data.current_affiliation && <p className="mb-4 font-semibold text-white">{data.current_affiliation}</p>}
      <ListItems items={data.hospitals} />
    </EditorialSection>
  )
}

function Qualifications({ sections }: SectionsProps) {
  const data = sections.qualifications
  if (!data || (!hasItems(data.degrees) && !hasItems(data.fellowships))) return null
  return (
    <EditorialSection title="Qualifications" icon={<GraduationCap size={20} />} light>
      <div className="space-y-5">
        <ListItems items={data.degrees} light />
        <ListItems items={data.fellowships} light />
      </div>
    </EditorialSection>
  )
}

function Specialization({ sections }: SectionsProps) {
  const data = sections.specialization
  if (!data) return null
  return (
    <EditorialSection title="Specialization" icon={<Shield size={20} />} light>
      <p className="mb-4 text-lg font-semibold text-navy">{data.primary}</p>
      <div className="flex flex-wrap gap-2">
        {data.sub_specialties.map((item) => <GoldPill key={item} label={item} light />)}
      </div>
    </EditorialSection>
  )
}

function Clinic({ sections }: SectionsProps) {
  const data = sections.clinicInfo
  if (!data) return null
  return (
    <EditorialSection title="Clinic" icon={<MapPin size={20} />} wide>
      <div className="grid gap-3 md:grid-cols-2">
        {data.address && <InfoRow icon={<MapPin size={18} />} text={data.address} />}
        {data.timings && <InfoRow icon={<Clock size={18} />} text={data.timings} />}
        {data.phone && <InfoLink icon={<Phone size={18} />} href={`tel:${data.phone}`} text={data.phone} />}
        {data.map_url && <InfoLink icon={<ExternalLink size={18} />} href={data.map_url} text="View on Map" />}
      </div>
    </EditorialSection>
  )
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex gap-3 border border-white/10 bg-white/5 p-4 text-gray-300">
      <span className="shrink-0 text-gold-300">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function InfoLink({ icon, href, text }: { icon: ReactNode; href: string; text: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex gap-3 border border-gold-300/20 bg-gold-300/10 p-4 text-gold-300 transition hover:bg-gold-300/20">
      <span className="shrink-0">{icon}</span>
      <span>{text}</span>
    </a>
  )
}

function Gallery({ sections }: SectionsProps) {
  const images = getGalleryImages(sections.gallery)
  if (!images.length) return null
  return (
    <EditorialSection title="Gallery" icon={<Images size={20} />} light wide>
      <div className="rounded-none border border-gold-300/30 bg-white p-3">
        <GalleryLightbox images={images} />
      </div>
    </EditorialSection>
  )
}

function Extras({ sections }: SectionsProps) {
  const achievements = getAchievementItems(sections.achievements)
  const socialLinks = getSocialLinks(sections.social)
  const hasExtras = achievements.length || hasItems(sections.languages?.spoken) || hasItems(sections.insurance?.panels) || socialLinks.length
  if (!hasExtras) return null
  return (
    <EditorialSection title="Credentials" icon={<Award size={20} />} wide>
      <div className="grid gap-5 md:grid-cols-3">
        <MiniList title="Achievements" items={achievements} />
        <MiniList title="Languages" items={sections.languages?.spoken} />
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Connect</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="border border-gold-300/30 px-3.5 py-1.5 text-sm font-semibold text-gold-300">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </EditorialSection>
  )
}

function MiniList({ title, items }: { title: string; items?: string[] }) {
  if (!hasItems(items)) return null
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{title}</p>
      <ListItems items={items} />
    </div>
  )
}

export default function BoldSections({ sections }: SectionsProps) {
  return (
    <main className="bg-navy px-6 py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <About sections={sections} />
        <Services sections={sections} />
        <Experience sections={sections} />
        <Qualifications sections={sections} />
        <Specialization sections={sections} />
        <Clinic sections={sections} />
        <Gallery sections={sections} />
        <Extras sections={sections} />
      </div>
    </main>
  )
}
