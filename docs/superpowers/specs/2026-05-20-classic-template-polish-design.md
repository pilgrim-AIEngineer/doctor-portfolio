# Classic Template Polish — Design Spec
**Date:** 2026-05-20  
**Scope:** Classic template only (`components/templates/classic/`) — public portfolio at `/dr/[slug]`  
**Constraint:** No changes to data fetching, server actions, or database queries. Design/UI only.  
**Approach:** B — Targeted redesign (photo-hero + sticky nav + flat-elegant cards)

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Overall direction | Elevated & Premium | Private clinic feel: generous white space, strong type hierarchy |
| Mobile hero layout | Photo-hero (visual-first) | Large photo banner → identity → stats → CTAs. Apollo/Practo pattern. |
| Section navigation | Sticky quick-jump nav | Horizontal scroll chips that stick after hero. IntersectionObserver for active state. |
| Section card style | Flat elegant | White card, gray-200 border, hairline divider under title. No hover-translate. |
| Desktop | Refine 2-col, don't restructure | Desktop layout already works — improve typography/spacing only |

---

## 1. Hero Redesign (`Hero.tsx`)

### Mobile layout (default, < md)
```
┌─────────────────────────────────┐
│  [PHOTO BANNER — full width]    │  aspect-ratio: 4/3, overflow hidden
│  ┌─────────────┐                │  gradient overlay fades to white at bottom
│  │   RK (photo │  ✓ NMC badge  │  circular photo (border-4 border-white)
│  │   or initials)               │  NMC verified badge: absolute bottom-right
│  └─────────────┘                │
│  gradient fade ░░░░░░░░░░░░     │
├─────────────────────────────────┤
│  [Specialty chip]               │  bg-brand-50 border-brand-200 text-brand-700
│  Dr. [Name]                     │  text-2xl font-bold tracking-tight
│  [Specialty · Affiliation]      │  text-sm text-brand-700 font-semibold
│  ┌──────┬──────┬──────┐         │
│  │ 15   │ 5k+  │ ₹800 │         │  3 stat chips, bg-gray-50 border-gray-200
│  │ Yrs  │ Pat  │ Consult│        │
│  └──────┴──────┴──────┘         │
│  "tagline if present"           │  border-l-3 brand-500, italic, text-sm
│  [WhatsApp] [Book Now]          │  grid-cols-2, green + brand-700
└─────────────────────────────────┘
```

**Stats chip logic (based on actual data model — no `patient_count` field exists):**
- Chip 1: `[N] Yrs` — from `computeExperienceYears()`, only if > 0
- Chip 2: `₹[fee]` — from `fees.consultation_fee`, only if present
- Chip 3: Omit (no reliable third stat in the data model)
- Max 2 stat chips rendered; row omitted entirely if both are absent

**Photo banner background:**
- If `personal.cover_image` exists → use as `next/image` background fill
- Else if `personal.photo` exists → use gradient (`from-brand-200 to-brand-300`) as bg
- Else → gradient bg only (no image)

### Desktop layout (md+)
- Retain 2-column grid: `[1.2fr 0.9fr]`
- Left: improved typography, same chip + name + specialty + tagline + CTA buttons
- Right: photo card — photo fills full card height, stats grid (2-col) at bottom of card
- Remove the decorative circle behind the right column (too decorative, not premium)
- NMC badge rendered inside the hero chips row (not on the photo) on desktop

### Changes vs current code
- Remove `md:grid-cols-[1.1fr_0.9fr]` — keep grid but adjust proportions
- Mobile: add photo banner section above text content (currently text is above, photo below)
- Stats: introduce 3-chip stats row (new `StatChip` helper component inside file)
- Tagline: keep the `border-l-4 border-brand-500` treatment, shrink to `text-sm`
- CTAs: `grid grid-cols-2 gap-3` replacing `flex flex-wrap gap-3` — ensures they're always full-width on mobile

---

## 2. Section Nav — New Component (`SectionNav.tsx`)

**File:** `components/templates/classic/SectionNav.tsx`  
**Type:** `'use client'` — needs `useEffect` for IntersectionObserver and scroll detection

### Behaviour
- Renders chips for each section that actually has content (passed as prop array)
- `position: sticky; top: 0; z-index: 20` — sticks to top of viewport after hero scrolls past
- Horizontal scroll: `overflow-x-auto` with hidden scrollbar
- Active chip: highlighted with `bg-brand-700 text-white`; inactive: `bg-gray-100 text-gray-600`
- Tapping a chip smooth-scrolls to the corresponding section `id`
- Active chip auto-scrolls into view within the nav strip when updated

### Section labels
```typescript
const SECTION_LABELS: Record<string, string> = {
  'section-personal': 'About',
  'section-qualifications': 'Quals',
  'section-specialization': 'Specialty',
  'section-experience': 'Experience',
  'section-services': 'Services',
  'section-clinic_info': 'Clinic',
  'section-achievements': 'Awards',
  'section-gallery': 'Gallery',
  'section-languages': 'More',
  'section-appointment': 'Book',
}
```

### Props
```typescript
interface SectionNavProps {
  sectionIds: string[]  // only sections with content, in order
}
```

### New helper in `shared.ts`: `getVisibleSectionIds`
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

### Integration in `index.tsx`
Inserted between `<ClassicHero />` and `<ClassicSections />`. Computes IDs via `getVisibleSectionIds(templateSections)` and passes to `<SectionNav>`.

---

## 3. Section Cards (`Sections.tsx` — `SectionBand` component)

### Before → After

| Property | Before | After |
|---|---|---|
| Card style | `rounded-[1.75rem] border border-clinical-line bg-white/90 shadow-sm` | `rounded-2xl border border-gray-200 bg-white shadow-sm` |
| Hover effect | `hover:-translate-y-1 hover:shadow-clinical` | **Remove** — jittery on mobile, not premium |
| Padding | `p-6 md:p-8` | `p-5 md:p-7` |
| Icon container | `h-11 w-11 rounded-2xl bg-clinical-soft` | `h-9 w-9 rounded-xl bg-brand-50` |
| Icon color | `text-brand-700` | `text-brand-600` |
| Title | `text-xl font-semibold tracking-tight text-clinical-ink` | `text-base font-bold tracking-tight text-gray-900` |
| Title row bottom | nothing | `border-b border-gray-100 pb-4 mb-5` (hairline divider) |

### `Pill` component
```
before: border-brand-100 bg-brand-50 text-brand-700 text-sm
after:  border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium
```
More restrained — pills were too blue everywhere.

### `ListItems` component  
- Dot: shrink from `h-2 w-2` to `h-1.5 w-1.5`, change color to `bg-gray-400`
- Text: `text-gray-600` (was `text-gray-700`), line-height `leading-6` (was `leading-7`)

---

## 4. Sticky CTA Bar (`AppointmentCTA.tsx`)

### Mobile fixed bar changes
```
before: border-t border-clinical-line bg-white/95 px-4 py-3 shadow-clinical backdrop-blur
after:  border-t border-gray-100 bg-white/98 px-4 py-3.5 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] backdrop-blur-sm pb-safe
```

- Add `pb-[env(safe-area-inset-bottom)]` for iPhone home bar
- WhatsApp: `bg-green-600` (was `bg-green-500`) — richer
- Book button: `bg-brand-700` stays
- Both buttons: `py-3` stays, add `text-sm` explicitly

### Desktop booking panel
- Background: `bg-white` (was `bg-clinical-mist`) — cleaner
- Outer card border: `border border-gray-200` (was `border-clinical-line`)
- "Appointment" label: `text-xs font-bold uppercase tracking-widest text-brand-600`
- Heading: `text-3xl font-bold tracking-tight`

---

## 5. Global Typography Polish (across all Classic components)

- Remove `text-clinical-ink` usages — replace with `text-gray-900` or `text-gray-800`
- `bg-clinical-soft` in cards → `bg-gray-50` (less blue-tinted)  
- `border-clinical-line` in cards → `border-gray-200`
- Keep `bg-clinical-mist` as page background in `index.tsx` — it's subtle and fine

---

## Files Modified

| File | Change |
|---|---|
| `components/templates/classic/Hero.tsx` | Full mobile layout restructure, desktop refine |
| `components/templates/classic/Sections.tsx` | SectionBand, Pill, ListItems restyling |
| `components/templates/classic/AppointmentCTA.tsx` | CTA bar polish, booking panel cleanup |
| `components/templates/classic/index.tsx` | Add `<SectionNav>`, pass section IDs |
| `components/templates/classic/SectionNav.tsx` | **New file** — sticky quick-jump nav |
| `components/templates/shared.ts` | Add `getVisibleSectionIds` helper |

---

## Out of Scope
- Dashboard UI — separate future task
- Other templates (modern, bold, oncology)
- Data fetching, server actions, database
- The login/onboarding flow
