// Doctor profile editor — all section forms
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Profile' }

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Profile</h1>
      {/* Profile section forms added per section feature */}
      <p className="text-gray-400 text-sm">Profile sections coming soon</p>
    </div>
  )
}
