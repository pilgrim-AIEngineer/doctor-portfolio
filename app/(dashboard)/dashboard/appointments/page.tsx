// Appointment requests list for the doctor
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Appointments' }

export default function AppointmentsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Appointment Requests</h1>
      {/* Appointment list added in feat/appointments */}
      <p className="text-gray-400 text-sm">No appointment requests yet</p>
    </div>
  )
}
