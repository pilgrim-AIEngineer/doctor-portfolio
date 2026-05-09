// Server action — create appointment record and notify doctor via email
'use server'

import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { bookingFormSchema } from '@/lib/validations/appointment'
import { APPOINTMENT_STATUS } from '@/lib/constants'

const resend = new Resend(process.env.RESEND_API_KEY)

interface CreateAppointmentInput {
  doctorId: string
  doctorEmail: string
  patientName: string
  patientPhone: string
  message?: string
}

export async function createAppointment(input: CreateAppointmentInput) {
  try {
    const validated = bookingFormSchema.safeParse({
      patient_name: input.patientName,
      patient_phone: input.patientPhone,
      message: input.message,
    })

    if (!validated.success) {
      return { error: 'Invalid input. Please check your details and try again.' }
    }

    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('appointments').insert({
      doctor_id: input.doctorId,
      patient_name: validated.data.patient_name,
      patient_phone: `+91${validated.data.patient_phone}`,
      message: validated.data.message ?? null,
      status: APPOINTMENT_STATUS.NEW,
    })

    if (dbError) {
      console.error('[createAppointment] db insert', dbError.message)
      return { error: 'Could not save your request. Please try again.' }
    }

    const { error: emailError } = await resend.emails.send({
      from: 'DocFolio <noreply@docfolio.in>',
      to: input.doctorEmail,
      subject: `New appointment request from ${validated.data.patient_name}`,
      html: buildEmailHtml({
        patientName: validated.data.patient_name,
        patientPhone: `+91 ${validated.data.patient_phone}`,
        message: validated.data.message,
      }),
    })

    if (emailError) {
      // Appointment was saved; email failure is non-fatal but worth logging
      console.error('[createAppointment] email send', emailError.message)
    }

    return { data: { success: true } }
  } catch (err) {
    console.error('[createAppointment] unexpected', err)
    return { error: 'Unexpected error. Please try again.' }
  }
}

function buildEmailHtml(params: {
  patientName: string
  patientPhone: string
  message?: string
}) {
  const messageRow = params.message
    ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Message</td><td style="padding:8px 0;font-size:14px;">${params.message}</td></tr>`
    : ''

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="font-size:20px;font-weight:600;color:#111827;margin-bottom:16px;">
        New Appointment Request
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Name</td><td style="padding:8px 0;font-size:14px;">${params.patientName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Phone</td><td style="padding:8px 0;font-size:14px;">${params.patientPhone}</td></tr>
        ${messageRow}
      </table>
      <p style="margin-top:24px;font-size:13px;color:#9ca3af;">
        Sent via DocFolio — log in to your dashboard to view all requests.
      </p>
    </div>
  `
}
