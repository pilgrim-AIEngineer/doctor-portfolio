// Skeleton shown while the async admin server component loads
export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-8 w-32 bg-gray-200 rounded-lg" />
      <div className="h-96 bg-gray-200 rounded-xl" />
      <div className="h-8 w-36 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
