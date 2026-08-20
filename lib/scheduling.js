// Motor de repaso espaciado -- el corazón del producto (decide cuándo le
// toca repasar cada tema a cada estudiante). Vivía inline adentro de
// mockup-firme.html; se movió acá para poder testearlo (ver
// test/scheduling.test.js). Se carga en el navegador como <script> normal
// (mockup-firme.html), así que estas declaraciones son globales a
// propósito, NO un IIFE -- addDays/duracionDe se usan desde muchos otros
// lugares del script principal, no solo desde acá. El guard de
// module.exports al final es lo único que distingue "cargado en el
// navegador" de "requerido desde Node" -- mismo código en los dos casos.

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// duracionDe() lee DURACIONES (días de estudio por tema, ver
// data/duraciones.json) -- en el navegador es una variable global que ya
// existe (poblada por cargarDatosEstaticos() en mockup-firme.html), así que
// el 4to parámetro se puede omitir siempre ahí. El 4to parámetro opcional
// existe solo para poder testear esta función desde Node sin depender de
// ningún global -- nunca lo pasa el código real de la app.
// Prueba la clave compuesta facultad::materia::tema antes que el nombre
// pelado (ver claveTema/buscarEnTabla en mockup-firme.html) -- hoy ningún
// JSON tiene claves compuestas todavía, así que esto siempre cae al
// nombre pelado (mismo comportamiento de antes); queda listo para cuando
// se empiece a migrar el catálogo de a una facultad.
function duracionDe(tema, e, duraciones) {
  const tabla = duraciones || (typeof DURACIONES !== 'undefined' ? DURACIONES : {});
  const compuesta = e ? tabla[`${e.facultad || '?'}::${e.materiaNombre || '?'}::${tema}`] : undefined;
  const base = (compuesta !== undefined ? compuesta : tabla[tema]) || 1; // 1 día default para temas propios, sin dato
  const extra = (e && e.extraDias && e.extraDias[tema]) || 0;
  return base + extra;
}

function diasUtilesEntre(examDate, today) {
  const dias = Math.max(1, Math.round((examDate - today) / 86400000) + 1); // incluye hoy
  return Math.max(1, dias - 1); // el último día se reserva para repaso final
}

// Mismo comentario que duracionDe() sobre el parámetro opcional "duraciones".
function calcularRitmoDe(temas, examDate, today, duraciones) {
  const diasUtiles = diasUtilesEntre(examDate, today);
  const totalDuracion = temas.reduce((s, t) => s + duracionDe(t, null, duraciones), 0);
  const minPace = Math.max(1, Math.ceil(totalDuracion / diasUtiles));
  return { diasUtiles, totalDuracion, minPace };
}

// Intervalos del repaso espaciado, en días desde el ÚLTIMO repaso real (no
// desde una fecha fija). idx 0 = primer repaso (2 días), y cada vez que se
// marca "firme" se avanza un escalón (más espaciado); "flojo" siempre
// vuelve al escalón 0.
const INTERVALOS_REPASO = [2, 5, 10, 20];

// Nunca deja que un intervalo de repaso supere ~1/3 de los días que quedan
// hasta el examen -- si no, para exámenes lejanos el intervalo máximo (20
// días) puede dejar tramos larguísimos sin nada agendado. Con esto la
// frecuencia de repaso aumenta sola a medida que se acerca la fecha.
function proximoFechaRepaso(e, idx, desde) {
  const base = INTERVALOS_REPASO[idx];
  if (!e.fecha) return addDays(desde, base);
  const examDate = new Date(e.fecha + 'T00:00:00');
  const diasRestantes = Math.max(1, Math.round((examDate - desde) / 86400000));
  const maxPermitido = Math.max(2, Math.floor(diasRestantes / 3));
  return addDays(desde, Math.min(base, maxPermitido));
}

// Un tema que volvió a "flojo" (escalón 0) demasiadas veces no necesita más
// del mismo repaso -- necesita otra estrategia (ver aplicarSeñalObjetiva en
// lib/evaluacion.js). Reusa el contador flojoCount que ya existía para "se
// te sigue escapando" en Resumen (marcar() en mockup-firme.html) en vez de
// duplicarlo en un campo nuevo -- es exactamente el mismo evento (tema que
// volvió al escalón 0), así no se resetea el historial de usuarios que ya
// vienen usando la app hace semanas.
const LEECH_RECAIDAS = 3;

function registrarRecaida(e, tema) {
  if (!e.flojoCount) e.flojoCount = {};
  e.flojoCount[tema] = (e.flojoCount[tema] || 0) + 1;
}

function esLeech(e, tema) {
  return ((e.flojoCount && e.flojoCount[tema]) || 0) >= LEECH_RECAIDAS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addDays, duracionDe, diasUtilesEntre, calcularRitmoDe,
    INTERVALOS_REPASO, proximoFechaRepaso,
    LEECH_RECAIDAS, registrarRecaida, esLeech,
  };
}
