// Global 404 page — shown when notFound() is called or a route doesn't match
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-bold text-brand-600">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
          <p className="text-gray-500">
            The doctor or page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
