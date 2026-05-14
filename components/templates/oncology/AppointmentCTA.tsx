// Oncology template appointment CTA - premium callback panel and sticky contact bar
import { CalendarDays, ExternalLink, Phone, ShieldCheck } from 'lucide-react'
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

export default function OncologyAppointmentCTA({ appointment, doctor, fees }: AppointmentCTAProps) {
  const contact = getContactLinks(appointment, doctor)

  return (
    <>
      <section id="oncology-booking" className="relative overflow-hidden bg-oncology-midnight px-6 py-14 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,theme(colors.oncology.gold/0.16),transparent_26%),radial-gradient(circle_at_78%_42%,theme(colors.oncology.teal/0.18),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 rounded-[2.25rem] border border-white/10 bg-white/[0.07] p-6 shadow-glass backdrop-blur-2xl md:grid-cols-[0.85fr_1fr] md:p-8">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-oncology-gold/30 bg-oncology-gold/10 px-4 py-2 text-xs font-bold uppercase text-oncology-gold">
              <ShieldCheck size={15} />
              Priority clinic access
            </p>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Request a cancer care consultation
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              Reach Dr. {doctor.name}&apos;s clinic on WhatsApp for the fastest response, or share your details for a callback.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-oncology transition hover:bg-green-600">
                <Phone size={16} />
                WhatsApp clinic
              </a>
              <a href={contact.telUrl} className="inline-flex items-center gap-2 rounded-full border border-oncology-teal/30 bg-oncology-teal/10 px-5 py-3 text-sm font-bold text-oncology-aura transition hover:bg-oncology-teal/20">
                <Phone size={16} />
                Call now
              </a>
              {contact.practoUrl && (
                <a href={contact.practoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-slate-100 transition hover:bg-white/[0.1]">
                  <ExternalLink size={16} />
                  Practo
                </a>
              )}
            </div>
            {fees && <div className="mt-4"><FeesCard fees={fees} variant="dark" /></div>}
          </div>

          {contact.formEnabled ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white p-5 text-clinical-ink shadow-oncology">
              <BookingForm doctorId={doctor.id} doctorEmail={doctor.email ?? ''} />
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-oncology-teal/25 bg-oncology-teal/10 p-6">
              <p className="text-xl font-semibold text-white">Callback form is not enabled.</p>
              <p className="mt-2 leading-7 text-slate-300">Please contact the clinic using WhatsApp or phone.</p>
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-oncology-midnight/95 px-4 py-3 shadow-glass backdrop-blur-xl md:hidden">
        <div className="flex gap-2">
          <a href={contact.waUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-sm font-bold text-white">
            <Phone size={16} />
            WhatsApp
          </a>
          <a href="#oncology-booking" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-oncology-gold py-3 text-sm font-bold text-oncology-midnight">
            <CalendarDays size={16} />
            Book
          </a>
        </div>
      </div>
    </>
  )
}
