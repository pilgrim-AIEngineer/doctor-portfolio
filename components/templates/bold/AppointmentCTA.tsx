// Bold template appointment CTA - high-contrast gold booking bar and form
'use client'

import { CalendarDays, ExternalLink, Phone } from 'lucide-react'
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

export default function BoldAppointmentCTA({ appointment, doctor, fees }: AppointmentCTAProps) {
  const contact = getContactLinks(appointment, doctor)

  return (
    <>
      {contact.formEnabled && (
        <section id="bold-book-form" className="md:hidden bg-navy px-6 pb-5">
          <BookingPanel doctor={doctor} contact={contact} fees={fees} compact />
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-gold-300 bg-navy-dark px-4 py-3 md:hidden">
        <div className="flex gap-2">
          <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 bg-gold-300 py-3 text-sm font-bold text-navy">
            <Phone size={16} />
            WhatsApp
          </a>
          {contact.formEnabled && (
            <a href="#bold-book-form" className="flex flex-1 items-center justify-center gap-2 border border-gold-300 py-3 text-sm font-bold text-gold-300">
              <CalendarDays size={16} />
              Book
            </a>
          )}
        </div>
      </div>

      <section id="bold-book-form" className="hidden border-t border-gold-300/20 bg-navy-dark px-6 py-14 md:block">
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
    <div className="mx-auto max-w-7xl border border-gold-300/30 bg-navy p-6 shadow-gold md:grid md:grid-cols-[0.8fr_1fr] md:gap-8 md:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-300">Appointment</p>
        <h2 className="mt-3 font-serif text-4xl font-bold text-white">
          Private consultation request
        </h2>
        <p className="mt-4 max-w-xl leading-7 text-gray-300">
          Contact Dr. {doctor.name} through WhatsApp, phone, or a callback request.
        </p>
        {fees && <FeesCard fees={fees} variant="dark" />}
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold-300 px-5 py-3 text-sm font-bold text-navy transition hover:bg-gold-400">
            <Phone size={16} />
            WhatsApp
          </a>
          <a href={contact.telUrl} className="inline-flex items-center gap-2 border border-gold-300 px-5 py-3 text-sm font-semibold text-gold-300 transition hover:bg-gold-300/10">
            <Phone size={16} />
            Call Now
          </a>
          {contact.practoUrl && (
            <a href={contact.practoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gold-300/50 px-5 py-3 text-sm font-semibold text-gold-300 transition hover:bg-gold-300/10">
              <ExternalLink size={16} />
              Practo
            </a>
          )}
        </div>
      </div>
      {contact.formEnabled && !compact && (
        <div className="mt-8 bg-ivory p-5 md:mt-0">
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        </div>
      )}
      {contact.formEnabled && compact && (
        <div className="mt-5 bg-ivory p-5">
          <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
        </div>
      )}
    </div>
  )
}
