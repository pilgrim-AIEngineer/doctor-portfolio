// Server actions for magic-link email authentication via Supabase
'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { authSchema, onboardingSchema } from '@/lib/validations/profile'
import { APP_URL } from '@/lib/constants'
import { slugify } from '@/lib/utils'

export async function sendMagicLink(formData: FormData): Promise<{ error?: string }> {
  try {
    const raw = { email: formData.get('email') as string }
    const validated = authSchema.safeParse(raw)

    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors.email?.[0] ?? 'Invalid email address' }
    }

    const supabase = createServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: validated.data.email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${APP_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('[sendMagicLink]', error.message)
      return { error: 'Could not send login link. Please try again.' }
    }

    return {}
  } catch (err) {
    console.error('[sendMagicLink] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
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
