# Profile Editor Redesign — Design Spec
**Date:** 2026-05-11
**Branch:** codex/template-improvement
**Status:** Approved, ready for implementation planning

---

## Problem Statement

The MVP profile editor has three compounding issues:

1. **No control** — doctors cannot toggle sections on/off or reorder them on their portfolio
2. **Shallow fields** — key sections (Experience, Qualifications, Testimonials) use unstructured "one per line" textareas that lose all semantic structure
3. **Incomplete sections** — Fees, multiple clinic locations, and FAQ are missing entirely

The result is a profile editor that feels like a raw form dump rather than a professional publishing tool.

---

## Chosen Approach: Two-Column Profile Editor

The profile page is redesigned as a two-column layout:
- **Left (sticky nav):** accordion groups with section completion dots, visibility toggles, reorder controls, and a Profile Strength score
- **Right (form pane):** active section form, unchanged in placement, deeply upgraded in field quality

---

## 1. Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Profile                          [Preview ↗]          │
├──────────────────┬──────────────────────────────────────────┤
│  Profile         │                                          │
│  Strength: 62%   │   ← Active form renders here →          │
│  ▓▓▓▓▓▓░░░░      │                                          │
│                  │                                          │
│  ▼ Identity      │                                          │
│    ● Personal    │                                          │
│    ○ Specializ.  │                                          │
│    ● Registration│                                          │
│    ● Qualif.     │                                          │
│                  │                                          │
│  ▼ Practice      │                                          │
│    ● Experience  │                                          │
│    ○ Services    │                                          │
│    ● Clinic Info │                                          │
│    ○ Fees 🔒     │                                          │
│    ○ Locations 🔒│                                          │
│                  │                                          │
│  ▷ Credibility   │                                          │
│  ▷ Patient       │                                          │
│  ▷ Connect       │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

**Breakpoints:**
- `md:` and above → two-column side-by-side
- below `md` → left nav becomes horizontal scrollable group chips (Identity · Practice · Credibility · Patient · Connect), section controls move into a `⋮` menu in each form's header

**Groups and their sections:**

| Group | Sections |
|---|---|
| Identity | personal, specialization, qualifications, registration |
| Practice | experience, services, clinic_info, fees, locations |
| Credibility | achievements, research, gallery |
| Patient | testimonials, faq, insurance, languages |
| Connect | appointment, social |

---

## 2. Section Control Panel (Left Nav)

Each section row in the left nav contains:
- **Completion dot** — filled (●) if section data exists, empty (○) if not
- **Section name** — clicking activates that form in the right pane
- **Eye icon** — toggles `is_visible` for this section on the public portfolio
- **Up/Down arrows** — reorders the section within its group (`display_order`)
- **Lock icon** — shown instead of eye/arrows for Pro-only sections on Free plan

Visibility and ordering apply **globally** across all templates.

### Optimistic UI
- Eye toggle flips immediately; server action fires in background; reverts + toast on error
- Up/down reorder moves immediately in local state; server action fires; reverts on error

---

## 3. Profile Strength

Computed client-side from the sections object. No server round-trip.

| Section | Weight |
|---|---|
| personal | 15 |
| specialization | 10 |
| experience | 10 |
| services | 10 |
| clinic_info / locations | 10 |
| qualifications | 8 |
| fees | 7 |
| appointment | 7 |
| testimonials | 7 |
| achievements | 5 |
| gallery | 4 |
| research | 3 |
| faq | 3 |
| insurance | 1 |
| languages | 1 |
| social | 1 |
| registration | 1 |

**Score** = (sum of weights for filled sections) / 103 × 100, rounded to nearest integer.

A section is "filled" when its required fields are non-empty.

**Color thresholds:** amber < 50%, blue 50–79%, green ≥ 80%

**Nudge copy** — one line below the bar, computed from which high-weight sections are empty:
- Missing fees + testimonials → *"Add your fees and testimonials to stand out."*
- Missing photo → *"Add a profile photo — it's the first thing patients see."*
- Missing services → *"Add your services so patients know what you treat."*
- Score ≥ 80% → *"Great profile! Keep it updated."*

---

## 4. Data Model Changes

### Migration 006 — `profiles` table additions
```sql
ALTER TABLE profiles ADD COLUMN is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN display_order integer NOT NULL DEFAULT 0;
```

RLS policies remain unchanged — doctors can only write their own rows.

### New server action — `updateSectionOrder`
```typescript
// Batch update visibility and order for multiple sections
updateSectionOrder(updates: { section_key: SectionKey; display_order: number; is_visible: boolean }[])
```
Debounced 300ms. Returns `{ data }` or `{ error }`.

### New section keys
Add `'fees' | 'locations' | 'faq'` to the `SectionKey` union in `types/Profile.ts`.

---

## 5. Form Upgrades

### Shared new components
- **`TagChipInput`** (`components/dashboard/profile/TagChipInput.tsx`) — type + Enter/comma to add, × to remove. Used for all flat string array fields.
- **`CardArrayInput`** (`components/dashboard/profile/CardArrayInput.tsx`) — generic card list with add/remove. Each card renders its own fields. Used for structured array sections.

### Per-section changes

**Personal**
- Add `cover_image` field (Cloudinary upload, for Bold/Oncology hero banner)
- Add character counter to `about` (max 500)
- No other changes

**Qualifications**
- `degrees`: `string[]` → `{ degree: string; institution: string; year: number }[]` — CardArrayInput
- `fellowships`: `string[]` → `{ title: string; institution: string; year: number }[]` — CardArrayInput

**Specialization**
- `sub_specialties`: textarea → TagChipInput
- `primary`: unchanged (text input)

**Experience**
- `hospitals`: `string[]` → `{ role: string; hospital: string; location: string; from_year: number; to_year: number | null }[]` — CardArrayInput (`to_year: null` = present)
- `years`: **removed** — computed from cards on portfolio render
- `current_affiliation`: unchanged

**Services**
- `treatments`, `procedures`, `consultation_types`: all textarea → TagChipInput

**Achievements**
- `awards`, `recognitions`: textarea → TagChipInput

**Research**
- `publications`, `conferences`: textarea → TagChipInput

**Testimonials**
- `reviews`: `string[]` → `{ patient_name: string; review: string; rating: 1 | 2 | 3 | 4 | 5 }[]` — CardArrayInput with star picker

**Insurance**
- `panels`: textarea → TagChipInput

**Languages**
- `spoken`: textarea → TagChipInput

**Clinic Info, Registration, Appointment, Social, Gallery** — unchanged

---

## 6. New Sections

### Fees (`section_key: 'fees'`) — Pro only
```typescript
interface FeesSection {
  consultation_fee: number       // ₹, required
  followup_fee?: number          // ₹, optional
  fee_note?: string              // max 200 chars, optional
}
```
Rendered on portfolio: small info card near Appointment CTA.

### Locations (`section_key: 'locations'`) — Pro only
```typescript
interface LocationsSection {
  locations: {
    name: string          // e.g. "Apollo Clinic, Bandra"
    address: string
    phone: string         // 10-digit
    timings: string       // free text
    map_url?: string
    is_primary: boolean   // only one can be true
  }[]                     // max 5
}
```
Takes precedence over `clinic_info` on portfolio if present. `clinic_info` kept for backward compatibility.

### FAQ (`section_key: 'faq'`) — Pro only
```typescript
interface FAQSection {
  items: {
    question: string   // text input
    answer: string     // textarea, max 400 chars
  }[]                  // max 10
}
```
Rendered as expandable accordion on portfolio. `FAQPage` JSON-LD schema added to the public portfolio `<head>`.

---

## 7. Pro Plan Gating

Fees, Locations, FAQ are Pro-only. On Free plan:
- Section row visible in left nav with a lock icon (🔒)
- Clicking the row renders a locked state in the right pane: feature description + *"Upgrade to Pro — ₹499/month"* button → `/dashboard/billing`
- No form is rendered

---

## 8. Error Handling & Loading

- **Auto-save**: unchanged (1000ms debounce, `SaveStatus` component)
- **Card array inputs**: inline validation per card; empty required fields show red border but don't block auto-save of other complete cards
- **Visibility toggle**: optimistic — reverts + toast on error
- **Reorder**: optimistic — reverts on error
- **Initial load**: server-rendered, no skeleton needed; spinners only on image uploads

---

## 9. Mobile Layout

- Left nav collapses to horizontal scrollable group chips at top of page
- Tapping a chip expands that group's sections as a vertical list below the chips
- Visibility/reorder controls per section move into a `⋮` context menu in each form's header

---

## 10. Public Portfolio Impact

- Sections with `is_visible = false` are filtered out before rendering
- Sections sorted by `display_order ASC` within each group
- `years` in Experience computed from card dates on render (no stored field)
- `locations` overrides `clinic_info` if `locations` section exists and has items
- FAQ adds `FAQPage` JSON-LD to `<head>` via `generateMetadata`
- Fees displayed near Appointment CTA on all four templates

---

## Out of Scope

- Rich text (bold/italic) in `about` or FAQ answers — plain textarea is sufficient for v1
- Patient-submitted reviews (public form) — manual entry only for now
- Custom sections (doctor-defined) — fixed section list only
- Per-template section visibility — global only

---

## Files Affected

| File | Change |
|---|---|
| `supabase/migrations/006_section_controls.sql` | New migration |
| `types/Profile.ts` | Add fees/locations/faq keys; update qualifications/experience/testimonials types |
| `app/actions/profile.ts` | Add `updateSectionOrder` action |
| `app/(dashboard)/dashboard/profile/page.tsx` | Two-column layout |
| `components/dashboard/ProfileSideNav.tsx` | New — left nav with accordion groups |
| `components/dashboard/ProfileStrength.tsx` | New — strength bar + nudge |
| `components/dashboard/profile/TagChipInput.tsx` | New shared component |
| `components/dashboard/profile/CardArrayInput.tsx` | New shared component |
| `components/dashboard/profile/forms/QualificationsForm.tsx` | Upgrade to card array |
| `components/dashboard/profile/forms/ExperienceForm.tsx` | Upgrade to card array |
| `components/dashboard/profile/forms/TestimonialsForm.tsx` | Upgrade to card array |
| `components/dashboard/profile/forms/ServicesForm.tsx` | Upgrade to tag chips |
| `components/dashboard/profile/forms/AchievementsForm.tsx` | Upgrade to tag chips |
| `components/dashboard/profile/forms/ResearchForm.tsx` | Upgrade to tag chips |
| `components/dashboard/profile/forms/SpecializationForm.tsx` | Upgrade sub_specialties to tag chips |
| `components/dashboard/profile/forms/InsuranceForm.tsx` | Upgrade to tag chips |
| `components/dashboard/profile/forms/LanguagesForm.tsx` | Upgrade to tag chips |
| `components/dashboard/profile/forms/PersonalForm.tsx` | Add cover_image + char counter |
| `components/dashboard/profile/forms/FeesForm.tsx` | New |
| `components/dashboard/profile/forms/LocationsForm.tsx` | New |
| `components/dashboard/profile/forms/FAQForm.tsx` | New |
| `lib/validations/profile.ts` | Add/update zod schemas for changed sections |
| `lib/constants.ts` | Add PROFILE_GROUPS constant |
| `app/dr/[slug]/page.tsx` | Filter/sort by is_visible/display_order; add FAQ JSON-LD |
| All template components | Consume fees, locations, faq sections |
