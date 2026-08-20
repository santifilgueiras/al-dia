// Merge de estados en conflicto de guardado -- se carga en el navegador
// como <script> normal (mockup-firme.html) y también con require() desde
// los tests, mismo patrón que lib/scheduling.js (declaración global +
// guard de module.exports al final, no un IIFE).
//
// Contexto (ver guardarEstadoSiHaceFalta() en mockup-firme.html): cuando
// dos dispositivos/pestañas de la misma cuenta guardan casi al mismo
// tiempo, el control de concurrencia optimista sobre updated_at detecta el
// conflicto -- pero hasta ahora, la reacción era descartar TODO el estado
// local y recargar el del server: si acabás de marcar un tema firme en el
// celular mientras la compu (que guardó primero) tenía otro cambio
// pendiente, esa marca se perdía en silencio. El estado es un mapa por
// tema, así que se puede mergear en vez de tener que elegir un ganador por
// fila entera.

// Bug real encontrado con un smoke test de dos pestañas de verdad
// (2026-08-20, ver sección G del patch): `{ ...l.states, ...r.states }`
// hace ganar al remoto en CUALQUIER clave que exista de los dos lados --
// y como `states` siempre tiene TODOS los temas de la materia (tocados o
// no), eso es prácticamente siempre. Marcar el tema A en el celular
// mientras la compu guarda un cambio en el tema B se perdía igual que
// antes del fix de D, solo que en silencio en vez de con un toast. Hace
// falta un tercer punto de referencia (qué tenía ESTE dispositivo la
// última vez que se supo sincronizado) para distinguir "esta clave no la
// toqué" de "esta clave la acabo de cambiar, pero ya existía antes".
//
// Si `base` no tiene esa clave (o no se pasa `base` en absoluto), el
// comportamiento es el de siempre: remoto gana en todo lo compartido,
// local gana solo en claves que remoto ni siquiera tiene -- por eso los
// tests viejos (sin `base`) siguen pasando sin tocarlos.
function mergearMapa(base, l, r) {
  base = base || {}; l = l || {}; r = r || {};
  const salida = { ...r };
  for (const key of Object.keys(l)) {
    const localCambio = l[key] !== base[key];
    const remotoCambio = r[key] !== base[key];
    // Solo ESTE dispositivo tocó la clave desde la última sincronización
    // conocida -- gana local, es la marca que se estaba por perder. Si el
    // remoto TAMBIÉN la tocó (conflicto real de verdad, los dos editaron
    // lo mismo), gana el remoto -- ya ganó por el spread de arriba.
    if (localCambio && !remotoCambio) salida[key] = l[key];
  }
  return salida;
}

// `local` es lo que tiene esta pestaña sin guardar todavía, `remoto` es lo
// que ya quedó persistido en el server (más nuevo, gana por defecto en todo
// lo que no se mergea explícito abajo). `base` (opcional) es el último
// estado que ESTE dispositivo supo sincronizado -- sin él, se pierde la
// capacidad de distinguir una edición local real de un valor que ya venía
// de antes (ver mergearMapa arriba).
function mergearEstados(local, remoto, base) {
  const salida = { ...remoto };
  const porId = (arr) => new Map((arr || []).map(e => [e.id, e]));
  const remotos = porId(remoto.examenes);
  const locales = porId(local.examenes);
  const bases = porId(base && base.examenes);

  const ids = new Set([...remotos.keys(), ...locales.keys()]);
  salida.examenes = [...ids].map(id => {
    const r = remotos.get(id), l = locales.get(id);
    if (!r) return l; // creado en este dispositivo, el server todavía no lo tiene
    if (!l) return r; // creado (o borrado acá) en el otro dispositivo -- gana el server
    const b = bases.get(id) || {};
    return {
      ...r,
      // Progreso por tema: gana el que tenga dato de cada lado, mergeado
      // campo por campo (no fila completa) y a favor de quien realmente
      // cambió cada clave desde la última sincronización (ver
      // mergearMapa). Si los dos tocaron el MISMO tema de verdad, gana el
      // remoto (ya está persistido) -- el único caso real en el que se
      // puede perder algo, y es una marca puntual, no la sesión entera.
      states:        mergearMapa(b.states,        l.states,        r.states),
      touched:       mergearMapa(b.touched,       l.touched,       r.touched),
      proximoRepaso: mergearMapa(b.proximoRepaso, l.proximoRepaso, r.proximoRepaso),
      intervaloIdx:  mergearMapa(b.intervaloIdx,  l.intervaloIdx,  r.intervaloIdx),
      prioridadTema: mergearMapa(b.prioridadTema, l.prioridadTema, r.prioridadTema),
      // Evaluación objetiva (ver lib/evaluacion.js, PATCH sección E): mismo
      // criterio de merge por tema que el resto.
      evaluaciones:  mergearMapa(b.evaluaciones,  l.evaluaciones,  r.evaluaciones),
      flojoCount:    mergearMapa(b.flojoCount,    l.flojoCount,    r.flojoCount),
      firmeFechas:   mergearMapa(b.firmeFechas,   l.firmeFechas,   r.firmeFechas),
      // Temas elegidos: unión -- agregar un tema en un dispositivo no lo
      // hace desaparecer en el otro.
      selected: [...new Set([...(l.selected || []), ...(r.selected || [])])],
      ownTemas: [...new Set([...(l.ownTemas || []), ...(r.ownTemas || [])])],
    };
  });

  // Notas del calendario (y temas propios de Repaso, mismo objeto -- ver
  // notasCalendario): mapa fecha -> lista, unión por id de nota.
  salida.notasCalendario = { ...(remoto.notasCalendario || {}) };
  for (const [dia, notas] of Object.entries(local.notasCalendario || {})) {
    const yaHay = new Map((salida.notasCalendario[dia] || []).map(nt => [nt.id, nt]));
    (notas || []).forEach(nt => { if (!yaHay.has(nt.id)) yaHay.set(nt.id, nt); });
    salida.notasCalendario[dia] = [...yaHay.values()];
  }

  salida.racha = Math.max(local.racha || 0, remoto.racha || 0);
  salida.actividadDiaria = { ...(local.actividadDiaria || {}), ...(remoto.actividadDiaria || {}) };
  salida.nextExamenId = Math.max(local.nextExamenId || 1, remoto.nextExamenId || 1);
  return salida;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mergearEstados, mergearMapa };
}
