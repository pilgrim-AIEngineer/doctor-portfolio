// Server actions for fetching and saving a doctor's template selection
'use server'

import { TEMPLATE_META } from '@/lib/constants'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import type { Doctor } from '@/types/Doctor'
import type { SectionKey } from '@/types/Profile'
import type { Template } from '@/types/Template'

interface TemplateData {
  templates: Template[]
  currentTemplateId: string | null
  plan: 'free' | 'pro'
}

interface PreviewProfileData {
  doctor: Doctor
  sections: Partial<Record<SectionKey, unknown>>
  template: Template
}

const DEFAULT_TEMPLATE: Template = {
  id: 'classic',
  name: 'classic',
  preview_image: '',
  is_active: true,
}

async function ensureTemplateCatalog() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return

  const supabase = createServiceClient()
  const rows = Object.keys(TEMPLATE_META).map((name) => ({
    name,
    preview_image: '',
    is_active: true,
  }))

  const { error } = await supabase
    .from('templates')
    .upsert(rows, { onConflict: 'name', ignoreDuplicates: true })

  if (error) {
    console.error('[ensureTemplateCatalog]', error.message)
  }
}

export async function getTemplateData(): Promise<{ data?: TemplateData; error?: string }> {
  try {
    await ensureTemplateCatalog()

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
    await ensureTemplateCatalog()

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

export async function getPreviewProfileData(): Promise<{ data?: PreviewProfileData; error?: string }> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    const [doctorResult, sectionsResult, templateResult] = await Promise.all([
      supabase
        .from('doctors')
        .select('id, name, email, phone, nmc_number, specialty, slug, plan, is_verified, is_admin, is_published, created_at')
        .eq('id', user.id)
        .single(),
      supabase.from('profiles').select('section_key, data').eq('doctor_id', user.id),
      supabase
        .from('doctor_templates')
        .select('templates(id, name, preview_image, is_active)')
        .eq('doctor_id', user.id)
        .maybeSingle(),
    ])

    if (doctorResult.error) {
      console.error('[getPreviewProfileData] doctor', doctorResult.error.message)
      return { error: 'Failed to load doctor profile.' }
    }
    if (sectionsResult.error) {
      console.error('[getPreviewProfileData] sections', sectionsResult.error.message)
      return { error: 'Failed to load profile sections.' }
    }

    const sections: Partial<Record<SectionKey, unknown>> = {}
    for (const row of sectionsResult.data ?? []) {
      sections[row.section_key as SectionKey] = row.data
    }

    const rawTemplate = templateResult.data?.templates as unknown as Template | undefined

    return {
      data: {
        doctor: doctorResult.data as Doctor,
        sections,
        template: rawTemplate ?? DEFAULT_TEMPLATE,
      },
    }
  } catch (err) {
    console.error('[getPreviewProfileData] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}
