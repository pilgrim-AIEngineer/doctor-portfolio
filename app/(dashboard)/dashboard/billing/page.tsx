// Billing and subscription management page
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentSubscription } from '@/app/actions/billing'
import BillingPanel from '@/components/dashboard/billing/BillingPanel'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doctor } = await supabase
    .from('doctors')
    .select('id, name, plan')
    .eq('id', user.id)
    .single()

  if (!doctor) redirect('/onboarding')

  const { data: subscription, error } = await getCurrentSubscription()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Billing &amp; Subscription</h1>
      {error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : (
        <BillingPanel
          doctor={doctor as { id: string; name: string; plan: 'free' | 'pro' }}
          subscription={subscription ?? null}
        />
      )}
    </div>
  )
}
