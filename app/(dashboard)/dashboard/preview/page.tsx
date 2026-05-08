// Live preview of the doctor's public portfolio
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Preview Portfolio' }

export default function PreviewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Preview</h1>
      {/* Portfolio preview added in feat/preview */}
      <p className="text-gray-400 text-sm">Preview coming soon</p>
    </div>
  )
}
