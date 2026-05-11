-- Add Oncology Pro template while preserving classic as the default free template
alter table templates drop constraint if exists templates_name_check;

alter table templates
  add constraint templates_name_check
  check (name in ('classic', 'modern', 'bold', 'oncology'));

insert into templates (name, preview_image)
values ('oncology', '')
on conflict (name) do nothing;
