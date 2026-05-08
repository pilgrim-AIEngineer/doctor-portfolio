// Subscription table row type
export interface Subscription {
  id: string
  doctor_id: string
  plan: 'free' | 'pro'
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  razorpay_id: string
  expires_at: string | null
}
