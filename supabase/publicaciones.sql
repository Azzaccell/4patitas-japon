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
  oculto boolean not null default false,  -- lo oculta seguridad.sql tras 3 denuncias
  author text,
  avatar text
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 500),
  oculto boolean not null default false,
  author text,
  avatar text
);

-- por si las tablas se crearon con una versión anterior de este archivo
alter table public.posts add column if not exists oculto boolean not null default false;
alter table public.post_comments add column if not exists oculto boolean not null default false;

create index if not exists posts_created_at on public.posts (created_at desc);
create index if not exists post_comments_post on public.post_comments (post_id, created_at);

-- Reglas: todos leen (menos lo ocultado por denuncias, que solo ve su autor); solo quien tiene cuenta publica, comenta y da corazón (los invitados entran con
-- una sesión anónima de Supabase y aquí no pueden escribir). Cada quien borra solo lo suyo.
create or replace function public.con_cuenta() returns boolean language sql stable as $$
  select auth.uid() is not null and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false;
$$;

alter table public.posts enable row level security;
alter table public.post_comments enable row level security;

drop policy if exists "posts: leer" on public.posts;
drop policy if exists "posts: publicar" on public.posts;
drop policy if exists "posts: borrar" on public.posts;
create policy "posts: leer" on public.posts for select using (not oculto or user_id = auth.uid());
-- una foto solo puede ir al álbum de una mascota propia
create policy "posts: publicar" on public.posts for insert to authenticated with check (
  public.con_cuenta() and user_id = auth.uid() and likes = 0
  and (pet_id is null or exists (select 1 from public.pets p where p.id::text = pet_id and p.user_id = auth.uid()))
);
create policy "posts: borrar" on public.posts for delete to authenticated using (user_id = auth.uid());

drop policy if exists "post_comments: leer" on public.post_comments;
drop policy if exists "post_comments: comentar" on public.post_comments;
drop policy if exists "post_comments: borrar" on public.post_comments;
create policy "post_comments: leer" on public.post_comments for select using (not oculto or user_id = auth.uid());
create policy "post_comments: comentar" on public.post_comments for insert to authenticated with check (public.con_cuenta() and user_id = auth.uid());
create policy "post_comments: borrar" on public.post_comments for delete to authenticated using (user_id = auth.uid());

-- La base pone la firma, la fecha y el estado de cada publicación y comentario: lo que mande la app
-- en author, avatar, created_at, oculto o likes se ignora. Así nadie firma como otro ni se adelanta en Inicio.
create or replace function public.firmar_fila() returns trigger
language plpgsql security definer set search_path = public as $$
declare meta jsonb; correo text;
begin
  select raw_user_meta_data, email into meta, correo from auth.users where id = auth.uid();
  new.author := coalesce(nullif(meta ->> 'full_name', ''), nullif(meta ->> 'name', ''), split_part(correo, '@', 1));
  new.avatar := case when meta ->> 'avatar_url' like 'https://%' then meta ->> 'avatar_url' end;
  new.created_at := now();
  new.oculto := false;
  if tg_table_name = 'posts' then
    new.likes := 0;
    if new.pet_id is not null then select p.name into new.pet_name from public.pets p where p.id::text = new.pet_id; end if;
  end if;
  return new;
end $$;
revoke all on function public.firmar_fila() from public, anon, authenticated;
drop trigger if exists firmar_fila on public.posts;
create trigger firmar_fila before insert on public.posts for each row execute function public.firmar_fila();
drop trigger if exists firmar_fila on public.post_comments;
create trigger firmar_fila before insert on public.post_comments for each row execute function public.firmar_fila();

-- Corazones: uno por persona y por foto. El total sale de contar, así nadie lo infla ni lo vacía.
create table if not exists public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  primary key (post_id, user_id)
);
alter table public.post_likes enable row level security; -- sin reglas: solo se toca a través de like_post

drop function if exists public.like_post(uuid, int);
create function public.like_post(pid uuid, delta int)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.con_cuenta() then return null; end if;
  if delta > 0 then
    insert into public.post_likes (post_id, user_id) values (pid, auth.uid()) on conflict do nothing;
  else
    delete from public.post_likes where post_id = pid and user_id = auth.uid();
  end if;
  update public.posts set likes = (select count(*) from public.post_likes where post_id = pid) where id = pid returning likes into n;
  return n;
end $$;
revoke all on function public.like_post(uuid, int) from public;
revoke all on function public.like_post(uuid, int) from anon;
grant execute on function public.like_post(uuid, int) to authenticated;

-- Tiempo real: las publicaciones nuevas aparecen sin recargar.
do $$ begin
  alter publication supabase_realtime add table public.posts;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.post_comments;
exception when duplicate_object then null; end $$;
