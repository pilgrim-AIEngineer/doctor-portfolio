// Onboarding page — shown to new users after their first magic-link sign-in
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import OnboardingStep from '@/components/auth/OnboardingStep'

export default async function OnboardingPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // If doctor row already exists, they completed onboarding — go to dashboard
  const { data: doctor } = await supabase
    .from('doctors')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (doctor) redirect('/dashboard/profile')

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Set up your portfolio</h1>
        <p className="text-sm text-gray-500 mb-8">Just a few details and you are ready to go.</p>
        <OnboardingStep />
      </div>
    </main>
  )
}
