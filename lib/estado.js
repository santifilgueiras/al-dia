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

// `local` es lo que tiene esta pestaña sin guardar todavía, `remoto` es lo
// que ya quedó persistido en el server (más nuevo, gana por defecto en todo
// lo que no se mergea explícito abajo).
function mergearEstados(local, remoto) {
  const salida = { ...remoto };
  const porId = (arr) => new Map((arr || []).map(e => [e.id, e]));
  const remotos = porId(remoto.examenes);
  const locales = porId(local.examenes);

  const ids = new Set([...remotos.keys(), ...locales.keys()]);
  salida.examenes = [...ids].map(id => {
    const r = remotos.get(id), l = locales.get(id);
    if (!r) return l; // creado en este dispositivo, el server todavía no lo tiene
    if (!l) return r; // creado (o borrado acá) en el otro dispositivo -- gana el server
    return {
      ...r,
      // Progreso por tema: gana el que tenga dato de cada lado, mergeado
      // campo por campo (no fila completa). Si los dos marcaron el MISMO
      // tema distinto, gana el remoto (ya está persistido) -- es el único
      // caso real en el que se puede perder algo, y es una marca puntual,
      // no la sesión entera.
      states:        { ...l.states,        ...r.states },
      touched:       { ...l.touched,       ...r.touched },
      proximoRepaso: { ...l.proximoRepaso, ...r.proximoRepaso },
      intervaloIdx:  { ...l.intervaloIdx,  ...r.intervaloIdx },
      prioridadTema: { ...l.prioridadTema, ...r.prioridadTema },
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
  module.exports = { mergearEstados };
}
