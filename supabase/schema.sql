-- ============================================================
-- Annie Oakley Animal Rescue — Database Schema
-- Paste this entire file into the Supabase SQL Editor and run it.
-- ============================================================

-- ANIMALS TABLE
-- Stores every animal available for adoption, fostering, or currently in care.
-- Think of this as the master list of all animals at the rescue.
create table if not exists animals (
  id uuid primary key default gen_random_uuid(),   -- a unique ID auto-generated for each animal
  name text not null,                              -- the animal's name
  species text not null,                           -- "dog", "cat", "rabbit", etc.
  breed text,                                      -- optional breed info
  age_years numeric,                               -- age (can be a decimal like 1.5 for 18 months)
  sex text check (sex in ('male', 'female', 'unknown')),
  size text check (size in ('small', 'medium', 'large', 'extra-large')),
  description text,                                -- the write-up shown on the listing
  status text not null default 'available' check (status in ('available', 'pending', 'adopted', 'fostered', 'not available')),
  photo_urls text[],                               -- list of photo URLs (stored in Supabase Storage)
  good_with_kids boolean,
  good_with_dogs boolean,
  good_with_cats boolean,
  special_needs text,                              -- any medical or behavioral notes
  intake_date date default current_date,           -- when the rescue took them in
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- APPLICATIONS TABLE
-- Covers all three form types: adoption, foster, and surrender.
-- Instead of three separate tables, one "type" column tells us which kind it is.
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('adoption', 'foster', 'surrender')),
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'denied', 'withdrawn')),

  -- applicant info (person filling out the form)
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text,
  applicant_address text,
  applicant_city text,
  applicant_state text default 'MT',
  applicant_zip text,

  -- for adoption/foster: which animal are they applying for?
  animal_id uuid references animals(id) on delete set null,

  -- for surrender: info about the animal being surrendered
  surrender_animal_name text,
  surrender_species text,
  surrender_breed text,
  surrender_age text,
  surrender_reason text,

  -- lifestyle questions (adoption/foster)
  housing_type text,           -- house, apartment, etc.
  has_yard boolean,
  landlord_allows_pets boolean,
  current_pets text,
  vet_name text,
  vet_phone text,
  experience_with_pets text,
  why_adopt text,

  -- legal fields for surrender (Montana law compliance)
  ownership_confirmed boolean default false,
  transfer_agreed boolean default false,

  notes text,                  -- any extra info or staff notes
  submitted_at timestamptz default now()
);

-- DONATIONS TABLE
-- Tracks donation goal progress shown on the public site.
-- Each row represents one donation campaign/goal.
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  campaign_name text not null,    -- e.g. "Spring Medical Fund"
  goal_amount numeric not null,   -- target dollar amount
  current_amount numeric default 0, -- how much has been raised so far
  description text,
  is_active boolean default true, -- only one should be active/shown at a time
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- VOLUNTEERS TABLE
-- People who sign up to volunteer through the website.
create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  availability text,             -- e.g. "weekends", "weekday mornings"
  interests text,                -- e.g. "dog walking, transport, events"
  experience text,
  signed_up_at timestamptz default now()
);

-- CALENDAR EVENTS TABLE
-- Events that staff can add and that show on the public volunteer calendar.
create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  event_type text check (event_type in ('adoption_event', 'volunteer', 'fundraiser', 'other')),
  is_public boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- This is like a bouncer for your database.
-- By default, Supabase locks everything down. We open up
-- specific actions (read, insert) for the public, while
-- keeping delete/update for authenticated staff only.
-- ============================================================

alter table animals enable row level security;
alter table applications enable row level security;
alter table donations enable row level security;
alter table volunteers enable row level security;
alter table calendar_events enable row level security;

-- Anyone can VIEW animals and active donations and public events
create policy "Public can view animals" on animals for select using (true);
create policy "Public can view donations" on donations for select using (true);
create policy "Public can view events" on calendar_events for select using (is_public = true);

-- Anyone can SUBMIT an application or volunteer signup
create policy "Public can submit applications" on applications for insert with check (true);
create policy "Public can sign up to volunteer" on volunteers for insert with check (true);

-- Only authenticated users (staff) can manage everything else
create policy "Staff can manage animals" on animals for all using (auth.role() = 'authenticated');
create policy "Staff can manage applications" on applications for all using (auth.role() = 'authenticated');
create policy "Staff can manage donations" on donations for all using (auth.role() = 'authenticated');
create policy "Staff can manage volunteers" on volunteers for all using (auth.role() = 'authenticated');
create policy "Staff can manage events" on calendar_events for all using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — a sample donation campaign so the meter isn't empty
-- ============================================================
insert into donations (campaign_name, goal_amount, current_amount, description, is_active)
values (
  'Spring Medical Fund',
  5000,
  1250,
  'Help us cover vet bills, spay/neuter surgeries, and vaccinations for animals in our care.',
  true
);
