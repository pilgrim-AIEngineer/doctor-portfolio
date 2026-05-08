// Appointment table row type
export interface Appointment {
  id: string
  doctor_id: string
  patient_name: string
  patient_phone: string
  message?: string
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}
