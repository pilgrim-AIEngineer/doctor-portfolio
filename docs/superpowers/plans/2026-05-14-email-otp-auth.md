# Email OTP Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace magic-link login with an 8-digit OTP entered directly on the login page so users never leave the app during authentication.

**Architecture:** The email step calls `sendEmailOtp` (Supabase `signInWithOtp` without `emailRedirectTo`), which triggers Supabase to send a token-only email. The new OTP step collects the 8-digit code and calls `verifyEmailOtp`, which calls `supabase.auth.verifyOtp` and redirects to `/onboarding` or `/dashboard/profile` based on whether the user has a `doctors` row. The `/auth/callback` route handler is deleted because session creation now happens inside `verifyEmailOtp`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Supabase Auth, react-hook-form + zod, Tailwind CSS

---

## File Map

| File | Change |
|---|---|
| `lib/validations/profile.ts` | Update `otpSchema`: 6 → 8 digits |
| `app/actions/auth.ts` | Rename `sendMagicLink` → `sendEmailOtp`; remove `emailRedirectTo`; add `verifyEmailOtp` |
| `components/auth/PhoneStep.tsx` | Update button labels; import `sendEmailOtp` |
| `components/auth/OtpStep.tsx` | Full rewrite: interactive OTP form with react-hook-form + `otpSchema` |
| `components/auth/LoginFlow.tsx` | Step type `'check-email'` → `'otp'` |
| `app/auth/callback/route.ts` | **Delete** |

---

## Task 1: Update `otpSchema` to 8 digits

**Files:**
- Modify: `lib/validations/profile.ts:163-165`

- [ ] **Step 1: Update the schema**

In `lib/validations/profile.ts`, find lines 163-165:
```ts
export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
})
```

Replace with:
```ts
export const otpSchema = z.object({
  otp: z.string().length(8, 'OTP must be 8 digits').regex(/^\d{8}$/, 'OTP must be numeric'),
})
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add lib/validations/profile.ts
git commit -m "fix: update otpSchema to 8 digits"
```

---

## Task 2: Update `app/actions/auth.ts`

**Files:**
- Modify: `app/actions/auth.ts`

This task renames `sendMagicLink` → `sendEmailOtp`, removes the `emailRedirectTo` option, and adds `verifyEmailOtp`.

- [ ] **Step 1: Rewrite `app/actions/auth.ts`**

Replace the entire file content with:

```ts
// Server actions for OTP-based email authentication via Supabase
'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { authSchema, otpSchema, onboardingSchema } from '@/lib/validations/profile'
import { slugify } from '@/lib/utils'

export async function sendEmailOtp(formData: FormData): Promise<{ error?: string }> {
  try {
    const raw = { email: formData.get('email') as string }
    const validated = authSchema.safeParse(raw)

    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors.email?.[0] ?? 'Invalid email address' }
    }

    const supabase = createServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: validated.data.email,
      options: { shouldCreateUser: true },
    })

    if (error) {
      console.error('[sendEmailOtp]', error.message)
      return { error: 'Could not send code. Please try again.' }
    }

    return {}
  } catch (err) {
    console.error('[sendEmailOtp] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<{ error?: string }> {
  // redirect() must be outside try/catch — it throws a special Next.js error
  let destination: string | null = null

  try {
    const validated = otpSchema.safeParse({ otp: token })
    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors.otp?.[0] ?? 'Invalid code' }
    }

    const supabase = createServerClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      console.error('[verifyEmailOtp]', error.message)
      return { error: 'Invalid or expired code. Please try again.' }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Session expired. Please log in again.' }
    }

    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    destination = doctor ? '/dashboard/profile' : '/onboarding'
  } catch (err) {
    console.error('[verifyEmailOtp] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }

  redirect(destination)
}

export async function completeOnboarding(formData: FormData): Promise<{ error?: string }> {
  // redirect() must be outside try/catch — it throws a special error
  let shouldRedirect = false

  try {
    const raw = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      nmc_number: formData.get('nmc_number') as string,
      specialty: formData.get('specialty') as string,
    }
    const validated = onboardingSchema.safeParse(raw)

    if (!validated.success) {
      const first = Object.values(validated.error.flatten().fieldErrors).flat()[0]
      return { error: first ?? 'Please fill in all required fields.' }
    }

    const supabase = createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Session expired. Please log in again.' }
    }

    // Generate unique slug from doctor name
    const baseSlug = `dr-${slugify(validated.data.name)}`
    const { data: existing } = await supabase
      .from('doctors')
      .select('slug')
      .eq('slug', baseSlug)
      .maybeSingle()
    const slug = existing
      ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
      : baseSlug

    const { error: insertError } = await supabase.from('doctors').insert({
      id: user.id,
      name: validated.data.name,
      email: user.email!,
      phone: validated.data.phone || null,
      nmc_number: validated.data.nmc_number,
      specialty: validated.data.specialty,
      slug,
    })

    if (insertError) {
      console.error('[completeOnboarding]', insertError.message)
      if (insertError.message.includes('nmc_number')) {
        return { error: 'This NMC number is already registered.' }
      }
      return { error: 'Could not save your profile. Please try again.' }
    }

    shouldRedirect = true
  } catch (err) {
    console.error('[completeOnboarding] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }

  if (shouldRedirect) redirect('/dashboard/profile')
  return {}
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: zero errors. (Will fail until PhoneStep.tsx is updated in Task 3 since it still imports `sendMagicLink`.)

- [ ] **Step 3: Commit**

```bash
git add app/actions/auth.ts
git commit -m "feat: replace sendMagicLink with sendEmailOtp, add verifyEmailOtp action"
```

---

## Task 3: Update `PhoneStep.tsx` and `LoginFlow.tsx`

**Files:**
- Modify: `components/auth/PhoneStep.tsx`
- Modify: `components/auth/LoginFlow.tsx`

These are small label/import/type changes. Do both in one commit.

- [ ] **Step 1: Update `components/auth/PhoneStep.tsx`**

Replace the entire file content with:

```tsx
// Email address input — step 1 of the auth flow
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema } from '@/lib/validations/profile'
import type { AuthInput } from '@/lib/validations/profile'
import { sendEmailOtp } from '@/app/actions/auth'

interface Props {
  onEmailSent: (email: string) => void
}

export default function EmailStep({ onEmailSent }: Props) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthInput>({ resolver: zodResolver(authSchema) })

  function onSubmit(data: AuthInput) {
    const formData = new FormData()
    formData.append('email', data.email)

    startTransition(async () => {
      const result = await sendEmailOtp(formData)
      if (result.error) {
        setError('email', { message: result.error })
      } else {
        onEmailSent(data.email)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          {...register('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="doctor@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending && (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isPending ? 'Sending code…' : 'Send code'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Update `components/auth/LoginFlow.tsx`**

Replace the entire file content with:

```tsx
// Multi-step auth flow: email → OTP entry
'use client'

import { useState } from 'react'
import EmailStep from './PhoneStep'
import OtpStep from './OtpStep'

type Step = 'email' | 'otp'

export default function LoginFlow() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')

  function handleEmailSent(sentEmail: string) {
    setEmail(sentEmail)
    setStep('otp')
  }

  function handleChangeEmail() {
    setStep('email')
  }

  return (
    <>
      {step === 'email' && <EmailStep onEmailSent={handleEmailSent} />}

      {step === 'otp' && (
        <OtpStep email={email} onChangeEmail={handleChangeEmail} />
      )}
    </>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: zero errors (OtpStep.tsx is not yet rewritten, but the Props interface `{ email: string; onChangeEmail: () => void }` already matches the existing file — so no errors yet).

- [ ] **Step 4: Commit**

```bash
git add components/auth/PhoneStep.tsx components/auth/LoginFlow.tsx
git commit -m "feat: update email step labels to Send code, update LoginFlow step type to otp"
```

---

## Task 4: Rewrite `OtpStep.tsx`

**Files:**
- Modify: `components/auth/OtpStep.tsx`

This is the largest change: replace the static "check your inbox" screen with an interactive OTP form using react-hook-form and `otpSchema`.

- [ ] **Step 1: Rewrite `components/auth/OtpStep.tsx`**

Replace the entire file content with:

```tsx
// OTP entry — step 2 of the email auth flow
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema } from '@/lib/validations/profile'
import { sendEmailOtp, verifyEmailOtp } from '@/app/actions/auth'

interface OtpInput {
  otp: string
}

interface Props {
  email: string
  onChangeEmail: () => void
}

export default function OtpStep({ email, onChangeEmail }: Props) {
  const [isResending, startResend] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpInput>({ resolver: zodResolver(otpSchema) })

  async function onSubmit(data: OtpInput) {
    const result = await verifyEmailOtp(email, data.otp)
    if (result?.error) {
      setError('otp', { message: result.error })
    }
  }

  function resend() {
    const formData = new FormData()
    formData.append('email', email)
    startResend(async () => { await sendEmailOtp(formData) })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Enter your code</h2>
        <p className="mt-1 text-sm text-gray-500">
          We sent an 8-digit code to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('otp')}
            type="text"
            inputMode="numeric"
            maxLength={8}
            autoComplete="one-time-code"
            placeholder="12345678"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSubmitting ? 'Verifying…' : 'Verify'}
        </button>
      </form>

      <div className="space-y-2">
        <button
          type="button"
          onClick={resend}
          disabled={isResending}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isResending ? 'Resending…' : 'Resend code'}
        </button>

        <button
          type="button"
          onClick={onChangeEmail}
          className="w-full text-sm text-brand-600 hover:underline"
        >
          Use a different email
        </button>
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
git add components/auth/OtpStep.tsx
git commit -m "feat: rewrite OtpStep as interactive 8-digit OTP form"
```

---

## Task 5: Delete the callback route

**Files:**
- Delete: `app/auth/callback/route.ts`

The `/auth/callback` route handler exchanged magic-link codes for sessions. Session creation now happens inside `verifyEmailOtp`, so this file is dead code.

The middleware matcher does not reference `/auth/callback` (confirmed: `matcher` only covers `/dashboard/:path*`, `/admin/:path*`, `/login`, `/onboarding`), so deleting this file will not cause any 404 in middleware rules.

- [ ] **Step 1: Delete the file**

```bash
rm app/auth/callback/route.ts
```

If the `app/auth/callback/` directory is now empty, remove it too:

```bash
rmdir app/auth/callback
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add -A app/auth/callback
git commit -m "chore: delete auth/callback route — no longer needed after OTP migration"
```

---

## Definition of Done Checklist

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Email step button reads "Send code" / "Sending code…"
- [ ] OTP step shows "Enter your code", accepts 8-digit input, verifies and redirects
- [ ] Resend button works (calls `sendEmailOtp` again)
- [ ] "Use a different email" link returns to email step
- [ ] New user (no `doctors` row) is redirected to `/onboarding` after verify
- [ ] Returning user is redirected to `/dashboard/profile` after verify
- [ ] `/auth/callback` directory is deleted
- [ ] No `console.log` in committed code
