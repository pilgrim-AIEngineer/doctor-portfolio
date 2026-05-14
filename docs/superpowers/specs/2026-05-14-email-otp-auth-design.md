# Email OTP Auth — Design Spec

**Date:** 2026-05-14
**Status:** Approved

---

## Problem

The current login flow sends a magic link to the doctor's email. The user must leave the app, open their inbox, click the link, and be redirected back. This is friction-heavy and breaks the in-app session flow.

## Goal

Replace the magic link with an 8-digit OTP entered directly on the login page. The user stays in the app throughout the entire auth flow.

---

## Flow

```
Email step → [sendEmailOtp] → Supabase sends 8-digit OTP email
OTP step   → [verifyEmailOtp] → Supabase verifies token → check doctors table
                                  ├─ new user  → redirect /onboarding
                                  └─ returning → redirect /dashboard/profile
```

---

## Changes

### 1. `lib/validations/profile.ts`

Update `otpSchema`:
- `.length(6)` → `.length(8)`
- regex `^\d{6}$` → `^\d{8}$`

No other schema changes.

### 2. `app/actions/auth.ts`

**Rename** `sendMagicLink` → `sendEmailOtp`.
- Remove the `emailRedirectTo` option from `signInWithOtp` so Supabase sends a token instead of a link.
- All other logic (validation, error handling pattern) stays the same.

**Add** `verifyEmailOtp(formData: FormData): Promise<{ error?: string }>`.
- Inputs: `email` (string), `token` (string).
- Validate `token` with `otpSchema`.
- Call `supabase.auth.verifyOtp({ email, token, type: 'email' })`.
- On error: return `{ error: 'Invalid or expired code. Please try again.' }`.
- On success: query `doctors` table for `user.id`.
  - No row → `redirect('/onboarding')`.
  - Row exists → `redirect('/dashboard/profile')`.
- `redirect()` calls live outside the try/catch (same pattern as `completeOnboarding`).

### 3. `components/auth/PhoneStep.tsx`

- Button label: "Send login link" → "Send code"
- Button pending label: "Sending link…" → "Sending code…"
- Update import: `sendMagicLink` → `sendEmailOtp`

### 4. `components/auth/OtpStep.tsx`

Full rewrite. Replace static "check your inbox" screen with an interactive OTP form:

- Heading: "Enter your code"
- Sub-copy: "We sent an 8-digit code to **{email}**"
- Single `<input type="text" inputMode="numeric" maxLength={8}>` controlled by react-hook-form + `otpSchema`
- Submit button: "Verify" / "Verifying…"
- On submit error: show inline error under the input
- Resend button: calls `sendEmailOtp` with the email prop, shows "Resending…" while pending
- "Use different email" link: calls `onChangeEmail` prop

Props interface:
```ts
interface Props {
  email: string
  onChangeEmail: () => void
}
```

### 5. `components/auth/LoginFlow.tsx`

- Step type: `'check-email'` → `'otp'`
- Handler name: `handleEmailSent` stays; internal step transition uses `'otp'`
- Render: `step === 'otp'` instead of `step === 'check-email'`

### 6. `app/auth/callback/route.ts`

**Delete.** The code-exchange callback is no longer needed — session creation now happens inside `verifyEmailOtp`.

---

## What is NOT changing

- The onboarding step (`OnboardingStep.tsx`, `completeOnboarding` action) — untouched.
- The `authSchema` (email validation) — untouched.
- The `onboardingSchema` — untouched.
- Supabase Auth provider configuration — OTP is already 8 digits per live confirmation.
- Middleware and route protection — untouched.

---

## Error states

| Scenario | User-facing message |
|---|---|
| Invalid email format | Existing zod error on email field |
| Supabase fails to send OTP | "Could not send code. Please try again." |
| Wrong / expired OTP | "Invalid or expired code. Please try again." |
| Session lost after verify | "Session expired. Please log in again." |

---

## Definition of done

- [ ] TypeScript compiles with zero errors.
- [ ] Email step shows "Send code" and transitions to OTP step on success.
- [ ] OTP step accepts 8-digit numeric input, verifies, and redirects correctly.
- [ ] Resend and "Use different email" both work.
- [ ] `/auth/callback` route is deleted and does not 404 in middleware rules.
- [ ] No `console.log` in committed code.
