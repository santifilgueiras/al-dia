const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Reemplaza el script manual de duplicados que se corría a mano antes de
// cada ronda de catálogo (ver rondas de Medicina/Ingeniería en el historial)
// -- si un nombre de tema queda ambiguo entre dos facultades DE DOMINIOS
// DISTINTOS, esto falla el build en vez de pisarse en silencio en
// producción (TEXTOS/DURACIONES/MODULO_ICONS son diccionarios globales por
// nombre, ver claveTema/buscarEnTabla en mockup-firme.html).
//
// Ojo: Ingeniería reusa a propósito el núcleo común (Cálculo, GAL, Física,
// Probabilidad y Estadística...) entre sus 9 carreras -- eso da ~180
// nombres "ambiguos" que son intencionales, no bugs (comparten
// bibliografía real a propósito). El riesgo real que este test cubre es
// un cruce entre DOMINIOS que no tienen nada en común (ej. un tema de
// Medicina con el mismo nombre que uno de Ingeniería) -- eso sí sería
// casi seguro una coincidencia accidental, no una reutilización a propósito.
const FAMILIAS = {
  salud: ['medicina', 'psicologia'],
  tecnica: [
    'ingenieria', 'ingenieria-civil', 'ingenieria-electrica', 'ingenieria-mecanica',
    'ingenieria-quimica', 'ingenieria-naval', 'ingenieria-alimentos',
    'ingenieria-produccion', 'agrimensura',
  ],
};
function familiaDe(facultad) {
  return Object.keys(FAMILIAS).find(fam => FAMILIAS[fam].includes(facultad)) || facultad;
}

// Lista plana de nombres de tema de un catálogo -- misma forma que usan los
// datos reales: { [anio_o_semestre]: [{ nombre, modulos: [{ modulo, temas: [...] }] }] }.
function recolectarTemas(cat) {
  const temas = [];
  Object.values(cat).forEach(materias => {
    (materias || []).forEach(materia => {
      (materia.modulos || []).forEach(mod => {
        (mod.temas || []).forEach(t => temas.push(t));
      });
    });
  });
  return temas;
}

test('ningún nombre de tema queda ambiguo entre dominios distintos (salud vs. técnica)', () => {
  const dataDir = path.join(__dirname, '..', 'data');
  const archivos = fs.readdirSync(dataDir).filter(f => f.startsWith('catalogo-'));
  assert.ok(archivos.length > 0, 'no se encontró ningún data/catalogo-*.json');

  const duenos = new Map(); // tema -> Set(facultad)
  for (const f of archivos) {
    const cat = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    const facultad = f.replace('catalogo-', '').replace('.json', '');
    recolectarTemas(cat).forEach(t => {
      if (!duenos.has(t)) duenos.set(t, new Set());
      duenos.get(t).add(facultad);
    });
  }

  const ambiguosEntreDominios = [...duenos].filter(([, facultades]) => {
    const familias = new Set([...facultades].map(familiaDe));
    return familias.size > 1;
  }).map(([t]) => t);

  assert.deepEqual(
    ambiguosEntreDominios, [],
    `Temas con el mismo nombre en dominios sin relación (revisar si es una coincidencia real o hay que renombrar uno): ${ambiguosEntreDominios.slice(0, 10).join(', ')}`,
  );
});
