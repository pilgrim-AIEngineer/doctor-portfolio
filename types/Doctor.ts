// Doctor table row type
export interface Doctor {
  id: string
  name: string
  email: string | null
  phone: string
  nmc_number: string
  specialty: string
  slug: string
  plan: 'free' | 'pro'
  is_verified: boolean
  is_admin: boolean
  is_published: boolean
  created_at: string
}
