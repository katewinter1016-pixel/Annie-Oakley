import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

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
    const body = await req.json()
    const { reviewer_name, animal_name, review_text, photo_url } = body

    const { error } = await supabase.from('reviews').insert({
      reviewer_name,
      animal_name,
      review_text,
      photo_url: photo_url ?? null,
      approved: false,
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }

    try {
      await resend.emails.send({
        from: 'Annie Oakley Animal Rescue <hello@annieoakleyanimalrescue.com>',
        to: ADMIN_EMAIL,
        subject: `New Review Pending Approval — ${esc(animal_name)}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#2D1606;">New Review Submitted</h2>
            <p><strong>Animal:</strong> ${esc(animal_name)}</p>
            <p><strong>Reviewer:</strong> ${esc(reviewer_name)}</p>
            <p><strong>Story:</strong> ${esc(review_text)}</p>
            <p style="margin-top:24px;">
              <a href="https://www.annieoakleyanimalrescue.com/admin/reviews" style="background:#D4A017;color:#2D1606;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold;">
                Approve in Admin Dashboard
              </a>
            </p>
          </div>
        `,
      })
    } catch {
      // Email failure is non-fatal — submission already saved
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
