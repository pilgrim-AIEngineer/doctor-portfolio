// Doctor login page — phone OTP auth
import type { Metadata } from 'next'
import LoginFlow from '@/components/auth/LoginFlow'

export const metadata: Metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to DocFolio</h1>
        <p className="text-sm text-gray-500 mb-8">Sign in with your Indian mobile number</p>
        <LoginFlow />
      </div>
    </main>
  )
}
