// Shown when a doctor's portfolio exists but is_published = false
import { Clock } from 'lucide-react'

interface Props {
  doctorName: string
  whatsapp?: string
}

export default function NotPublished({ doctorName, whatsapp }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
            <Clock className="w-8 h-8 text-brand-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Portfolio coming soon</h1>
          <p className="text-gray-500">
            Dr {doctorName} is still setting up their profile. Check back soon.
          </p>
        </div>
        {whatsapp && (
          <a
            href={`https://wa.me/91${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Contact on WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
