'use client'

// ─────────────────────────────────────────────────────────────────
// To connect your Google Calendar:
// 1. Go to calendar.google.com
// 2. Create a calendar named "Annie Oakley Animal Rescue Events"
// 3. Open its Settings → "Integrate calendar"
// 4. Copy the Calendar ID (looks like: abc123@group.calendar.google.com)
// 5. Replace PASTE_YOUR_CALENDAR_ID_HERE below with that ID
// ─────────────────────────────────────────────────────────────────

const CALENDAR_ID = '728ae4fd7948eb9dcf50e85795751bb6e55eac5032154c68ac93c3b4ec2d32ff@group.calendar.google.com'
const CALENDAR_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FDenver&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&mode=AGENDA`

const isConfigured = CALENDAR_ID.length > 0

export default function GoogleCalendarEmbed() {
  if (!isConfigured) {
    return (
      <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-12 text-center">
        <CalendarIcon />
        <h3 className="font-display text-xl font-bold text-[#2D1606] mt-4 mb-2">
          Google Calendar Coming Soon
        </h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          All events are listed above. A full interactive calendar will appear here once connected.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
      <iframe
        src={CALENDAR_URL}
        style={{ border: 0 }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
        title="Annie Oakley Animal Rescue Event Calendar"
      />
    </div>
  )
}

function CalendarIcon() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-[#D4A017]/15 flex items-center justify-center mx-auto">
      <svg className="w-8 h-8 text-[#D4A017]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
      </svg>
    </div>
  )
}
