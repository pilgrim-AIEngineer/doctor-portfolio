// Bold template appointment CTA — gold sticky bar (mobile) + gold inline section (desktop)
'use client'

import { Phone, ExternalLink, CalendarDays } from 'lucide-react'
import { formatIndianPhone } from '@/lib/utils'
import type { AppointmentSection } from '@/types/Profile'
import type { Doctor } from '@/types/Doctor'
import BookingForm from '@/components/templates/classic/BookingForm'

interface AppointmentCTAProps {
  appointment?: AppointmentSection
  doctor: Doctor
}

export default function BoldAppointmentCTA({ appointment, doctor }: AppointmentCTAProps) {
  const rawPhone = appointment?.whatsapp ?? doctor.phone
  const formattedPhone = formatIndianPhone(rawPhone)
  const waNumber = formattedPhone.replace('+', '')
  const waText = encodeURIComponent(
    `Hello Dr. ${doctor.name}, I would like to book an appointment.`,
  )
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`
  const telUrl = `tel:${formattedPhone}`
  const formEnabled = appointment?.booking_form_enabled === true

  return (
    <>
      {/* Mobile: inline form (above sticky bar) */}
      {formEnabled && (
        <section id="bold-book-form" className="md:hidden max-w-3xl mx-auto px-6 pt-8 pb-4 bg-navy">
          <h2 className="font-serif text-xl font-bold text-white mb-1">Book an Appointment</h2>
          <p className="text-sm text-gray-400 mb-2">Fill in your details and the doctor will get back to you.</p>
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        </section>
      )}

      {/* Mobile: gold sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-navy-dark border-t-2 border-gold-300 px-4 py-3 z-50">
        <div className="flex gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 ${formEnabled ? 'flex-1' : 'w-full'} bg-gold-300 hover:bg-gold-400 text-navy py-3 rounded-xl font-bold text-sm transition-colors`}
          >
            <Phone size={16} />
            WhatsApp
          </a>
          {formEnabled && (
            <a
              href="#bold-book-form"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gold-300 text-gold-300 hover:bg-gold-300/10 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              <CalendarDays size={16} />
              Book Appointment
            </a>
          )}
        </div>
        {appointment?.practo_url && (
          <a
            href={appointment.practo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-2 text-xs text-gold-300 underline underline-offset-2"
          >
            Book on Practo
          </a>
        )}
      </div>

      {/* Desktop: inline gold section */}
      <section id="bold-book-form" className="hidden md:block bg-navy border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="font-serif text-2xl font-bold text-white mb-5">Book an Appointment</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gold-300 hover:bg-gold-400 text-navy px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              <Phone size={16} />
              WhatsApp
            </a>
            <a
              href={telUrl}
              className="flex items-center gap-2 border border-gold-300 text-gold-300 hover:bg-gold-300/10 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <Phone size={16} />
              Call Now
            </a>
            {appointment?.practo_url && (
              <a
                href={appointment.practo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gold-300/50 text-gold-300/80 hover:border-gold-300 hover:text-gold-300 hover:bg-gold-300/10 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                <ExternalLink size={16} />
                Book on Practo
              </a>
            )}
          </div>
          {formEnabled && (
            <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
          )}
        </div>
      </section>
    </>
  )
}
