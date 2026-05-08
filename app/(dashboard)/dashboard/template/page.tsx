// Template picker — lets doctors choose from available portfolio templates
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Choose Template' }

export default function TemplatePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Template</h1>
      {/* Template cards added in feat/template-picker */}
      <p className="text-gray-400 text-sm">Templates coming soon</p>
    </div>
  )
}
