// Classic template appointment CTA — sticky WhatsApp bar (mobile) + contact section (desktop)
import { ExternalLink, Phone, CalendarDays } from 'lucide-react'
import { formatIndianPhone } from '@/lib/utils'
import type { AppointmentSection } from '@/types/Profile'
import type { Doctor } from '@/types/Doctor'
import BookingForm from './BookingForm'

interface AppointmentCTAProps {
  appointment?: AppointmentSection
  doctor: Doctor
}

export default function AppointmentCTA({ appointment, doctor }: AppointmentCTAProps) {
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
      {/* Mobile: inline form section (visible above the sticky bar) */}
      {formEnabled && (
        <section id="book-form" className="md:hidden max-w-3xl mx-auto px-6 pt-8 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Book an Appointment</h2>
          <p className="text-sm text-gray-500 mb-2">Fill in your details and the doctor will get back to you.</p>
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        </section>
      )}

      {/* Mobile: fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className={`flex gap-2 ${formEnabled ? '' : ''}`}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 ${formEnabled ? 'flex-1' : 'w-full'} bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm`}
          >
            <Phone size={16} />
            WhatsApp
          </a>
          {formEnabled && (
            <a
              href="#book-form"
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold text-sm"
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
            className="block text-center mt-2 text-xs text-brand-600 underline underline-offset-2"
          >
            Book on Practo
          </a>
        )}
      </div>

      {/* Desktop: inline section */}
      <section id="book-form" className="hidden md:block max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Book an Appointment</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm"
          >
            <Phone size={16} />
            WhatsApp
          </a>
          <a
            href={telUrl}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm"
          >
            <Phone size={16} />
            Call Now
          </a>
          {appointment?.practo_url && (
            <a
              href={appointment.practo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-brand-300 hover:bg-brand-50 text-brand-700 px-5 py-2.5 rounded-lg font-medium text-sm"
            >
              <ExternalLink size={16} />
              Book on Practo
            </a>
          )}
        </div>
        {formEnabled && (
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        )}
      </section>
    </>
  )
}
