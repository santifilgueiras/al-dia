-- Esquema de Supabase para "Al Día" -- correr esto una sola vez en
-- Dashboard de Supabase -> SQL Editor -> pegar todo -> Run.
--
-- Guarda el estado ENTERO de la app (examenes, racha, recordatorio, etc.)
-- como un solo JSONB por usuario, en vez de armar un esquema relacional
-- completo -- es la forma más rápida de pasar de "todo en memoria del
-- navegador" a "persistido de verdad" sin reescribir el modelo de datos
-- del mockup. Si esto se convierte en producto real, vale la pena migrar a
-- tablas relacionales (examenes, temas, estados) más adelante -- para una
-- ronda de prueba con poca gente, este approach alcanza y sobra.

create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  estado jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- RLS: cada usuario solo puede leer y escribir SU PROPIA fila. Sin esto,
-- cualquiera con la anon key (que vive en el HTML, es pública a propósito)
-- podría leer el progreso de cualquier otro estudiante.
alter table public.app_state enable row level security;

drop policy if exists "select propio" on public.app_state;
create policy "select propio"
  on public.app_state for select
  using (auth.uid() = user_id);

drop policy if exists "insert propio" on public.app_state;
create policy "insert propio"
  on public.app_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "update propio" on public.app_state;
create policy "update propio"
  on public.app_state for update
  using (auth.uid() = user_id);

-- Mantiene updated_at al día solo, sin que el cliente tenga que mandarlo.
create or replace function public.tocar_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists app_state_updated_at on public.app_state;
create trigger app_state_updated_at
  before update on public.app_state
  for each row execute function public.tocar_updated_at();

-- Push notifications reales (agregado 2026-08-08). Una fila por dispositivo
-- suscripto (un mismo usuario puede tener varios -- celular + compu), no
-- una por usuario. El server dispara los recordatorios con la
-- SUPABASE_SERVICE_ROLE_KEY (bypassea RLS a propósito, necesita leer/tocar
-- las filas de TODOS los usuarios para el cron), pero el cliente solo
-- gestiona su propia suscripción vía la anon key + RLS de acá abajo, igual
-- que app_state.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  hora text not null default '20:00',
  activo boolean not null default true,
  ultimo_envio date,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "select propia" on public.push_subscriptions;
create policy "select propia"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "insert propia" on public.push_subscriptions;
create policy "insert propia"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "update propia" on public.push_subscriptions;
create policy "update propia"
  on public.push_subscriptions for update
  using (auth.uid() = user_id);

drop policy if exists "delete propia" on public.push_subscriptions;
create policy "delete propia"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);

-- Cache COMPARTIDA de fichas generadas por IA (agregado para bajar el costo
-- de la API key de Santiago). La primera vez que se pide un tema/tipo/
-- cantidad/con-búsqueda, se guarda acá; la próxima persona que pida
-- exactamente lo mismo recibe la copia guardada sin volver a llamar a
-- Claude. Los nombres de tema NO son globalmente únicos (Ingeniería reusa
-- agresivamente el núcleo común -- Cálculo, GAL, Física -- entre sus 9
-- carreras, con el mismo nombre de tema y bibliografía distinta) -- la
-- clave real incluye materia_nombre, si no dos carreras podían recibir
-- fichas cruzadas de la otra (bug real, corregido 2026-08-19). Nunca se
-- cachean fichas generadas a partir de un apunte propio subido por un
-- estudiante (ese contenido es único de esa persona, no tiene sentido
-- compartirlo).
create table if not exists public.fichas_cache (
  id uuid primary key default gen_random_uuid(),
  tema text not null,
  materia_nombre text not null,
  tipo text not null default 'normal',
  cantidad int not null,
  con_busqueda boolean not null default false,
  fichas jsonb not null,
  created_at timestamptz not null default now(),
  unique (materia_nombre, tema, tipo, cantidad, con_busqueda)
);

-- MIGRACIÓN 2026-08-19 -- para una instalación de Supabase que YA tenía
-- fichas_cache creada con la clave vieja (sin materia_nombre). Si es una
-- instalación nueva, el create table de arriba ya crea la tabla bien y este
-- bloque no hace nada. Guardado con un chequeo de la constraint vieja para
-- que sea seguro re-correr el archivo entero las veces que haga falta --
-- sin el guard, el "delete" de acá abajo borraría la cache real en CADA
-- re-ejecución, no solo la primera vez que hace falta migrar.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'fichas_cache_tema_tipo_cantidad_con_busqueda_key'
  ) then
    -- Se vacía la cache vieja a propósito: las filas de antes no tienen
    -- materia_nombre y no se pueden atribuir a una con certeza.
    delete from public.fichas_cache;
    alter table public.fichas_cache alter column materia_nombre set not null;
    alter table public.fichas_cache drop constraint fichas_cache_tema_tipo_cantidad_con_busqueda_key;
    alter table public.fichas_cache add constraint fichas_cache_clave_unica
      unique (materia_nombre, tema, tipo, cantidad, con_busqueda);
  end if;
end $$;

-- Techo diario global de llamadas a la API de Claude (server.js,
-- topeDiarioIA). rateLimitIA (20/hora por usuario) vive en memoria del
-- proceso Node -- Render free duerme/reinicia la instancia con cada
-- spin-down, así que ese límite por hora es evadible solo con esperar. Este
-- contador vive acá en la base para sobrevivir a los reinicios. Sin
-- políticas para el cliente -- solo el server (service role) lee/escribe,
-- vía la función de abajo.
create table if not exists public.ia_uso_diario (
  dia date primary key,
  llamadas int not null default 0
);
alter table public.ia_uso_diario enable row level security;

-- Incremento atómico: dos requests simultáneos no se pisan (a diferencia de
-- un select+update desde el server, que sí tendría una carrera real).
create or replace function public.incrementar_uso_ia(p_dia date, p_tope int)
returns int as $$
declare nuevo int;
begin
  insert into public.ia_uso_diario (dia, llamadas) values (p_dia, 1)
  on conflict (dia) do update set llamadas = public.ia_uso_diario.llamadas + 1
  returning llamadas into nuevo;
  if nuevo > p_tope then
    return -1; -- pasó el techo
  end if;
  return nuevo;
end;
$$ language plpgsql;

-- RLS activado pero SIN políticas: nadie con la anon key (pública, vive en
-- el navegador) puede leer ni escribir esta tabla directo. Solo el server
-- accede, con SUPABASE_SERVICE_ROLE_KEY (bypassea RLS a propósito), igual
-- que con el cron de push.
alter table public.fichas_cache enable row level security;

-- Feedback 👍/👎 de fichas y resúmenes generados por IA (agregado para tener
-- una señal barata de qué temas la IA responde flojo). El cliente nunca
-- escribe acá directo -- pasa siempre por POST /api/feedback (requireAuth),
-- que arma la fila con supabaseAdmin (service role). RLS activado sin
-- políticas para el cliente, mismo patrón que fichas_cache: ni siquiera con
-- la anon key se puede leer o escribir esta tabla desde el navegador. Se
-- revisa a mano desde el SQL Editor del dashboard.
create table if not exists public.ficha_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tema text,
  materia_nombre text,
  tipo_contenido text not null check (tipo_contenido in ('ficha', 'ficha_multiple', 'resumen')),
  contenido text,
  valor text not null check (valor in ('up', 'down')),
  created_at timestamptz not null default now()
);

alter table public.ficha_feedback enable row level security;
