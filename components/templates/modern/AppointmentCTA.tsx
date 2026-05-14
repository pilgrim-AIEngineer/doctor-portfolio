// Modern template appointment CTA - floating actions with animated booking sheet
'use client'

import { useState } from 'react'
import { CalendarDays, ExternalLink, Phone, X } from 'lucide-react'
import type { AppointmentSection, FeesSection } from '@/types/Profile'
import type { Doctor } from '@/types/Doctor'
import { getContactLinks } from '@/components/templates/shared'
import BookingForm from '@/components/templates/classic/BookingForm'
import FeesCard from '@/components/templates/FeesCard'

interface AppointmentCTAProps {
  appointment?: AppointmentSection
  doctor: Doctor
  fees?: FeesSection
}

export default function ModernAppointmentCTA({ appointment, doctor, fees }: AppointmentCTAProps) {
  const [formOpen, setFormOpen] = useState(false)
  const contact = getContactLinks(appointment, doctor)

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {contact.practoUrl && (
          <a
            href={contact.practoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-modern-panel/90 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-glass backdrop-blur transition hover:bg-white/10"
          >
            <ExternalLink size={14} />
            Practo
          </a>
        )}
        <div className="flex rounded-full border border-white/10 bg-modern-panel/90 p-1 shadow-glass backdrop-blur">
          <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white transition hover:bg-green-600" aria-label="WhatsApp">
            <Phone size={20} />
          </a>
          {contact.formEnabled && (
            <button type="button" onClick={() => setFormOpen(true)} className="ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-modern-ink transition hover:bg-cyan-200" aria-label="Book appointment">
              <CalendarDays size={20} />
            </button>
          )}
        </div>
      </div>

      <section id="modern-book-form" className="sr-only" aria-hidden="true" />

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-modern-ink/80 backdrop-blur-sm"
            onClick={() => setFormOpen(false)}
            aria-label="Close booking form"
          />
          <div className="relative w-full max-w-lg animate-template-rise rounded-t-[2rem] border border-white/10 bg-white p-6 shadow-glass md:rounded-[2rem]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-brand-700">Appointment</p>
                <h2 className="text-2xl font-semibold text-gray-950">Book with Dr. {doctor.name}</h2>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
              <Phone size={16} />
              WhatsApp Instead
            </a>
            {fees && <div className="mb-4"><FeesCard fees={fees} /></div>}
            <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
          </div>
        </div>
      )}
    </>
  )
}
