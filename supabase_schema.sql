-- Supabase schema for C.R.M. - Central de RPG
-- Run this in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.campaign_states (
  id uuid primary key default gen_random_uuid(),
  share_code text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_members (
  id uuid primary key default gen_random_uuid(),
  share_code text not null references public.campaign_states(share_code) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'player',
  created_at timestamptz not null default now(),
  unique (share_code, user_id)
);

alter table public.campaign_states enable row level security;
alter table public.campaign_members enable row level security;

drop policy if exists "campaign select for members" on public.campaign_states;
create policy "campaign select for members"
on public.campaign_states
for select
to authenticated
using (
  owner_id = auth.uid()
  or exists (
    select 1 from public.campaign_members m
    where m.share_code = campaign_states.share_code
    and m.user_id = auth.uid()
  )
);

drop policy if exists "campaign insert by owner" on public.campaign_states;
create policy "campaign insert by owner"
on public.campaign_states
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "campaign update for members" on public.campaign_states;
create policy "campaign update for members"
on public.campaign_states
for update
to authenticated
using (
  owner_id = auth.uid()
  or exists (
    select 1 from public.campaign_members m
    where m.share_code = campaign_states.share_code
    and m.user_id = auth.uid()
  )
)
with check (
  owner_id = auth.uid()
  or exists (
    select 1 from public.campaign_members m
    where m.share_code = campaign_states.share_code
    and m.user_id = auth.uid()
  )
);

drop policy if exists "members can read own membership" on public.campaign_members;
create policy "members can read own membership"
on public.campaign_members
for select
to authenticated
using (user_id = auth.uid());

create or replace function public.join_campaign(p_share_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.campaign_states where share_code = p_share_code) then
    return;
  end if;

  insert into public.campaign_members (share_code, user_id, role)
  values (p_share_code, auth.uid(), 'player')
  on conflict (share_code, user_id) do nothing;
end;
$$;

grant execute on function public.join_campaign(text) to authenticated;

-- Let Supabase Realtime broadcast updates; safe to run more than once.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'campaign_states'
  ) then
    alter publication supabase_realtime add table public.campaign_states;
  end if;
end;
$$;
