// Skeleton shown while the billing server component loads
export default function BillingLoading() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
      <div className="h-24 bg-gray-200 rounded-xl" />
    </div>
  )
}
