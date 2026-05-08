// Doctor account settings
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      {/* Account settings added in feat/settings */}
      <p className="text-gray-400 text-sm">Settings coming soon</p>
    </div>
  )
}
