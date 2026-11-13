-- Seguridad de 4 Patitas Japón: denuncias, límites de publicación y borrado de cuenta.
-- Correr en Supabase → SQL Editor DESPUÉS de publicaciones.sql. Se puede volver a correr sin romper nada.

-- ---------------------------------------------------------------------------
-- 1) Denuncias: cualquiera (también un invitado) puede denunciar una foto, un aviso o un comentario.
--    Nadie puede leer las denuncias de otros; se revisan en Table Editor → denuncias.
-- ---------------------------------------------------------------------------
create table if not exists public.denuncias (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  con_cuenta boolean not null default public.con_cuenta(),
  kind text not null check (kind in ('post', 'aviso', 'comentario', 'comentario_post', 'mascota')),
  target_id text not null check (char_length(target_id) <= 64),
  reason text not null check (reason in ('estafa', 'spam', 'inapropiado', 'maltrato', 'falso', 'otro')),
  detail text check (char_length(detail) <= 300),
  revisada boolean not null default false,
  unique (user_id, kind, target_id)
);
create index if not exists denuncias_objetivo on public.denuncias (kind, target_id);

alter table public.denuncias enable row level security;
drop policy if exists "denuncias: denunciar" on public.denuncias;
drop policy if exists "denuncias: ver las mías" on public.denuncias;
create policy "denuncias: denunciar" on public.denuncias for insert to authenticated
  with check (user_id = auth.uid() and con_cuenta = public.con_cuenta() and revisada = false);
create policy "denuncias: ver las mías" on public.denuncias for select to authenticated using (user_id = auth.uid());

-- Una foto o un comentario de foto con 3 denuncias de personas con cuenta se oculta solo
-- (su autor lo sigue viendo). Para volver a mostrarlo: update posts set oculto = false where id = '...'.

create or replace function public.ocultar_denunciado() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from public.denuncias
   where kind = new.kind and target_id = new.target_id and con_cuenta;
  if n >= 3 then
    if new.kind = 'post' then update public.posts set oculto = true where id::text = new.target_id;
    elsif new.kind = 'comentario_post' then update public.post_comments set oculto = true where id::text = new.target_id;
    end if;
  end if;
  return new;
end $$;
revoke all on function public.ocultar_denunciado() from public, anon, authenticated;
drop trigger if exists ocultar_denunciado on public.denuncias;
create trigger ocultar_denunciado after insert on public.denuncias for each row execute function public.ocultar_denunciado();


-- ---------------------------------------------------------------------------
-- 2) Límites por persona y por hora, para frenar el spam.
-- ---------------------------------------------------------------------------
create or replace function public.limite_por_hora() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int; tope int := tg_argv[0]::int;
begin
  execute format('select count(*) from %I.%I where user_id = $1 and created_at > now() - interval ''1 hour''', tg_table_schema, tg_table_name)
    into n using auth.uid();
  if n >= tope then
    raise exception 'Llegaste al límite de % por hora. Espera un rato y vuelve a intentar.', tope using errcode = 'P0001';
  end if;
  return new;
end $$;

revoke all on function public.limite_por_hora() from public, anon, authenticated;

drop trigger if exists limite_por_hora on public.posts;
create trigger limite_por_hora before insert on public.posts for each row execute function public.limite_por_hora('10');
drop trigger if exists limite_por_hora on public.post_comments;
create trigger limite_por_hora before insert on public.post_comments for each row execute function public.limite_por_hora('30');
drop trigger if exists limite_por_hora on public.denuncias;
create trigger limite_por_hora before insert on public.denuncias for each row execute function public.limite_por_hora('20');

-- Avisos y comentarios de avisos: estas tablas las comparte 4 Patitas web, así que el límite
-- también la protege a ella. Solo se agrega si la tabla tiene user_id y created_at.
do $$
declare t text; tope text;
begin
  foreach t in array array['reports', 'comments'] loop
    tope := case t when 'reports' then '6' else '30' end;
    if (select count(*) from information_schema.columns
         where table_schema = 'public' and table_name = t and column_name in ('user_id', 'created_at')) = 2 then
      execute format('drop trigger if exists limite_por_hora on public.%I', t);
      execute format('create trigger limite_por_hora before insert on public.%I for each row execute function public.limite_por_hora(%L)', t, tope);
    else
      raise notice 'La tabla % no tiene user_id y created_at: no se le puso límite', t;
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3) Borrar mi cuenta (lo pide Google Play): borra lo publicado y la cuenta misma.
--    Las fotos subidas a Storage las borra la app antes de llamar a esta función.
-- ---------------------------------------------------------------------------
create or replace function public.borrar_mi_cuenta() returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); t text;
begin
  if not public.con_cuenta() then
    raise exception 'Entra con tu cuenta para borrarla.' using errcode = 'P0001';
  end if;
  delete from public.post_comments where user_id = uid;
  delete from public.posts where user_id = uid;
  delete from public.denuncias where user_id = uid;
  -- tablas compartidas con 4 Patitas web: solo si tienen user_id
  foreach t in array array['comments', 'reports', 'pets'] loop
    if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = t and column_name = 'user_id') then
      execute format('delete from public.%I where user_id = $1', t) using uid;
    end if;
  end loop;
  delete from auth.users where id = uid;
end $$;
revoke all on function public.borrar_mi_cuenta() from public;
revoke all on function public.borrar_mi_cuenta() from anon;
grant execute on function public.borrar_mi_cuenta() to authenticated;
