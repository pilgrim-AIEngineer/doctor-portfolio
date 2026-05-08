// DoctorProfile — the single prop type all portfolio templates consume
import type { Doctor } from './Doctor'
import type { SectionKey } from './Profile'
import type { Template } from './Template'

export interface DoctorProfile {
  doctor: Doctor
  sections: Partial<Record<SectionKey, unknown>>
  template: Template
}
