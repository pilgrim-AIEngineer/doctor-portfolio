# Modern Template Redesign — Design Spec

_Date: 2026-05-24_
_Source: Classic Template Desktop design handoff (medfolio-classic-theme bundle)_
_Approach: Adapt design's X-factor elements to the modern template's dark ink + cyan palette. No data-fetch changes._

---

## 1. Scope

Three files change. All data props (`DoctorProfile`, `TemplateSections`, `Doctor`, `AppointmentSection`, `FeesSection`) are preserved exactly. No new server actions or queries.

| File | Change |
|---|---|
| `components/templates/modern/Hero.tsx` | Ghost watermark, ECG line, diagonal slash, inline stats |
| `components/templates/modern/Sections.tsx` | Sidebar nav on desktop, mobile AnchorNav preserved |
| `components/templates/modern/AppointmentCTA.tsx` | Full-width dark CTA section on desktop, FAB hidden on lg |

A new client component is extracted:

| New file | Purpose |
|---|---|
| `components/templates/modern/SidebarNav.tsx` | `"use client"` — IntersectionObserver + sidebar markup |

---

## 2. Hero (`Hero.tsx`)

### Decorations (absolutely positioned, non-interactive)

**Ghost year watermark**
- Value: `computeExperienceYears(experience, personal)` — same helper already called in the hero
- Position: `absolute bottom-[-48px] left-[28%]`
- Style: `text-[280px] font-black font-serif leading-none text-white/[0.05] select-none pointer-events-none tracking-[-20px] whitespace-nowrap`

**ECG heartbeat SVG**
- Position: `absolute bottom-7 left-12 pointer-events-none`
- Dimensions: `260×22`, `viewBox="0 0 260 22"`
- Polyline points: `0,11 30,11 42,5 54,17 63,2 75,20 87,11 140,11 152,7 164,15 173,3 185,19 197,11 260,11`
- Stroke: `white` at `opacity-[0.15]`, strokeWidth `2.5`, strokeLinecap/Linejoin `round`

### Left column changes

**Inline stat row** (replaces nothing on the left — the metric boxes were on the right column)
- Rendered after the tagline, before the CTA buttons
- Three stats separated by `1px h-8 bg-white/20` vertical dividers:
  - `computeExperienceYears(experience, personal)` + `"yrs"`
  - `getServiceCount(services)` + `"services"`
  - Fee from `sections.fees?.consultation_fee` — show `₹{fee.toLocaleString()}` if present, else omit this stat
- Stat value: `text-2xl font-bold text-white`
- Stat label: `text-[11px] font-semibold uppercase tracking-wide text-slate-400 mt-1`
- Wrapper: `flex items-center gap-6 mt-6 flex-wrap`

### Right column changes

**Photo panel diagonal slash**
- The existing `<div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] bg-modern-panel">` wraps the photo
- Add a sibling `<div>` behind it (absolute, inset-0) with `clipPath="polygon(8% 0, 100% 0, 100% 100%, 0 100%)"` and `bg-white/[0.04]` — creates the angled left edge
- The photo card itself stays rectangular; only the background slash panel is clipped

**Remove metric column**
- The right side of the glass card grid (`md:grid-cols-[1fr_0.72fr]`) currently has: 3 `<Metric>` boxes + "Fast appointment access" card
- Remove the metrics column. Change grid to `grid-cols-1` — photo takes full width of the glass card on all sizes
- The metric data moves into the inline stat row on the left

**Offset accent frame**
- The existing `absolute left-5 top-6 h-full w-full rounded-[2rem] border border-white/10` stays — just verify it still renders correctly without the metric column beside it

---

## 3. Sidebar Nav (`SidebarNav.tsx` — new file)

### Behaviour
- `"use client"` directive
- `IntersectionObserver` watches each section element by ID
- `rootMargin: '-20% 0px -60% 0px'` — same as the design's pattern
- `activeId` state drives: progress fill height, active dot style, active item background

### Structure

```
<aside>  sticky top-8, w-[220px], shrink-0, self-start, hidden lg:block
  ┌── Doctor identity block
  │   avatar (initials, 40×40, rounded-xl, bg-brand-700/20, text-cyan-200)
  │   name (13px, 700, white)
  │   specialty (11px, slate-400)
  │   border-b border-white/10 pb-4 mb-4
  │
  └── nav  position-relative pl-7
      │
      ├── track line: absolute left-[7px] top-1 bottom-1, w-[1.5px], bg-white/10
      ├── progress fill: absolute left-[7px] top-1, w-[1.5px], bg-cyan-300/70
      │   height = (activeIndex / (total - 1)) * 100%  transition-[height] duration-400
      │
      └── per-item button  (onClick → smooth scroll to section)
          ├── track dot: absolute -left-5, 7px→10px on active
          │   inactive: bg-slate-600   active: bg-cyan-300 + ring (box-shadow 0 0 0 3px cyan-300/20)
          ├── number: "01" "02"…  10px, 700, cyan-300 (active) / slate-600 (inactive)
          └── label: 13px, 700 (active) / 500 (inactive), white (active) / slate-400 (inactive)

  └── Book CTA: mt-5, bg-cyan-300, text-modern-ink, rounded-xl, 13px 700, href="#modern-book-form"
```

### Nav items

Derived from `getVisibleSectionIds(sections)` (exported from `components/templates/shared.ts`). Map visible section IDs to labels + icons. Use the same icon set already imported in `Sections.tsx`.

---

## 4. Sections layout (`Sections.tsx`)

### Desktop layout

```
<main>
  <AnchorNav />          ← existing, add lg:hidden
  <div className="mx-auto max-w-7xl px-6 py-10 lg:flex lg:gap-12 lg:items-start">
    <SidebarNav sections={sections} />    ← hidden on mobile via lg:block inside component
    <div className="flex-1 min-w-0 grid gap-5 lg:grid-cols-2">
      {/* all existing section components unchanged */}
    </div>
  </div>
</main>
```

- The 2-col section grid on desktop still works — it's now inside the flex-1 content area
- `AnchorNav` stays for mobile (add `lg:hidden`)
- `SidebarNav` handles its own `hidden lg:block`

---

## 5. Appointment CTA (`AppointmentCTA.tsx`)

### New desktop section (above the existing FAB/modal code)

```
<section id="modern-book-form" className="relative overflow-hidden lg:block hidden">
  {/* Diagonal stripe texture */}
  {/* Ghost "Rx" text */}
  <div className="relative max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-2 gap-16 items-start">
    Left col:
      eyebrow: "Appointment" — text-[11px] font-bold uppercase tracking-[2px] text-cyan-300 mb-3
      h2: "Book with Dr. {name}" — text-[40px] font-extrabold text-white leading-tight
      subtext: "Use WhatsApp for the fastest response…" — text-[15px] text-white/55
      fee badge (if fees present): bg-white/[0.07] border border-white/14 rounded-2xl px-5 py-3
        ₹{fee} in text-3xl font-bold white + "Consultation fee" in text-[11px] text-white/50
      CTA row: WhatsApp (green pill) + Call Now (ghost pill)

    Right col:
      white card: bg-white rounded-3xl p-8
        "Send a booking request" heading (text-gray-900)
        <FeesCard fees={fees} /> if present
        <BookingForm doctorId={doctor.id} doctorEmail={doctor.email} />
  </div>
</section>
```

**FAB visibility:** The existing fixed FAB div gets `lg:hidden` so it only shows on mobile.

**`id="modern-book-form"`** moves from the current `<section className="sr-only">` to this new visible section. The hero's "Book appointment" anchor link still works.

**`"use client"`** stays — `useState(formOpen)` is still needed for the mobile modal.

---

## 6. Out of scope

- No changes to `index.tsx`
- No changes to `shared.ts` helpers
- No changes to `BookingForm`, `FeesCard`, `GalleryLightbox`
- No Tailwind config changes (all colours already exist: `modern-ink`, `modern-panel`, `brand-700`, `cyan-300`, etc.)
- No new routes, actions, or DB queries
- Mobile layouts: hero mobile is untouched, sections mobile uses existing AnchorNav, CTA mobile uses existing FAB + modal

---

## 7. Definition of done

1. Renders correctly at 375px (mobile) — no layout regressions
2. Renders correctly at 1280px (desktop) — sidebar visible, inline stats row visible, ECG/watermark visible, diagonal slash visible, desktop CTA section visible
3. TypeScript compiles with zero errors
4. All existing data props flow through unchanged
5. No `console.log` remaining
