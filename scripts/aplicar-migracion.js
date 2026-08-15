// Segundo paso de la migración (correr DESPUÉS de scripts/extraer-datos.js y
// de que su verificación haya pasado en limpio): reemplaza en
// mockup-firme.html las 14 constantes de datos por un único "let" vacío (su
// contenido ahora vive en data/*.json, se carga con fetch), y convierte
// FACULTADES -- que no es un dato puro, tiene funciones (cicloLabel) y
// referencias a los catálogos -- en una función que arma el objeto recién
// después de que los catálogos ya se cargaron.
//
// Reusa la misma lógica de conteo de llaves (consciente de strings y
// comentarios) que extraer-datos.js para ubicar el inicio/fin exacto de cada
// bloque, en vez de asumir números de línea fijos.

const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'mockup-firme.html');

function ubicarBloque(html, nombre) {
  const marca = `const ${nombre} = `;
  const inicioConst = html.indexOf(marca);
  if (inicioConst === -1) throw new Error(`No se encontró "const ${nombre} =" -- ¿ya se corrió esta migración antes?`);
  const inicioObjeto = inicioConst + marca.length;
  if (html[inicioObjeto] !== '{') {
    throw new Error(`${nombre} no empieza con "{" justo después del "=".`);
  }
  let profundidad = 0;
  let enString = null;
  let enComentarioLinea = false;
  let enComentarioBloque = false;
  let i = inicioObjeto;
  for (; i < html.length; i++) {
    const c = html[i];
    if (enComentarioLinea) { if (c === '\n') enComentarioLinea = false; continue; }
    if (enComentarioBloque) { if (html[i - 1] === '*' && c === '/') enComentarioBloque = false; continue; }
    if (enString) { if (c === '\\') { i++; continue; } if (c === enString) enString = null; continue; }
    if (c === '/' && html[i + 1] === '/') { enComentarioLinea = true; continue; }
    if (c === '/' && html[i + 1] === '*') { enComentarioBloque = true; continue; }
    if (c === '"' || c === "'" || c === '`') { enString = c; continue; }
    if (c === '{') profundidad++;
    else if (c === '}') { profundidad--; if (profundidad === 0) { i++; break; } }
  }
  if (profundidad !== 0) throw new Error(`No se encontró el cierre de ${nombre}.`);
  let finConSemicolon = i;
  if (html[finConSemicolon] === ';') finConSemicolon++;
  return { inicioConst, inicioObjeto, finObjeto: i, finConSemicolon };
}

const CONST_A_BORRAR = [
  'CATALOGO_POR_ANIO', 'CATALOGO_POR_CICLO_PSICOLOGIA', 'CATALOGO_POR_CICLO_INGENIERIA',
  'CATALOGO_POR_CICLO_INGENIERIA_CIVIL', 'CATALOGO_POR_CICLO_INGENIERIA_ELECTRICA',
  'CATALOGO_POR_CICLO_INGENIERIA_MECANICA', 'CATALOGO_POR_CICLO_INGENIERIA_QUIMICA',
  'CATALOGO_POR_CICLO_INGENIERIA_NAVAL', 'CATALOGO_POR_CICLO_INGENIERIA_ALIMENTOS',
  'CATALOGO_POR_CICLO_INGENIERIA_PRODUCCION', 'CATALOGO_POR_CICLO_AGRIMENSURA',
  'MODULO_ICONS', 'TEXTOS', 'DURACIONES',
];

let html = fs.readFileSync(HTML_PATH, 'utf8');

// Ubicar TODOS los bloques (incluido FACULTADES) contra el HTML original,
// antes de mutar nada -- las operaciones se aplican después de atrás hacia
// adelante para que los índices ya calculados no se invaliden entre sí.
const ubicaciones = {};
for (const nombre of CONST_A_BORRAR) ubicaciones[nombre] = ubicarBloque(html, nombre);
ubicaciones.FACULTADES = ubicarBloque(html, 'FACULTADES');

const declaracionLet =
`let CATALOGO_POR_ANIO, CATALOGO_POR_CICLO_PSICOLOGIA, CATALOGO_POR_CICLO_INGENIERIA,
    CATALOGO_POR_CICLO_INGENIERIA_CIVIL, CATALOGO_POR_CICLO_INGENIERIA_ELECTRICA,
    CATALOGO_POR_CICLO_INGENIERIA_MECANICA, CATALOGO_POR_CICLO_INGENIERIA_QUIMICA,
    CATALOGO_POR_CICLO_INGENIERIA_NAVAL, CATALOGO_POR_CICLO_INGENIERIA_ALIMENTOS,
    CATALOGO_POR_CICLO_INGENIERIA_PRODUCCION, CATALOGO_POR_CICLO_AGRIMENSURA,
    MODULO_ICONS, TEXTOS, DURACIONES, FACULTADES;
// Los catálogos, la bibliografía y las duraciones de arriba viven ahora en
// data/*.json (ver scripts/extraer-datos.js) -- se cargan con fetch en
// cargarDatosEstaticos(), llamada al principio de iniciarApp(), en vez de
// venir hardcodeados en este script. FACULTADES se arma en
// construirFacultades() (más abajo) recién después de que esos catálogos ya
// están cargados, porque depende de ellos (catalogoPorCiclo: CATALOGO_POR_ANIO, etc.).`;

const operaciones = [
  { inicio: ubicaciones.CATALOGO_POR_ANIO.inicioConst, fin: ubicaciones.CATALOGO_POR_ANIO.finConSemicolon, reemplazo: declaracionLet },
  ...CONST_A_BORRAR.slice(1).map(nombre => ({
    inicio: ubicaciones[nombre].inicioConst,
    fin: ubicaciones[nombre].finConSemicolon,
    reemplazo: '',
  })),
];

{
  const u = ubicaciones.FACULTADES;
  const cuerpoObjeto = html.slice(u.inicioObjeto, u.finObjeto); // "{" ... "}" completo, sin tocar su contenido
  const reemplazo = `function construirFacultades() {\n  FACULTADES = ${cuerpoObjeto};\n}`;
  operaciones.push({ inicio: u.inicioConst, fin: u.finConSemicolon, reemplazo });
}

operaciones.sort((a, b) => b.inicio - a.inicio);
for (const op of operaciones) {
  html = html.slice(0, op.inicio) + op.reemplazo + html.slice(op.fin);
}

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('Listo: 14 constantes reemplazadas por "let" vacíos, FACULTADES convertida a construirFacultades().');
