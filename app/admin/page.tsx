// Admin dashboard — manage doctors, templates, and subscriptions
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin' }

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
      {/* Admin management UI added in feat/admin */}
      <p className="text-gray-400 text-sm">Admin panel coming soon</p>
    </div>
  )
}
