import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, availability, interests, experience } = body

    const { error } = await supabase.from('volunteers').insert({
      name,
      email,
      phone: phone || null,
      availability,
      interests,
      experience: experience || null,
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to save volunteer signup' }, { status: 500 })
    }

    // Send emails — wrapped so a failure doesn't block the submission
    try {
      await resend.emails.send({
        from: 'Annie Oakley Animal Rescue <hello@annieoakleyanimalrescue.com>',
        to: ADMIN_EMAIL,
        subject: `New Volunteer Signup — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#2D1606;">New Volunteer Signup</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || '—'}</p>
            <p><strong>Interests:</strong> ${interests || '—'}</p>
            <p><strong>Availability:</strong> ${availability}</p>
            ${experience ? `<p><strong>Experience:</strong> ${experience}</p>` : ''}
            <p style="margin-top:24px;">
              <a href="https://annie-oakley.vercel.app/admin/volunteers" style="background:#D4A017;color:#2D1606;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold;">
                View in Admin Dashboard
              </a>
            </p>
          </div>
        `,
      })
      await resend.emails.send({
        from: 'Annie Oakley Animal Rescue <hello@annieoakleyanimalrescue.com>',
        to: email,
        subject: 'Thank you for volunteering with Annie Oakley Animal Rescue!',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#2D1606;">Thank you, ${name}!</h2>
            <p>We've received your volunteer signup and we're so grateful for your willingness to help. A member of our team will reach out to you soon.</p>
            <p>If you have any questions in the meantime, reach us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a> or call <a href="tel:4064890382">(406) 489-0382</a>.</p>
            <p style="margin-top:24px;color:#888;font-size:13px;">— The Annie Oakley Animal Rescue Team</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Email send failed (non-fatal):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Volunteer signup error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
