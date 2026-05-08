// Dashboard index — redirects to profile section
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  redirect('/dashboard/profile')
}
