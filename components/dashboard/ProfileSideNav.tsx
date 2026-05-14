// ProfileSideNav — accordion group nav with visibility toggles, reorder arrows, completion dots
'use client'

import { useState, useCallback } from 'react'
import { Eye, EyeOff, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Lock } from 'lucide-react'
import { updateSectionOrder } from '@/app/actions/profile'
import { PROFILE_GROUPS, PRO_ONLY_SECTIONS, SECTION_LABELS } from '@/lib/constants'
import Toast from '@/components/ui/Toast'
import type { SectionKey, SectionMeta } from '@/types/Profile'

interface ProfileSideNavProps {
  sections: Partial<Record<SectionKey, unknown>>
  sectionMeta: SectionMeta[]
  activeSection: SectionKey
  doctorPlan: string
  onSelect: (key: SectionKey) => void
  onProGate: () => void
}

function buildMetaMap(metas: SectionMeta[]): Record<string, SectionMeta> {
  const map: Record<string, SectionMeta> = {}
  for (const m of metas) map[m.section_key] = m
  return map
}

export default function ProfileSideNav({
  sections,
  sectionMeta,
  activeSection,
  doctorPlan,
  onSelect,
  onProGate,
}: ProfileSideNavProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['identity', 'practice']))
  const [meta, setMeta] = useState<Record<string, SectionMeta>>(() => buildMetaMap(sectionMeta))
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const isPro = doctorPlan === 'pro'

  function toggleGroup(key: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const syncToServer = useCallback(
    async (updatedMeta: Record<string, SectionMeta>, prevMeta: Record<string, SectionMeta>) => {
      const updates = Object.values(updatedMeta).map((m) => ({
        section_key: m.section_key,
        display_order: m.display_order,
        is_visible: m.is_visible,
      }))
      const result = await updateSectionOrder(updates)
      if (result.error) {
        setMeta(prevMeta)
        setToast({ message: 'Failed to save. Please try again.', type: 'error' })
      }
    },
    []
  )

  function toggleVisibility(sectionKey: SectionKey) {
    const prev = meta
    const current = prev[sectionKey]
    const updated = {
      ...prev,
      [sectionKey]: { ...current, is_visible: !current?.is_visible },
    }
    setMeta(updated)
    syncToServer(updated, prev)
  }

  function moveSection(groupSections: readonly string[], sectionKey: string, direction: 'up' | 'down') {
    const orderedInGroup = [...groupSections].sort(
      (a, b) => (meta[a]?.display_order ?? 0) - (meta[b]?.display_order ?? 0)
    )
    const idx = orderedInGroup.indexOf(sectionKey)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= orderedInGroup.length) return

    const aKey = orderedInGroup[idx]
    const bKey = orderedInGroup[swapIdx]
    const aOrder = meta[aKey]?.display_order ?? 0
    const bOrder = meta[bKey]?.display_order ?? 0

    const prev = meta
    const updated = {
      ...prev,
      [aKey]: { ...prev[aKey], display_order: bOrder },
      [bKey]: { ...prev[bKey], display_order: aOrder },
    }
    setMeta(updated)
    syncToServer(updated, prev)
  }

  return (
    <nav className="w-56 flex-shrink-0">
      {PROFILE_GROUPS.map((group) => {
        const isOpen = openGroups.has(group.key)
        const orderedSections = [...group.sections].sort(
          (a, b) => (meta[a]?.display_order ?? 0) - (meta[b]?.display_order ?? 0)
        )

        return (
          <div key={group.key} className="mb-1">
            <button
              onClick={() => toggleGroup(group.key)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors"
            >
              {group.label}
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {isOpen && (
              <div className="ml-1 space-y-0.5">
                {orderedSections.map((sectionKey, idx) => {
                  const key = sectionKey as SectionKey
                  const isActive = activeSection === key
                  const isFilled = sections[key] != null
                  const isVisible = meta[key]?.is_visible ?? true
                  const isProOnly = PRO_ONLY_SECTIONS.includes(sectionKey)
                  const isLocked = isProOnly && !isPro

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer group ${
                        isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => {
                        if (isLocked) { onProGate(); return }
                        onSelect(key)
                      }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isFilled ? 'bg-brand-500' : 'bg-gray-300'
                        }`}
                      />

                      <span className="flex-1 text-sm truncate">{SECTION_LABELS[sectionKey]}</span>

                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <div className="hidden group-hover:flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveSection(group.sections, sectionKey, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                            aria-label="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveSection(group.sections, sectionKey, 'down')}
                            disabled={idx === orderedSections.length - 1}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                            aria-label="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => toggleVisibility(key)}
                            className="p-0.5 text-gray-400 hover:text-gray-600"
                            aria-label={isVisible ? 'Hide section' : 'Show section'}
                          >
                            {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </nav>
  )
}
