import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

// This is the API endpoint that all three application forms post to.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, ...fields } = body

    if (!['adoption', 'foster', 'surrender'].includes(type)) {
      return NextResponse.json({ error: 'Invalid application type' }, { status: 400 })
    }

    // Save the application to Supabase
    const { data, error } = await supabase
      .from('applications')
      .insert({
        type,
        applicant_name: fields.applicant_name,
        applicant_email: fields.applicant_email,
        applicant_phone: fields.applicant_phone,
        applicant_address: fields.applicant_address,
        applicant_city: fields.applicant_city,
        applicant_state: fields.applicant_state ?? 'MT',
        applicant_zip: fields.applicant_zip,
        animal_id: fields.animal_id ?? null,
        form_data: fields, // store all extra fields in the flexible jsonb column
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
    }

    const typeLabel = type === 'adoption' ? 'Adoption' : type === 'foster' ? 'Foster' : 'Surrender'

    // Notify admin
    await resend.emails.send({
      from: 'Annie Oakley Animal Rescue <hello@annieoakleyanimalrescue.com>',
      to: ADMIN_EMAIL,
      subject: `New ${typeLabel} Application — ${fields.applicant_name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#2D1606;">New ${typeLabel} Application</h2>
          <p><strong>Name:</strong> ${fields.applicant_name}</p>
          <p><strong>Email:</strong> ${fields.applicant_email}</p>
          <p><strong>Phone:</strong> ${fields.applicant_phone ?? '—'}</p>
          ${fields.animal_id ? `<p><strong>Animal ID:</strong> ${fields.animal_id}</p>` : ''}
          <p style="margin-top:24px;">
            <a href="https://annie-oakley.vercel.app/admin/applications" style="background:#D4A017;color:#2D1606;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold;">
              View in Admin Dashboard
            </a>
          </p>
        </div>
      `,
    })

    // Confirm to applicant
    await resend.emails.send({
      from: 'Annie Oakley Animal Rescue <hello@annieoakleyanimalrescue.com>',
      to: fields.applicant_email,
      subject: `We received your ${typeLabel.toLowerCase()} application!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#2D1606;">Thank you, ${fields.applicant_name}!</h2>
          <p>We've received your ${typeLabel.toLowerCase()} application and will be in touch soon.</p>
          <p>If you have any questions in the meantime, reply to this email or reach us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
          <p style="margin-top:24px;color:#888;font-size:13px;">— The Annie Oakley Animal Rescue Team</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Application submission error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
