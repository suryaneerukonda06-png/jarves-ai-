create extension if not exists vector;

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 10000),
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists memories_user_id_created_at_idx
  on public.memories(user_id, created_at desc);

alter table public.memories enable row level security;

drop policy if exists "Users can read own memories" on public.memories;
create policy "Users can read own memories"
  on public.memories for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own memories" on public.memories;
create policy "Users can insert own memories"
  on public.memories for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own memories" on public.memories;
create policy "Users can delete own memories"
  on public.memories for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.match_memories(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table(id uuid, content text, similarity float)
language sql
stable
as $$
  select m.id, m.content,
    1 - (m.embedding <=> query_embedding) as similarity
  from public.memories m
  where m.user_id = auth.uid()
    and m.embedding is not null
    and 1 - (m.embedding <=> query_embedding) >= match_threshold
  order by m.embedding <=> query_embedding
  limit match_count;
$$;
