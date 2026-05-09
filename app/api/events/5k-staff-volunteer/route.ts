import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
function getResend() { return new Resend(process.env.RESEND_API_KEY) }

const STAFF_ROLES: Record<string, { label: string; max: number }> = {
  'sign-in-booth': { label: 'Sign-In Booth Volunteer', max: 2 },
  'post-run-booth': { label: 'Post Run Booth Volunteer', max: 2 },
  'race-setup': { label: 'Race Set-Up Volunteer', max: 2 },
  'alternate-volunteer': { label: 'Alternate Volunteer', max: 2 },
}

const CUTOFF = new Date('2026-06-20T06:30:00-06:00')

function esc(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  try {
    if (new Date() > CUTOFF) {
      return NextResponse.json({ error: 'Volunteer sign-ups are now closed.' }, { status: 400 })
    }

    const { name, email, phone, role } = await req.json()

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required.' }, { status: 400 })
    }

    if (!STAFF_ROLES[role]) {
      return NextResponse.json({ error: 'Invalid volunteer role.' }, { status: 400 })
    }

    const supabase = getSupabaseServer()

    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', '5k-2026')
      .eq('volunteer_role', role)
      .eq('registration_type', 'staff-volunteer')

    if ((count ?? 0) >= STAFF_ROLES[role].max) {
      return NextResponse.json(
        { error: `Sorry, the ${STAFF_ROLES[role].label} spots are full.` },
        { status: 409 }
      )
    }

    const { error } = await supabase.from('event_registrations').insert({
      event_id: '5k-2026',
      registration_type: 'staff-volunteer',
      contact_name: name,
      contact_email: email,
      contact_phone: phone || null,
      volunteer_role: role,
      participants: [],
      total_cost: 0,
      liability_accepted: false,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save sign-up.' }, { status: 500 })
    }

    const roleLabel = STAFF_ROLES[role].label

    try {
      await getResend().emails.send({
        from: 'Annie Oakley Animal Rescue <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `New Fetch the Finish Line Volunteer — ${esc(name)}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#2D1606">New Event Volunteer Sign-Up</h2><p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> ${esc(email)}</p><p><strong>Phone:</strong> ${esc(phone || '—')}</p><p><strong>Role:</strong> ${esc(roleLabel)}</p><p style="margin-top:24px"><a href="https://www.annieoakleyanimalrescue.com/admin/registrations" style="background:#D4A017;color:#2D1606;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold">View in Admin</a></p></div>`,
      })

      await getResend().emails.send({
        from: 'Annie Oakley Animal Rescue <onboarding@resend.dev>',
        to: email,
        subject: "You're signed up to volunteer at Fetch the Finish Line!",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#2D1606">Thank you, ${esc(name)}!</h2><p>You're signed up as a <strong>${esc(roleLabel)}</strong> for the <strong>Fetch the Finish Line Fun Run</strong> on <strong>June 20, 2026</strong> at Sharbono Park in Fairview, MT.</p><p>We'll be in touch with more details closer to the event. Thank you for helping make this happen!</p><p style="margin-top:24px;color:#888;font-size:13px;">— The Annie Oakley Animal Rescue Team</p></div>`,
      })
    } catch {
      // Email failure non-fatal
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
