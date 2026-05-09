// Server actions for the admin panel — all mutations and reads for admin-only operations
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import type { Doctor } from '@/types/Doctor'
import type { Template } from '@/types/Template'

export interface AdminStats {
  totalDoctors: number
  verifiedDoctors: number
  freePlan: number
  proPlan: number
}

async function requireAdmin(): Promise<{ userId: string } | { error: string }> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error || !doctor?.is_admin) return { error: 'Unauthorized' }
  return { userId: user.id }
}

export async function getAdminStats(): Promise<{ data?: AdminStats; error?: string }> {
  try {
    const service = createServiceClient()
    const [total, verified, free, pro] = await Promise.all([
      service.from('doctors').select('*', { count: 'exact', head: true }),
      service.from('doctors').select('*', { count: 'exact', head: true }).eq('is_verified', true),
      service.from('doctors').select('*', { count: 'exact', head: true }).eq('plan', 'free'),
      service.from('doctors').select('*', { count: 'exact', head: true }).eq('plan', 'pro'),
    ])
    if (total.error) return { error: 'Failed to load stats' }
    return {
      data: {
        totalDoctors: total.count ?? 0,
        verifiedDoctors: verified.count ?? 0,
        freePlan: free.count ?? 0,
        proPlan: pro.count ?? 0,
      },
    }
  } catch (err) {
    console.error('[getAdminStats]', err)
    return { error: 'Unexpected error loading stats' }
  }
}

export async function getAllDoctors(): Promise<{ data?: Doctor[]; error?: string }> {
  try {
    const service = createServiceClient()
    const { data, error } = await service
      .from('doctors')
      .select('id, name, specialty, nmc_number, plan, slug, is_verified, is_admin, created_at')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[getAllDoctors]', error.message)
      return { error: 'Failed to load doctors' }
    }
    return { data: data as Doctor[] }
  } catch (err) {
    console.error('[getAllDoctors] unexpected', err)
    return { error: 'Unexpected error loading doctors' }
  }
}

export async function getAllTemplates(): Promise<{ data?: Template[]; error?: string }> {
  try {
    // Must use service client — RLS hides inactive templates from regular queries
    const service = createServiceClient()
    const { data, error } = await service.from('templates').select('*').order('name')
    if (error) {
      console.error('[getAllTemplates]', error.message)
      return { error: 'Failed to load templates' }
    }
    return { data: data as Template[] }
  } catch (err) {
    console.error('[getAllTemplates] unexpected', err)
    return { error: 'Unexpected error loading templates' }
  }
}

export async function toggleDoctorVerification(
  doctorId: string,
  currentValue: boolean,
): Promise<{ data?: boolean; error?: string }> {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return { error: auth.error }

    const service = createServiceClient()
    const newValue = !currentValue
    const { data, error } = await service
      .from('doctors')
      .update({ is_verified: newValue })
      .eq('id', doctorId)
      .select('slug')
      .single()

    if (error) {
      console.error('[toggleDoctorVerification]', error.message)
      return { error: 'Failed to update verification status' }
    }

    revalidatePath('/admin')
    revalidatePath(`/dr/${data.slug}`)
    return { data: newValue }
  } catch (err) {
    console.error('[toggleDoctorVerification] unexpected', err)
    return { error: 'Unexpected error' }
  }
}

export async function toggleTemplateActive(
  templateId: string,
  currentValue: boolean,
): Promise<{ data?: boolean; error?: string }> {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return { error: auth.error }

    const service = createServiceClient()
    const newValue = !currentValue
    const { error } = await service
      .from('templates')
      .update({ is_active: newValue })
      .eq('id', templateId)

    if (error) {
      console.error('[toggleTemplateActive]', error.message)
      return { error: 'Failed to update template status' }
    }

    revalidatePath('/admin')
    revalidatePath('/dashboard/template')
    return { data: newValue }
  } catch (err) {
    console.error('[toggleTemplateActive] unexpected', err)
    return { error: 'Unexpected error' }
  }
}
