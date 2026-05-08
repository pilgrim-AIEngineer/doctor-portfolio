# DocFolio — Development Notes

Record architectural decisions, gotchas, and non-obvious context here.
Keep entries short. Add date and context.

---

## 2026-05-08 — Project initialised

- Next.js 14 App Router, TypeScript strict, Tailwind CSS
- Supabase Auth (phone OTP) + PostgreSQL with RLS on every table from day one
- Three portfolio templates: classic, modern, bold — all receive the same `DoctorProfile` prop
- Auto-save on all profile forms via `useAutoSave` hook (1 s debounce)
- Public portfolios at `/dr/[slug]` use ISR with 1-hour revalidation
- Razorpay webhook at `/api/razorpay-webhook` verifies HMAC-SHA256 before any DB write
- See SPEC.md for product spec; CLAUDE.md for coding rules
