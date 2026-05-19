// Stats row — placeholder activity cards for dashboard home (analytics coming soon)
import { BarChart2, Calendar, Clock, MessageCircle } from 'lucide-react'

interface Props {
  lastUpdated: string | null
}

export default function StatsRow({ lastUpdated }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Activity</h2>
      <div className="space-y-3">
        {[
          { label: 'Portfolio views', icon: BarChart2 },
          { label: 'Appointment requests', icon: Calendar },
          { label: 'WhatsApp clicks', icon: MessageCircle },
        ].map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon size={15} className="text-gray-400" />
              {label}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-300">—</span>
              <span className="text-xs text-gray-400">coming soon</span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400" />
            Last updated
          </div>
          <span className="text-sm text-gray-500">{lastUpdated ?? '—'}</span>
        </div>
      </div>
    </div>
  )
}
