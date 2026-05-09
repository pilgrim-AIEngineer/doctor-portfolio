-- Add is_admin column and trigger to prevent self-escalation via authenticated role

alter table doctors add column is_admin boolean not null default false;

-- Trigger function: allows service role to change is_admin freely;
-- silently resets is_admin for all other roles so a doctor cannot escalate themselves.
create or replace function prevent_is_admin_self_escalation()
returns trigger language plpgsql security definer as $$
begin
  if current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role' then
    return new;
  end if;
  new.is_admin := old.is_admin;
  return new;
end;
$$;

create trigger lock_is_admin_change
  before update on doctors
  for each row execute function prevent_is_admin_self_escalation();
