# Doctor UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real dashboard home page with portfolio link sharing + QR code, and polish all 4 portfolio templates to look great with minimal data and render correctly on mobile.

**Architecture:** The dashboard home replaces the current redirect at `app/(dashboard)/dashboard/page.tsx` with a server component that fetches doctor + profiles data and renders three client/server sub-components. Template heroes get an initials avatar fallback, always-visible trust signals, and corrected mobile text sizes — all sharing a single `getInitials` helper added to `components/templates/shared.ts`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Supabase, `react-qr-code` (new, ~5kb)

---

## File Map

### New files
| File | Role |
|---|---|
| `components/dashboard/PortfolioStatusCard.tsx` | Client component — URL display, copy button, QR code, publish badge |
| `components/dashboard/StatsRow.tsx` | Server component — 4 stat placeholder cards |
| `components/dashboard/DashboardHome.tsx` | Server component — assembles all three home blocks |

### Modified files
| File | Change |
|---|---|
| `app/(dashboard)/dashboard/page.tsx` | Replace redirect with data-fetching server component |
| `components/templates/shared.ts` | Add `getInitials(name)` helper |
| `components/templates/classic/Hero.tsx` | Initials avatar, specialty chip, NMC always-visible |
| `components/templates/modern/Hero.tsx` | Initials avatar, mobile h1 size, NMC unverified state |
| `components/templates/bold/Hero.tsx` | Initials avatar, mobile h1 size, NMC unverified state |
| `components/templates/oncology/Hero.tsx` | Initials avatar, mobile h1 size, remove mobile min-height |

---

## Task 1: Install react-qr-code

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install the package**

```bash
npm install react-qr-code
```

Expected output: `added 1 package` (or similar — it has zero runtime deps).

- [ ] **Step 2: Verify TypeScript can find the types**

```bash
npx tsc --noEmit
```

Expected: zero errors (the package ships its own types).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-qr-code for portfolio QR generation"
```

---

## Task 2: Add `getInitials` to shared template helpers

**Files:**
- Modify: `components/templates/shared.ts`

- [ ] **Step 1: Add the helper function**

Open `components/templates/shared.ts`. After the last `export function` (after `getQualificationItems`), add:

```typescript
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'DR'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/templates/shared.ts
git commit -m "feat: add getInitials helper to template shared utilities"
```

---

## Task 3: Classic Hero — initials avatar + specialty chip + NMC trust signal

**Files:**
- Modify: `components/templates/classic/Hero.tsx`

- [ ] **Step 1: Update the import lines**

Replace the existing lucide import line:

```typescript
import { CalendarDays, MapPin, Phone, ShieldCheck } from 'lucide-react'
```

With:

```typescript
import { CalendarDays, MapPin, Phone, ShieldCheck, Stethoscope } from 'lucide-react'
```

Add `getInitials` to the shared import line:

```typescript
import { computeExperienceYears, getContactLinks, getInitials, type TemplateSections } from '@/components/templates/shared'
```

- [ ] **Step 2: Replace the badges row (specialty chip + NMC trust signal)**

Find this block (lines ~21–33):

```tsx
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
```

Replace with:

```tsx
<div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-600">
  <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 font-semibold text-brand-700">
    <Stethoscope size={15} />
    {doctor.specialty}
  </span>
  {doctor.is_verified ? (
    <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 font-semibold text-green-700">
      <ShieldCheck size={15} />
      NMC Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-medium text-gray-600">
      NMC: {doctor.nmc_number}
    </span>
  )}
  {clinicInfo?.address && (
    <span className="inline-flex items-center gap-2">
      <MapPin size={15} className="text-brand-600" />
      {clinicInfo.address}
    </span>
  )}
</div>
```

- [ ] **Step 3: Replace the photo fallback with initials avatar**

Find the `else` branch of the photo conditional (lines ~79–83):

```tsx
) : (
  <div className="flex h-full items-center justify-center text-6xl font-semibold text-brand-200">
    Dr
  </div>
)}
```

Replace with:

```tsx
) : (
  <div className="flex h-full items-center justify-center bg-brand-50">
    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-600 text-4xl font-bold text-white">
      {getInitials(doctor.name)}
    </div>
  </div>
)}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 5: Visual check**

Start dev server (`npm run dev`). Open a portfolio page that uses Classic template at `/dr/[any-slug]`. Confirm:
- Specialty chip appears in the badges row above the doctor's name
- NMC number shown as a chip when `is_verified = false`; green "NMC Verified" badge when `is_verified = true`
- When no photo: two-letter initials appear in a branded circle, not "Dr" text

- [ ] **Step 6: Commit**

```bash
git add components/templates/classic/Hero.tsx
git commit -m "feat: classic hero — initials avatar, specialty chip, always-visible NMC trust signal"
```

---

## Task 4: Modern Hero — initials avatar + mobile h1 size + NMC unverified state

**Files:**
- Modify: `components/templates/modern/Hero.tsx`

- [ ] **Step 1: Add getInitials to the import**

Find:

```typescript
import {
  computeExperienceYears,
  getContactLinks,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'
```

Replace with:

```typescript
import {
  computeExperienceYears,
  getContactLinks,
  getInitials,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'
```

- [ ] **Step 2: Fix the h1 mobile text size**

Find:

```tsx
<h1 className="max-w-3xl text-5xl font-semibold leading-none tracking-tight md:text-7xl">
```

Replace with:

```tsx
<h1 className="max-w-3xl text-3xl font-semibold leading-none tracking-tight sm:text-5xl md:text-7xl">
```

- [ ] **Step 3: Add NMC unverified state to the badges row**

Find:

```tsx
<div className="mb-7 flex flex-wrap items-center gap-3 text-sm text-slate-300">
  {doctor.is_verified && (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1 font-semibold text-cyan-100 backdrop-blur">
      <ShieldCheck size={15} />
      NMC Verified
    </span>
  )}
  <span className="inline-flex items-center gap-2 text-cyan-100">
    <Sparkles size={15} />
    {doctor.specialty}
  </span>
</div>
```

Replace with:

```tsx
<div className="mb-7 flex flex-wrap items-center gap-3 text-sm text-slate-300">
  {doctor.is_verified ? (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1 font-semibold text-cyan-100 backdrop-blur">
      <ShieldCheck size={15} />
      NMC Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-medium text-slate-300 backdrop-blur">
      NMC: {doctor.nmc_number}
    </span>
  )}
  <span className="inline-flex items-center gap-2 text-cyan-100">
    <Sparkles size={15} />
    {doctor.specialty}
  </span>
</div>
```

- [ ] **Step 4: Replace the photo fallback with initials avatar**

Find:

```tsx
) : (
  <div className="flex h-full items-center justify-center text-7xl font-semibold text-white/20">
    Dr
  </div>
)}
```

Replace with:

```tsx
) : (
  <div className="flex h-full items-center justify-center">
    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 text-4xl font-bold text-white">
      {getInitials(doctor.name)}
    </div>
  </div>
)}
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 6: Visual check at 375px viewport**

In browser DevTools, set viewport to 375px wide. Open a portfolio using the Modern template. Confirm:
- H1 name does not overflow or wrap excessively
- Specialty and NMC chips are visible
- No horizontal scrollbar

- [ ] **Step 7: Commit**

```bash
git add components/templates/modern/Hero.tsx
git commit -m "feat: modern hero — initials avatar, mobile h1 size, NMC unverified state"
```

---

## Task 5: Bold Hero — initials avatar + mobile h1 size + NMC unverified state

**Files:**
- Modify: `components/templates/bold/Hero.tsx`

- [ ] **Step 1: Add getInitials to the import**

Find:

```typescript
import { getContactLinks, type TemplateSections } from '@/components/templates/shared'
```

Replace with:

```typescript
import { getContactLinks, getInitials, type TemplateSections } from '@/components/templates/shared'
```

- [ ] **Step 2: Fix the h1 mobile text size**

Find:

```tsx
<h1 className="font-serif text-5xl font-bold leading-none tracking-tight text-white md:text-7xl">
```

Replace with:

```tsx
<h1 className="font-serif text-3xl font-bold leading-none tracking-tight text-white sm:text-5xl md:text-7xl">
```

- [ ] **Step 3: Add NMC unverified state + always-visible specialty chip**

Find:

```tsx
{doctor.is_verified && (
  <span className="mb-7 inline-flex w-fit items-center gap-2 border-y border-gold-300/40 py-2 text-sm font-semibold text-gold-300">
    <ShieldCheck size={16} />
    NMC Verified
  </span>
)}
```

Replace with:

```tsx
<div className="mb-7 flex flex-wrap items-center gap-3">
  <span className="inline-flex items-center gap-2 border-y border-gold-300/40 py-2 text-sm font-semibold text-gold-300">
    {doctor.specialty}
  </span>
  {doctor.is_verified ? (
    <span className="inline-flex items-center gap-2 border-y border-gold-300/40 py-2 text-sm font-semibold text-gold-300">
      <ShieldCheck size={16} />
      NMC Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 border-y border-gold-300/20 py-2 text-sm font-medium text-gray-400">
      NMC: {doctor.nmc_number}
    </span>
  )}
</div>
```

- [ ] **Step 4: Replace the photo fallback with initials avatar**

Find:

```tsx
) : (
  <div className="flex h-full items-center justify-center font-serif text-7xl text-gold-300/30">
    Dr
  </div>
)}
```

Replace with:

```tsx
) : (
  <div className="flex h-full items-center justify-center">
    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-gold-300/40 bg-gold-300/10 font-serif text-4xl font-bold text-gold-300">
      {getInitials(doctor.name)}
    </div>
  </div>
)}
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 6: Visual check at 375px viewport**

Set DevTools to 375px. Open a Bold template portfolio. Confirm h1 does not overflow, trust signals are visible, initials avatar is centered in the photo frame.

- [ ] **Step 7: Commit**

```bash
git add components/templates/bold/Hero.tsx
git commit -m "feat: bold hero — initials avatar, mobile h1 size, specialty chip, NMC unverified state"
```

---

## Task 6: Oncology Hero — initials avatar + mobile text + remove fixed min-height

**Files:**
- Modify: `components/templates/oncology/Hero.tsx`

- [ ] **Step 1: Add getInitials to the import**

Find:

```typescript
import {
  computeExperienceYears,
  getContactLinks,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'
```

Replace with:

```typescript
import {
  computeExperienceYears,
  getContactLinks,
  getInitials,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'
```

- [ ] **Step 2: Fix the h1 mobile text size**

Find:

```tsx
<h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
```

Replace with:

```tsx
<h1 className="max-w-3xl text-3xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-7xl">
```

- [ ] **Step 3: Fix the tagline mobile text size**

Find:

```tsx
<p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">
```

Replace with:

```tsx
<p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-xl sm:leading-8">
```

- [ ] **Step 4: Remove the fixed min-height that breaks mobile viewports**

Find:

```tsx
<section id="section-personal" className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
```

Replace with:

```tsx
<section id="section-personal" className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:min-h-[660px] md:py-16">
```

- [ ] **Step 5: Replace the photo fallback with initials avatar**

Find:

```tsx
) : (
  <div className="flex h-full items-center justify-center text-7xl font-semibold text-oncology-aura/30">
    Dr
  </div>
)}
```

Replace with:

```tsx
) : (
  <div className="flex h-full items-center justify-center">
    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-oncology-aura/30 bg-oncology-teal/10 text-4xl font-semibold text-oncology-aura">
      {getInitials(doctor.name)}
    </div>
  </div>
)}
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 7: Visual check at 375px viewport**

Set DevTools to 375px. Open an Oncology template portfolio. Confirm:
- Page does not have excessive blank space on short mobile screens
- H1 is readable and contained within the viewport width
- Initials avatar visible in the photo frame

- [ ] **Step 8: Commit**

```bash
git add components/templates/oncology/Hero.tsx
git commit -m "feat: oncology hero — initials avatar, mobile text sizes, remove fixed min-height"
```

---

## Task 7: PortfolioStatusCard component

**Files:**
- Create: `components/dashboard/PortfolioStatusCard.tsx`

- [ ] **Step 1: Create the file**

Create `components/dashboard/PortfolioStatusCard.tsx` with this content:

```tsx
// Portfolio status card — shows live URL, copy button, QR code, and publish status
'use client'

import { useState } from 'react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Copy, Check, ExternalLink } from 'lucide-react'

interface Props {
  isPublished: boolean
  portfolioUrl: string
  slug: string
}

export default function PortfolioStatusCard({ isPublished, portfolioUrl, slug }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPublished ? 'bg-green-500' : 'bg-amber-500'
                }`}
              />
              {isPublished ? 'Live' : 'Draft'}
            </span>
          </div>

          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Your portfolio URL</p>
          <p className="font-mono text-sm font-medium text-gray-900 truncate mb-4">{portfolioUrl}</p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <Check size={15} className="text-green-600" />
              ) : (
                <Copy size={15} />
              )}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <a
              href={`/dr/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-600 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              View portfolio
              <ExternalLink size={15} />
            </a>
          </div>

          {!isPublished && (
            <p className="mt-4 text-sm text-gray-500">
              Your portfolio is ready.{' '}
              <Link href="/dashboard/settings" className="font-medium text-brand-600 hover:underline">
                Publish it to go live →
              </Link>
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <QRCode value={portfolioUrl} size={96} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/PortfolioStatusCard.tsx
git commit -m "feat: add PortfolioStatusCard with URL copy and QR code"
```

---

## Task 8: StatsRow component

**Files:**
- Create: `components/dashboard/StatsRow.tsx`

- [ ] **Step 1: Create the file**

Create `components/dashboard/StatsRow.tsx` with this content:

```tsx
// Stats row — placeholder activity cards for dashboard home (analytics coming soon)
import { BarChart2, Calendar, Clock, MessageCircle } from 'lucide-react'

interface Props {
  lastUpdated: string | null
}

export default function StatsRow({ lastUpdated }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Activity</h2>
      <div className="space-y-3">
        {[
          { label: 'Portfolio views', icon: BarChart2 },
          { label: 'Appointment requests', icon: Calendar },
          { label: 'WhatsApp clicks', icon: MessageCircle },
        ].map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon size={15} className="text-gray-400" />
              {label}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-300">—</span>
              <span className="text-xs text-gray-400">coming soon</span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400" />
            Last updated
          </div>
          <span className="text-sm text-gray-500">{lastUpdated ?? '—'}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/StatsRow.tsx
git commit -m "feat: add StatsRow placeholder analytics cards for dashboard home"
```

---

## Task 9: DashboardHome component

**Files:**
- Create: `components/dashboard/DashboardHome.tsx`

- [ ] **Step 1: Create the file**

Create `components/dashboard/DashboardHome.tsx` with this content:

```tsx
// Dashboard home — assembles portfolio status card, profile strength, and stats row
import type { SectionKey } from '@/types/Profile'
import ProfileStrength from '@/components/dashboard/ProfileStrength'
import PortfolioStatusCard from '@/components/dashboard/PortfolioStatusCard'
import StatsRow from '@/components/dashboard/StatsRow'

interface Props {
  doctor: { name: string; slug: string; plan: string; is_published: boolean }
  sections: Partial<Record<SectionKey, unknown>>
  portfolioUrl: string
  lastUpdated: string | null
}

export default function DashboardHome({ doctor, sections, portfolioUrl, lastUpdated }: Props) {
  const firstName = doctor.name.split(' ')[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, Dr. {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is how your portfolio looks today.
        </p>
      </div>

      <PortfolioStatusCard
        isPublished={doctor.is_published}
        portfolioUrl={portfolioUrl}
        slug={doctor.slug}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 pt-4 pb-1">
            <h2 className="text-sm font-semibold text-gray-700">Profile Strength</h2>
          </div>
          <ProfileStrength sections={sections} />
          <div className="grid grid-cols-3 gap-2 p-4 pt-3">
            {[
              { label: 'Edit Profile', href: '/dashboard/profile' },
              { label: 'Template', href: '/dashboard/template' },
              { label: 'Preview', href: '/dashboard/preview' },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center justify-center rounded-lg border border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <StatsRow lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/DashboardHome.tsx
git commit -m "feat: add DashboardHome shell component"
```

---

## Task 10: Dashboard page — replace redirect with server component

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Replace the entire file content**

The current file is only a redirect. Replace the full file with:

```tsx
// Dashboard home page — fetches doctor + sections and renders the home control centre
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { APP_URL } from '@/lib/constants'
import DashboardHome from '@/components/dashboard/DashboardHome'
import type { SectionKey } from '@/types/Profile'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [doctorRes, profilesRes] = await Promise.all([
    supabase
      .from('doctors')
      .select('name, slug, plan, is_published')
      .eq('id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('section_key, data, updated_at')
      .eq('doctor_id', user.id),
  ])

  if (doctorRes.error || !doctorRes.data) redirect('/onboarding')

  const doctor = doctorRes.data
  const profiles = profilesRes.data ?? []

  const sections: Partial<Record<SectionKey, unknown>> = {}
  for (const row of profiles) {
    sections[row.section_key as SectionKey] = row.data
  }

  const lastUpdated =
    profiles.length > 0
      ? profiles.reduce(
          (max, p) => (p.updated_at > max ? p.updated_at : max),
          profiles[0].updated_at,
        )
      : null

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <DashboardHome
        doctor={doctor}
        sections={sections}
        portfolioUrl={`${APP_URL}/dr/${doctor.slug}`}
        lastUpdated={formattedLastUpdated}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Visual check — full dashboard home**

Start dev server, log in as a doctor. Visit `/dashboard`. Confirm:
- Real page renders (not a redirect to `/dashboard/profile`)
- "Welcome back, Dr. [FirstName]" heading visible
- PortfolioStatusCard shows URL, copy button, QR code, and Live/Draft badge
- Profile Strength bar renders with correct score
- Three quick-action links (Edit Profile, Template, Preview) visible
- Stats row shows 4 items with `—` placeholders
- No TypeScript or console errors

- [ ] **Step 4: Commit**

```bash
git add app/(dashboard)/dashboard/page.tsx
git commit -m "feat: replace dashboard redirect with full home page — portfolio status, profile strength, stats"
```

---

## Spec Coverage Self-Review

| Spec requirement | Task that covers it |
|---|---|
| `/dashboard` renders real home page | Task 10 |
| Portfolio URL copyable | Task 7 (PortfolioStatusCard) |
| QR code visible on dashboard | Task 7 |
| Publish status badge | Task 7 |
| Profile Strength on dashboard | Task 9 (DashboardHome) |
| Stats row with `—` placeholders | Task 8 |
| Quick-action buttons | Task 9 |
| Initials avatar fallback — Classic | Task 3 |
| Initials avatar fallback — Modern | Task 4 |
| Initials avatar fallback — Bold | Task 5 |
| Initials avatar fallback — Oncology | Task 6 |
| Specialty chip always visible in hero | Tasks 3, 4, 5, 6 |
| NMC trust signal always visible | Tasks 3, 4, 5, 6 |
| Mobile h1 size fix — Modern | Task 4 |
| Mobile h1 size fix — Bold | Task 5 |
| Mobile h1 size fix — Oncology | Task 6 |
| Remove Oncology mobile fixed min-height | Task 6 |
| `getInitials` shared helper | Task 2 |
| `react-qr-code` dependency | Task 1 |
