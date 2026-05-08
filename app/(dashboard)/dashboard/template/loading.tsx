// Loading skeleton for template picker
export default function TemplateLoading() {
  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}
