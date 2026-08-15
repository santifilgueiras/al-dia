const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  extraerJSON, extraerJSONObjeto, mezclarOpcionesMultiple,
  fechaHoyMontevideo, horaAhoraMontevideo, bucket15, pendingCountFromEstado,
} = require('../lib/server-utils');

describe('extraerJSON (respuestas de la IA con array)', () => {
  test('JSON limpio, sin nada alrededor', () => {
    assert.deepEqual(extraerJSON('[{"a":1}]'), [{ a: 1 }]);
  });

  test('con preámbulo de texto antes del array', () => {
    const texto = 'Acá tenés las fichas:\n[{"pregunta":"q","respuesta":"r"}]';
    assert.deepEqual(extraerJSON(texto), [{ pregunta: 'q', respuesta: 'r' }]);
  });

  test('con texto después del array', () => {
    const texto = '[{"pregunta":"q","respuesta":"r"}]\nEspero que te sirva.';
    assert.deepEqual(extraerJSON(texto), [{ pregunta: 'q', respuesta: 'r' }]);
  });

  test('JSON anidado (array de objetos con arrays adentro) se extrae completo', () => {
    const texto = '[{"pregunta":"q","opciones":["a","b"],"correcta":0}]';
    assert.deepEqual(extraerJSON(texto), [{ pregunta: 'q', opciones: ['a', 'b'], correcta: 0 }]);
  });

  test('sin ningún array en el texto devuelve null', () => {
    assert.equal(extraerJSON('no hay json acá'), null);
  });

  test('array con sintaxis inválida devuelve null en vez de tirar', () => {
    assert.equal(extraerJSON('[{"a":1,}]'), null);
  });

  // Caso de borde documentado en el código: el regex es goloso (primer "["
  // hasta el ÚLTIMO "]" del texto entero) -- si el texto trae un segundo
  // bloque de corchetes después del real, los mezcla en un solo intento de
  // parseo. Este test no es "el comportamiento ideal", es una foto de honesta
  // del riesgo real que señaló la revisión de testing-strategy: no arma un
  // JSON con contenido mezclado silenciosamente, directamente falla a null
  // porque ese texto combinado no es JSON válido.
  test('con dos bloques de corchetes en el texto, no arma un JSON mezclado silencioso', () => {
    const texto = '[{"a":1}] y notación de conjuntos tipo [2,3]';
    assert.equal(extraerJSON(texto), null);
  });
});

describe('extraerJSONObjeto (respuestas de la IA con objeto suelto)', () => {
  test('objeto limpio', () => {
    assert.deepEqual(extraerJSONObjeto('{"estado":"correcto"}'), { estado: 'correcto' });
  });

  test('con texto alrededor', () => {
    const texto = 'Acá tenés la evaluación: {"estado":"incorrecto","explicacion":"..."}';
    assert.deepEqual(extraerJSONObjeto(texto).estado, 'incorrecto');
  });

  test('sin objeto devuelve null', () => {
    assert.equal(extraerJSONObjeto('nada de json'), null);
  });

  test('objeto inválido devuelve null en vez de tirar', () => {
    assert.equal(extraerJSONObjeto('{estado: sin comillas}'), null);
  });
});

describe('mezclarOpcionesMultiple', () => {
  test('el valor de la opción correcta sigue siendo el mismo después de mezclar', () => {
    const fichas = [{ pregunta: 'q', opciones: ['A', 'B', 'C', 'D'], correcta: 0 }];
    for (let i = 0; i < 50; i++) {
      const [mezclada] = mezclarOpcionesMultiple(fichas);
      assert.equal(mezclada.opciones[mezclada.correcta], 'A');
      assert.equal(mezclada.opciones.length, 4);
      assert.deepEqual([...mezclada.opciones].sort(), ['A', 'B', 'C', 'D']);
    }
  });

  test('"correcta" como string (bug real ya visto con la IA) también se resuelve bien', () => {
    const fichas = [{ pregunta: 'q', opciones: ['A', 'B', 'C', 'D'], correcta: '2' }];
    const [mezclada] = mezclarOpcionesMultiple(fichas);
    assert.equal(mezclada.opciones[mezclada.correcta], 'C');
  });

  test('la posición de la correcta no queda siempre en el mismo lugar (no es un no-op)', () => {
    const fichas = [{ pregunta: 'q', opciones: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], correcta: 0 }];
    const posiciones = new Set();
    for (let i = 0; i < 100; i++) {
      const [mezclada] = mezclarOpcionesMultiple(fichas);
      posiciones.add(mezclada.correcta);
    }
    assert.ok(posiciones.size > 1, 'la correcta debería caer en más de una posición distinta en 100 corridas');
  });

  test('fichas sin "opciones" (formato pregunta/respuesta normal) quedan intactas', () => {
    const fichas = [{ pregunta: 'q', respuesta: 'r' }];
    assert.deepEqual(mezclarOpcionesMultiple(fichas), fichas);
  });

  test('mezcla independiente por cada ficha de la lista', () => {
    const fichas = [
      { pregunta: 'q1', opciones: ['A', 'B'], correcta: 0 },
      { pregunta: 'q2', opciones: ['X', 'Y'], correcta: 1 },
    ];
    const resultado = mezclarOpcionesMultiple(fichas);
    assert.equal(resultado[0].opciones[resultado[0].correcta], 'A');
    assert.equal(resultado[1].opciones[resultado[1].correcta], 'Y');
  });
});

describe('fechaHoyMontevideo / horaAhoraMontevideo', () => {
  test('fecha en formato YYYY-MM-DD', () => {
    assert.match(fechaHoyMontevideo(), /^\d{4}-\d{2}-\d{2}$/);
  });

  test('hora en formato HH:MM', () => {
    assert.match(horaAhoraMontevideo(), /^\d{2}:\d{2}$/);
  });
});

describe('bucket15', () => {
  test('redondea hacia abajo al escalón de 15 más cercano', () => {
    assert.equal(bucket15('08:07'), '08:00');
    assert.equal(bucket15('08:14'), '08:00');
    assert.equal(bucket15('08:16'), '08:15');
    assert.equal(bucket15('08:29'), '08:15');
  });

  test('ya está en un escalón exacto -- se queda igual', () => {
    assert.equal(bucket15('08:00'), '08:00');
    assert.equal(bucket15('08:15'), '08:15');
    assert.equal(bucket15('08:30'), '08:30');
    assert.equal(bucket15('08:45'), '08:45');
  });

  test('borde de la hora (los minutos 45-59 redondean a :45, nunca cruzan de hora)', () => {
    assert.equal(bucket15('23:59'), '23:45');
  });

  test('sin valor (undefined/vacío) cae al default 00:00', () => {
    assert.equal(bucket15(undefined), '00:00');
    assert.equal(bucket15(''), '00:00');
  });

  test('rellena con ceros a la izquierda', () => {
    assert.equal(bucket15('5:07'), '05:00');
  });
});

describe('pendingCountFromEstado', () => {
  const base = { selected: ['t1', 't2', 't3'], selectedPace: 5 };

  test('cuenta los temas que no están firme', () => {
    const estado = { examenes: [{ ...base, states: { t1: 'firme', t2: 'flojo', t3: 'nuevo' } }] };
    assert.equal(pendingCountFromEstado(estado), 2);
  });

  test('ignora exámenes ya rendidos (rendidaManual)', () => {
    const estado = { examenes: [{ ...base, rendidaManual: true, states: {} }] };
    assert.equal(pendingCountFromEstado(estado), 0);
  });

  test('ignora exámenes ejemplo/cosméticos', () => {
    const estado = { examenes: [{ ...base, ejemplo: true, states: {} }] };
    assert.equal(pendingCountFromEstado(estado), 0);
  });

  test('ignora exámenes cuya fecha ya pasó', () => {
    const estado = { examenes: [{ ...base, fecha: '2000-01-01', states: {} }] };
    assert.equal(pendingCountFromEstado(estado), 0);
  });

  test('ignora exámenes sin calendario armado (sin selectedPace)', () => {
    const estado = { examenes: [{ selected: ['t1'], selectedPace: null, states: {} }] };
    assert.equal(pendingCountFromEstado(estado), 0);
  });

  test('suma entre varios exámenes en curso', () => {
    const estado = {
      examenes: [
        { ...base, states: { t1: 'firme', t2: 'nuevo', t3: 'nuevo' } }, // 2 pendientes
        { ...base, states: { t1: 'nuevo', t2: 'nuevo', t3: 'nuevo' } }, // 3 pendientes
      ],
    };
    assert.equal(pendingCountFromEstado(estado), 5);
  });

  test('sin examenes / estado vacío da 0, no explota', () => {
    assert.equal(pendingCountFromEstado({}), 0);
    assert.equal(pendingCountFromEstado({ examenes: [] }), 0);
  });
});
