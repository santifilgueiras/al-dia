// Evaluación objetiva del progreso -- ver PATCH-2026-08-19.md sección E.
// Hasta ahora "firme"/"flojo" salían solo de tres botones que toca el
// estudiante (autodeclarado). Fichas de opción múltiple, Simulacro y el
// test de "Explícamelo" ya calculan aciertos/total -- esto los conecta al
// estado real del tema en vez de dejarlos como una pantalla de resultado
// aislada. Mismo patrón dual browser+Node que lib/scheduling.js/estado.js:
// funciones globales de nivel superior (no un IIFE), con un guard de
// module.exports al final para poder testear desde Node.

// Umbrales deliberadamente conservadores -- la idea NO es sobreescribir lo
// que el estudiante dice de sí mismo, sino no dejar pasar una contradicción
// evidente entre "lo tengo firme" y 2 de 8 en el simulacro de ese tema.
const UMBRAL_FIRME = 0.8; // >=80% sostiene (o sube a) firme
const UMBRAL_FLOJO = 0.5; // <50% baja a flojo, sin importar cómo se había marcado

// addDays/calcularRitmoDe/proximoFechaRepaso/INTERVALOS_REPASO/registrarRecaida
// son globales en el navegador (scheduling.js se carga antes, mismo <script>
// clásico de siempre -- ver el <head> de mockup-firme.html). Bajo Node este
// archivo es un módulo aislado y hace falta traerlos con require(). Mismo
// truco que ya usa duracionDe() en lib/scheduling.js con su parámetro
// opcional de "duraciones", resuelto acá una sola vez para las 4 funciones
// de este archivo.
function _schedDeps() {
  return typeof proximoFechaRepaso !== 'undefined'
    ? { addDays, calcularRitmoDe, proximoFechaRepaso, INTERVALOS_REPASO, registrarRecaida }
    : require('./scheduling');
}

function fechaISO(d) { return d.toISOString().slice(0, 10); }

// e.evaluaciones[tema] = { intentos: [{ fecha, aciertos, total, origen }] }
// origen: 'fichas' | 'simulacro' | 'test'. Devuelve lo que haya ajustado
// aplicarSeñalObjetiva (o null si no ajustó nada), para que quien llama
// pueda mostrarlo en la UI ("Bajamos X a flojo...").
function registrarEvaluacion(e, tema, aciertos, total, origen, hoy) {
  if (!e.evaluaciones) e.evaluaciones = {};
  if (!e.evaluaciones[tema]) e.evaluaciones[tema] = { intentos: [] };
  e.evaluaciones[tema].intentos.push({ fecha: fechaISO(hoy), aciertos, total, origen });
  // Solo interesan los últimos 5 intentos: un desastre de hace dos meses no
  // debería seguir pesando cuando la persona ya lo repasó bien tres veces.
  e.evaluaciones[tema].intentos = e.evaluaciones[tema].intentos.slice(-5);
  return aplicarSeñalObjetiva(e, tema, hoy);
}

// Devuelve { tema, de, a, ratio } si ajustó el estado, o null si no había
// contradicción evidente (o la muestra era muy chica para concluir algo).
function aplicarSeñalObjetiva(e, tema, hoy) {
  const reg = e.evaluaciones && e.evaluaciones[tema];
  if (!reg || !reg.intentos.length) return null;
  const ult = reg.intentos[reg.intentos.length - 1];
  if (!ult.total || ult.total < 4) return null; // muestra muy chica para concluir algo
  const ratio = ult.aciertos / ult.total;
  const { proximoFechaRepaso, INTERVALOS_REPASO, registrarRecaida } = _schedDeps();

  if (!e.states) e.states = {};
  if (!e.touched) e.touched = {};
  if (!e.intervaloIdx) e.intervaloIdx = {};
  if (!e.proximoRepaso) e.proximoRepaso = {};

  if (ratio < UMBRAL_FLOJO && e.states[tema] !== 'flojo') {
    const de = e.states[tema];
    e.states[tema] = 'flojo';
    e.touched[tema] = true;
    e.intervaloIdx[tema] = 0;
    e.proximoRepaso[tema] = fechaISO(proximoFechaRepaso(e, 0, hoy));
    registrarRecaida(e, tema);
    e.ajustadoPorEvaluacion = true; // para poder explicarlo en la UI
    return { tema, de, a: 'flojo', ratio };
  }
  if (ratio >= UMBRAL_FIRME && e.states[tema] === 'flojo') {
    // Sube solo un escalón: un buen resultado confirma, no consagra.
    e.states[tema] = 'firme';
    e.touched[tema] = true;
    const idx = Math.min((e.intervaloIdx[tema] || 0) + 1, INTERVALOS_REPASO.length - 1);
    e.intervaloIdx[tema] = idx;
    e.proximoRepaso[tema] = fechaISO(proximoFechaRepaso(e, idx, hoy));
    if (!e.firmeFechas) e.firmeFechas = {};
    e.firmeFechas[tema] = fechaISO(hoy);
    return { tema, de: 'flojo', a: 'firme', ratio };
  }
  return null;
}

// Cuántos temas por día se marcaron firme de verdad en los últimos 7 días
// -- la señal real detrás de proyeccionFirmes(), más honesta que el ritmo
// mínimo teórico cuando el estudiante ya viene más rápido o más lento que
// ese mínimo.
function ritmoObservado(e, hoy) {
  const { addDays } = _schedDeps();
  const desde = addDays(hoy, -7);
  const fechas = Object.values(e.firmeFechas || {});
  const recientes = fechas.filter(f => {
    const d = new Date(f + 'T00:00:00');
    return d >= desde && d <= hoy;
  });
  return recientes.length / 7;
}

// "A este ritmo llegás con 8 de 12 firmes" -- reemplaza al % firme crudo
// (que arranca en 0 y cuenta en contra todo lo no visto todavía) como
// número principal de una materia: más útil y más honesto que "estás en la
// semana 1 con 3% firme".
function proyeccionFirmes(e, hoy) {
  if (!e.fecha || !e.selected || !e.selected.length) return null;
  const { calcularRitmoDe } = _schedDeps();
  const examDate = new Date(e.fecha + 'T00:00:00');
  const { diasUtiles, minPace } = calcularRitmoDe(e.selected, examDate, hoy);
  const ritmoReal = ritmoObservado(e, hoy) || minPace;
  const alcanzables = Math.min(e.selected.length, Math.floor(ritmoReal * diasUtiles));
  return { alcanzables, total: e.selected.length, ritmoReal, ritmoNecesario: minPace };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UMBRAL_FIRME, UMBRAL_FLOJO,
    registrarEvaluacion, aplicarSeñalObjetiva,
    ritmoObservado, proyeccionFirmes,
  };
}
