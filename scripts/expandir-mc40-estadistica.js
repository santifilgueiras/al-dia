// Reemplaza el contenido placeholder (2 módulos, 4 temas) de "Introducción a la
// Estadística" (MC40, 3er semestre, FCEA) por el temario oficial completo, sacado
// de la Ficha de Unidad Curricular real (fcea.udelar.edu.uy, marzo 2026, ficha
// MC40_2026_01). Pedido explícito de Santiago tras pasar el link de la
// Tecnicatura en Administración y pedir "todas bien las materias de estadistica
// ... con todos pero todos los temas".
//
// MC40 es compartida por Contador Público, Licenciado en Administración y
// Técnico en Administración -- aparece igual en catalogo-administracion.json Y
// catalogo-contador-publico.json, así que se actualiza en los dos para no dejarlos
// desincronizados.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const ARCHIVOS = ['catalogo-administracion.json', 'catalogo-contador-publico.json'];

const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

const LIBRO = 'Hildebrand y Ott - Estadística Aplicada a la Administración y la Economía';

// [modulo, icono, [ [tema, seccion, dias], ... ] ]
const MODULOS_NUEVOS = [
  ['Estadística descriptiva', '📊', [
    ['Naturaleza de la estadística: estadística descriptiva e inferencial', 'capítulo introductorio: qué es la estadística descriptiva y la inferencial', 1],
    ['Clasificación de variables y distribución de frecuencias', 'capítulo de organización de datos: tipos de variables y tablas de frecuencia', 1],
    ['Medidas de resumen: posición y dispersión', 'capítulo de medidas de tendencia central, posición y dispersión', 1],
    ['Representación gráfica de un conjunto de datos', 'capítulo de representación gráfica de datos', 1],
    ['Tabulación cruzada, asociación, correlación y recta de regresión', 'capítulo de tabulación cruzada, correlación y regresión lineal simple', 2],
  ]],
  ['Probabilidad', '🎲', [
    ['Experimento aleatorio, espacio muestral y sucesos', 'capítulo de probabilidad: experimentos aleatorios y espacio muestral', 1],
    ['Concepto de probabilidad: axiomas y propiedades', 'capítulo de probabilidad: axiomas y propiedades básicas', 1],
    ['Probabilidad condicionada e independencia de eventos', 'capítulo de probabilidad condicional e independencia de sucesos', 1],
  ]],
  ['Variable aleatoria', '🔢', [
    ['Tipos de variables aleatorias y su distribución', 'capítulo de variables aleatorias discretas y continuas', 1],
    ['Momentos de una variable aleatoria', 'capítulo de esperanza, varianza y momentos de una variable aleatoria', 1],
    ['Modelo Binomial e Hipergeométrico', 'capítulo de distribuciones discretas: Binomial e Hipergeométrica', 2],
    ['Modelo Normal', 'capítulo de la distribución Normal', 2],
  ]],
  ['Muestreo', '🧮', [
    ['Población, parámetro y muestra aleatoria', 'capítulo de muestreo: población, parámetro y muestra aleatoria', 1],
    ['Estimador y sus propiedades', 'capítulo de propiedades de los estimadores', 1],
    ['Distribución de la media muestral y teorema central del límite', 'capítulo de distribuciones muestrales y teorema central del límite', 2],
  ]],
  ['Estimación', '🎯', [
    ['Estimación puntual y por intervalos', 'capítulo de estimación puntual y por intervalos de confianza', 2],
    ['Aplicación a la estimación de medias y proporciones', 'capítulo de intervalos de confianza para medias y proporciones', 1],
  ]],
  ['Contraste de hipótesis', '⚖️', [
    ['Aplicación del contraste de hipótesis a medias y proporciones', 'capítulo de contrastes de hipótesis para medias y proporciones', 2],
  ]],
];

const TEMAS_VIEJOS = [
  'Organización y descripción de datos: medidas de tendencia central y dispersión',
  'Representación gráfica de datos',
  'Probabilidad básica y variables aleatorias',
  'Distribuciones de probabilidad discretas y continuas más usadas',
];

let totalTemas = 0;

for (const archivo of ARCHIVOS) {
  const p = path.join(DATA, archivo);
  const catalogo = JSON.parse(fs.readFileSync(p, 'utf8'));
  let materia = null;
  for (const key of Object.keys(catalogo)) {
    const m = catalogo[key].find(x => x.nombre === 'Introducción a la Estadística');
    if (m) { materia = m; break; }
  }
  if (!materia) throw new Error(`No se encontró "Introducción a la Estadística" en ${archivo}`);

  materia.modulos = MODULOS_NUEVOS.map(([modulo, , temas]) => ({
    modulo,
    temas: temas.map(([nombre]) => nombre),
  }));

  fs.writeFileSync(p, JSON.stringify(catalogo, null, 2) + '\n');
  totalTemas = materia.modulos.reduce((s, m) => s + m.temas.length, 0);
  console.log(`${archivo}: Introducción a la Estadística ahora tiene ${materia.modulos.length} módulos / ${totalTemas} temas`);
}

// Limpiar los 4 temas viejos de TEXTOS/DURACIONES (confirmado que no los usa
// ningún otro catálogo) y cargar los nuevos.
TEMAS_VIEJOS.forEach(t => { delete textos[t]; delete duraciones[t]; });

MODULOS_NUEVOS.forEach(([, , temas]) => {
  temas.forEach(([nombre, seccion, dias]) => {
    textos[nombre] = { libro: LIBRO, seccion };
    duraciones[nombre] = dias;
  });
});

MODULOS_NUEVOS.forEach(([modulo, icono]) => {
  if (!iconos[modulo]) iconos[modulo] = icono;
});

fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');

console.log('Listo.');
