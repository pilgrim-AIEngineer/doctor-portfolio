// Interactive template cards with activate/deactivate toggle
'use client'

import { useState } from 'react'
import { Loader2, Crown } from 'lucide-react'
import Toast from '@/components/ui/Toast'
import { toggleTemplateActive } from '@/app/actions/admin'
import { TEMPLATE_META } from '@/lib/constants'
import type { Template } from '@/types/Template'

interface Props {
  templates: Template[]
}

const PREVIEW_GRADIENT: Record<string, string> = {
  classic: 'from-blue-50 to-blue-100',
  modern:  'from-slate-800 to-slate-900',
  bold:    'from-gray-900 to-black',
}

export default function TemplateManagement({ templates }: Props) {
  const [items, setItems] = useState<Template[]>(templates)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleToggle(template: Template) {
    setPendingId(template.id)
    setItems((prev) =>
      prev.map((t) => (t.id === template.id ? { ...t, is_active: !t.is_active } : t)),
    )

    const result = await toggleTemplateActive(template.id, template.is_active)

    if (result.error) {
      setItems((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, is_active: template.is_active } : t)),
      )
      setToast({ message: result.error, type: 'error' })
    } else {
      const label = !template.is_active ? 'Template activated' : 'Template deactivated'
      setToast({ message: label, type: 'success' })
    }
    setPendingId(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((template) => {
          const meta = TEMPLATE_META[template.name]
          const gradient = PREVIEW_GRADIENT[template.name] ?? 'from-gray-100 to-gray-200'
          const isPending = pendingId === template.id

          return (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className={`h-28 bg-gradient-to-br ${gradient}`} />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{meta.label}</h3>
                  <div className="flex items-center gap-2">
                    {meta.tier === 'pro' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 text-xs font-medium">
                        <Crown size={10} /> Pro
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        template.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{meta.description}</p>
                <button
                  onClick={() => handleToggle(template)}
                  disabled={isPending}
                  className={`w-full flex items-center justify-center gap-2 text-sm py-2 rounded-lg border transition-colors disabled:opacity-60 ${
                    template.is_active
                      ? 'border-red-300 text-red-600 hover:bg-red-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : template.is_active ? (
                    'Deactivate'
                  ) : (
                    'Activate'
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  )
}
