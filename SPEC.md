# DocFolio — Product Specification

## What is this?
A SaaS platform where Indian doctors fill their professional information 
and get a beautiful public portfolio website automatically rendered from 
preset templates.

## Tech Stack
- Framework: Next.js 14 (App Router)
- Database: Supabase (PostgreSQL + Auth)
- Styling: Tailwind CSS
- Payments: Razorpay
- File uploads: Cloudinary
- Email: Resend
- OTP/SMS: MSG91
- Deployment: Vercel
- Language: TypeScript

## User Roles
1. Doctor — signs up, fills profile, picks template, publishes portfolio
2. Public visitor — views doctor's public portfolio at /dr/[slug]
3. Admin — manages templates, doctors, subscriptions

## Database Tables
- doctors (id, name, email, phone, nmc_number, specialty, slug, plan, is_verified, created_at)
- profiles (id, doctor_id, section_key, data jsonb, updated_at)
- templates (id, name, preview_image, is_active)
- doctor_templates (doctor_id, template_id)
- subscriptions (id, doctor_id, plan, status, razorpay_id, expires_at)
- appointments (id, doctor_id, patient_name, patient_phone, message, created_at)

## Profile Sections (each saved separately)
- personal: name, photo, tagline, about
- qualifications: degrees[], fellowships[]
- registration: nmc_number, state_council, validity
- specialization: primary, sub_specialties[]
- experience: years, hospitals[], current_affiliation
- services: treatments[], procedures[], consultation_types[]
- achievements: awards[], recognitions[]
- research: publications[], conferences[]
- testimonials: reviews[]
- gallery: images[]
- clinic_info: address, map_url, timings, phone
- appointment: whatsapp, practo_url, booking_form_enabled
- insurance: panels[]
- languages: spoken[]
- social: youtube, instagram, linkedin, twitter

## Plans
- Free: 1 template, subdomain only, basic sections
- Pro (₹499/month): all templates, custom domain, analytics, all sections

## URL Structure
- /login — doctor login/signup
- /dashboard — doctor's management area
- /dashboard/profile — edit profile sections
- /dashboard/template — pick template
- /dashboard/preview — live preview
- /dashboard/billing — manage subscription
- /admin — admin panel
- /dr/[slug] — public doctor portfolio (e.g. /dr/dr-rajesh-sharma-varanasi)

## Key Rules
- Mobile first design (most Indian users are on phone)
- All forms auto-save (no manual save button needed)
- NMC number is required at signup and shown as verified badge
- Public portfolio must be SEO optimized (meta tags, og:image, schema.org)
- Appointment CTA always visible (sticky on mobile)