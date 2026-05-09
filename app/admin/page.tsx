// Admin dashboard — stats, doctor management, and template management
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminStats, getAllDoctors, getAllTemplates } from '@/app/actions/admin'
import StatsCards from '@/components/admin/StatsCards'
import DoctorsTable from '@/components/admin/DoctorsTable'
import TemplateManagement from '@/components/admin/TemplateManagement'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Admin — DocFolio' }
}

export default async function AdminPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase
    .from('doctors')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!me?.is_admin) redirect('/dashboard')

  const [statsResult, doctorsResult, templatesResult] = await Promise.all([
    getAdminStats(),
    getAllDoctors(),
    getAllTemplates(),
  ])

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      {statsResult.error ? (
        <p className="text-sm text-red-600">{statsResult.error}</p>
      ) : (
        <StatsCards stats={statsResult.data!} />
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Doctors</h2>
        {doctorsResult.error ? (
          <p className="text-sm text-red-600">{doctorsResult.error}</p>
        ) : (
          <DoctorsTable doctors={doctorsResult.data!} />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Templates</h2>
        {templatesResult.error ? (
          <p className="text-sm text-red-600">{templatesResult.error}</p>
        ) : (
          <TemplateManagement templates={templatesResult.data!} />
        )}
      </section>
    </div>
  )
}
