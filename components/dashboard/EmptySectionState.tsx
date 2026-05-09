// Banner shown inside a profile section tab when the doctor hasn't filled it in yet
import { PlusCircle } from 'lucide-react'

interface Props {
  sectionLabel: string
}

export default function EmptySectionState({ sectionLabel }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-gray-200 rounded-xl text-center mb-6">
      <PlusCircle className="w-8 h-8 text-gray-300" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">
          No {sectionLabel} added yet
        </p>
        <p className="text-xs text-gray-400">
          Fill in the fields below to add this section to your portfolio.
        </p>
      </div>
    </div>
  )
}
