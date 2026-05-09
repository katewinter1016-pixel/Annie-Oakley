import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
function getResend() { return new Resend(process.env.RESEND_API_KEY) }

// June 20, 2026 at 6:30 AM MDT (30 min before 7 AM start)
const REGISTRATION_CUTOFF = new Date('2026-06-20T06:30:00-06:00')

const VOLUNTEER_LIMITS: Record<string, number> = { booth: 6, walk: 4, alternate: 5 }

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
    const {
      registration_type,
      contact_name,
      contact_email,
      contact_phone,
      participants,
      total_cost,
      animals,
      liability_accepted,
      volunteer_role,
      emergency_contact,
    } = body

    if (!registration_type || !contact_name || !contact_email || !participants?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!liability_accepted) {
      return NextResponse.json({ error: 'Liability waiver must be accepted.' }, { status: 400 })
    }

    const supabase = getSupabaseServer()

    // Enforce volunteer slot limits
    if (volunteer_role && VOLUNTEER_LIMITS[volunteer_role] !== undefined) {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', '5k-2026')
        .eq('volunteer_role', volunteer_role)

      if ((count ?? 0) >= VOLUNTEER_LIMITS[volunteer_role]) {
        return NextResponse.json(
          { error: `Sorry, the ${volunteer_role} volunteer spots are now full. Please choose a different role.` },
          { status: 409 }
        )
      }
    }

    const mailingAddress = body.mailing_address ?? null

    const { error } = await supabase.from('event_registrations').insert({
      event_id: '5k-2026',
      registration_type,
      contact_name,
      contact_email,
      contact_phone: contact_phone || null,
      mailing_address: mailingAddress,
      emergency_contact: emergency_contact || null,
      participants,
      total_cost,
      animals: animals?.length ? animals : null,
      liability_accepted: true,
      volunteer_role: volunteer_role || null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save registration.' }, { status: 500 })
    }

    type Participant = { name: string; age_category: string; shirt_size: string; price: number }
    type Animal = { pet_name: string; species: string; breed: string }

    const participantRows = (participants as Participant[])
      .map(
        p =>
          `<tr><td style="padding:4px 12px 4px 0">${esc(p.name)}</td><td style="padding:4px 12px 4px 0">${esc(p.age_category)}</td><td style="padding:4px 12px 4px 0">${esc(p.shirt_size) || '—'}</td><td style="padding:4px 0">$${p.price}</td></tr>`
      )
      .join('')

    const animalRows =
      animals?.length
        ? (animals as Animal[])
            .map(
              a =>
                `<tr><td style="padding:4px 12px 4px 0">${esc(a.pet_name)}</td><td style="padding:4px 12px 4px 0">${esc(a.species)}</td><td style="padding:4px 0">${esc(a.breed) || '—'}</td></tr>`
            )
            .join('')
        : null

    const volunteerLine = volunteer_role
      ? `<p><strong>Volunteer Role:</strong> ${esc(volunteer_role)}</p>`
      : ''

    const animalSection = animalRows
      ? `<p><strong>Animals attending:</strong></p><table style="width:100%;border-collapse:collapse;margin:8px 0"><thead><tr style="text-align:left;border-bottom:2px solid #eee"><th style="padding:4px 12px 4px 0">Pet Name</th><th style="padding:4px 12px 4px 0">Species</th><th>Breed</th></tr></thead><tbody>${animalRows}</tbody></table>`
      : '<p><strong>Animals:</strong> None</p>'

    try {
      await getResend().emails.send({
        from: 'Annie Oakley Animal Rescue <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `New Fun Run Registration — ${esc(contact_name)}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#2D1606">New Fun Run Registration</h2><p><strong>Contact:</strong> ${esc(contact_name)}</p><p><strong>Email:</strong> ${esc(contact_email)}</p><p><strong>Phone:</strong> ${esc(contact_phone || '—')}</p><p><strong>Type:</strong> ${esc(registration_type)}</p>${volunteerLine}<table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr style="text-align:left;border-bottom:2px solid #eee"><th style="padding:4px 12px 4px 0">Name</th><th style="padding:4px 12px 4px 0">Category</th><th style="padding:4px 12px 4px 0">Shirt</th><th>Price</th></tr></thead><tbody>${participantRows}</tbody></table>${animalSection}<p><strong>Total: $${total_cost}</strong></p><p style="margin-top:24px"><a href="https://www.annieoakleyanimalrescue.com/admin/registrations" style="background:#D4A017;color:#2D1606;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold">View in Admin</a></p></div>`,
      })

      await getResend().emails.send({
        from: 'Annie Oakley Animal Rescue <onboarding@resend.dev>',
        to: contact_email,
        subject: "You're registered for the Fetch the Finish Line Fun Run!",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#2D1606">You're In, ${esc(contact_name)}!</h2><p>Thank you for registering for the <strong>Fetch the Finish Line Fun Run</strong> on <strong>June 20, 2026 at 7:00 AM</strong> at Sharbono Park in Fairview, MT — part of Hoopfest!</p><table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr style="text-align:left;border-bottom:2px solid #eee"><th style="padding:4px 12px 4px 0">Participant</th><th style="padding:4px 12px 4px 0">Category</th><th style="padding:4px 12px 4px 0">Shirt Size</th><th>Price</th></tr></thead><tbody>${participantRows}</tbody></table>${volunteer_role ? `<p><strong>Volunteer role:</strong> ${esc(volunteer_role)} — thank you for helping!</p>` : ''}<p><strong>Total Due: $${total_cost}</strong></p><p>Please complete your payment via Venmo to <strong>@CareMt24</strong> with the note <em>"Fun Run - ${esc(contact_name)}"</em>. Registration is not confirmed until payment is received.</p><p>Dogs are welcome on leash! We'll see you at the finish line.</p><p style="margin-top:24px;color:#888;font-size:13px">— The Annie Oakley Animal Rescue Team</p></div>`,
      })
    } catch {
      // Email failure non-fatal
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('5k-register unexpected error:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg || 'Something went wrong.' }, { status: 500 })
  }
}
