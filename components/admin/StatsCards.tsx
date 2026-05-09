// Admin stats overview — 4 count cards for total, verified, free, and pro doctors
import { Users, BadgeCheck, User, Crown } from 'lucide-react'
import type { AdminStats } from '@/app/actions/admin'

interface Props {
  stats: AdminStats
}

interface Card {
  label: string
  value: number
  icon: React.ElementType
  iconClass: string
}

export default function StatsCards({ stats }: Props) {
  const cards: Card[] = [
    { label: 'Total Doctors',  value: stats.totalDoctors,    icon: Users,      iconClass: 'text-brand-600' },
    { label: 'Verified',       value: stats.verifiedDoctors, icon: BadgeCheck, iconClass: 'text-green-600' },
    { label: 'Free Plan',      value: stats.freePlan,        icon: User,       iconClass: 'text-gray-500'  },
    { label: 'Pro Plan',       value: stats.proPlan,         icon: Crown,      iconClass: 'text-gold-500'  },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{card.label}</span>
              <Icon size={18} className={card.iconClass} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
