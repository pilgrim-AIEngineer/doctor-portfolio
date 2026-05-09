// Skeleton loading state for public portfolio — matches Hero + Sections layout
export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="bg-brand-700 py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full bg-white/20" />
          <div className="h-8 w-56 rounded bg-white/20" />
          <div className="h-5 w-40 rounded bg-white/20" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="py-10 border-b border-gray-100 space-y-3">
            <div className="h-5 w-36 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-4/5 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
