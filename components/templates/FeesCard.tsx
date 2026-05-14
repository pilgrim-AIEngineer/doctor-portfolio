// Shared fees info card rendered near the appointment CTA on all templates
import type { FeesSection } from '@/types/Profile'

interface FeesCardProps {
  fees: FeesSection
  variant?: 'light' | 'dark'
}

export default function FeesCard({ fees, variant = 'light' }: FeesCardProps) {
  const textPrimary = variant === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = variant === 'dark' ? 'text-gray-300' : 'text-gray-500'
  const border = variant === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bg = variant === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-3 text-sm`}>
      <p className={`font-semibold ${textPrimary}`}>Consultation Fees</p>
      <div className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 ${textSecondary}`}>
        <span>Consultation: ₹{fees.consultation_fee}</span>
        {fees.followup_fee != null && (
          <span>Follow-up: ₹{fees.followup_fee}</span>
        )}
      </div>
      {fees.fee_note && (
        <p className={`mt-1 text-xs ${textSecondary}`}>{fees.fee_note}</p>
      )}
    </div>
  )
}
