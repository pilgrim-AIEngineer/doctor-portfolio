// Server actions for fetching subscription status and processing mock payments
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { PLANS, SUBSCRIPTION_STATUS } from '@/lib/constants'
import type { Subscription } from '@/types/Subscription'

export async function getCurrentSubscription(): Promise<{ data?: Subscription | null; error?: string }> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('status', SUBSCRIPTION_STATUS.ACTIVE)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[getCurrentSubscription]', error.message)
      return { error: 'Failed to load subscription. Please try again.' }
    }

    return { data: data ?? null }
  } catch (err) {
    console.error('[getCurrentSubscription] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

export async function processMockPayment(
  simulateSuccess: boolean
): Promise<{ data?: { success: true }; error?: string }> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }

    if (!simulateSuccess) {
      return { error: 'Payment failed. Please try again.' }
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { error: insertError } = await supabase.from('subscriptions').insert({
      doctor_id: user.id,
      plan: PLANS.PRO,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      razorpay_id: 'mock_' + Date.now(),
      expires_at: expiresAt,
    })

    if (insertError) {
      console.error('[processMockPayment] insert', insertError.message)
      return { error: 'Failed to activate subscription. Please try again.' }
    }

    const { error: updateError } = await supabase
      .from('doctors')
      .update({ plan: PLANS.PRO })
      .eq('id', user.id)

    if (updateError) {
      console.error('[processMockPayment] update', updateError.message)
      return { error: 'Subscription created but plan update failed. Contact support.' }
    }

    revalidatePath('/dashboard/billing')
    return { data: { success: true } }
  } catch (err) {
    console.error('[processMockPayment] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}
