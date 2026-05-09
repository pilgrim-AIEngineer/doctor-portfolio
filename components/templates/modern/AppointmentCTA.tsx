// Modern template appointment CTA — circular FAB fixed bottom-right, opens WhatsApp or booking sheet
'use client'

import { useState } from 'react'
import { CalendarDays, Phone, ExternalLink, X } from 'lucide-react'
import { formatIndianPhone } from '@/lib/utils'
import type { AppointmentSection } from '@/types/Profile'
import type { Doctor } from '@/types/Doctor'
import BookingForm from '@/components/templates/classic/BookingForm'

interface AppointmentCTAProps {
  appointment?: AppointmentSection
  doctor: Doctor
}

const fabClass =
  'w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-brand-300'

export default function ModernAppointmentCTA({ appointment, doctor }: AppointmentCTAProps) {
  const [formOpen, setFormOpen] = useState(false)

  const rawPhone = appointment?.whatsapp ?? doctor.phone
  const waNumber = formatIndianPhone(rawPhone).replace('+', '')
  const waText = encodeURIComponent(
    `Hello Dr. ${doctor.name}, I would like to book an appointment.`,
  )
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`
  const formEnabled = appointment?.booking_form_enabled === true

  return (
    <>
      {/* Floating action button — fixed bottom-right on all breakpoints */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {appointment?.practo_url && (
          <a
            href={appointment.practo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-brand-200 text-brand-700 text-sm font-medium px-4 py-2 rounded-full shadow-lg hover:bg-brand-50 transition-colors"
          >
            <ExternalLink size={14} />
            Practo
          </a>
        )}
        {formEnabled ? (
          <button type="button" onClick={() => setFormOpen(true)} className={fabClass} aria-label="Book appointment">
            <CalendarDays size={22} />
          </button>
        ) : (
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className={fabClass} aria-label="WhatsApp">
            <Phone size={22} />
          </a>
        )}
      </div>

      {/* Bottom sheet — visible only when formOpen */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFormOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl px-6 pt-6 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Book an Appointment</h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold mb-4 transition-colors"
            >
              <Phone size={16} />
              WhatsApp Instead
            </a>
            <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
          </div>
        </div>
      )}
    </>
  )
}
