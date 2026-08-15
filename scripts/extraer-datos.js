// Script de migración -- se corre UNA vez a mano (node scripts/extraer-datos.js
// desde la raíz del proyecto), no queda en el deploy. Saca las 14 constantes
// de datos puros (catálogos, bibliografía, duraciones) del <script> inline de
// mockup-firme.html a archivos JSON estáticos en data/, y verifica que la
// extracción sea perfecta (byte a byte) antes de imprimir el resultado.
//
// Ver al-dia-datos-estaticos-para-code.md para el porqué: el <script> pesa
// 858 KB (85% del archivo entero), y de eso ~669 KB son estos 14 bloques de
// datos sin lógica -- separarlos deja que el service worker los cachee aparte
// (stale-while-revalidate) en vez de re-bajarlos enteros en cada carga.

const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'mockup-firme.html');
const DATA_DIR = path.join(__dirname, '..', 'data');

// [nombre de la constante en el JS, nombre del archivo JSON de salida]
const CONSTANTES = [
  ['CATALOGO_POR_ANIO', 'catalogo-medicina'],
  ['CATALOGO_POR_CICLO_PSICOLOGIA', 'catalogo-psicologia'],
  ['CATALOGO_POR_CICLO_INGENIERIA', 'catalogo-ingenieria'],
  ['CATALOGO_POR_CICLO_INGENIERIA_CIVIL', 'catalogo-ingenieria-civil'],
  ['CATALOGO_POR_CICLO_INGENIERIA_ELECTRICA', 'catalogo-ingenieria-electrica'],
  ['CATALOGO_POR_CICLO_INGENIERIA_MECANICA', 'catalogo-ingenieria-mecanica'],
  ['CATALOGO_POR_CICLO_INGENIERIA_QUIMICA', 'catalogo-ingenieria-quimica'],
  ['CATALOGO_POR_CICLO_INGENIERIA_NAVAL', 'catalogo-ingenieria-naval'],
  ['CATALOGO_POR_CICLO_INGENIERIA_ALIMENTOS', 'catalogo-ingenieria-alimentos'],
  ['CATALOGO_POR_CICLO_INGENIERIA_PRODUCCION', 'catalogo-ingenieria-produccion'],
  ['CATALOGO_POR_CICLO_AGRIMENSURA', 'catalogo-agrimensura'],
  ['MODULO_ICONS', 'modulo-icons'],
  ['TEXTOS', 'textos'],
  ['DURACIONES', 'duraciones'],
];

// Ubica "const NOMBRE = {" y devuelve el texto del objeto completo (desde la
// "{" de apertura hasta su "}" de cierre real), contando llaves a mano en vez
// de asumir un rango de líneas fijo -- consciente de strings ('/"/`) y
// comentarios (// y /* */) para no confundir una "{" o "}" que esté DENTRO de
// un string o un comentario con la estructura real del objeto.
function extraerBloque(html, nombre) {
  const marca = `const ${nombre} = `;
  const inicioMarca = html.indexOf(marca);
  if (inicioMarca === -1) throw new Error(`No se encontró "const ${nombre} =" en el HTML.`);
  const inicioObjeto = inicioMarca + marca.length;
  if (html[inicioObjeto] !== '{') {
    throw new Error(`${nombre} no empieza con "{" justo después del "=" -- revisar a mano, el script asume un objeto literal.`);
  }
  let profundidad = 0;
  let enString = null; // '"' | "'" | '`' | null
  let enComentarioLinea = false;
  let enComentarioBloque = false;
  let i = inicioObjeto;
  for (; i < html.length; i++) {
    const c = html[i];
    if (enComentarioLinea) {
      if (c === '\n') enComentarioLinea = false;
      continue;
    }
    if (enComentarioBloque) {
      if (html[i - 1] === '*' && c === '/') enComentarioBloque = false;
      continue;
    }
    if (enString) {
      if (c === '\\') { i++; continue; } // salta el próximo caracter (escape)
      if (c === enString) enString = null;
      continue;
    }
    if (c === '/' && html[i + 1] === '/') { enComentarioLinea = true; continue; }
    if (c === '/' && html[i + 1] === '*') { enComentarioBloque = true; continue; }
    if (c === '"' || c === "'" || c === '`') { enString = c; continue; }
    if (c === '{') profundidad++;
    else if (c === '}') {
      profundidad--;
      if (profundidad === 0) { i++; break; }
    }
  }
  if (profundidad !== 0) throw new Error(`No se encontró el cierre de ${nombre} -- llaves desbalanceadas.`);
  return html.slice(inicioObjeto, i);
}

// Código propio y confiable (no input de usuario) -- Function tolera la
// sintaxis JS real (claves sin comillas, comentarios) que JSON.parse
// rechazaría.
function evaluarBloque(texto, nombre) {
  return new Function(`return (${texto});`)();
}

// Antes de escribir el JSON: verifica recursivamente que no haya ninguna
// función en el valor. Si la encuentra, aborta con un error explícito en vez
// de escribir un JSON con datos faltantes en silencio (JSON.stringify
// simplemente omite las funciones, sin avisar).
function verificarSinFunciones(valor, nombre, ruta) {
  if (typeof valor === 'function') {
    throw new Error(`${nombre}: se encontró una función en ${ruta} -- no se puede convertir a JSON tal cual. Revisar a mano.`);
  }
  if (Array.isArray(valor)) {
    valor.forEach((v, idx) => verificarSinFunciones(v, nombre, `${ruta}[${idx}]`));
  } else if (valor && typeof valor === 'object') {
    Object.entries(valor).forEach(([k, v]) => verificarSinFunciones(v, nombre, `${ruta}.${k}`));
  }
}

fs.mkdirSync(DATA_DIR, { recursive: true });
const html = fs.readFileSync(HTML_PATH, 'utf8');

console.log('--- Paso 1: extraer y escribir los JSON ---\n');

const filas = [];
for (const [nombre, archivo] of CONSTANTES) {
  const texto = extraerBloque(html, nombre);
  const valor = evaluarBloque(texto, nombre);
  verificarSinFunciones(valor, nombre, nombre);

  const json = JSON.stringify(valor, null, 2);
  const destino = path.join(DATA_DIR, `${archivo}.json`);
  fs.writeFileSync(destino, json, 'utf8');

  const claves = Array.isArray(valor) ? valor.length : Object.keys(valor).length;
  filas.push({ archivo: `${archivo}.json`, bytes: Buffer.byteLength(json, 'utf8'), claves });
}

filas.forEach(f => console.log(`  ${f.archivo.padEnd(38)} ${String(f.bytes).padStart(8)} bytes   ${f.claves} claves/entradas`));
const totalBytes = filas.reduce((s, f) => s + f.bytes, 0);
console.log(`\n  Total: ${totalBytes} bytes (~${(totalBytes / 1024).toFixed(1)} KB) en ${filas.length} archivos.\n`);

console.log('--- Paso 2: verificación byte a byte contra el HTML original ---\n');

let huboError = false;
for (const [nombre, archivo] of CONSTANTES) {
  const texto = extraerBloque(html, nombre); // vuelve a extraer del HTML original, independiente del paso 1
  const valorOriginal = evaluarBloque(texto, nombre);
  const jsonOriginal = JSON.stringify(valorOriginal, null, 2);
  const jsonEscrito = fs.readFileSync(path.join(DATA_DIR, `${archivo}.json`), 'utf8');
  if (jsonOriginal !== jsonEscrito) {
    huboError = true;
    console.error(`  ✗ ${nombre}: el JSON escrito NO coincide carácter por carácter con lo extraído del HTML.`);
  } else {
    console.log(`  ✓ ${nombre} -> ${archivo}.json coincide exacto.`);
  }
}

if (huboError) {
  console.error('\nHubo diferencias -- NO seguir con el resto de la migración hasta investigar por qué.');
  process.exit(1);
}
console.log('\nLas 14 constantes coinciden exacto entre el HTML y los JSON generados.');
