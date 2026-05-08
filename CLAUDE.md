# CLAUDE.md — DocFolio

> This file is read by Claude Code at the start of every session.
> It defines how Claude should think, behave, and code in this project.
> Keep this file updated as the project evolves.

---

## 1. Karpathy's Rule (read this first, every time)

> *"The hottest new programming language is English."*
> — Andrej Karpathy

What this means for this project:

- **Think before you type.** Before writing any code, reason through the
  approach in plain English. If the plan is wrong, the code will be wrong.
- **Simple beats clever.** A junior developer must be able to read every
  file you produce. If a solution requires a comment to explain why it
  exists, rewrite it so it doesn't.
- **The best code is no code.** Before building something, ask: does
  Next.js, Supabase, or an existing library already do this? Use it.
- **Errors are information.** Never suppress an error. Surface it, log it,
  and handle it explicitly.
- **Slow down on the hard parts.** Auth, payments, and data mutations are
  dangerous. Be deliberate. Add a comment explaining every non-obvious
  decision in these areas.

---

## 2. Project identity

**Product:** DocFolio
**What it is:** A SaaS platform where Indian doctors fill their professional
information and get a beautiful public portfolio website rendered from preset
templates. Public visitors can discover and contact doctors.

**SPEC.md is the source of truth.** If SPEC.md and this file ever conflict,
SPEC.md wins. Read SPEC.md at the start of any new feature.

---

## 3. Tech stack (do not deviate without asking)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14, App Router | Use server components by default |
| Language | TypeScript (strict mode) | No `any`. No `// @ts-ignore`. |
| Database | Supabase (PostgreSQL) | Use RLS on every table |
| Auth | Supabase Auth | Phone OTP for Indian users |
| Styling | Tailwind CSS | No inline styles. No CSS modules. |
| Forms | react-hook-form + zod | Zod schema is the single source of validation |
| State | Zustand (client), Server Actions (mutations) | No Redux. No Context for server data. |
| Uploads | Cloudinary | Via server action, never expose API key to client |
| Payments | Razorpay | Subscription API only |
| Email | Resend | Transactional only |
| SMS/OTP | MSG91 | Indian numbers (+91) |
| Icons | lucide-react | No other icon libraries |
| Deployment | Vercel + Supabase | Do not suggest alternatives |

---

## 4. Project structure (strict — do not reorganise)

```
docfolio/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── profile/
│   │       ├── template/
│   │       ├── preview/
│   │       ├── appointments/
│   │       ├── billing/
│   │       └── settings/
│   ├── dr/
│   │   └── [slug]/          ← public portfolio
│   ├── admin/
│   ├── api/
│   │   └── razorpay-webhook/
│   ├── actions/             ← all server actions live here
│   └── sitemap.ts
├── components/
│   ├── ui/                  ← generic reusable: Button, Input, Card, Toast
│   ├── dashboard/           ← dashboard-specific components
│   ├── portfolio/           ← public portfolio components
│   └── templates/
│       ├── classic/
│       ├── modern/
│       └── bold/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── validations/         ← all zod schemas
│   ├── utils.ts
│   └── constants.ts
├── hooks/                   ← custom React hooks only
├── types/                   ← TypeScript interfaces and types
├── supabase/
│   └── migrations/
├── public/
├── SPEC.md
├── CLAUDE.md                ← this file
└── NOTES.md
```

---

## 5. Coding rules (non-negotiable)

### General
- Every file starts with a one-line comment stating what it does.
- Maximum file length: 300 lines. If longer, split into smaller files.
- Maximum function length: 40 lines. If longer, extract helper functions.
- No magic numbers or strings. Put them in `lib/constants.ts`.
- No `console.log` in committed code. Use a `logger` utility.

### TypeScript
- Strict mode is on. Satisfy the compiler without casting.
- Define all types in `/types`. Import from there everywhere.
- Prefer `interface` for objects, `type` for unions and aliases.
- Never use `any`. Use `unknown` and narrow it.

### React and Next.js
- Default to **Server Components**. Add `"use client"` only when you need:
  interactivity, browser APIs, hooks, or event listeners.
- Data fetching happens in Server Components or Server Actions. Never
  `useEffect` + `fetch` for initial data.
- All mutations go through **Server Actions** in `/app/actions/`.
- Use `loading.tsx` and `error.tsx` in every route segment.
- Every page exports proper `generateMetadata` for SEO.

### Supabase and data
- **Every table has RLS enabled.** Never disable RLS.
- Doctors can only read and write their own rows. Enforce in policy.
- Admin actions use a service role client in server actions only.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Always handle Supabase errors explicitly — check `error` before using `data`.

### Forms
- Every form field has a zod schema in `/lib/validations/`.
- Forms auto-save with 1000ms debounce. Show save state (saving / saved / error).
- Never disable the submit button without showing why.

### Styling
- Mobile-first. Write the mobile layout first, then `md:` and `lg:` overrides.
- Use Tailwind utility classes only. No custom CSS files.
- Color palette: use only the colors defined in `tailwind.config.ts`.
- No hardcoded hex values in JSX.

---

## 6. File naming conventions

| Type | Convention | Example |
|---|---|---|
| Pages | `page.tsx` | `app/dashboard/profile/page.tsx` |
| Layouts | `layout.tsx` | `app/dashboard/layout.tsx` |
| Components | PascalCase | `ProfilePhotoUpload.tsx` |
| Server actions | camelCase | `actions/profile.ts` |
| Hooks | `use` prefix | `hooks/useAutoSave.ts` |
| Types | PascalCase | `types/Doctor.ts` |
| Zod schemas | camelCase + `Schema` | `profileSectionSchema` |
| Supabase migrations | `NNN_description.sql` | `001_initial.sql` |

---

## 7. Environment variables

All secrets live in `.env.local`. Never hardcode. Never commit.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server only — never expose to client

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=             # server only

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=               # server only
NEXT_PUBLIC_RAZORPAY_KEY_ID=       # safe for client (public key only)

# Resend
RESEND_API_KEY=                    # server only

# MSG91
MSG91_AUTH_KEY=                    # server only
MSG91_TEMPLATE_ID=

# App
NEXT_PUBLIC_APP_URL=               # e.g. https://docfolio.in
NEXT_PUBLIC_APP_NAME=DocFolio
CRON_SECRET=                       # for securing cron job routes
```

**Rule:** If a variable does not start with `NEXT_PUBLIC_`, it must never
appear in any client component, client-side hook, or be passed as a prop
to a client component.

---

## 8. Database rules

Use these exact table and column names. Do not rename without updating SPEC.md.

```sql
-- Core tables (see supabase/migrations/001_initial.sql for full schema)
doctors          -- one row per registered doctor
profiles         -- one row per section per doctor (section_key + data jsonb)
templates        -- available portfolio templates
doctor_templates -- which template a doctor has selected
subscriptions    -- Razorpay subscription records
appointments     -- appointment requests from public visitors
```

**RLS policy pattern for every doctor-owned table:**
```sql
-- Doctors can only see and modify their own data
create policy "doctor owns row"
on table_name for all
using (auth.uid() = doctor_id);
```

---

## 9. Token efficiency rules

These rules exist to keep Claude Code sessions fast and focused.

- **Read only the files you need.** Before reading a file, state why you
  need it. Do not read entire directories speculatively.
- **Edit surgically.** Use targeted edits (`str_replace`) not full file
  rewrites, unless the change affects more than 50% of the file.
- **No unnecessary commentary.** Do not narrate what you are about to do.
  Do it, then give a one-sentence summary of what changed.
- **Batch related changes.** If three files need the same type of change,
  do all three in one response.
- **Do not repeat code in explanations.** If you just wrote a function,
  do not paste it again to explain it. Reference it by name.
- **Stop and ask when genuinely ambiguous.** One clarifying question is
  cheaper than building the wrong thing and reverting it.
- **Never regenerate working code.** If a component already works and the
  task is to add a feature, add only the feature. Do not rewrite the
  existing component from scratch.

---

## 10. Error handling standard

Every async function in this project follows this pattern:

```typescript
// Server action pattern
export async function someAction(input: InputType) {
  try {
    const validated = someSchema.safeParse(input)
    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors }
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('table')
      .insert(validated.data)

    if (error) {
      console.error('[someAction]', error.message)
      return { error: 'Something went wrong. Please try again.' }
    }

    return { data }
  } catch (err) {
    console.error('[someAction] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}
```

- Always return `{ data }` on success and `{ error: string }` on failure.
- Never throw errors from server actions — return them.
- User-facing error messages are always in plain English, never technical.
- Log the technical detail with `console.error('[functionName]', ...)`.

---

## 11. Security checklist

Run through this mentally before finishing any feature:

- [ ] Is this route protected by middleware?
- [ ] Is the Supabase RLS policy correct for this table?
- [ ] Are any secret keys exposed to the client?
- [ ] Is user input validated with zod before touching the database?
- [ ] Is the Razorpay webhook signature verified before processing?
- [ ] Are file uploads validated for type and size before upload?
- [ ] Is the doctor's `slug` generated from their name safely (no XSS)?

---

## 12. Performance rules

- Images always use `next/image` with explicit `width` and `height`.
- Dynamic imports (`next/dynamic`) for heavy components (template previews,
  rich text editors, image croppers).
- Supabase queries always `select` only the columns needed — never `select('*')`
  on tables with a `data jsonb` column.
- Public portfolio pages use `generateStaticParams` for ISR with
  `revalidate = 3600` (1 hour).
- Fonts loaded via `next/font/google` only. Never a `<link>` tag.

---

## 13. Template architecture

Each template is a self-contained folder under `components/templates/`.

```
components/templates/classic/
├── index.tsx          ← the root component, receives DoctorProfile prop
├── Hero.tsx
├── Sections.tsx
├── AppointmentCTA.tsx
└── classic.types.ts   ← template-specific type extensions if needed
```

All three templates receive the **same `DoctorProfile` prop type** defined
in `types/DoctorProfile.ts`. The data layer never changes — only the visual
layer changes per template.

```typescript
// types/DoctorProfile.ts — the single prop type all templates consume
export interface DoctorProfile {
  doctor: Doctor
  sections: Record<SectionKey, unknown>
  template: Template
}
```

---

## 14. Indian market specifics

These are non-negotiable product requirements, not preferences:

- Phone number fields always show `+91` prefix and accept 10-digit numbers.
- Razorpay is the only payment gateway. Do not suggest Stripe.
- OTP via MSG91. Do not suggest Twilio as primary (too expensive for India).
- Currency always displayed as `₹` (not INR, not Rs).
- Date format: DD/MM/YYYY in UI. ISO 8601 in database.
- NMC registration number is required. Show a verified badge (✓) once checked.
- WhatsApp CTA is mandatory on the public portfolio — it is how Indian
  patients actually contact doctors.
- Default language: English. Regional language support is a future feature.

---

## 15. What Claude should never do

- Never use `create-react-app` or plain React. This is a Next.js project.
- Never use `pages/` router. App Router only.
- Never use `axios`. Use native `fetch` or Supabase client methods.
- Never use `moment.js`. Use `date-fns`.
- Never install a new package without stating why the existing stack
  cannot solve the problem.
- Never expose a service-role key, API secret, or webhook secret to
  the client bundle.
- Never write a migration that drops a column without a backup strategy.
- Never skip error handling to "keep the code simple."
- Never write tests that mock the thing being tested.
- Never push directly to `main`. Always use a feature branch.

---

## 16. Git conventions

```
feat: add WhatsApp CTA to public portfolio
fix: correct OTP expiry check in auth flow
chore: update Supabase client to latest SDK
docs: add billing section to SPEC.md
refactor: extract appointment form into its own component
```

Branch naming: `feat/template-modern`, `fix/auth-otp-bug`, `chore/update-deps`

---

## 17. Definition of done

A feature is done when:

1. It works correctly on mobile (375px) and desktop (1280px).
2. Loading states are implemented (skeleton or spinner).
3. Error states are implemented (empty state or error message).
4. TypeScript compiles with zero errors (`tsc --noEmit`).
5. No `console.log` statements remain.
6. The relevant section of SPEC.md still accurately describes what was built.
7. Environment variables used are documented in `.env.local.example`.

---

*Last updated: project init. Update this file whenever a major architectural
decision is made.*