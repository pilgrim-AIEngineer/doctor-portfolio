// Classic template appointment CTA - polished booking band and mobile contact bar
import { CalendarDays, ExternalLink, Phone } from 'lucide-react'
import type { AppointmentSection, FeesSection } from '@/types/Profile'
import type { Doctor } from '@/types/Doctor'
import { getContactLinks } from '@/components/templates/shared'
import BookingForm from './BookingForm'
import FeesCard from '@/components/templates/FeesCard'

interface AppointmentCTAProps {
  appointment?: AppointmentSection
  doctor: Doctor
  fees?: FeesSection
}

export default function AppointmentCTA({ appointment, doctor, fees }: AppointmentCTAProps) {
  const contact = getContactLinks(appointment, doctor)

  return (
    <>
      {contact.formEnabled && (
        <section id="classic-book-form" className="md:hidden px-6 pb-5">
          <BookingPanel doctor={doctor} contact={contact} fees={fees} compact />
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-clinical-line bg-white/95 px-4 py-3 shadow-clinical backdrop-blur md:hidden">
        <div className="flex gap-2">
          <a
            href={contact.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-sm font-semibold text-white"
          >
            <Phone size={16} />
            WhatsApp
          </a>
          {contact.formEnabled && (
            <a
              href="#classic-book-form"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-700 py-3 text-sm font-semibold text-white"
            >
              <CalendarDays size={16} />
              Book
            </a>
          )}
        </div>
      </div>

      <section id="classic-book-form" className="hidden bg-white px-6 py-14 md:block">
        <BookingPanel doctor={doctor} contact={contact} fees={fees} />
      </section>
    </>
  )
}

function BookingPanel({
  doctor,
  contact,
  fees,
  compact = false,
}: {
  doctor: Doctor
  contact: ReturnType<typeof getContactLinks>
  fees?: FeesSection
  compact?: boolean
}) {
  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-clinical-line bg-clinical-mist p-6 shadow-clinical md:grid md:grid-cols-[0.8fr_1fr] md:gap-8 md:p-8">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">Appointment</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-clinical-ink">
          Book an appointment with Dr. {doctor.name}
        </h2>
        <p className="mt-3 text-gray-600">
          Use WhatsApp for fastest response, or send a request through the booking form.
        </p>
        {fees && <FeesCard fees={fees} />}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
            <Phone size={16} />
            WhatsApp
          </a>
          <a href={contact.telUrl} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
            <Phone size={16} />
            Call Now
          </a>
          {contact.practoUrl && (
            <a href={contact.practoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              <ExternalLink size={16} />
              Practo
            </a>
          )}
        </div>
      </div>
      {contact.formEnabled && !compact && (
        <div className="mt-8 rounded-[1.5rem] bg-white p-5 md:mt-0">
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        </div>
      )}
      {contact.formEnabled && compact && (
        <div className="mt-5 rounded-[1.5rem] bg-white p-5">
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        </div>
      )}
    </div>
  )
}
