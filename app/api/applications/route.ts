import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This is the API endpoint that all three application forms post to.
// Think of it as the mailbox — the form fills out the envelope and drops
// it here, and this code opens it, checks it, and files it in Supabase.

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

    // ── EMAIL PLACEHOLDER ─────────────────────────────────────────
    // When Resend is set up, this is where we'll send two emails:
    //   1. A notification to annieoakleyanimalrescue@gmail.com
    //   2. A confirmation to the applicant
    // For now this is a no-op — the application is saved to Supabase
    // and staff can review it in the admin dashboard.
    // ─────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Application submission error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
