// CardArrayInput — renders an add/remove list of cards; children receive per-card field renderers
'use client'

import { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface CardArrayInputProps<T> {
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderCard: (item: T, index: number) => ReactNode
  addLabel?: string
  maxItems?: number
}

export default function CardArrayInput<T>({
  items,
  onAdd,
  onRemove,
  renderCard,
  addLabel = 'Add item',
  maxItems,
}: CardArrayInputProps<T>) {
  const atMax = maxItems !== undefined && items.length >= maxItems

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative border border-gray-200 rounded-lg p-4 pr-8 bg-gray-50">
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {renderCard(item, i)}
        </div>
      ))}
      {!atMax && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
      {atMax && (
        <p className="text-xs text-gray-400">Maximum of {maxItems} items reached.</p>
      )}
    </div>
  )
}
