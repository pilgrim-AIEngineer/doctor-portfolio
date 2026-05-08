-- Switch auth identifier from phone OTP to email OTP.
-- email becomes the primary auth credential (NOT NULL, UNIQUE).
-- phone becomes an optional clinic contact number collected during onboarding.

alter table doctors
  alter column phone drop not null;

alter table doctors
  alter column email set not null;

alter table doctors
  add constraint doctors_email_unique unique (email);
