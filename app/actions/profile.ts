// Server actions for reading and writing doctor profile sections
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { PRO_ONLY_SECTIONS } from '@/lib/constants'
import type { SectionKey } from '@/types/Profile'

export async function saveProfileSection(
  sectionKey: SectionKey,
  data: unknown
): Promise<{ data?: unknown; error?: string }> {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Not authenticated' }

    if ((PRO_ONLY_SECTIONS as readonly string[]).includes(sectionKey)) {
      const { data: planRow } = await supabase
        .from('doctors')
        .select('plan')
        .eq('id', user.id)
        .single()
      if (planRow?.plan !== 'pro') {
        return { error: 'Pro plan required to save this section.' }
      }
    }

    const { data: saved, error } = await supabase
      .from('profiles')
      .upsert(
        {
          doctor_id: user.id,
          section_key: sectionKey,
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'doctor_id,section_key' }
      )
      .select()
      .single()

    if (error) {
      console.error('[saveProfileSection]', error.message)
      return { error: 'Failed to save. Please try again.' }
    }

    // Revalidate both the dashboard and the public portfolio so changes appear immediately
    const { data: doctorRow } = await supabase
      .from('doctors')
      .select('slug')
      .eq('id', user.id)
      .single()

    revalidatePath('/dashboard/profile')
    if (doctorRow?.slug) {
      revalidatePath(`/dr/${doctorRow.slug}`)
    }

    return { data: saved }
  } catch (err) {
    console.error('[saveProfileSection] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function togglePublish(
  publish: boolean
): Promise<{ data?: { is_published: boolean }; error?: string }> {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('doctors')
      .update({ is_published: publish })
      .eq('id', user.id)
      .select('is_published, slug')
      .single()

    if (error) {
      console.error('[togglePublish]', error.message)
      return { error: 'Failed to update visibility. Please try again.' }
    }

    revalidatePath('/dashboard/settings')
    if (data?.slug) revalidatePath(`/dr/${data.slug}`)

    return { data: { is_published: data.is_published } }
  } catch (err) {
    console.error('[togglePublish] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function getProfileSections(): Promise<{ data?: unknown; error?: string }> {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('profiles')
      .select('section_key, data, is_visible, display_order, updated_at')
      .eq('doctor_id', user.id)

    if (error) {
      console.error('[getProfileSections]', error.message)
      return { error: 'Failed to load profile.' }
    }

    return { data }
  } catch (err) {
    console.error('[getProfileSections] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function updateSectionOrder(
  updates: { section_key: string; display_order: number; is_visible: boolean }[]
): Promise<{ data?: unknown; error?: string }> {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Not authenticated' }

    const { error } = await supabase
      .from('profiles')
      .upsert(
        updates.map((u) => ({
          doctor_id: user.id,
          section_key: u.section_key,
          is_visible: u.is_visible,
          display_order: u.display_order,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: 'doctor_id,section_key' }
      )

    if (error) {
      console.error('[updateSectionOrder]', error.message)
      return { error: 'Failed to update section order.' }
    }

    const { data: doctorRow } = await supabase
      .from('doctors')
      .select('slug')
      .eq('id', user.id)
      .single()

    if (doctorRow?.slug) revalidatePath(`/dr/${doctorRow.slug}`)

    return { data: true }
  } catch (err) {
    console.error('[updateSectionOrder] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}
