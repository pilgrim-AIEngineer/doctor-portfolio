// Dashboard layout — authenticated wrapper; sidebar nav added per feature
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar navigation added in feat/dashboard-nav */}
      <main className="md:pl-64 p-0">{children}</main>
    </div>
  )
}
