// Dashboard layout — auth guard, doctor fetch, sidebar + mobile tab bar
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import TopNav from '@/components/dashboard/TopNav'
import MobileTabBar from '@/components/dashboard/MobileTabBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('name, specialty, slug')
    .eq('id', user.id)
    .single()

  if (error || !doctor) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav name={doctor.name} specialty={doctor.specialty} slug={doctor.slug} />
      <MobileTabBar />
      <main className="md:pt-16 pb-16 md:pb-0">{children}</main>
    </div>
  )
}
