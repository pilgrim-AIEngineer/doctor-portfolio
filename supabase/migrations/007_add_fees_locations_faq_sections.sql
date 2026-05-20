-- Extend profiles.section_key constraint to include 'fees', 'locations', and 'faq'
-- These three keys were added to the application after the initial schema was written
-- but the CHECK constraint was never updated, causing all saves for these sections to fail.
alter table profiles drop constraint if exists profiles_section_key_check;

alter table profiles
  add constraint profiles_section_key_check
  check (section_key in (
    'personal', 'qualifications', 'registration', 'specialization',
    'experience', 'services', 'achievements', 'research', 'testimonials',
    'gallery', 'clinic_info', 'appointment', 'insurance', 'languages', 'social',
    'fees', 'locations', 'faq'
  ));
