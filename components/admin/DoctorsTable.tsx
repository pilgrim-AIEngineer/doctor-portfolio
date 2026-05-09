// Interactive doctors table with verify/unverify toggle per row
'use client'

import { useState } from 'react'
import { Loader2, ExternalLink, BadgeCheck, Crown } from 'lucide-react'
import Toast from '@/components/ui/Toast'
import { toggleDoctorVerification } from '@/app/actions/admin'
import { formatDate } from '@/lib/utils'
import type { Doctor } from '@/types/Doctor'

interface Props {
  doctors: Doctor[]
}

export default function DoctorsTable({ doctors }: Props) {
  const [rows, setRows] = useState<Doctor[]>(doctors)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleToggleVerify(doctor: Doctor) {
    setPendingId(doctor.id)
    setRows((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, is_verified: !d.is_verified } : d)),
    )

    const result = await toggleDoctorVerification(doctor.id, doctor.is_verified)

    if (result.error) {
      setRows((prev) =>
        prev.map((d) => (d.id === doctor.id ? { ...d, is_verified: doctor.is_verified } : d)),
      )
      setToast({ message: result.error, type: 'error' })
    } else {
      const label = !doctor.is_verified ? 'Doctor verified' : 'Verification removed'
      setToast({ message: label, type: 'success' })
    }
    setPendingId(null)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Specialty</th>
              <th className="px-4 py-3 font-medium">NMC No.</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Portfolio</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{doctor.name}</td>
                <td className="px-4 py-3 text-gray-600">{doctor.specialty}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{doctor.nmc_number}</td>
                <td className="px-4 py-3">
                  {doctor.plan === 'pro' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 text-xs font-medium">
                      <Crown size={10} /> Pro
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      Free
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(doctor.created_at)}</td>
                <td className="px-4 py-3">
                  <a
                    href={`/dr/${doctor.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700"
                  >
                    View <ExternalLink size={12} />
                  </a>
                </td>
                <td className="px-4 py-3">
                  {pendingId === doctor.id ? (
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  ) : doctor.is_verified ? (
                    <button
                      onClick={() => handleToggleVerify(doctor)}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Unverify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleVerify(doctor)}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <BadgeCheck size={12} /> Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No doctors registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  )
}
