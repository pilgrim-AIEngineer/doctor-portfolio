// FAQForm — edits the "faq" profile section (Pro only)
'use client'

import { useState, useEffect } from 'react'
import { saveProfileSection } from '@/app/actions/profile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useDraftStore } from '@/hooks/useDraftStore'
import type { FAQEntry } from '@/types/Profile'
import { FAQ_MAX_ITEMS, FAQ_ANSWER_MAX_CHARS } from '@/lib/constants'
import CardArrayInput from '../CardArrayInput'
import SaveStatus from '../SaveStatus'

const INPUT = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const LABEL = 'block text-xs font-medium text-gray-600 mb-1'

const emptyEntry = (): FAQEntry => ({ question: '', answer: '' })

function FAQCard({
  item,
  index,
  onChange,
}: {
  item: FAQEntry
  index: number
  onChange: (index: number, updated: FAQEntry) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className={LABEL}>Question</label>
        <input
          type="text"
          value={item.question}
          onChange={(e) => onChange(index, { ...item, question: e.target.value })}
          className={INPUT}
          placeholder="e.g. Do you offer online consultations?"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={LABEL} style={{ marginBottom: 0 }}>Answer</label>
          <span className="text-xs text-gray-400">{item.answer.length}/{FAQ_ANSWER_MAX_CHARS}</span>
        </div>
        <textarea
          value={item.answer}
          onChange={(e) => onChange(index, { ...item, answer: e.target.value })}
          rows={3}
          maxLength={FAQ_ANSWER_MAX_CHARS}
          className={`${INPUT} resize-y`}
          placeholder="Yes, I offer online video consultations via…"
        />
      </div>
    </div>
  )
}

export default function FAQForm({ data }: { data: unknown }) {
  const existing = data as { items?: FAQEntry[] } | undefined
  const [items, setItems] = useState<FAQEntry[]>(existing?.items ?? [])

  function updateItem(index: number, updated: FAQEntry) {
    setItems((prev) => prev.map((item, i) => (i === index ? updated : item)))
  }

  const setSection = useDraftStore((s) => s.setSection)
  const status = useAutoSave({ items }, (d) => saveProfileSection('faq', d))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setSection('faq', { items }) }, [JSON.stringify(items)])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
        <SaveStatus status={status} />
      </div>
      <p className="text-sm text-gray-500">Common patient questions shown on your portfolio. Helps with SEO.</p>
      <CardArrayInput
        items={items}
        onAdd={() => setItems((prev) => [...prev, emptyEntry()])}
        onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
        renderCard={(item, i) => <FAQCard item={item} index={i} onChange={updateItem} />}
        addLabel="Add question"
        maxItems={FAQ_MAX_ITEMS}
      />
    </div>
  )
}
