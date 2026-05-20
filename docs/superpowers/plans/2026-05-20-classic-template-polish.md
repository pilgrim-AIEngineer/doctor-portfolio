# Classic Template Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Classic portfolio template (the public `/dr/[slug]` page) with a photo-hero mobile layout, sticky section quick-jump nav, flat-elegant section cards, and refined CTA bar.

**Architecture:** Pure UI changes in `components/templates/classic/`. No data fetching changes. One new component (`SectionNav.tsx`) and one new helper in `shared.ts`. Tasks 1, 3, 4, 5 are independent and can run in parallel. Task 2 depends on Task 1. Task 6 depends on all others.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, lucide-react icons, next/image.

---

## Parallelization map

```
Task 1 (shared.ts)  ──→  Task 2 (SectionNav.tsx)  ──┐
Task 3 (Sections.tsx)  ─────────────────────────────→  Task 6 (index.tsx)  →  Task 7 (verify)
Task 4 (AppointmentCTA.tsx)  ───────────────────────→  ↑
Task 5 (Hero.tsx)  ─────────────────────────────────→  ↑
```

Tasks 1, 3, 4, 5 can start simultaneously. Task 2 starts after Task 1 completes. Task 6 starts only after Tasks 2, 3, 4, 5 all complete.

---

## Task 1: Add `getVisibleSectionIds` to `shared.ts`

**Files:**
- Modify: `components/templates/shared.ts`

- [ ] **Step 1: Open `components/templates/shared.ts` and append the new export at the end of the file (after the last function)**

The complete function to append:

```typescript
export function getVisibleSectionIds(sections: TemplateSections): string[] {
  const checks: [string, boolean][] = [
    ['section-personal',      !!sections.personal?.about],
    ['section-qualifications', !!(sections.qualifications?.degrees?.length || sections.qualifications?.fellowships?.length)],
    ['section-specialization', !!sections.specialization],
    ['section-experience',    !!sections.experience],
    ['section-services',      !!(sections.services?.treatments?.length || sections.services?.procedures?.length)],
    ['section-clinic_info',   !!(sections.locations?.locations?.length || sections.clinicInfo)],
    ['section-achievements',  !!(sections.achievements?.awards?.length || sections.achievements?.recognitions?.length)],
    ['section-gallery',       !!sections.gallery?.images?.length],
    ['section-languages',     !!(sections.languages?.spoken?.length || sections.insurance?.panels?.length || getSocialLinks(sections.social).length)],
  ]
  return checks.filter(([, hasContent]) => hasContent).map(([id]) => id)
}
```

- [ ] **Step 2: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors related to `getVisibleSectionIds`. If you see `getSocialLinks is not defined`, ensure the function is placed after `getSocialLinks` in the file (it already exists at line ~117 in the current file).

- [ ] **Step 3: Commit**

```bash
git add components/templates/shared.ts
git commit -m "feat: add getVisibleSectionIds helper to shared template utils"
```

---

## Task 2: Create `SectionNav.tsx` (depends on Task 1)

**Files:**
- Create: `components/templates/classic/SectionNav.tsx`

- [ ] **Step 1: Create the file with this exact content**

```typescript
// Classic template sticky section navigation — horizontal scroll chips with active-section tracking
'use client'

import { useEffect, useRef, useState } from 'react'

const SECTION_LABELS: Record<string, string> = {
  'section-personal':       'About',
  'section-qualifications': 'Quals',
  'section-specialization': 'Specialty',
  'section-experience':     'Experience',
  'section-services':       'Services',
  'section-clinic_info':    'Clinic',
  'section-achievements':   'Awards',
  'section-gallery':        'Gallery',
  'section-languages':      'More',
}

interface SectionNavProps {
  sectionIds: string[]
}

export default function SectionNav({ sectionIds }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    if (!sectionIds.length) return

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })

    return () => observers.forEach((obs) => obs?.disconnect())
  }, [sectionIds])

  // Auto-scroll the active chip into view within the strip
  useEffect(() => {
    chipRefs.current.get(activeId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeId])

  if (!sectionIds.length) return null

  function handleChipClick(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const navHeight = 48
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 [&::-webkit-scrollbar]:hidden">
        {sectionIds.map((id) => (
          <button
            key={id}
            ref={(el) => {
              if (el) chipRefs.current.set(id, el)
              else chipRefs.current.delete(id)
            }}
            onClick={() => handleChipClick(id)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeId === id
                ? 'bg-brand-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {SECTION_LABELS[id] ?? id}
          </button>
        ))}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors. If you see `Cannot find module 'react'`, ensure `"use client"` is at the top and the project has react types installed.

- [ ] **Step 3: Commit**

```bash
git add components/templates/classic/SectionNav.tsx
git commit -m "feat: add SectionNav sticky quick-jump component to classic template"
```

---

## Task 3: Restyle section cards in `Sections.tsx`

**Files:**
- Modify: `components/templates/classic/Sections.tsx`

This task makes 5 targeted changes to existing components in the file. Read the current file first to confirm the exact strings before replacing.

- [ ] **Step 1: Update `SectionBand` — card container classes and title row**

Find this block in `SectionBand` (around line 48):
```typescript
    <div className="rounded-[1.75rem] border border-clinical-line bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-clinical md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-clinical-soft text-brand-700">
          {icon}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-clinical-ink">{title}</h2>
      </div>
```

Replace with:
```typescript
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </span>
        <h2 className="text-base font-bold tracking-tight text-gray-900">{title}</h2>
      </div>
```

- [ ] **Step 2: Update `Pill` component**

Find (around line 63):
```typescript
    <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700">
```

Replace with:
```typescript
    <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
```

- [ ] **Step 3: Update `ListItems` component**

Find (around line 74):
```typescript
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accent}`} />
          <span className="leading-7">{item}</span>
```

Replace with:
```typescript
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent}`} />
          <span className="leading-6 text-gray-600">{item}</span>
```

Also update the default accent in the `ListItems` signature from `bg-brand-500` to `bg-gray-400`:
```typescript
function ListItems({ items, accent = 'bg-gray-400' }: { items?: string[]; accent?: string }) {
```

- [ ] **Step 4: Update `InfoRow` and `InfoLink` — replace `bg-clinical-soft` with `bg-gray-50`**

Find `InfoRow` (around line 208):
```typescript
    <div className="flex gap-3 rounded-2xl bg-clinical-soft p-4">
```
Replace with:
```typescript
    <div className="flex gap-3 rounded-xl bg-gray-50 p-3.5">
```

Find `InfoLink` (around line 217):
```typescript
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex gap-3 rounded-2xl bg-clinical-soft p-4 text-brand-700 transition hover:bg-brand-50">
```
Replace with:
```typescript
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex gap-3 rounded-xl bg-gray-50 p-3.5 text-brand-700 transition hover:bg-brand-100">
```

- [ ] **Step 5: Fix remaining `text-clinical-ink` usages in `Specialization` and `Experience`**

In `Specialization` component, find:
```typescript
      <p className="mb-4 text-lg font-semibold text-clinical-ink">{data.primary}</p>
```
Replace with:
```typescript
      <p className="mb-4 text-base font-bold text-gray-900">{data.primary}</p>
```

In `Experience` component, find:
```typescript
        <p className="mb-4 font-semibold text-clinical-ink">{data.current_affiliation}</p>
```
Replace with:
```typescript
        <p className="mb-4 font-semibold text-gray-800">{data.current_affiliation}</p>
```

- [ ] **Step 6: Fix `bg-clinical-soft` in `Services` group cards**

Find (around line 157):
```typescript
          <div key={group.title} className="rounded-2xl bg-clinical-soft p-5">
```
Replace with:
```typescript
          <div key={group.title} className="rounded-2xl bg-gray-50 p-5">
```

- [ ] **Step 7: Fix `LocationCard` component — three token replacements**

Find:
```typescript
    <div className="rounded-2xl border border-clinical-line bg-clinical-soft p-4 space-y-2">
      <p className="font-semibold text-clinical-ink">{loc.name}</p>
```
Replace with:
```typescript
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
      <p className="font-semibold text-gray-900">{loc.name}</p>
```

- [ ] **Step 9: Update `Experience` section — stat display box**

Find (around line 130):
```typescript
        <div className="mb-5 inline-flex items-end gap-3 rounded-2xl bg-clinical-soft px-5 py-4">
          <span className="text-5xl font-semibold text-brand-700">{years}</span>
          <span className="pb-1 text-sm font-semibold uppercase text-gray-500">years</span>
        </div>
```

Replace with:
```typescript
        <div className="mb-5 inline-flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <span className="text-4xl font-bold text-brand-700">{years}</span>
          <span className="pb-1 text-xs font-bold uppercase tracking-wide text-gray-500">years exp.</span>
        </div>
```

- [ ] **Step 10: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 11: Commit**

```bash
git add components/templates/classic/Sections.tsx
git commit -m "feat: restyle classic template section cards to flat-elegant design"
```

---

## Task 4: Polish `AppointmentCTA.tsx`

**Files:**
- Modify: `components/templates/classic/AppointmentCTA.tsx`

- [ ] **Step 1: Update the mobile fixed bottom bar**

Find (around line 27):
```typescript
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-clinical-line bg-white/95 px-4 py-3 shadow-clinical backdrop-blur md:hidden">
        <div className="flex gap-2">
          <a
            href={contact.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-sm font-semibold text-white"
          >
            <Phone size={16} />
            WhatsApp
          </a>
          {contact.formEnabled && (
            <a
              href="#classic-book-form"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-700 py-3 text-sm font-semibold text-white"
            >
              <CalendarDays size={16} />
              Book
            </a>
          )}
        </div>
      </div>
```

Replace with:
```typescript
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/98 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] backdrop-blur-sm md:hidden">
        <div className="flex gap-2.5">
          <a
            href={contact.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white"
          >
            <Phone size={16} />
            WhatsApp
          </a>
          {contact.formEnabled && (
            <a
              href="#classic-book-form"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 py-3.5 text-sm font-bold text-white"
            >
              <CalendarDays size={16} />
              Book
            </a>
          )}
        </div>
      </div>
```

- [ ] **Step 2: Update the desktop `BookingPanel` container**

Find (around line 69):
```typescript
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-clinical-line bg-clinical-mist p-6 shadow-clinical md:grid md:grid-cols-[0.8fr_1fr] md:gap-8 md:p-8">
```

Replace with:
```typescript
    <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid md:grid-cols-[0.8fr_1fr] md:gap-8 md:p-8">
```

- [ ] **Step 3: Update the "Appointment" label and heading in `BookingPanel`**

Find (around line 71):
```typescript
        <p className="text-sm font-semibold uppercase text-brand-700">Appointment</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-clinical-ink">
```

Replace with:
```typescript
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Appointment</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
```

- [ ] **Step 4: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add components/templates/classic/AppointmentCTA.tsx
git commit -m "feat: polish classic template CTA bar and desktop booking panel"
```

---

## Task 5: Restructure `Hero.tsx` — photo-hero mobile + refined desktop

**Files:**
- Modify: `components/templates/classic/Hero.tsx`

This is the largest change. The entire file is replaced. Read the current file first to confirm imports, then replace with the complete implementation below.

- [ ] **Step 1: Replace the entire file content**

```typescript
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
```

- [ ] **Step 2: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors. If you see an error on `fees as FeesSection`, verify that `FeesSection` is imported from `@/types/Profile` (the import is in the file above). If you see errors about `sections.locations`, verify `TemplateSections` has `locations?: LocationsSection` — it does, confirmed in `components/templates/shared.ts`.

- [ ] **Step 3: Commit**

```bash
git add components/templates/classic/Hero.tsx
git commit -m "feat: redesign classic template hero with photo-banner mobile layout"
```

---

## Task 6: Wire `SectionNav` in `index.tsx` (depends on Tasks 1, 2, 3, 4, 5)

**Files:**
- Modify: `components/templates/classic/index.tsx`

- [ ] **Step 1: Replace the entire file content**

```typescript
// Classic template - clinical editorial portfolio layout
import type { DoctorProfile } from '@/types/DoctorProfile'
import { getTemplateSections, getVisibleSectionIds } from '@/components/templates/shared'
import ClassicHero from './Hero'
import ClassicSections from './Sections'
import AppointmentCTA from './AppointmentCTA'
import SectionNav from './SectionNav'

interface ClassicTemplateProps {
  profile: DoctorProfile
}

export default function ClassicTemplate({ profile }: ClassicTemplateProps) {
  const { doctor, sections } = profile
  const templateSections = getTemplateSections(sections)
  const sectionIds = getVisibleSectionIds(templateSections)

  return (
    <div className="min-h-screen bg-clinical-mist text-gray-900 pb-24 md:pb-0">
      <ClassicHero doctor={doctor} sections={templateSections} />
      <SectionNav sectionIds={sectionIds} />
      <ClassicSections sections={templateSections} />
      <AppointmentCTA appointment={templateSections.appointment} doctor={doctor} fees={templateSections.fees} />
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors. Verify `getVisibleSectionIds` is importable (Task 1 must be done). Verify `SectionNav` is importable (Task 2 must be done).

- [ ] **Step 3: Commit**

```bash
git add components/templates/classic/index.tsx
git commit -m "feat: wire SectionNav into classic template layout"
```

---

## Task 7: Final TypeScript verification

**Files:** (read-only verification, no edits)

- [ ] **Step 1: Full TypeScript check across the project**

```powershell
npx tsc --noEmit
```

Expected: zero errors. If errors appear, they will be in the 6 files modified in this plan — fix them before proceeding.

- [ ] **Step 2: Check for accidental `console.log` statements**

```powershell
Select-String -Path "components/templates/classic/*.tsx" -Pattern "console\.log"
```

Expected: no matches.

- [ ] **Step 3: Verify no `any` types were introduced**

```powershell
Select-String -Path "components/templates/classic/*.tsx" -Pattern ": any"
```

Expected: no matches (the `fees as FeesSection` cast in Hero.tsx uses a named type, not `any`).

- [ ] **Step 4: Commit verification result**

```bash
git commit --allow-empty -m "chore: verify classic template polish — tsc clean, no console.log, no any types"
```

---

## Visual verification checklist (manual, after all tasks complete)

Start the dev server:
```powershell
npm run dev
```

Navigate to `http://localhost:3000/dr/[any-published-slug]` and verify:

**Mobile (375px — use browser DevTools device emulation):**
- [ ] Photo banner appears at top, fills full width at 4:3 ratio
- [ ] Initials circle appears if no photo, centered in gradient bg
- [ ] NMC Verified badge overlays bottom-right of banner (if doctor is verified)
- [ ] Name, affiliation, location appear below banner
- [ ] Stat chips (years, fee) appear only when data exists
- [ ] Tagline shows with left blue border if present
- [ ] WhatsApp and Book buttons fill the full grid width
- [ ] Section nav strip appears below hero on scroll, sticks at top
- [ ] Active chip highlights as you scroll through sections
- [ ] Section cards have thin gray border and hairline title divider
- [ ] Sticky bottom bar has richer green and correct safe-area padding on iOS
- [ ] No horizontal scroll at 375px

**Desktop (1280px):**
- [ ] 2-column hero grid preserved (text left, photo card right)
- [ ] Section nav appears below hero and sticks correctly
- [ ] Section cards look clean with flat-elegant style
- [ ] Booking panel at bottom uses white background, clean border
