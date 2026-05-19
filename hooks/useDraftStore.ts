// Live draft store for profile section data — bridges form state to the preview panel
import { create } from 'zustand'
import type { SectionKey } from '@/types/Profile'

interface DraftStore {
  sections: Partial<Record<SectionKey, unknown>>
  initSections: (saved: Partial<Record<SectionKey, unknown>>) => void
  setSection: (key: SectionKey, data: unknown) => void
}

export const useDraftStore = create<DraftStore>((set) => ({
  sections: {},
  initSections: (saved) => set({ sections: saved }),
  setSection: (key, data) =>
    set((state) => ({ sections: { ...state.sections, [key]: data } })),
}))
