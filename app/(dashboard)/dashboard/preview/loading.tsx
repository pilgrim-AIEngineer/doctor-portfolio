// Skeleton shown while the preview server component loads
export default function PreviewLoading() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-gray-200 rounded-lg" />
        <div className="h-9 w-28 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-[600px] bg-gray-200 rounded-2xl" />
    </div>
  )
}
