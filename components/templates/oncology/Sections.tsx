// Oncology template sections - treatment taxonomy, trust signals, and clinic details
import {
  BookOpen,
  Clock,
  ExternalLink,
  GraduationCap,
  Images,
  Languages,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import type { Doctor } from '@/types/Doctor'
import type { LocationEntry } from '@/types/Profile'
import GalleryLightbox from '@/components/templates/classic/GalleryLightbox'
import {
  computeExperienceYears,
  getAchievementItems,
  getGalleryImages,
  getQualificationItems,
  getSocialLinks,
  hasItems,
  type TemplateSections,
} from '@/components/templates/shared'
import {
  InfoLink,
  InfoRow,
  PillGroup,
  PillList,
  SectionCard,
  TextList,
  TreatmentFooter,
} from './SectionBlocks'

interface SectionsProps {
  doctor: Doctor
  sections: TemplateSections
}

const NAV_ITEMS = [
  { href: '#oncology-treatments', label: 'Treatments' },
  { href: '#oncology-about', label: 'Doctor' },
  { href: '#oncology-clinic', label: 'Clinic' },
  { href: '#oncology-booking', label: 'Appointment' },
] as const

export default function OncologySections({ doctor, sections }: SectionsProps) {
  return (
    <main className="relative overflow-hidden bg-oncology-midnight">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,theme(colors.oncology.teal/0.14),transparent_28%),radial-gradient(circle_at_88%_44%,theme(colors.brand.700/0.18),transparent_34%)]" />
      <AnchorNav />
      <div className="relative">
        <TrustBand doctor={doctor} sections={sections} />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-2 md:py-16">
        <Treatments sections={sections} />
        <DoctorStory sections={sections} />
        <Credentials sections={sections} />
        <Clinic sections={sections} />
        <Testimonials sections={sections} />
        <Research sections={sections} />
        <Gallery sections={sections} />
        <MoreInfo sections={sections} />
      </div>
      <TreatmentFooter sections={sections} />
    </main>
  )
}

function AnchorNav() {
  return (
    <nav className="sticky top-0 z-30 border-y border-white/10 bg-oncology-midnight/85 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl justify-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-glass">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-oncology-teal/10 hover:text-oncology-aura">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

function TrustBand({ doctor, sections }: SectionsProps) {
  const { experience, languages, clinicInfo } = sections
  const expYears = computeExperienceYears(experience)
  const items = [
    expYears > 0 ? { label: 'Experience', value: `${expYears}+ years`, icon: <Stethoscope size={18} /> } : null,
    experience?.current_affiliation ? { label: 'Affiliation', value: experience.current_affiliation, icon: <MapPin size={18} /> } : null,
    doctor.is_verified ? { label: 'Registration', value: 'NMC verified', icon: <ShieldCheck size={18} /> } : null,
    hasItems(languages?.spoken) ? { label: 'Languages', value: languages.spoken.join(', '), icon: <Languages size={18} /> } : null,
    clinicInfo?.timings ? { label: 'Clinic hours', value: clinicInfo.timings, icon: <Clock size={18} /> } : null,
  ].filter((item): item is { label: string; value: string; icon: JSX.Element } => Boolean(item))

  if (!items.length) return null

  return (
    <section className="border-y border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {items.map((item) => (
          <div key={item.label} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.045] px-5 py-5 shadow-glass">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-oncology-teal/70 to-transparent" />
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-oncology-teal/25 bg-oncology-teal/10 text-oncology-aura transition group-hover:bg-oncology-teal/20">
                {item.icon}
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-oncology-gold">{item.label}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-white">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Treatments({ sections }: Pick<SectionsProps, 'sections'>) {
  const groups = [
    { title: 'Cancer treatments', items: sections.services?.treatments },
    { title: 'Advanced procedures', items: sections.services?.procedures },
    { title: 'Special focus areas', items: sections.specialization?.sub_specialties },
  ].filter((group) => hasItems(group.items))
  if (!groups.length) return null

  return (
    <SectionCard id="oncology-treatments" title="Cancer Treatments" icon={<Stethoscope size={20} />} wide>
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="relative overflow-hidden rounded-3xl border border-oncology-teal/20 bg-gradient-to-br from-oncology-teal/10 to-white/[0.04] p-5 shadow-oncology">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-oncology-aura/20" />
            <p className="relative mb-4 text-xs font-bold uppercase text-oncology-gold">{group.title}</p>
            <PillList items={group.items} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function DoctorStory({ sections }: Pick<SectionsProps, 'sections'>) {
  if (!sections.personal?.about) return null
  return (
    <SectionCard id="oncology-about" title="Doctor Story" icon={<UserRound size={20} />} wide tone="light">
      <p className="max-w-4xl whitespace-pre-line text-lg leading-8 text-gray-700">
        {sections.personal.about}
      </p>
    </SectionCard>
  )
}

function Credentials({ sections }: Pick<SectionsProps, 'sections'>) {
  const achievements = getAchievementItems(sections.achievements)
  const hasContent =
    (sections.qualifications?.degrees?.length ?? 0) > 0 ||
    (sections.qualifications?.fellowships?.length ?? 0) > 0 ||
    achievements.length > 0
  if (!hasContent) return null
  const degrees = getQualificationItems(sections.qualifications?.degrees ?? [])
  const fellowships = getQualificationItems(sections.qualifications?.fellowships ?? [])

  return (
    <SectionCard title="Credentials" icon={<GraduationCap size={20} />}>
      <div className="space-y-6">
        <TextList title="Degrees" items={degrees} />
        <TextList title="Fellowships" items={fellowships} />
        <TextList title="Awards" items={achievements} iconClass="bg-oncology-gold" />
      </div>
    </SectionCard>
  )
}

function LocationCard({ loc }: { loc: LocationEntry }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 space-y-2">
      <p className="font-semibold text-oncology-gold">{loc.name}</p>
      <InfoRow icon={<MapPin size={18} />} text={loc.address} />
      <InfoRow icon={<Clock size={18} />} text={loc.timings} />
      <InfoLink icon={<Phone size={18} />} href={`tel:${loc.phone}`} text={loc.phone} />
      {loc.map_url && <InfoLink icon={<ExternalLink size={18} />} href={loc.map_url} text="Get Directions" />}
    </div>
  )
}

function Clinic({ sections }: Pick<SectionsProps, 'sections'>) {
  const locationEntries = sections.locations?.locations
  if (locationEntries && locationEntries.length > 0) {
    const sorted = [...locationEntries].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    return (
      <SectionCard id="oncology-clinic" title="Clinic Access" icon={<MapPin size={20} />}>
        <div className="space-y-4">
          {sorted.map((loc) => <LocationCard key={loc.name} loc={loc} />)}
        </div>
      </SectionCard>
    )
  }
  const data = sections.clinicInfo
  if (!data) return null

  return (
    <SectionCard id="oncology-clinic" title="Clinic Access" icon={<MapPin size={20} />}>
      <div className="space-y-3 text-gray-700">
        {data.address && <InfoRow icon={<MapPin size={18} />} text={data.address} />}
        {data.timings && <InfoRow icon={<Clock size={18} />} text={data.timings} />}
        {data.phone && <InfoLink icon={<Phone size={18} />} href={`tel:${data.phone}`} text={data.phone} />}
        {data.map_url && <InfoLink icon={<ExternalLink size={18} />} href={data.map_url} text="Open clinic map" />}
      </div>
    </SectionCard>
  )
}

function Testimonials({ sections }: Pick<SectionsProps, 'sections'>) {
  if (!hasItems(sections.testimonials?.reviews)) return null
  return (
    <SectionCard title="Patient Feedback" icon={<ShieldCheck size={20} />} wide>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.testimonials.reviews.map((review) => (
          <blockquote key={review} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-slate-200">
            <p className="leading-7">{review}</p>
          </blockquote>
        ))}
      </div>
    </SectionCard>
  )
}

function Research({ sections }: Pick<SectionsProps, 'sections'>) {
  const hasContent = hasItems(sections.research?.publications) || hasItems(sections.research?.conferences)
  if (!hasContent) return null
  return (
    <SectionCard title="Research and Insights" icon={<BookOpen size={20} />} wide>
      <div className="grid gap-6 md:grid-cols-2">
        <TextList title="Publications" items={sections.research?.publications} />
        <TextList title="Conferences" items={sections.research?.conferences} />
      </div>
    </SectionCard>
  )
}

function Gallery({ sections }: Pick<SectionsProps, 'sections'>) {
  const images = getGalleryImages(sections.gallery)
  if (!images.length) return null
  return (
    <SectionCard title="Clinic Gallery" icon={<Images size={20} />} wide>
      <GalleryLightbox images={images} />
    </SectionCard>
  )
}

function MoreInfo({ sections }: Pick<SectionsProps, 'sections'>) {
  const socialLinks = getSocialLinks(sections.social)
  const hasContent = hasItems(sections.insurance?.panels) || hasItems(sections.languages?.spoken) || socialLinks.length
  if (!hasContent) return null

  return (
    <SectionCard title="More Information" icon={<Languages size={20} />} wide>
      <div className="grid gap-5 md:grid-cols-3">
        <PillGroup title="Languages" items={sections.languages?.spoken} />
        <PillGroup title="Insurance" items={sections.insurance?.panels} />
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-gray-500">Connect</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-oncology-teal/25 bg-oncology-teal/10 px-3.5 py-1.5 text-sm font-semibold text-oncology-aura">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
