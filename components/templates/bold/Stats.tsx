// Bold template stats strip - gold editorial metrics from existing profile data
import {
  computeExperienceYears,
  getServiceCount,
  getSpecializationCount,
  type TemplateSections,
} from '@/components/templates/shared'

interface StatsProps {
  sections: TemplateSections
}

interface StatItem {
  value: number
  label: string
}

export default function BoldStats({ sections }: StatsProps) {
  const stats: StatItem[] = [
    { value: computeExperienceYears(sections.experience, sections.personal), label: 'Years of Experience' },
    { value: getServiceCount(sections.services), label: 'Services Offered' },
    { value: getSpecializationCount(sections.specialization), label: 'Focus Areas' },
  ].filter((item) => item.value > 0)

  if (!stats.length) return null

  return (
    <div className="border-y border-gold-300/20 bg-navy">
      <div className="mx-auto grid max-w-7xl divide-y divide-gold-300/15 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-8 text-center">
            <p className="font-serif text-6xl font-bold leading-none text-gold-300 md:text-7xl">
              {stat.value}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
