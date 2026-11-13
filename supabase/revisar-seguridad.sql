-- Revisión de seguridad: SOLO LECTURA, no cambia nada.
-- Pegar en Supabase → SQL Editor y mirar cada resultado. Sirve sobre todo para las tablas que
-- 4 Patitas Japón comparte con 4 Patitas web (reports, pets, comments) y para Storage.

-- 1) Tablas sin RLS. Debería salir vacío: una tabla sin RLS la puede leer y cambiar cualquiera con la clave pública.
select tablename as tabla_sin_rls from pg_tables where schemaname = 'public' and not rowsecurity;

-- 2) Todas las reglas. Revisar que UPDATE y DELETE usen "user_id = auth.uid()" (solo el dueño).
select tablename as tabla, policyname as regla, cmd as accion, roles, qual as quien_puede, with_check as que_se_comprueba
  from pg_policies where schemaname in ('public', 'storage') order by tablename, cmd;

-- 3) Reglas peligrosas: dejan cambiar o borrar filas ajenas. Debería salir vacío.
select tablename as tabla, policyname as regla, cmd as accion
  from pg_policies
 where schemaname = 'public' and cmd in ('UPDATE', 'DELETE', 'ALL') and (qual is null or qual = 'true');

-- 4) Funciones con permisos especiales (security definer) y quién puede llamarlas.
--    Las de corazones y seguir deben sumar o restar de a uno; ninguna debe dejar editar filas ajenas.
select p.proname as funcion,
       has_function_privilege('anon', p.oid, 'execute') as visitante_sin_sesion,
       has_function_privilege('authenticated', p.oid, 'execute') as con_sesion
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prosecdef order by 1;

-- 5) Storage: el bucket de fotos debería tener límite de tamaño y solo aceptar imágenes.
select id as bucket, public as publico, file_size_limit as tamano_maximo, allowed_mime_types as tipos
  from storage.buckets;

-- 6) ¿Cuántas cuentas anónimas (invitados) se crearon en las últimas 24 horas? Muchas de golpe = bots.
select count(*) as invitados_ultimas_24h from auth.users where is_anonymous and created_at > now() - interval '1 day';
