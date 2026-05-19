// Skeleton loading state for dashboard home route
export default function DashboardLoading() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}
