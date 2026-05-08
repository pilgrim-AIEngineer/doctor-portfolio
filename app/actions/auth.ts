// Server actions for phone OTP authentication via Supabase
'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { authSchema, otpSchema, onboardingSchema } from '@/lib/validations/profile'
import { PHONE_PREFIX } from '@/lib/constants'
import { slugify } from '@/lib/utils'

export async function sendOtp(formData: FormData): Promise<{ error?: string }> {
  try {
    const raw = { phone: formData.get('phone') as string }
    const validated = authSchema.safeParse(raw)

    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors.phone?.[0] ?? 'Invalid phone number' }
    }

    const supabase = createServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: `${PHONE_PREFIX}${validated.data.phone}`,
    })

    if (error) {
      console.error('[sendOtp]', error.message)
      return { error: 'Could not send OTP. Please try again.' }
    }

    return {}
  } catch (err) {
    console.error('[sendOtp] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function verifyOtp(
  phone: string,
  formData: FormData
): Promise<{ error?: string; isNewUser?: boolean }> {
  // redirect() must be outside try/catch — it throws a special error
  let shouldRedirect = false

  try {
    const raw = { otp: formData.get('otp') as string }
    const validated = otpSchema.safeParse(raw)

    if (!validated.success) {
      return { error: 'Enter the 6-digit OTP sent to your number.' }
    }

    const supabase = createServerClient()
    const { data: authData, error } = await supabase.auth.verifyOtp({
      phone: `${PHONE_PREFIX}${phone}`,
      token: validated.data.otp,
      type: 'sms',
    })

    if (error) {
      console.error('[verifyOtp]', error.message)
      return { error: 'Incorrect OTP. Please try again.' }
    }

    if (!authData.user) {
      return { error: 'Authentication failed. Please try again.' }
    }

    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (!doctor) {
      return { isNewUser: true }
    }

    shouldRedirect = true
  } catch (err) {
    console.error('[verifyOtp] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }

  if (shouldRedirect) redirect('/dashboard/profile')
  return {}
}

export async function completeOnboarding(formData: FormData): Promise<{ error?: string }> {
  // redirect() must be outside try/catch — it throws a special error
  let shouldRedirect = false

  try {
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
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

    // Generate unique slug — user.phone already has the +91 prefix from Supabase auth
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
      email: validated.data.email || null,
      phone: user.phone!,
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
