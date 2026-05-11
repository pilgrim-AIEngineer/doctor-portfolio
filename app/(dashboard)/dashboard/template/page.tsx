// Template picker — lets doctors choose from available portfolio templates
import type { Metadata } from 'next'
import { getTemplateData } from '@/app/actions/template'
import TemplateSelector from '@/components/dashboard/TemplateSelector'

export const metadata: Metadata = { title: 'Choose Template' }
export const dynamic = 'force-dynamic'

export default async function TemplatePage() {
  const result = await getTemplateData()

  if (result.error || !result.data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600 text-sm">{result.error ?? 'Failed to load templates.'}</p>
      </div>
    )
  }

  const { templates, currentTemplateId, plan } = result.data

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Template</h1>
      <p className="text-sm text-gray-500 mb-8">
        Your selected template controls how your public portfolio looks at{' '}
        <span className="font-medium">/dr/your-name</span>.
      </p>
      <TemplateSelector
        templates={templates}
        currentTemplateId={currentTemplateId}
        plan={plan}
      />
    </div>
  )
}
