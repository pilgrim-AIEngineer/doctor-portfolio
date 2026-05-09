// Bold template stats strip — large gold numbers for years, procedures, specializations
import type { ExperienceSection, ServicesSection, SpecializationSection } from '@/types/Profile'

interface StatsProps {
  experience?: ExperienceSection
  services?: ServicesSection
  specialization?: SpecializationSection
}

interface StatItem {
  value: number
  label: string
}

export default function BoldStats({ experience, services, specialization }: StatsProps) {
  const stats: StatItem[] = []

  if (experience?.years) {
    stats.push({ value: experience.years, label: 'Years of Experience' })
  }

  const procedureCount = services?.procedures?.length ?? 0
  if (procedureCount > 0) {
    stats.push({ value: procedureCount, label: 'Procedures Offered' })
  }

  const specCount = (specialization?.sub_specialties?.length ?? 0) + (specialization ? 1 : 0)
  if (specCount > 0) {
    stats.push({ value: specCount, label: 'Specializations' })
  }

  if (!stats.length) return null

  return (
    <div className="bg-navy-dark border-b border-white/10">
      <div className="max-w-4xl mx-auto flex divide-x divide-white/10">
        {stats.map(({ value, label }) => (
          <div key={label} className="flex-1 text-center px-6 py-10">
            <p className="font-serif text-6xl md:text-8xl font-bold text-gold-300 leading-none">
              {value}
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-gray-400 font-sans">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
