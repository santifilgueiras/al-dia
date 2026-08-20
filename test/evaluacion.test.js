const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  UMBRAL_FIRME, UMBRAL_FLOJO,
  registrarEvaluacion, aplicarSeñalObjetiva,
  ritmoObservado, proyeccionFirmes,
} = require('../lib/evaluacion');

const hoy = new Date('2026-08-20T00:00:00');
const examenBase = (over) => ({
  id: 1, fecha: '2026-09-19', selected: ['Insuficiencia cardíaca', 'Otro tema'],
  states: {}, touched: {}, intervaloIdx: {}, proximoRepaso: {}, ...over,
});

describe('UMBRAL_FIRME / UMBRAL_FLOJO', () => {
  test('80% y 50%, tal como pide el patch', () => {
    assert.equal(UMBRAL_FIRME, 0.8);
    assert.equal(UMBRAL_FLOJO, 0.5);
  });
});

describe('registrarEvaluacion', () => {
  test('guarda el intento con fecha/aciertos/total/origen', () => {
    const e = examenBase();
    registrarEvaluacion(e, 'Otro tema', 3, 4, 'fichas', hoy);
    assert.equal(e.evaluaciones['Otro tema'].intentos.length, 1);
    assert.deepEqual(e.evaluaciones['Otro tema'].intentos[0], { fecha: '2026-08-20', aciertos: 3, total: 4, origen: 'fichas' });
  });

  test('solo conserva los últimos 5 intentos -- un desastre viejo no debería seguir pesando', () => {
    const e = examenBase();
    for (let i = 0; i < 7; i++) registrarEvaluacion(e, 'Otro tema', 1, 4, 'fichas', hoy);
    assert.equal(e.evaluaciones['Otro tema'].intentos.length, 5);
  });
});

describe('aplicarSeñalObjetiva', () => {
  test('muestra muy chica (total < 4) no ajusta nada', () => {
    const e = examenBase({ states: { A: 'firme' } });
    const r = registrarEvaluacion(e, 'A', 0, 3, 'simulacro', hoy);
    assert.equal(r, null);
    assert.equal(e.states.A, 'firme');
  });

  test('firme + mal resultado real (2/8) baja a flojo y resetea el repaso al escalón 0', () => {
    const e = examenBase({ states: { 'Insuficiencia cardíaca': 'firme' }, intervaloIdx: { 'Insuficiencia cardíaca': 2 } });
    const r = registrarEvaluacion(e, 'Insuficiencia cardíaca', 2, 8, 'simulacro', hoy);
    assert.deepEqual(r, { tema: 'Insuficiencia cardíaca', de: 'firme', a: 'flojo', ratio: 0.25 });
    assert.equal(e.states['Insuficiencia cardíaca'], 'flojo');
    assert.equal(e.touched['Insuficiencia cardíaca'], true);
    assert.equal(e.intervaloIdx['Insuficiencia cardíaca'], 0);
    assert.equal(e.proximoRepaso['Insuficiencia cardíaca'], '2026-08-22'); // hoy + 2 (escalón 0)
    assert.equal(e.ajustadoPorEvaluacion, true);
  });

  test('bajar a flojo cuenta como recaída (flojoCount, mismo dato que "se te sigue escapando")', () => {
    const e = examenBase({ states: { A: 'firme' } });
    registrarEvaluacion(e, 'A', 1, 5, 'test', hoy);
    assert.equal(e.flojoCount.A, 1);
  });

  test('ya estaba flojo y sale mal de nuevo -- no vuelve a marcar la transición ni suma otra recaída', () => {
    const e = examenBase({ states: { A: 'flojo' } });
    const r = registrarEvaluacion(e, 'A', 0, 4, 'fichas', hoy);
    assert.equal(r, null);
    assert.equal(e.flojoCount, undefined);
  });

  test('flojo + buen resultado (8/8) sube un solo escalón a firme, no lo "consagra"', () => {
    const e = examenBase({ states: { A: 'flojo' }, intervaloIdx: { A: 1 } });
    const r = registrarEvaluacion(e, 'A', 8, 8, 'fichas', hoy);
    assert.deepEqual(r, { tema: 'A', de: 'flojo', a: 'firme', ratio: 1 });
    assert.equal(e.states.A, 'firme');
    assert.equal(e.intervaloIdx.A, 2); // avanzó un escalón, no saltó al final
    assert.equal(e.firmeFechas.A, '2026-08-20');
  });

  test('tema nuevo (nunca tocado) con buen resultado NO se declara firme solo -- la señal confirma, no consagra desde cero', () => {
    const e = examenBase({ states: {} });
    const r = registrarEvaluacion(e, 'A', 8, 8, 'fichas', hoy);
    assert.equal(r, null);
    assert.equal(e.states.A, undefined);
  });

  test('resultado ambiguo (50-79%) no toca nada', () => {
    const e = examenBase({ states: { A: 'firme' } });
    const r = registrarEvaluacion(e, 'A', 5, 8, 'simulacro', hoy); // 62.5%
    assert.equal(r, null);
    assert.equal(e.states.A, 'firme');
  });
});

describe('ritmoObservado', () => {
  test('cuenta cuántos temas se marcaron firme en los últimos 7 días', () => {
    const e = { firmeFechas: { A: '2026-08-19', B: '2026-08-15', C: '2026-08-01' } };
    // desde 13/8 (hoy-7) hasta 20/8: A (19/8) y B (15/8) entran, C (1/8) no.
    assert.equal(ritmoObservado(e, hoy), 2 / 7);
  });

  test('sin ninguna marca reciente da 0', () => {
    assert.equal(ritmoObservado({ firmeFechas: {} }, hoy), 0);
  });
});

describe('proyeccionFirmes', () => {
  test('sin fecha de examen no proyecta nada', () => {
    const e = examenBase({ fecha: null });
    assert.equal(proyeccionFirmes(e, hoy), null);
  });

  test('sin ritmo real observado, usa el ritmo mínimo teórico', () => {
    const e = examenBase({ fecha: '2026-08-25', selected: ['A', 'B'] }); // 5 días útiles
    const r = proyeccionFirmes(e, hoy);
    assert.equal(r.total, 2);
    assert.equal(r.ritmoReal, r.ritmoNecesario);
    assert.equal(r.alcanzables, 2);
  });

  test('con ritmo real observado más lento que el mínimo, proyecta menos de los que hay', () => {
    const e = examenBase({
      fecha: '2026-09-19', // ~30 días útiles
      selected: Array.from({ length: 20 }, (_, i) => `tema${i}`),
      firmeFechas: { tema0: '2026-08-19' }, // 1 firme en los últimos 7 días -> ritmo 1/7
    });
    const r = proyeccionFirmes(e, hoy);
    assert.ok(r.alcanzables < r.total);
    assert.equal(r.ritmoReal, 1 / 7);
  });
});
