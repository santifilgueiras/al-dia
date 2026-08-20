const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { mergearEstados } = require('../lib/estado');

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
