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

function DesktopCTA({ doctor, fees, contact }: {
  doctor: Doctor
  fees?: FeesSection
  contact: ReturnType<typeof getContactLinks>
}) {
  return (
    <section id="modern-book-form" className="hidden lg:block relative overflow-hidden">
      {/* Diagonal stripe texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 40px)' }}
      />
      {/* Ghost "Rx" watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-16 -right-5 text-[280px] font-black leading-none text-white/[0.03] tracking-[-12px]"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Rx
      </div>

      <div
        className="relative max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-2 gap-16 items-start"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}
      >
        {/* Left: copy + contact CTAs */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan-300">
            Appointment
          </p>
          <h2 className="text-[40px] font-extrabold text-white leading-tight tracking-tight">
            Book with<br />Dr. {doctor.name}
          </h2>
          <p className="mt-4 text-[15px] text-white/55 leading-relaxed max-w-sm">
            Use WhatsApp for the fastest response, or fill the booking form and we&apos;ll confirm within 24 hours.
          </p>

          {fees?.consultation_fee && (
            <div className="mt-7 inline-flex items-center gap-4 rounded-2xl border border-white/14 bg-white/[0.07] px-5 py-3">
              <span className="text-3xl font-bold text-white leading-none">
                ₹{fees.consultation_fee.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50 leading-snug">
                Consultation<br />fee
              </span>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={contact.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-600"
            >
              <Phone size={16} />
              WhatsApp
            </a>
            {contact.formattedPhone && (
              <a
                href={`tel:${contact.formattedPhone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/[0.08] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                <Phone size={16} />
                Call Now
              </a>
            )}
          </div>
        </div>

        {/* Right: booking form in white card */}
        <div className="rounded-3xl bg-white p-8">
          <p className="text-base font-bold text-gray-900">Send a booking request</p>
          <p className="mt-1 text-sm text-gray-500">We&apos;ll confirm your appointment within 24 hours.</p>
          {fees && <div className="mt-4 mb-4"><FeesCard fees={fees} /></div>}
          <div className="mt-4">
            <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ModernAppointmentCTA({ appointment, doctor, fees }: AppointmentCTAProps) {
  const [formOpen, setFormOpen] = useState(false)
  const contact = getContactLinks(appointment, doctor)

  return (
    <>
      <span id="section-appointment" aria-hidden="true" />

      {/* Desktop CTA section — shown on lg+ */}
      <DesktopCTA doctor={doctor} fees={fees} contact={contact} />

      {/* Floating FAB — mobile only */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 lg:hidden">
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

      {/* Mobile booking modal */}
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
