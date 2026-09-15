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
  // Facultad de Ciencias Económicas y de Administración (FCEA): las 5
  // carreras comparten un núcleo común real (mismo código de UC -- ver
  // scripts/agregar-catalogo-fcea.js, agregar-catalogo-estadistica.js y
  // crear-catalogo-tecnico-administracion.js) más varias UC adicionales que
  // también comparten código entre pares de carreras -- esa reutilización es
  // intencional, no una colisión a resolver. "tecnico-administracion" es la
  // Tecnicatura corta (5 semestres); reusa UC de "administracion" (la
  // Licenciatura larga) y "contador-publico" a propósito.
  economia: ['contador-publico', 'economia', 'administracion', 'estadistica', 'tecnico-administracion'],
  // Facultad de Información y Comunicación (FIC): las 3 carreras cargadas
  // (Comunicación, Archivología, Bibliotecología) comparten un núcleo real
  // de hasta 14 UC (Curso Introductorio, Introducción a la Epistemología,
  // Historia de las Ideas, Metodología de la Investigación en Información y
  // Comunicación, Fundamentos de Inteligencia Artificial, Diseño Asistido de
  // Software, Diseño y Análisis, Estadística Básica, Administración en
  // Unidades de Información I/II, Documentación Audiovisual, Introducción a
  // la Preservación Digital, Redes y Sistemas, Bases de Datos -- ver
  // scripts/agregar-catalogo-fic.js) -- esa reutilización es intencional,
  // no una colisión a resolver.
  fic: ['comunicacion', 'archivologia', 'bibliotecologia'],
};
function familiaDe(facultad) {
  return Object.keys(FAMILIAS).find(fam => FAMILIAS[fam].includes(facultad)) || facultad;
}

// Excepción puntual (no una familia entera): "Programación Imperativa" de la
// Licenciatura en Estadística (FCEA, familia "economia") es LITERALMENTE la
// misma UC que "Programación 1"/"Programación Imperativa" de varias
// ingenierías (familia "tecnica") -- la dicta el Instituto de Computación de
// FING para las dos facultades, confirmado contra la ficha oficial real
// (fcea.udelar.edu.uy, agosto 2026). No amerita fusionar las familias
// "economia" y "tecnica" enteras (el resto de sus materias no se relaciona),
// así que se permite esta coincidencia puntual en vez de la familia completa.
const TEMAS_COMPARTIDOS_CONOCIDOS = new Set([
  'Búsqueda lineal y búsqueda binaria',
  'Algoritmos de ordenación',
]);

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

  const ambiguosEntreDominios = [...duenos].filter(([t, facultades]) => {
    if (TEMAS_COMPARTIDOS_CONOCIDOS.has(t)) return false;
    const familias = new Set([...facultades].map(familiaDe));
    return familias.size > 1;
  }).map(([t]) => t);

  assert.deepEqual(
    ambiguosEntreDominios, [],
    `Temas con el mismo nombre en dominios sin relación (revisar si es una coincidencia real o hay que renombrar uno): ${ambiguosEntreDominios.slice(0, 10).join(', ')}`,
  );
});
