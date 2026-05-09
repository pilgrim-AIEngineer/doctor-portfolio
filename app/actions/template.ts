// Server actions for fetching and saving a doctor's template selection
'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { Template } from '@/types/Template'

interface TemplateData {
  templates: Template[]
  currentTemplateId: string | null
  plan: 'free' | 'pro'
}

export async function getTemplateData(): Promise<{ data?: TemplateData; error?: string }> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    const [templatesResult, selectionResult, doctorResult] = await Promise.all([
      supabase.from('templates').select('id, name, preview_image, is_active').eq('is_active', true),
      supabase.from('doctor_templates').select('template_id').eq('doctor_id', user.id).maybeSingle(),
      supabase.from('doctors').select('plan').eq('id', user.id).single(),
    ])

    if (templatesResult.error) {
      console.error('[getTemplateData] templates', templatesResult.error.message)
      return { error: 'Failed to load templates.' }
    }
    if (doctorResult.error) {
      console.error('[getTemplateData] doctor', doctorResult.error.message)
      return { error: 'Failed to load account info.' }
    }

    return {
      data: {
        templates: templatesResult.data as Template[],
        currentTemplateId: selectionResult.data?.template_id ?? null,
        plan: doctorResult.data.plan as 'free' | 'pro',
      },
    }
  } catch (err) {
    console.error('[getTemplateData] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function selectTemplate(templateId: string): Promise<{ data?: boolean; error?: string }> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    const [doctorResult, templateResult] = await Promise.all([
      supabase.from('doctors').select('plan').eq('id', user.id).single(),
      supabase.from('templates').select('name').eq('id', templateId).single(),
    ])

    if (doctorResult.error || templateResult.error) {
      console.error('[selectTemplate] lookup', doctorResult.error?.message ?? templateResult.error?.message)
      return { error: 'Failed to verify selection. Please try again.' }
    }

    if (doctorResult.data.plan === 'free' && templateResult.data.name !== 'classic') {
      return { error: 'Upgrade to Pro to use this template.' }
    }

    const { error } = await supabase
      .from('doctor_templates')
      .upsert({ doctor_id: user.id, template_id: templateId }, { onConflict: 'doctor_id' })

    if (error) {
      console.error('[selectTemplate] upsert', error.message)
      return { error: 'Failed to save template. Please try again.' }
    }

    return { data: true }
  } catch (err) {
    console.error('[selectTemplate] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}
