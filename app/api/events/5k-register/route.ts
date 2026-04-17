import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

// June 20, 2026 at 8:30 AM MDT (30 min before 9 AM start)
const REGISTRATION_CUTOFF = new Date('2026-06-20T08:30:00-06:00')

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
    if (new Date() > REGISTRATION_CUTOFF) {
      return NextResponse.json({ error: 'Registration is now closed.' }, { status: 400 })
    }

    const body = await req.json()
    const { registration_type, contact_name, contact_email, contact_phone, participants, total_cost } = body

    if (!registration_type || !contact_name || !contact_email || !participants?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const { error } = await supabase.from('event_registrations').insert({
      event_id: '5k-2026',
      registration_type,
      contact_name,
      contact_email,
      contact_phone: contact_phone || null,
      participants,
      total_cost,
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to save registration.' }, { status: 500 })
    }

    const participantRows = (participants as Array<{ name: string; age_category: string; shirt_size: string; price: number }>)
      .map((p) => `<tr><td style="padding:4px 12px 4px 0">${esc(p.name)}</td><td style="padding:4px 12px 4px 0">${esc(p.age_category)}</td><td style="padding:4px 12px 4px 0">${esc(p.shirt_size) || '—'}</td><td style="padding:4px 0">$${p.price}</td></tr>`)
      .join('')

    try {
      await resend.emails.send({
        from: 'Annie Oakley Animal Rescue <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `New 5K Registration — ${esc(contact_name)}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#2D1606">New 5K Registration</h2><p><strong>Contact:</strong> ${esc(contact_name)}</p><p><strong>Email:</strong> ${esc(contact_email)}</p><p><strong>Phone:</strong> ${esc(contact_phone || '—')}</p><p><strong>Type:</strong> ${esc(registration_type)}</p><table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr style="text-align:left;border-bottom:2px solid #eee"><th style="padding:4px 12px 4px 0">Name</th><th style="padding:4px 12px 4px 0">Category</th><th style="padding:4px 12px 4px 0">Shirt</th><th>Price</th></tr></thead><tbody>${participantRows}</tbody></table><p><strong>Total: $${total_cost}</strong></p><p style="margin-top:24px"><a href="https://www.annieoakleyanimalrescue.com/admin/registrations" style="background:#D4A017;color:#2D1606;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold">View in Admin</a></p></div>`,
      })

      await resend.emails.send({
        from: 'Annie Oakley Animal Rescue <onboarding@resend.dev>',
        to: contact_email,
        subject: 'You\'re registered for the Fetch the Finish Line 5K!',
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#2D1606">You're In, ${esc(contact_name)}!</h2><p>Thank you for registering for the <strong>Fetch the Finish Line 5K Run</strong> on <strong>June 20, 2026</strong>!</p><table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr style="text-align:left;border-bottom:2px solid #eee"><th style="padding:4px 12px 4px 0">Participant</th><th style="padding:4px 12px 4px 0">Category</th><th style="padding:4px 12px 4px 0">Shirt Size</th><th>Price</th></tr></thead><tbody>${participantRows}</tbody></table><p><strong>Total Due: $${total_cost}</strong></p><p>Please complete your payment via Venmo to <strong>@CareMt24</strong> with the note <em>"5K - ${esc(contact_name)}"</em>. Registration is not confirmed until payment is received.</p><p>Dogs are welcome on leash! We'll see you at the finish line.</p><p style="margin-top:24px;color:#888;font-size:13px">— The Annie Oakley Animal Rescue Team</p></div>`,
      })
    } catch {
      // Email failure non-fatal
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
