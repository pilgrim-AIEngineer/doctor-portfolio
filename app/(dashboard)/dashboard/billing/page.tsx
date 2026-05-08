// Subscription and billing management
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Billing' }

export default function BillingPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Billing &amp; Subscription</h1>
      {/* Plan cards and Razorpay integration added in feat/billing */}
      <p className="text-gray-400 text-sm">Billing section coming soon</p>
    </div>
  )
}
