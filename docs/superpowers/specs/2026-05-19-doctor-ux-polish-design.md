# DocFolio — Doctor UX Polish Design Spec

**Date:** 2026-05-19
**Goal:** Make doctors willing to invest in the platform by delivering two demo "wow moments": (A) a stunning public portfolio and (C) an effortless setup experience.
**Context:** Building toward a demo/launch moment where a mixed group of doctors (any specialty) will try the product hands-on on their own phones. The demo story is: "Go from signup to a live, professional portfolio in under 5 minutes."

---

## Scope

Two focused improvements:

1. **Dashboard Home Page** — replace the current redirect with a real control-center page
2. **Portfolio Polish + Mobile Responsiveness** — templates look great with minimal data, render correctly on mobile

---

## Section 1 — Dashboard Home Page

### Problem
`/dashboard` currently redirects immediately to `/dashboard/profile`. Doctors never see a home base. After the demo onboarding, they have no clear signal that their portfolio exists or is live.

### Solution
A real server-rendered home page at `/dashboard` with three visual blocks.

---

### Block 1 — Portfolio Status Card (most prominent)

**Purpose:** The shareable asset. This is what doctors will screenshot and show colleagues.

**Contents:**
- Publish status badge: green "Live" if `is_published = true`, orange "Draft" if false
- Full portfolio URL: `docfolio.in/dr/[slug]` displayed as readable text
- Copy-to-clipboard button: copies URL, shows "Copied!" confirmation for 2 seconds
- QR code: renders the portfolio URL as a scannable QR code (doctors screenshot this for their clinic notice board)
- "View portfolio" button: opens `/dr/[slug]` in a new tab
- If unpublished: a soft CTA — "Your portfolio is ready. Publish it to go live." with a link to `/dashboard/settings`

**Component:** `PortfolioStatusCard` — client component (needs clipboard API and QR render)

---

### Block 2 — Profile Strength + Quick Actions

**Purpose:** Tell the doctor what to do next without overwhelming them.

**Contents:**
- Reuse the existing `ProfileStrength` component (weighted score + nudge copy already built)
- Below it: three quick-action buttons
  - "Edit Profile" → `/dashboard/profile`
  - "Change Template" → `/dashboard/template`
  - "Preview" → `/dashboard/preview`

**Component:** Inline in `DashboardHome` — no new component needed beyond `ProfileStrength` reuse.

---

### Block 3 — Stats Row (4 placeholder cards)

**Purpose:** Set the expectation that analytics are coming. Pro value prop signal.

**Cards:**
| Label | Value | Note |
|---|---|---|
| Portfolio views | — | Coming soon (Pro) |
| Appointment requests | — | Coming soon |
| WhatsApp clicks | — | Coming soon (Pro) |
| Last updated | relative date | Read from `profiles.updated_at` max |

Cards show `—` as the value with a small "coming soon" label. No tooltip needed — the label is self-explanatory.

**Component:** `StatsRow` — server or client component, no interactivity needed.

---

### Data Requirements
The dashboard home server component fetches in parallel:
- `doctors` — `name, slug, plan, is_published` (already fetched in layout, can be passed down or re-fetched)
- `profiles` — `section_key, data, updated_at` — to power `ProfileStrength` and "last updated" stat

No new API routes. No database migrations.

---

## Section 2 — Portfolio Polish + Graceful Empty States

### Problem
Templates render with visible gaps when a doctor has only filled the onboarding form (name, phone, NMC number, specialty). Empty sections leave broken layouts, visible placeholder text, or ugly blank cards. This kills the "wow" moment.

### Solution
**The core rule:** If a section has no data, it does not render. The portfolio gracefully contracts. No "not provided" text. No empty cards. No broken UI.

Additionally, the two fields guaranteed from onboarding (specialty + NMC number) must always render as visible trust signals in the hero.

---

### Hero / Personal Section (highest priority)

The hero is always the first thing visible. It must look complete with minimal data.

**Changes:**
- **Photo fallback:** When `personal.photo` is absent, render a stylised avatar: initials (first + last name initial) in a brand-coloured circle. No broken image icon.
- **Tagline + About:** Mark as optional in the hero render. If absent, the hero layout adjusts — does not leave a blank gap.
- **Always-render trust signals:** Specialty chip and "NMC Verified ✓" badge always appear in the hero, sourced from the `doctors` table (guaranteed at onboarding). These are not gated on the `profiles.personal` section being filled.

**Minimum viable hero (onboarding data only):**
```
[Initials Avatar]  Dr. [Name]
                   [Specialty] chip  •  NMC Verified ✓
                   [WhatsApp CTA button]
```
This looks polished and professional. Nothing broken. Nothing missing.

---

### Section-Level Guards (all 4 templates)

Each template renders section blocks conditionally. The pattern already exists inconsistently — we make it consistent.

**Rule per section block:**
```tsx
// Before rendering any section block
if (!sections.qualifications) return null
```

Apply this guard to every section block in:
- `components/templates/classic/index.tsx` and child components
- `components/templates/modern/index.tsx` and child components
- `components/templates/bold/index.tsx` and child components
- `components/templates/oncology/index.tsx` and child components

Sections with array data (qualifications, services, achievements, etc.) additionally check that the array is non-empty before rendering.

---

### Mobile Responsiveness Pass

A systematic audit and fix of all 4 template `index.tsx` files and their child components.

**Checklist per template:**
- [ ] No horizontal overflow (`overflow-x: hidden` should not be needed — fix the root cause)
- [ ] All grid/flex layouts have correct `sm:` / `md:` breakpoints
- [ ] Hero text sizes scale down correctly on small screens (`text-4xl` → `text-2xl` on mobile)
- [ ] WhatsApp CTA button: minimum 44px touch target, full-width on mobile
- [ ] Appointment form: inputs are full-width on mobile, readable font size (min 16px to prevent iOS zoom)
- [ ] Gallery: single-column on mobile, grid on desktop
- [ ] No fixed-width elements that break on narrow screens

---

## File Changes Summary

### New files
| File | Purpose |
|---|---|
| `components/dashboard/DashboardHome.tsx` | Home page shell, assembles three blocks |
| `components/dashboard/PortfolioStatusCard.tsx` | URL, copy button, QR code, publish badge |
| `components/dashboard/StatsRow.tsx` | 4 placeholder stat cards |

### Modified files
| File | Change |
|---|---|
| `app/(dashboard)/dashboard/page.tsx` | Replace redirect with server component, render `DashboardHome` |
| `components/templates/classic/index.tsx` + children | Empty state guards + mobile responsive pass |
| `components/templates/modern/index.tsx` + children | Empty state guards + mobile responsive pass |
| `components/templates/bold/index.tsx` + children | Empty state guards + mobile responsive pass |
| `components/templates/oncology/index.tsx` + children | Empty state guards + mobile responsive pass |
| All template Hero components | Initials avatar fallback, always-render specialty + NMC badge |

### New dependency
| Package | Reason | Size |
|---|---|---|
| `react-qr-code` | QR code generation from URL string | ~5kb, zero deps |

---

## Definition of Done

- [ ] `/dashboard` renders a real home page — no redirect
- [ ] Portfolio URL is copyable and QR code is visible on the dashboard home
- [ ] Publish status (Live/Draft) is visible at a glance
- [ ] Profile Strength component appears on dashboard home
- [ ] Stats row renders with placeholder `—` values
- [ ] A doctor who only filled the onboarding form sees a polished, non-broken portfolio at `/dr/[slug]`
- [ ] Hero renders with initials avatar when no photo is uploaded
- [ ] NMC Verified badge and specialty chip always appear in the hero
- [ ] All 4 templates pass mobile render check at 375px viewport
- [ ] No horizontal scroll on any template at mobile viewport
- [ ] TypeScript compiles with zero errors
- [ ] No `console.log` remains
