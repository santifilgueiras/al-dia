const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { mergearEstados, mergearMapa } = require('../lib/estado');

// Examen base mínimo para no repetir todos los campos en cada caso.
const examenBase = (over) => ({
  id: 1, states: {}, touched: {}, selected: ['A', 'B'], ownTemas: [],
  proximoRepaso: {}, intervaloIdx: {}, prioridadTema: {}, ...over,
});

describe('mergearEstados (conflicto de guardado entre dos dispositivos)', () => {
  test('conserva la marca local cuando el remoto tocó otro tema', () => {
    const local = { examenes: [examenBase({ states: { A: 'firme' }, touched: { A: true } })] };
    const remoto = { examenes: [examenBase({ states: { B: 'flojo' }, touched: { B: true } })] };
    const m = mergearEstados(local, remoto);
    assert.equal(m.examenes[0].states.A, 'firme'); // lo que antes se perdía
    assert.equal(m.examenes[0].states.B, 'flojo');
  });

  test('si los dos marcaron el MISMO tema distinto, gana el remoto (ya persistido)', () => {
    const local = { examenes: [examenBase({ states: { A: 'flojo' } })] };
    const remoto = { examenes: [examenBase({ states: { A: 'firme' } })] };
    const m = mergearEstados(local, remoto);
    assert.equal(m.examenes[0].states.A, 'firme');
  });

  test('un examen creado solo en el dispositivo local sobrevive al merge', () => {
    const local = { examenes: [examenBase({ id: 99, materiaNombre: 'Nuevo' })] };
    const remoto = { examenes: [] };
    const m = mergearEstados(local, remoto);
    assert.equal(m.examenes.length, 1);
    assert.equal(m.examenes[0].materiaNombre, 'Nuevo');
  });

  test('temas seleccionados: unión, no se pierde uno agregado en el otro dispositivo', () => {
    const local = { examenes: [examenBase({ selected: ['A', 'B', 'C'] })] };
    const remoto = { examenes: [examenBase({ selected: ['A', 'B', 'D'] })] };
    const m = mergearEstados(local, remoto);
    assert.deepEqual(new Set(m.examenes[0].selected), new Set(['A', 'B', 'C', 'D']));
  });

  test('notas del calendario: unión por id, no se pisan entre dispositivos', () => {
    const local = { examenes: [], notasCalendario: { '2026-08-20': [{ id: 'a', texto: 'nota local' }] } };
    const remoto = { examenes: [], notasCalendario: { '2026-08-20': [{ id: 'b', texto: 'nota remota' }] } };
    const m = mergearEstados(local, remoto);
    assert.equal(m.notasCalendario['2026-08-20'].length, 2);
  });

  test('racha: se queda con la más alta de las dos', () => {
    const m = mergearEstados({ examenes: [], racha: 5 }, { examenes: [], racha: 3 });
    assert.equal(m.racha, 5);
  });

  test('sin examenes de ningún lado no explota', () => {
    const m = mergearEstados({ examenes: [] }, { examenes: [] });
    assert.deepEqual(m.examenes, []);
  });
});

describe('mergearMapa (base/local/remoto -- el fix del bug real de 2026-08-20)', () => {
  test('local cambió una clave que ya existía en remoto (sin cambios ahí) -- gana local', () => {
    // Este es EXACTAMENTE el bug encontrado con un smoke test de dos
    // pestañas reales: antes de tener `base`, `{...l, ...r}` hacía ganar
    // al remoto en cualquier clave presente en los dos lados -- y como
    // `states` siempre tiene TODOS los temas (tocados o no), una marca
    // nueva en un tema que el remoto ya "conocía" (aunque sin cambios) se
    // perdía en silencio.
    const base = { A: 'nuevo', B: 'nuevo' };
    const l = { A: 'nuevo', B: 'firme' }; // este dispositivo acaba de marcar B firme
    const r = { A: 'nuevo', B: 'nuevo' }; // el remoto no tocó nada
    assert.deepEqual(mergearMapa(base, l, r), { A: 'nuevo', B: 'firme' });
  });

  test('los dos cambiaron la MISMA clave a valores distintos -- gana remoto (conflicto real)', () => {
    const base = { A: 'nuevo' };
    const l = { A: 'flojo' };
    const r = { A: 'firme' };
    assert.deepEqual(mergearMapa(base, l, r), { A: 'firme' });
  });

  test('los dos cambiaron claves DISTINTAS -- ninguna se pierde', () => {
    const base = { A: 'nuevo', B: 'nuevo' };
    const l = { A: 'flojo', B: 'nuevo' };
    const r = { A: 'nuevo', B: 'firme' };
    assert.deepEqual(mergearMapa(base, l, r), { A: 'flojo', B: 'firme' });
  });

  test('sin base (undefined), se comporta exactamente como el spread viejo -- remoto gana en lo compartido', () => {
    assert.deepEqual(mergearMapa(undefined, { A: 'flojo' }, { A: 'firme' }), { A: 'firme' });
    assert.deepEqual(mergearMapa(undefined, { A: 'flojo' }, {}), { A: 'flojo' }); // clave nueva, solo local la tiene
  });
});

describe('mergearEstados con base -- 3 vías (regresión del bug real)', () => {
  test('dos pestañas marcando temas DISTINTOS del mismo examen -- las dos marcas sobreviven', () => {
    // Reproduce el smoke test manual de Chrome real: pestaña 1 marca "A"
    // flojo, pestaña 2 marca "B" firme, las dos partiendo del mismo
    // estado base con A y B ya en 'nuevo'.
    const base = { examenes: [examenBase({ states: { A: 'nuevo', B: 'nuevo' } })] };
    const local = { examenes: [examenBase({ states: { A: 'flojo', B: 'nuevo' } })] }; // esta pestaña marcó A
    const remoto = { examenes: [examenBase({ states: { A: 'nuevo', B: 'firme' } })] }; // la otra ya guardó B
    const m = mergearEstados(local, remoto, base);
    assert.equal(m.examenes[0].states.A, 'flojo'); // antes se perdía
    assert.equal(m.examenes[0].states.B, 'firme');
  });

  test('sin pasar base, mergearEstados sigue funcionando como antes (compatibilidad hacia atrás)', () => {
    const local = { examenes: [examenBase({ states: { A: 'firme' } })] };
    const remoto = { examenes: [examenBase({ states: { B: 'flojo' } })] };
    const m = mergearEstados(local, remoto); // sin 3er argumento
    assert.equal(m.examenes[0].states.A, 'firme');
    assert.equal(m.examenes[0].states.B, 'flojo');
  });
});
