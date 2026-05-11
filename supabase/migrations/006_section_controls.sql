-- Add section visibility and ordering controls to profiles table
alter table profiles add column if not exists is_visible boolean not null default true;
alter table profiles add column if not exists display_order integer not null default 0;
