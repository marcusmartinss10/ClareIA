-- Migration: 20240126_auto_create_profile
-- Description: Sets up a trigger to automatically create profile and organization when a new user signs up.

-- 1. Create the function that will be executed by the trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  org_id uuid;
begin
  -- Insert into profiles
  -- We use the data passed in raw_user_meta_data
  insert into public.profiles (id, email, full_name, whatsapp)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'whatsapp'
  );

  -- Insert into organizations
  insert into public.organizations (name, cnpj, slug)
  values (
    new.raw_user_meta_data->>'clinic_name',
    new.raw_user_meta_data->>'cnpj',
    new.raw_user_meta_data->>'slug'
  )
  returning id into org_id;

  -- Insert into organization_members
  -- Link the new user as the 'owner' of the new organization
  insert into public.organization_members (organization_id, user_id, role)
  values (
    org_id,
    new.id,
    'owner'
  );

  return new;
end;
$$;

-- 2. Create the trigger
-- Drop if exists to ensure idempotent run (though 'create or replace trigger' is not standard pg syntax for all versions, 'drop trigger if exists' is safer)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
