// Razorpay webhook handler — verifies HMAC signature before processing subscription events
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { SUBSCRIPTION_STATUS } from '@/lib/constants'

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') ?? ''
    const secret = process.env.RAZORPAY_KEY_SECRET ?? ''

    // Verify webhook authenticity — Razorpay signs with HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body) as {
      event: string
      payload: { subscription: { entity: { id: string; status: string } } }
    }

    const supabase = getServiceSupabase()

    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.charged': {
        const { id, status } = event.payload.subscription.entity
        await supabase
          .from('subscriptions')
          .update({ status: SUBSCRIPTION_STATUS.ACTIVE })
          .eq('razorpay_id', id)
        break
      }
      case 'subscription.cancelled': {
        const { id } = event.payload.subscription.entity
        await supabase
          .from('subscriptions')
          .update({ status: SUBSCRIPTION_STATUS.CANCELLED })
          .eq('razorpay_id', id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[razorpay-webhook]', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
