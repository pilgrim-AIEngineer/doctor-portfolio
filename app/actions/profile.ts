// Server actions for reading and writing doctor profile sections
'use server'

import { createServerClient } from '@/lib/supabase/server'
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

    return { data: saved }
  } catch (err) {
    console.error('[saveProfileSection] unexpected', err)
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
      .select('section_key, data, updated_at')
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
