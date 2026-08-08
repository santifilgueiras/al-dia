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

create policy "select propio"
  on public.app_state for select
  using (auth.uid() = user_id);

create policy "insert propio"
  on public.app_state for insert
  with check (auth.uid() = user_id);

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
