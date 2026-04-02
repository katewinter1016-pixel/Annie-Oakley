# Annie Oakley Animal Rescue — Website

A full-stack nonprofit rescue website built with Next.js, Supabase, and Vercel.

**Live site:** https://yourdomain.com  
**Staging (Vercel):** https://annie-oakley-rescue.vercel.app  
**Rescue contact:** annieoakleyanimalrescue@gmail.com · (406) 489-0382 · Fairview, MT

---

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + API routes |
| Database | Supabase (PostgreSQL) | Animals, applications, donations, volunteers |
| Hosting | Vercel | Deployment + CDN |
| Email | Resend | Form submissions → Gmail |
| Styling | Tailwind CSS | Brand-matched UI |
| Forms | React Hook Form + Zod | Validation + submission |
| Language | TypeScript | Type safety throughout |

---

## Brand

| Element | Value |
|---|---|
| Primary yellow | `#D4A017` |
| Dark / nav | `#1a1a1a` |
| Light background | `#FFF8E7` |
| Font | Inter / system sans |

Logo files are in `/public/logos/`

---

## Project Structure

```
annie-oakley-rescue/
│
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (nav + footer)
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles + Tailwind
│   │
│   ├── animals/
│   │   └── page.tsx              # Adoptable animals — dog/cat tabs
│   │
│   ├── volunteer/
│   │   └── page.tsx              # Volunteer calendar + sign-up form
│   │
│   ├── about/
│   │   └── page.tsx              # Mission, founders, facility goal
│   │
│   ├── forms/
│   │   ├── adopt/page.tsx        # Adoption application
│   │   ├── foster/page.tsx       # Foster application
│   │   └── surrender/page.tsx    # Animal surrender (legal form)
│   │
│   ├── admin/                    # Password-protected admin dashboard
│   │   ├── layout.tsx            # Admin layout + auth check
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── animals/page.tsx      # Add / edit / remove animals
│   │   ├── applications/page.tsx # View all form submissions
│   │   ├── volunteers/page.tsx   # View volunteer sign-ups
│   │   ├── donations/page.tsx    # Update donation meter
│   │   └── events/page.tsx       # Manage volunteer calendar events
│   │
│   └── api/                      # Next.js API routes (server-side)
│       ├── forms/
│       │   ├── adopt/route.ts    # Saves to Supabase + emails rescue
│       │   ├── foster/route.ts
│       │   ├── surrender/route.ts
│       │   └── volunteer/route.ts
│       ├── admin/
│       │   └── animals/route.ts  # CRUD for animal listings
│       └── donations/route.ts    # Read/update donation total
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Top nav with donation button
│   │   └── Footer.tsx            # Contact info + social links
│   │
│   ├── ui/
│   │   ├── Button.tsx            # Reusable button component
│   │   ├── Card.tsx              # Generic card wrapper
│   │   ├── Badge.tsx             # Status badges (needs foster, etc.)
│   │   ├── Modal.tsx             # Generic modal
│   │   ├── Tabs.tsx              # Dog / Cat tab switcher
│   │   ├── AnimalCard.tsx        # Individual animal listing card
│   │   └── DonationMeter.tsx     # Facility funding progress bar
│   │
│   ├── forms/
│   │   ├── AdoptionForm.tsx      # Full adoption form component
│   │   ├── FosterForm.tsx        # Full foster form component
│   │   ├── SurrenderForm.tsx     # Full surrender form (legal)
│   │   ├── VolunteerForm.tsx     # Volunteer sign-up form
│   │   └── PrintButton.tsx       # Triggers print CSS for paper forms
│   │
│   └── admin/
│       ├── AnimalTable.tsx       # Animals list with edit/remove
│       ├── AnimalFormModal.tsx   # Add/edit animal modal
│       ├── ApplicationsTable.tsx # Applications inbox
│       └── StatsBar.tsx          # Dashboard stats (animals, apps, etc.)
│
├── lib/
│   ├── supabase.ts               # Supabase browser client
│   ├── supabaseServer.ts         # Supabase server + service role client
│   ├── email.ts                  # Resend email functions
│   └── utils.ts                  # cn(), formatAge(), facilityPercent()
│
├── hooks/
│   ├── useAnimals.ts             # Fetch + filter animals from Supabase
│   └── useDonations.ts           # Fetch donation total for meter
│
├── types/
│   └── index.ts                  # All TypeScript interfaces and types
│
├── supabase/
│   └── migrations/
│       ├── 001_animals.sql       # Animals table + RLS policies
│       ├── 002_applications.sql  # Applications table
│       ├── 003_donations.sql     # Donation totals + split function
│       ├── 004_volunteers.sql    # Volunteer sign-ups
│       └── 005_events.sql        # Rescue events for calendar
│
├── public/
│   ├── logos/                    # Annie Oakley logo files
│   └── images/animals/           # Animal photos (or use Supabase storage)
│
├── .env.example                  # All required env vars (safe to commit)
├── .env.local                    # Your actual keys — NEVER commit this
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Pages Overview

### Public pages

| Route | Page | Key Features |
|---|---|---|
| `/` | Homepage | Hero + mission, donation meter, quick-link cards, stats |
| `/animals` | Animals | Dog/Cat tabs, filter by foster needed, adopt button per card |
| `/volunteer` | Volunteer | Google Calendar embed, event list, sign-up form |
| `/about` | About Us | Buffy & Sarah's story, mission, facility goal |
| `/forms/adopt` | Adoption Form | Auto-fills animal info, emails rescue on submit |
| `/forms/foster` | Foster Form | Auto-fills animal info, emails rescue on submit |
| `/forms/surrender` | Surrender Form | Legal ownership transfer, MT statute references |

### Admin pages (password protected)

| Route | Page |
|---|---|
| `/admin` | Dashboard — stats overview |
| `/admin/animals` | Add, edit, remove animal listings + photo upload |
| `/admin/applications` | View all adoption, foster, surrender submissions |
| `/admin/volunteers` | View volunteer sign-ups by event |
| `/admin/donations` | Manually update donation total for facility meter |
| `/admin/events` | Add/remove volunteer calendar events |

---

## Database Schema (Supabase)

### `animals`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text | |
| species | text | `dog` or `cat` |
| breed | text | |
| age_years | integer | |
| age_months | integer | Optional |
| sex | text | `male` or `female` |
| description | text | |
| photo_urls | text[] | Array of Supabase storage URLs |
| status | text | `available`, `adopted`, `fostered`, `pending` |
| needs_foster | boolean | Shows "Needs a Foster" badge |
| good_with_kids | boolean | |
| good_with_dogs | boolean | |
| good_with_cats | boolean | |
| is_spayed_neutered | boolean | |
| is_vaccinated | boolean | |
| special_needs | text | Optional |

### `applications`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| type | text | `adoption`, `foster`, `surrender` |
| status | text | `pending`, `reviewing`, `approved`, `denied` |
| animal_id | uuid | FK to animals (nullable) |
| animal_name | text | |
| applicant_name | text | |
| applicant_email | text | |
| applicant_phone | text | |
| form_data | jsonb | Full form submission |
| notes | text | Admin notes |

### `donation_totals`
| Column | Type | Notes |
|---|---|---|
| total_amount | bigint | Stored in cents |
| facility_amount | bigint | 70% of total |
| supplies_amount | bigint | 30% of total |

### `volunteer_signups`
| Column | Type | Notes |
|---|---|---|
| first_name | text | |
| last_name | text | |
| email | text | |
| phone | text | |
| event_name | text | |
| availability | text | |
| skills | text[] | Array of selected skills |

### `events`
| Column | Type | Notes |
|---|---|---|
| title | text | |
| description | text | |
| location | text | |
| start_time | timestamptz | |
| end_time | timestamptz | |
| google_calendar_link | text | "Add to calendar" URL |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values.
**Never commit `.env.local` to Git.**

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESCUE_EMAIL` | `annieoakleyanimalrescue@gmail.com` |
| `FROM_EMAIL` | Your verified Resend sender domain |
| `ADMIN_PASSWORD` | Choose a strong password |
| `NEXT_PUBLIC_SITE_URL` | Your production domain |

---

## Getting Started (Local Development)

```bash
# 1. Clone the repo
git clone https://github.com/YOURUSERNAME/annie-oakley-rescue.git
cd annie-oakley-rescue

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in .env.local with your keys

# 4. Run the Supabase migrations
# Go to Supabase → SQL Editor and run each file in supabase/migrations/ in order

# 5. Start the dev server
npm run dev

# 6. Open in browser
# http://localhost:3000
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Go to vercel.com → Import project → Select this repo
3. Add all environment variables from `.env.local` in Vercel project settings
4. Deploy — every push to `main` triggers an automatic redeploy

---

## Supabase Setup

1. Create a project at supabase.com
2. Go to **SQL Editor** and run each migration file in order:
   - `supabase/migrations/001_animals.sql`
   - `supabase/migrations/002_applications.sql`
   - `supabase/migrations/003_donations.sql`
   - `supabase/migrations/004_volunteers.sql`
   - `supabase/migrations/005_events.sql`
3. Go to **Storage** → create a bucket called `animal-photos` → set to public
4. Copy your Project URL and API keys into `.env.local`

---

## Email Setup (Resend)

1. Create an account at resend.com
2. Add and verify your domain (or use their test domain for development)
3. Create an API key and add it to `.env.local` as `RESEND_API_KEY`
4. Set `FROM_EMAIL` to a verified sender address on your domain

All form submissions trigger two emails:
- One to `annieoakleyanimalrescue@gmail.com` with the full form data
- One confirmation email to the applicant

---

## Admin Dashboard

The admin dashboard is at `/admin`. It is protected by a simple password
stored in `ADMIN_PASSWORD` in your environment variables.

**Admin can:**
- Add, edit, and remove animal listings with photos
- View all adoption, foster, and surrender applications
- Update the facility donation meter total
- Add and remove volunteer calendar events
- View volunteer sign-ups by event

---

## Forms

All three forms submit to:
1. **Supabase** — stored in the `applications` table
2. **Resend** — emailed to `annieoakleyanimalrescue@gmail.com`
3. **Applicant** — confirmation email sent automatically

### Print versions
Every form has a **Print / Save as PDF** button that triggers a
print-optimized CSS layout — clean black and white, no colored backgrounds,
signature lines for paper completion. The surrender form includes the full
legal text so it stands alone on paper without needing the website.

### Animal auto-fill
When a user clicks "Apply to Adopt" or "Apply to Foster" on a specific
animal card, the animal's name, species, breed, age, and ID are
automatically passed into the form so the applicant does not re-enter them.

---

## Donation Meter

- Displays on the homepage
- Shows facility fund progress toward $1,000,000 goal
- All donations split: **70% facility / 30% animal supplies**
- Only the facility meter is shown publicly
- Disclaimer shown below the meter explaining the split
- Admin can manually update the total in `/admin/donations`

---

## Volunteer Calendar

- Google Calendar embedded on the volunteer page
- Events display with date, time, location, and description
- Each event has an **"+ Add to my calendar"** link
  that opens Google Calendar on the volunteer's phone
- Volunteers receive reminders via their phone's calendar app
- Admin manages events in `/admin/events`

---

## Legal Notes (Surrender Form)

The surrender form references Montana law:
- **MCA § 7-23-4202** — spay/neuter requirement for rescue placements
- **MCA § 45-8-209** — animal cruelty statutes
- **MCA § 45-8-211** — cruelty penalties

The form includes:
- Irrevocable ownership transfer clause
- Full disclosure certification with misrepresentation language
- Liability release for Annie Oakley Animal Rescue
- Mandatory bite history and cruelty involvement disclosure
- Co-owner consent field
- Active legal proceedings disclosure
- Signed and timestamped by owner + AOAR team member

> This form should be reviewed periodically by a Montana-licensed attorney,
> especially given the rescue's animal cruelty prosecution work.

---

## Roadmap

- [ ] Homepage
- [ ] Animals page with dog/cat tabs
- [ ] Adoption form + print version
- [ ] Foster form + print version
- [ ] Surrender form + print version (legal)
- [ ] Volunteer page + Google Calendar
- [ ] About page
- [ ] Admin dashboard — animals
- [ ] Admin dashboard — applications
- [ ] Admin dashboard — donations meter
- [ ] Admin dashboard — events
- [ ] Supabase storage for animal photos
- [ ] Resend email integration
- [ ] Vercel deployment
- [ ] Custom domain setup
- [ ] Grooming & boarding section (future)
- [ ] Community spay/neuter clinic info (future)

---

## Built by

Developed for **Buffy & Sarah** — founders of Annie Oakley Animal Rescue.  
Every life matters — and they are just getting started. 🐾
