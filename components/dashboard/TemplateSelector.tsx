// Client component — displays template cards and handles selection with plan-gating
'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, CheckCircle, Loader2 } from 'lucide-react'
import { selectTemplate } from '@/app/actions/template'
import { TEMPLATE_META } from '@/lib/constants'
import Toast from '@/components/ui/Toast'
import type { Template } from '@/types/Template'

const PREVIEW_GRADIENT: Record<string, string> = {
  classic: 'from-blue-500 to-blue-700',
  modern:  'from-purple-500 to-purple-700',
  bold:    'from-orange-500 to-red-600',
  oncology:'from-brand-900 via-clinical-ink to-brand-600',
}

interface Props {
  templates: Template[]
  currentTemplateId: string | null
  plan: 'free' | 'pro'
}

interface Toast {
  message: string
  type: 'success' | 'error'
}

export default function TemplateSelector({ templates, currentTemplateId, plan }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(currentTemplateId)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [upgradePromptId, setUpgradePromptId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const clearToast = useCallback(() => setToast(null), [])

  async function handleSelect(template: Template) {
    const meta = TEMPLATE_META[template.name]

    if (plan === 'free' && meta.tier === 'pro') {
      setUpgradePromptId(prev => (prev === template.id ? null : template.id))
      return
    }

    setUpgradePromptId(null)
    setSavingId(template.id)
    const result = await selectTemplate(template.id)
    setSavingId(null)

    if (result.error) {
      setToast({ message: result.error, type: 'error' })
    } else {
      setSelectedId(template.id)
      setToast({ message: `"${meta.label}" template applied!`, type: 'success' })
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map(template => {
          const meta = TEMPLATE_META[template.name]
          const isLocked = plan === 'free' && meta.tier === 'pro'
          const isSelected = selectedId === template.id
          const isSaving = savingId === template.id
          const showUpgrade = upgradePromptId === template.id

          return (
            <div
              key={template.id}
              className={`rounded-xl border-2 overflow-hidden transition-all ${
                isSelected ? 'border-brand-600 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Preview */}
              <div className="relative h-48">
                {template.preview_image ? (
                  <Image src={template.preview_image} alt={meta.label} fill className="object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${PREVIEW_GRADIENT[template.name] ?? 'from-gray-400 to-gray-600'}`} />
                )}

                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3">
                      <Lock className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                    <CheckCircle className="w-5 h-5 text-brand-600" />
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{meta.label}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    meta.tier === 'free'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {meta.tier === 'free' ? 'Free' : 'Pro'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4">{meta.description}</p>

                {showUpgrade && (
                  <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
                    This template requires a Pro plan.{' '}
                    <Link href="/dashboard/billing" className="font-semibold underline underline-offset-2">
                      Upgrade now →
                    </Link>
                  </div>
                )}

                <button
                  onClick={() => handleSelect(template)}
                  disabled={isSaving || isSelected}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 cursor-default border border-brand-200'
                      : isLocked
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSelected ? 'Selected ✓' : isLocked ? 'Unlock with Pro' : 'Use this template'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  )
}
