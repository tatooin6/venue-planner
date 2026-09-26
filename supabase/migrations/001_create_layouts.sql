create table public.layouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  definition jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.layouts enable row level security;

create policy "Users can read their layouts" on public.layouts for select to authenticated using (auth.uid() = user_id);
create policy "Users can create their layouts" on public.layouts for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their layouts" on public.layouts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their layouts" on public.layouts for delete to authenticated using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger layouts_set_updated_at before update on public.layouts for each row execute function public.set_updated_at();
