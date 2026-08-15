// Funciones puras de server.js, separadas a este módulo para poder
// testearlas con node:test sin arrancar el server real (server.js llama a
// app.listen() al cargarse). No hay lógica nueva acá -- es exactamente el
// mismo código, solo movido.

// Extrae el primer bloque JSON válido de la respuesta -- Claude a veces
// agrega texto alrededor a pesar de que se le pide que no lo haga.
function extraerJSON(texto) {
  const match = texto.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// Igual que extraerJSON pero para un objeto {...} en vez de un array --
// usada por /api/explicar (Preguntame sobre esto), que devuelve una
// pregunta/evaluación suelta, no una lista.
function extraerJSONObjeto(texto) {
  const match = texto.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// La IA, al armar el JSON de opción múltiple, tiende a poner la respuesta
// correcta casi siempre en las primeras posiciones (el propio ejemplo del
// prompt muestra "correcta": 0, y eso la ancla) -- nunca o casi nunca en la
// última opción. Un estudiante que se da cuenta puede usar ese patrón para
// descartar la última opción sin saber la respuesta real. En vez de confiar
// en que la IA randomice bien (los LLM son malos para eso), mezclamos las
// opciones acá con Fisher-Yates cada vez que se sirven fichas -- tanto recién
// generadas como desde la cache compartida -- así la posición de la correcta
// queda uniformemente distribuida sin importar el sesgo del modelo.
function mezclarOpcionesMultiple(fichas) {
  return fichas.map(f => {
    if (!Array.isArray(f.opciones)) return f;
    const correctaValor = f.opciones[Number(f.correcta)];
    const opciones = [...f.opciones];
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    return { ...f, opciones, correcta: opciones.indexOf(correctaValor) };
  });
}

function fechaHoyMontevideo() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function horaAhoraMontevideo() {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Montevideo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
}

// Redondea "HH:MM" hacia abajo al escalón de 15 min más cercano, para
// comparar la hora elegida por el usuario contra la hora actual sin
// depender de que el cron externo pegue justo al minuto exacto.
function bucket15(hhmm) {
  const [h, m] = String(hhmm || '00:00').split(':').map(Number);
  const flooredM = m - (m % 15);
  return `${String(h).padStart(2, '0')}:${String(flooredM).padStart(2, '0')}`;
}

// Reimplementación server-side de pendingCountGlobal() del front (mismo
// criterio: temas de exámenes en curso con calendario armado que no están
// "firme"). Vive acá porque el server no tiene acceso al estado en memoria
// del navegador -- solo a la foto guardada en app_state.
function pendingCountFromEstado(estado) {
  const examenes = (estado && estado.examenes) || [];
  const hoy = fechaHoyMontevideo();
  let n = 0;
  examenes.forEach((e) => {
    const rendido = e.ejemplo || e.rendidaManual || (e.fecha && e.fecha < hoy);
    if (rendido) return;
    if (!(e.selected && e.selected.length && e.selectedPace)) return;
    const states = e.states || {};
    n += e.selected.filter((t) => states[t] !== 'firme').length;
  });
  return n;
}

module.exports = {
  extraerJSON,
  extraerJSONObjeto,
  mezclarOpcionesMultiple,
  fechaHoyMontevideo,
  horaAhoraMontevideo,
  bucket15,
  pendingCountFromEstado,
};
