const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  addDays, duracionDe, diasUtilesEntre, calcularRitmoDe,
  INTERVALOS_REPASO, proximoFechaRepaso,
} = require('../lib/scheduling');

describe('addDays', () => {
  test('suma días', () => {
    assert.equal(addDays(new Date('2026-08-15T00:00:00'), 5).toISOString().slice(0, 10), '2026-08-20');
  });

  test('resta días con n negativo', () => {
    assert.equal(addDays(new Date('2026-08-15T00:00:00'), -5).toISOString().slice(0, 10), '2026-08-10');
  });

  test('cruza de mes/año correctamente', () => {
    assert.equal(addDays(new Date('2026-12-30T00:00:00'), 5).toISOString().slice(0, 10), '2027-01-04');
  });

  test('no muta la fecha original', () => {
    const original = new Date('2026-08-15T00:00:00');
    addDays(original, 10);
    assert.equal(original.toISOString().slice(0, 10), '2026-08-15');
  });
});

describe('duracionDe', () => {
  const duraciones = { 'Tema pesado': 3, 'Tema liviano': 1 };

  test('lee la duración de la tabla pasada como 3er parámetro', () => {
    assert.equal(duracionDe('Tema pesado', null, duraciones), 3);
  });

  test('tema sin dato en la tabla cae al default de 1 día', () => {
    assert.equal(duracionDe('Tema inventado', null, duraciones), 1);
  });

  test('suma los días extra de un check-in adaptativo (e.extraDias)', () => {
    const e = { extraDias: { 'Tema pesado': 2 } };
    assert.equal(duracionDe('Tema pesado', e, duraciones), 5);
  });

  test('sin tabla ni DURACIONES global no explota -- cae a 1 día default', () => {
    assert.equal(duracionDe('cualquier tema'), 1);
  });
});

describe('diasUtilesEntre', () => {
  test('reserva el último día para repaso final', () => {
    // 15/8 a 20/8 = 6 días incluyendo hoy -- 1 se reserva -> 5 útiles
    const hoy = new Date('2026-08-15T00:00:00');
    const examen = new Date('2026-08-20T00:00:00');
    assert.equal(diasUtilesEntre(examen, hoy), 5);
  });

  test('examen hoy mismo da al menos 1 (nunca 0 ni negativo)', () => {
    const hoy = new Date('2026-08-15T00:00:00');
    assert.equal(diasUtilesEntre(hoy, hoy), 1);
  });
});

describe('calcularRitmoDe', () => {
  const duraciones = { t1: 2, t2: 3, t3: 1 };

  test('ritmo mínimo = ceil(duración total / días útiles)', () => {
    const hoy = new Date('2026-08-15T00:00:00');
    const examen = new Date('2026-08-20T00:00:00'); // 5 días útiles
    const r = calcularRitmoDe(['t1', 't2', 't3'], examen, hoy, duraciones); // duración total 6
    assert.equal(r.diasUtiles, 5);
    assert.equal(r.totalDuracion, 6);
    assert.equal(r.minPace, Math.ceil(6 / 5)); // 2
  });

  test('ritmo mínimo nunca baja de 1', () => {
    const hoy = new Date('2026-08-15T00:00:00');
    const examen = new Date('2026-08-16T00:00:00');
    const r = calcularRitmoDe([], examen, hoy, duraciones);
    assert.equal(r.minPace, 1);
  });
});

describe('INTERVALOS_REPASO', () => {
  test('es la escalera 2/5/10/20 días', () => {
    assert.deepEqual(INTERVALOS_REPASO, [2, 5, 10, 20]);
  });
});

describe('proximoFechaRepaso', () => {
  test('sin fecha de examen, usa el intervalo tal cual', () => {
    const desde = new Date('2026-08-15T00:00:00');
    const r = proximoFechaRepaso({ fecha: null }, 0, desde); // idx 0 -> 2 días
    assert.equal(r.toISOString().slice(0, 10), '2026-08-17');
  });

  test('con examen lejano, no clampea (hay margen de sobra)', () => {
    const desde = new Date('2026-08-15T00:00:00');
    const e = { fecha: '2026-12-15' }; // ~120 días -- de sobra para un intervalo de 20
    const r = proximoFechaRepaso(e, 3, desde); // idx 3 -> base 20
    assert.equal(r.toISOString().slice(0, 10), '2026-09-04'); // 15/8 + 20
  });

  test('con examen cercano, clampea a ~1/3 de los días restantes', () => {
    const desde = new Date('2026-08-15T00:00:00');
    const e = { fecha: '2026-09-13' }; // 29 días restantes -> maxPermitido = floor(29/3) = 9
    const r = proximoFechaRepaso(e, 3, desde); // idx 3 -> base 20, pero clampeado a 9
    assert.equal(r.toISOString().slice(0, 10), '2026-08-24'); // 15/8 + 9
  });

  test('el clamp nunca baja de 2 días, ni con el examen prácticamente encima', () => {
    const desde = new Date('2026-08-15T00:00:00');
    const e = { fecha: '2026-08-16' }; // 1 día restante -> floor(1/3) = 0, pero el piso es 2
    const r = proximoFechaRepaso(e, 0, desde); // idx 0 -> base 2, igual al piso
    assert.equal(r.toISOString().slice(0, 10), '2026-08-17');
  });
});
