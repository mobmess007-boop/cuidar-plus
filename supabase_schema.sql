-- Create a table for public profiles if desired, but for this MVP we might rely on auth.users metadata.
-- However, creating a profile table is good practice.

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  is_premium boolean default false,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- BLOOD PRESSURE LOGS
create table public.blood_pressure_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  systolic int not null,
  diastolic int not null,
  pulse int,
  notes text,
  measured_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blood_pressure_logs enable row level security;

create policy "Users can view their own bp logs"
  on blood_pressure_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bp logs"
  on blood_pressure_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own bp logs"
  on blood_pressure_logs for update
  using ( auth.uid() = user_id );
  
create policy "Users can delete their own bp logs"
  on blood_pressure_logs for delete
  using ( auth.uid() = user_id );


-- MEDICATIONS
create table public.medications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  dosage text,
  frequency text, -- store as text for MVP, e.g. "8h", "12h"
  next_dose timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.medications enable row level security;

create policy "Users can view their own medications"
  on medications for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own medications"
  on medications for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own medications"
  on medications for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own medications"
  on medications for delete
  using ( auth.uid() = user_id );


-- GLUCOSE LOGS
create table public.glucose_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  level int not null, -- mg/dL
  context text, -- e.g., 'fasting', 'after_meal'
  notes text,
  measured_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.glucose_logs enable row level security;

create policy "Users can view their own glucose logs"
  on glucose_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own glucose logs"
  on glucose_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own glucose logs"
  on glucose_logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own glucose logs"
  on glucose_logs for delete
  using ( auth.uid() = user_id );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, is_premium)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
