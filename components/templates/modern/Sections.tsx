// Modern template sections - glass panels, anchors, and compact content modules
import type { ReactNode } from 'react'
import {
  Award,
  Briefcase,
  Clock,
  ExternalLink,
  GraduationCap,
  Images,
  MapPin,
  Phone,
  Share2,
  Shield,
  Stethoscope,
  User2,
} from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import type { LocationEntry } from '@/types/Profile'
import GalleryLightbox from '@/components/templates/classic/GalleryLightbox'
import SidebarNav from './SidebarNav'
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

interface ModernSectionsProps {
  sections: TemplateSections
  doctor: Doctor
}

const NAV_ITEMS = [
  { href: '#modern-about', label: 'About' },
  { href: '#modern-services', label: 'Services' },
  { href: '#modern-experience', label: 'Experience' },
  { href: '#modern-clinic', label: 'Clinic' },
] as const

function GlassSection({
  id,
  title,
  icon,
  children,
  wide = false,
}: {
  id?: string
  title: string
  icon: ReactNode
  children: ReactNode
  wide?: boolean
}) {
  return (
    <section id={id} className={wide ? 'lg:col-span-2' : undefined}>
      <div className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 shadow-glass backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1] md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
            {icon}
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-1.5 text-sm font-semibold text-cyan-100">
      {label}
    </span>
  )
}

function ItemList({ items }: { items?: string[] }) {
  if (!hasItems(items)) return null
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-slate-300">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
          <span className="leading-7">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function AnchorNav() {
  return (
    <nav className="sticky top-4 z-20 mx-auto mb-8 flex max-w-4xl justify-center px-6 lg:hidden">
      <div className="flex gap-1 rounded-full border border-white/10 bg-modern-panel/80 p-1 shadow-glass backdrop-blur">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

function About({ sections }: SectionsProps) {
  if (!sections.personal?.about) return null
  return (
    <>
      <span id="section-personal" aria-hidden="true" />
      <GlassSection id="modern-about" title="About" icon={<User2 size={20} />} wide>
        <p className="max-w-4xl whitespace-pre-line text-lg leading-8 text-slate-300">
          {sections.personal.about}
        </p>
      </GlassSection>
    </>
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
    <>
      <span id="section-services" aria-hidden="true" />
      <GlassSection id="modern-services" title="Services" icon={<Stethoscope size={20} />} wide>
        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="rounded-3xl border border-white/10 bg-modern-panel/70 p-5">
              <p className="mb-4 text-xs font-bold uppercase text-cyan-200">{group.title}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => <Chip key={item} label={item} />)}
              </div>
            </div>
          ))}
        </div>
      </GlassSection>
    </>
  )
}

function Experience({ sections }: SectionsProps) {
  const data = sections.experience
  if (!data) return null
  const years = computeExperienceYears(data, sections.personal)
  const hospitalItems = getHospitalItems(data)
  return (
    <>
      <span id="section-experience" aria-hidden="true" />
      <GlassSection id="modern-experience" title="Experience" icon={<Briefcase size={20} />}>
        {years > 0 && (
          <div className="mb-5 flex items-end gap-3">
            <span className="text-6xl font-semibold text-cyan-200">{years}</span>
            <span className="pb-2 text-sm font-bold uppercase text-slate-400">years</span>
          </div>
        )}
        {data.current_affiliation && <p className="mb-4 font-semibold text-white">{data.current_affiliation}</p>}
        <ItemList items={hospitalItems} />
      </GlassSection>
    </>
  )
}

function Qualifications({ sections }: SectionsProps) {
  const data = sections.qualifications
  if (!data || (!data.degrees?.length && !data.fellowships?.length)) return null
  const degrees = getQualificationItems(data.degrees ?? [])
  const fellowships = getQualificationItems(data.fellowships ?? [])
  return (
    <GlassSection id="section-qualifications" title="Qualifications" icon={<GraduationCap size={20} />}>
      <div className="space-y-5">
        <ItemList items={degrees} />
        <ItemList items={fellowships} />
      </div>
    </GlassSection>
  )
}

function Specialization({ sections }: SectionsProps) {
  const data = sections.specialization
  if (!data) return null
  return (
    <GlassSection id="section-specialization" title="Specialization" icon={<Shield size={20} />}>
      <p className="mb-4 text-lg font-semibold text-white">{data.primary}</p>
      <div className="flex flex-wrap gap-2">
        {data.sub_specialties.map((item) => <Chip key={item} label={item} />)}
      </div>
    </GlassSection>
  )
}

function LocationCard({ loc }: { loc: LocationEntry }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 space-y-2">
      <p className="font-semibold text-white">{loc.name}</p>
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
      <>
        <span id="section-clinic_info" aria-hidden="true" />
        <GlassSection id="modern-clinic" title="Clinic" icon={<MapPin size={20} />} wide>
          <div className="grid gap-4 md:grid-cols-2">
            {sorted.map((loc) => <LocationCard key={loc.name} loc={loc} />)}
          </div>
        </GlassSection>
      </>
    )
  }
  const data = sections.clinicInfo
  if (!data) return null
  return (
    <>
      <span id="section-clinic_info" aria-hidden="true" />
      <GlassSection id="modern-clinic" title="Clinic" icon={<MapPin size={20} />} wide>
        <div className="grid gap-3 md:grid-cols-2">
          {data.address && <InfoRow icon={<MapPin size={18} />} text={data.address} />}
          {data.timings && <InfoRow icon={<Clock size={18} />} text={data.timings} />}
          {data.phone && <InfoLink icon={<Phone size={18} />} href={`tel:${data.phone}`} text={data.phone} />}
          {data.map_url && <InfoLink icon={<ExternalLink size={18} />} href={data.map_url} text="View on Map" />}
        </div>
      </GlassSection>
    </>
  )
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/5 p-4 text-slate-300">
      <span className="shrink-0 text-cyan-200">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function InfoLink({ icon, href, text }: { icon: ReactNode; href: string; text: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex gap-3 rounded-2xl bg-white/5 p-4 text-cyan-100 transition hover:bg-cyan-300/10">
      <span className="shrink-0">{icon}</span>
      <span>{text}</span>
    </a>
  )
}

function Gallery({ sections }: SectionsProps) {
  const images = getGalleryImages(sections.gallery)
  if (!images.length) return null
  return (
    <GlassSection id="section-gallery" title="Gallery" icon={<Images size={20} />} wide>
      <GalleryLightbox images={images} />
    </GlassSection>
  )
}

function Extras({ sections }: SectionsProps) {
  const achievements = getAchievementItems(sections.achievements)
  const socialLinks = getSocialLinks(sections.social)
  const hasExtras = achievements.length || hasItems(sections.languages?.spoken) || hasItems(sections.insurance?.panels) || socialLinks.length
  if (!hasExtras) return null
  return (
    <GlassSection id="section-languages" title="More" icon={<Award size={20} />} wide>
      <div className="grid gap-5 md:grid-cols-3">
        <MiniList title="Achievements" items={achievements} />
        <MiniList title="Languages" items={sections.languages?.spoken} />
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-slate-400">Connect</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-cyan-100">
                <Share2 size={13} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </GlassSection>
  )
}

function MiniList({ title, items }: { title: string; items?: string[] }) {
  if (!hasItems(items)) return null
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase text-slate-400">{title}</p>
      <ItemList items={items} />
    </div>
  )
}

export default function ModernSections({ sections, doctor }: ModernSectionsProps) {
  return (
    <main id="modern-sections" className="relative bg-gradient-to-b from-modern-ink via-modern-panel to-modern-ink px-0 py-10">
      <AnchorNav />
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-start lg:gap-12">
        <SidebarNav sections={sections} doctor={doctor} />
        <div className="flex-1 min-w-0 grid gap-5 lg:grid-cols-2">
          <About sections={sections} />
          <Services sections={sections} />
          <Experience sections={sections} />
          <Qualifications sections={sections} />
          <Specialization sections={sections} />
          <Clinic sections={sections} />
          <Gallery sections={sections} />
          <Extras sections={sections} />
        </div>
      </div>
    </main>
  )
}
