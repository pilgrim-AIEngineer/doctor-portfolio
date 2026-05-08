-- Initial DocFolio schema — all tables, RLS policies, triggers, and indexes

create extension if not exists "uuid-ossp";

-- ─── updated_at trigger (reused on every table that needs it) ────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── doctors ────────────────────────────────────────────────────────────────
create table doctors (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text        not null,
  email       text,
  phone       text        not null unique,
  nmc_number  text        not null unique,
  specialty   text        not null,
  slug        text        not null unique,
  plan        text        not null default 'free' check (plan in ('free', 'pro')),
  is_verified boolean     not null default false,
  created_at  timestamptz not null default now()
);

alter table doctors enable row level security;

create policy "doctor owns row"         on doctors for all    using (auth.uid() = id);
create policy "public can read doctors" on doctors for select using (true);

-- ─── profiles ───────────────────────────────────────────────────────────────
create table profiles (
  id          uuid        primary key default uuid_generate_v4(),
  doctor_id   uuid        not null references doctors(id) on delete cascade,
  section_key text        not null check (section_key in (
    'personal', 'qualifications', 'registration', 'specialization',
    'experience', 'services', 'achievements', 'research', 'testimonials',
    'gallery', 'clinic_info', 'appointment', 'insurance', 'languages', 'social'
  )),
  data        jsonb       not null default '{}',
  updated_at  timestamptz not null default now(),
  unique (doctor_id, section_key)
);

alter table profiles enable row level security;

create policy "doctor owns profile"      on profiles for all    using (auth.uid() = doctor_id);
create policy "public can read profiles" on profiles for select using (true);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create index profiles_doctor_id_idx on profiles (doctor_id);

-- ─── templates ──────────────────────────────────────────────────────────────
create table templates (
  id            uuid    primary key default uuid_generate_v4(),
  name          text    not null unique check (name in ('classic', 'modern', 'bold')),
  preview_image text    not null default '',
  is_active     boolean not null default true
);

alter table templates enable row level security;

create policy "public can read templates" on templates for select using (is_active = true);

insert into templates (name, preview_image) values
  ('classic', ''),
  ('modern',  ''),
  ('bold',    '');

-- ─── doctor_templates ───────────────────────────────────────────────────────
create table doctor_templates (
  doctor_id   uuid primary key references doctors(id)   on delete cascade,
  template_id uuid not null    references templates(id) on delete restrict
);

alter table doctor_templates enable row level security;

create policy "doctor owns template selection"  on doctor_templates for all    using (auth.uid() = doctor_id);
create policy "public can read doctor template" on doctor_templates for select using (true);

-- Auto-assign 'classic' template when a new doctor row is inserted
create or replace function assign_default_template()
returns trigger language plpgsql security definer as $$
declare
  classic_id uuid;
begin
  select id into classic_id from templates where name = 'classic' limit 1;
  insert into doctor_templates (doctor_id, template_id) values (new.id, classic_id);
  return new;
end;
$$;

create trigger doctors_assign_default_template
  after insert on doctors
  for each row execute function assign_default_template();

-- ─── subscriptions ──────────────────────────────────────────────────────────
create table subscriptions (
  id           uuid        primary key default uuid_generate_v4(),
  doctor_id    uuid        not null references doctors(id) on delete cascade,
  plan         text        not null check (plan in ('free', 'pro')),
  status       text        not null check (status in ('active', 'cancelled', 'expired', 'pending')),
  razorpay_id  text        not null default '',
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "doctor owns subscription" on subscriptions for all using (auth.uid() = doctor_id);

create index subscriptions_doctor_id_idx on subscriptions (doctor_id);

-- ─── appointments ───────────────────────────────────────────────────────────
create table appointments (
  id            uuid        primary key default uuid_generate_v4(),
  doctor_id     uuid        not null references doctors(id) on delete cascade,
  patient_name  text        not null,
  patient_phone text        not null,
  message       text,
  status        text        not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at    timestamptz not null default now()
);

alter table appointments enable row level security;

create policy "doctor owns appointments"       on appointments for all    using (auth.uid() = doctor_id);
create policy "public can insert appointments" on appointments for insert with check (true);

create index appointments_doctor_id_idx on appointments (doctor_id);
