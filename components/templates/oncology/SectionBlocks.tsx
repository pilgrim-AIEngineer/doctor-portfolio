// Oncology section blocks - dark glass cards, luminous lists, and premium footer
import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { hasItems, type TemplateSections } from '@/components/templates/shared'

export function SectionCard({ id, title, icon, children, wide = false, tone = 'glass' }: {
  id?: string
  title: string
  icon: ReactNode
  children: ReactNode
  wide?: boolean
  tone?: 'glass' | 'light'
}) {
  const isLight = tone === 'light'

  return (
    <section id={id} className={wide ? 'md:col-span-2' : undefined}>
      <div className={`h-full rounded-[2rem] border p-6 shadow-oncology md:p-8 ${
        isLight
          ? 'border-oncology-teal/20 bg-white text-clinical-ink'
          : 'border-white/10 bg-white/[0.07] text-white backdrop-blur-xl'
      }`}>
        <div className="mb-6 flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isLight ? 'bg-oncology-midnight text-oncology-gold' : 'bg-oncology-teal/10 text-oncology-aura'
          }`}>
            {icon}
          </span>
          <h2 className={`text-2xl font-semibold tracking-tight ${isLight ? 'text-clinical-ink' : 'text-white'}`}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}

export function TreatmentFooter({ sections }: { sections: TemplateSections }) {
  const items = [
    ...(sections.services?.treatments ?? []),
    ...(sections.services?.procedures ?? []),
    ...(sections.specialization?.sub_specialties ?? []),
  ]
  if (!items.length) return null

  return (
    <footer className="relative overflow-hidden bg-oncology-midnight px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,theme(colors.oncology.teal/0.18),transparent_30%),radial-gradient(circle_at_90%_70%,theme(colors.oncology.gold/0.16),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase text-oncology-gold">
          <Sparkles size={16} />
          Oncology care areas
        </p>
        <div className="flex flex-wrap gap-2.5">
          {items.map((item) => (
            <a key={item} href="#oncology-treatments" className="rounded-full border border-oncology-teal/25 bg-oncology-teal/10 px-4 py-2 text-sm font-semibold text-oncology-aura transition hover:bg-oncology-teal/20">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export function PillList({ items, dark = true }: { items?: string[]; dark?: boolean }) {
  if (!hasItems(items)) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
          dark
            ? 'border-oncology-teal/25 bg-oncology-teal/10 text-oncology-aura'
            : 'border-brand-100 bg-brand-50 text-brand-800'
        }`}>
          {item}
        </span>
      ))}
    </div>
  )
}

export function PillGroup({ title, items }: { title: string; items?: string[] }) {
  if (!hasItems(items)) return null
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase text-oncology-gold">{title}</p>
      <PillList items={items} />
    </div>
  )
}

export function TextList({ title, items, iconClass = 'bg-oncology-teal' }: {
  title: string
  items?: string[]
  iconClass?: string
}) {
  if (!hasItems(items)) return null
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase text-oncology-gold">{title}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-slate-200">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${iconClass}`} />
            <span className="leading-7">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-slate-200">
      <span className="shrink-0 text-oncology-aura">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

export function InfoLink({ icon, href, text }: { icon: ReactNode; href: string; text: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex gap-3 rounded-2xl border border-oncology-teal/20 bg-oncology-teal/10 p-4 text-oncology-aura transition hover:bg-oncology-teal/20">
      <span className="shrink-0">{icon}</span>
      <span>{text}</span>
    </a>
  )
}
