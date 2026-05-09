// Skeleton shown while the settings server component loads
export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded-lg" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="h-px bg-gray-200" />
      <div className="h-24 bg-gray-200 rounded-xl" />
    </div>
  )
}
