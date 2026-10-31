-- Publicaciones de Inicio (la red social del barrio) para 4 Patitas Japón.
-- Correr una vez en Supabase → SQL Editor. Se puede volver a correr sin romper nada.
-- Mientras estas tablas no existan, la app guarda las publicaciones solo en cada teléfono.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  photo text not null,
  text text not null default '' check (char_length(text) <= 1000),
  pet_id text,           -- id de la mascota del cuaderno (opcional)
  pet_name text,
  pet_photo text,
  zone text,
  likes integer not null default 0,
  author text,
  avatar text
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 500),
  author text,
  avatar text
);

create index if not exists posts_created_at on public.posts (created_at desc);
create index if not exists post_comments_post on public.post_comments (post_id, created_at);

-- Reglas: todos leen; cada sesión (también la anónima) publica y borra solo lo suyo.
alter table public.posts enable row level security;
alter table public.post_comments enable row level security;

drop policy if exists "posts: leer" on public.posts;
drop policy if exists "posts: publicar" on public.posts;
drop policy if exists "posts: borrar" on public.posts;
create policy "posts: leer" on public.posts for select using (true);
create policy "posts: publicar" on public.posts for insert to authenticated with check (user_id = auth.uid() and likes = 0);
create policy "posts: borrar" on public.posts for delete to authenticated using (user_id = auth.uid());

drop policy if exists "post_comments: leer" on public.post_comments;
drop policy if exists "post_comments: comentar" on public.post_comments;
drop policy if exists "post_comments: borrar" on public.post_comments;
create policy "post_comments: leer" on public.post_comments for select using (true);
create policy "post_comments: comentar" on public.post_comments for insert to authenticated with check (user_id = auth.uid());
create policy "post_comments: borrar" on public.post_comments for delete to authenticated using (user_id = auth.uid());

-- Corazones: suma o resta de a uno sin dar permiso de editar la publicación.
create or replace function public.like_post(pid uuid, delta int)
returns int language sql security definer set search_path = public as $$
  update public.posts set likes = greatest(0, likes + sign(delta)::int) where id = pid returning likes;
$$;
revoke all on function public.like_post(uuid, int) from public;
grant execute on function public.like_post(uuid, int) to anon, authenticated;

-- Tiempo real: las publicaciones nuevas aparecen sin recargar.
do $$ begin
  alter publication supabase_realtime add table public.posts;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.post_comments;
exception when duplicate_object then null; end $$;
