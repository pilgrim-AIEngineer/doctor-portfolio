// Client component for billing plan display and mock payment flow
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, CreditCard, CheckCircle, Lock, X, Loader2 } from 'lucide-react'
import { processMockPayment } from '@/app/actions/billing'
import { PLANS, PLAN_PRICE, SUBSCRIPTION_STATUS } from '@/lib/constants'
import Toast from '@/components/ui/Toast'
import type { Subscription } from '@/types/Subscription'

interface Props {
  doctor: { id: string; name: string; plan: 'free' | 'pro' }
  subscription: Subscription | null
}

const FREE_FEATURES = [
  '1 portfolio template (Classic)',
  'Public portfolio at /dr/your-name',
  'Basic profile sections',
  'Appointment booking form',
]

const PRO_FEATURES = [
  'All 3 premium templates',
  'Custom domain support',
  'Analytics dashboard',
  'All profile sections (gallery, research, etc.)',
  'Priority support',
]

export default function BillingPanel({ doctor, subscription }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const clearToast = useCallback(() => setToast(null), [])

  async function handlePayment(simulateSuccess: boolean) {
    setIsPaying(true)
    const result = await processMockPayment(simulateSuccess)
    setIsPaying(false)
    setShowModal(false)

    if (result.error) {
      setToast({ message: result.error, type: 'error' })
      return
    }

    setToast({ message: 'You are now on Pro! Enjoy all features.', type: 'success' })
    router.refresh()
  }

  const isPro = doctor.plan === PLANS.PRO

  const formattedExpiry = subscription?.expires_at
    ? new Date(subscription.expires_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Current Plan</h2>
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 bg-gold-100 text-gold-600 text-xs font-semibold px-3 py-1 rounded-full">
              <Crown size={13} />
              Pro
            </span>
          ) : (
            <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              Free
            </span>
          )}
        </div>

        {isPro && subscription ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  subscription.status === SUBSCRIPTION_STATUS.ACTIVE
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            {formattedExpiry && (
              <p className="text-sm text-gray-500">Renews on {formattedExpiry}</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Upgrade to Pro to unlock all templates and advanced features.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Upgrade to Pro — ₹{PLAN_PRICE.PRO}/month
            </button>
          </div>
        )}
      </div>

      {/* Plan Features Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">What&apos;s included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Free</p>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-3">Pro — ₹{PLAN_PRICE.PRO}/mo</p>
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  {isPro ? (
                    <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <Lock size={15} className="text-gray-300 mt-0.5 shrink-0" />
                  )}
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-brand-600" />
                <h3 className="text-base font-semibold text-gray-900">Complete Payment</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={isPaying}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>DocFolio Pro — 1 month</span>
                <span className="font-medium">₹{PLAN_PRICE.PRO}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{PLAN_PRICE.PRO}/month</span>
              </div>
            </div>

            {/* Demo notice */}
            <div className="bg-brand-50 text-brand-700 text-xs rounded-lg p-3 mb-5">
              This is a demo payment. No real money is charged.
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handlePayment(true)}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors"
              >
                {isPaying ? <Loader2 size={16} className="animate-spin" /> : null}
                Pay ₹{PLAN_PRICE.PRO}
              </button>
              <button
                onClick={() => handlePayment(false)}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 text-sm font-medium py-2.5 rounded-lg hover:bg-red-100 disabled:opacity-60 transition-colors"
              >
                {isPaying ? <Loader2 size={16} className="animate-spin" /> : null}
                Simulate Failure
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
