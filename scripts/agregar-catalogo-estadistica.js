// Agrega la Licenciatura en Estadística (FCEA, UDELAR) como 4ta carrera de
// Facultad de Ciencias Económicas y de Administración -- ya tiene Contador
// Público/Economía/Administración. Reusa el contenido ya cargado de Cálculo
// I, Álgebra Lineal y Cálculo II (mismo código de UC real, MC10/MC20/MC31,
// compartido en la malla oficial) y agrega bibliografía/duración/ícono solo
// para los temas y módulos nuevos y específicos de Estadística.
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-estadistica.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const modIcons = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

function walpole(seccion) { return { libro: 'Walpole, Myers & Myers -- Probabilidad y Estadística para Ingeniería y Ciencias', seccion }; }
function ross(seccion) { return { libro: 'Ross -- A First Course in Probability', seccion }; }
function caselaBerger(seccion) { return { libro: 'Casella & Berger -- Statistical Inference', seccion }; }
function stewart(seccion) { return { libro: 'Stewart -- Cálculo de varias variables', seccion }; }
function cochran(seccion) { return { libro: 'Cochran -- Sampling Techniques', seccion }; }
function montgomery(seccion) { return { libro: 'Montgomery, Peck & Vining -- Introducción al análisis de regresión lineal', seccion }; }
function johnsonWichern(seccion) { return { libro: 'Johnson & Wichern -- Applied Multivariate Statistical Analysis', seccion }; }
function brockwell(seccion) { return { libro: 'Brockwell & Davis -- Introduction to Time Series and Forecasting', seccion }; }
const APUNTES = { libro: 'Apuntes de cátedra', seccion: 'material de curso (sin libro de texto clásico único)' };

// tema -> [entradaTextos, dias, icono de su módulo]
const TEXTOS_NUEVOS = {
  'Tablas de frecuencia y representaciones gráficas de datos': [walpole('cap. de estadística descriptiva'), 1, '📊'],
  'Medidas de tendencia central: media, mediana y moda': [walpole('cap. de estadística descriptiva'), 1, '📊'],
  'Medidas de dispersión: varianza, desvío estándar y coeficiente de variación': [walpole('cap. de estadística descriptiva'), 2, '📊'],
  'Correlación y coeficiente de determinación (enfoque descriptivo)': [walpole('cap. de regresión y correlación'), 2, '📊'],
  'Variables, tipos de datos y estructuras de control': [APUNTES, 1, '💻'],
  'Funciones y estructuras de datos básicas (listas, diccionarios)': [APUNTES, 2, '💻'],
  'Lectura y manipulación de datos con librerías estadísticas': [APUNTES, 2, '💻'],
  'Buenas prácticas de código y control de versiones básico': [APUNTES, 1, '💻'],
  'Espacios de probabilidad, axiomas y probabilidad condicional': [ross('cap. de axiomas de probabilidad'), 2, '🎲'],
  'Independencia de eventos y teorema de Bayes': [ross('cap. de probabilidad condicional'), 2, '🎲'],
  'Variables aleatorias discretas y sus distribuciones (Binomial, Poisson)': [ross('cap. de variables aleatorias discretas'), 2, '🎲'],
  'Variables aleatorias continuas y sus distribuciones (Normal, Exponencial)': [ross('cap. de variables aleatorias continuas'), 2, '🎲'],
  'Campos vectoriales, gradiente, divergencia y rotor': [stewart('cap. de cálculo vectorial'), 2, '➗'],
  'Integrales de línea y de superficie': [stewart('cap. de integrales de línea y superficie'), 2, '➗'],
  'Series numéricas y series de potencias': [stewart('cap. de series'), 2, '➗'],
  'Ecuaciones diferenciales ordinarias de primer orden': [stewart('cap. de ecuaciones diferenciales'), 2, '➗'],
  'Estimadores puntuales: sesgo, varianza y error cuadrático medio': [caselaBerger('cap. de estimación puntual'), 2, '📐'],
  'Métodos de estimación: máxima verosimilitud y momentos': [caselaBerger('cap. de métodos de estimación'), 3, '📐'],
  'Intervalos de confianza para media y proporción': [caselaBerger('cap. de estimación por intervalos'), 2, '📐'],
  'Contraste de hipótesis: errores tipo I y tipo II, valor p': [caselaBerger('cap. de contraste de hipótesis'), 3, '📐'],
  'Muestreo aleatorio simple y estimación de parámetros poblacionales': [cochran('cap. de muestreo aleatorio simple'), 2, '📋'],
  'Muestreo estratificado y por conglomerados': [cochran('cap. de muestreo estratificado y por conglomerados'), 3, '📋'],
  'Diseño de cuestionarios y fuentes de error no muestral': [APUNTES, 1, '📋'],
  'Estimación del tamaño de muestra y cálculo de precisión': [cochran('cap. de tamaño de muestra'), 2, '📋'],
  'Estimación por mínimos cuadrados en regresión múltiple': [montgomery('cap. de regresión lineal múltiple'), 2, '📉'],
  'Diagnóstico del modelo: residuos, multicolinealidad y heterocedasticidad': [montgomery('cap. de diagnóstico del modelo'), 3, '📉'],
  'Análisis de varianza (ANOVA) como caso particular del modelo lineal': [montgomery('cap. de ANOVA y modelo lineal'), 2, '📉'],
  'Selección de modelos y criterios de bondad de ajuste': [montgomery('cap. de selección de modelos'), 2, '📉'],
  'Pruebas de bondad de ajuste (Chi-cuadrado, Kolmogorov-Smirnov)': [caselaBerger('cap. de pruebas de bondad de ajuste'), 2, '🔬'],
  'Pruebas no paramétricas de comparación de grupos': [caselaBerger('cap. de inferencia no paramétrica'), 2, '🔬'],
  'Distribución a priori y a posteriori': [caselaBerger('cap. de inferencia bayesiana'), 2, '🔬'],
  'Estimación bayesiana y su comparación con el enfoque frecuentista': [caselaBerger('cap. de inferencia bayesiana'), 3, '🔬'],
  'Análisis de componentes principales': [johnsonWichern('cap. de componentes principales'), 2, '🧮'],
  'Análisis factorial exploratorio': [johnsonWichern('cap. de análisis factorial'), 3, '🧮'],
  'Análisis de conglomerados (cluster analysis)': [johnsonWichern('cap. de análisis de conglomerados'), 2, '🧮'],
  'Análisis discriminante': [johnsonWichern('cap. de análisis discriminante'), 2, '🧮'],
  'Tendencia, estacionalidad y componente cíclico': [brockwell('cap. de descomposición de series temporales'), 1, '📈'],
  'Suavizamiento exponencial y medias móviles': [brockwell('cap. de suavizamiento y medias móviles'), 2, '📈'],
  'Procesos estacionarios, autocorrelación y autocorrelación parcial': [brockwell('cap. de estacionariedad y autocorrelación'), 2, '📈'],
  'Modelos ARIMA: identificación, estimación y diagnóstico': [brockwell('cap. de modelos ARIMA'), 3, '📈'],
};

const MODULOS_ICONOS = {
  'Organización y resumen de datos': '📊', 'Dispersión y relación entre variables': '📊',
  'Fundamentos de programación imperativa': '💻', 'Programación aplicada a datos': '💻',
  'Fundamentos de probabilidad': '🎲', 'Variables aleatorias': '🎲',
  'Cálculo vectorial': '➗', 'Series y ecuaciones diferenciales': '➗',
  'Estimación puntual': '📐', 'Estimación por intervalos y contraste': '📐',
  'Diseño muestral': '📋', 'Planificación de encuestas': '📋',
  'Regresión lineal múltiple': '📉', 'Modelo lineal general': '📉',
  'Inferencia no paramétrica': '🔬', 'Inferencia bayesiana introductoria': '🔬',
  'Reducción de dimensión': '🧮', 'Clasificación y agrupamiento': '🧮',
  'Componentes de una serie temporal': '📈', 'Modelos ARIMA': '📈',
};

let agregadosTexto = 0, agregadosDuracion = 0, agregadosIcono = 0, colisiones = [];
for (const [tema, [entradaTexto, dias]] of Object.entries(TEXTOS_NUEVOS)) {
  if (textos[tema] !== undefined) { colisiones.push(['textos', tema]); continue; }
  textos[tema] = entradaTexto;
  agregadosTexto++;
  if (duraciones[tema] !== undefined) { colisiones.push(['duraciones', tema]); continue; }
  duraciones[tema] = dias;
  agregadosDuracion++;
}
for (const [modulo, icono] of Object.entries(MODULOS_ICONOS)) {
  if (modIcons[modulo] === undefined) { modIcons[modulo] = icono; agregadosIcono++; }
}

if (colisiones.length) {
  console.error('COLISIONES DETECTADAS (no se sobreescribió nada):', colisiones);
  process.exit(1);
}

fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(modIcons, null, 2) + '\n');

// Integridad del catálogo de Estadística: todo tema tiene bibliografía,
// duración e ícono de módulo; sin duplicados de materia dentro de un semestre;
// las 3 materias reusadas (Cálculo I/II, Álgebra Lineal) coinciden byte a
// byte con lo ya cargado para Contador Público/Economía/Administración.
const otros = {
  contador: JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-contador-publico.json'), 'utf8')),
  economia: JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-economia.json'), 'utf8')),
};
let sinTexto = [], sinDuracion = [], sinIcono = [], duplicados = [], reuseInconsistente = [];
for (const [sem, materias] of Object.entries(catalogo)) {
  const nombres = new Set();
  materias.forEach(m => {
    if (nombres.has(m.nombre)) duplicados.push(`sem ${sem}: ${m.nombre}`);
    nombres.add(m.nombre);
    (m.modulos || []).forEach(mod => {
      if (!modIcons[mod.modulo]) sinIcono.push(mod.modulo);
      mod.temas.forEach(t => {
        if (!textos[t]) sinTexto.push(t);
        if (duraciones[t] === undefined) sinDuracion.push(t);
      });
    });
  });
}
['Cálculo I', 'Álgebra Lineal', 'Cálculo II'].forEach(nombre => {
  const enEstadistica = [].concat(...Object.values(catalogo)).find(m => m.nombre === nombre);
  const enOtro = [].concat(...Object.values(otros.contador), ...Object.values(otros.economia)).find(m => m.nombre === nombre);
  if (enEstadistica && enOtro && JSON.stringify(enEstadistica.modulos) !== JSON.stringify(enOtro.modulos)) {
    reuseInconsistente.push(nombre);
  }
});

console.log(`Textos agregados: ${agregadosTexto}, duraciones agregadas: ${agregadosDuracion}, íconos agregados: ${agregadosIcono}`);
console.log(`Integridad -- sin texto: ${sinTexto.length}, sin duración: ${sinDuracion.length}, sin ícono: ${sinIcono.length}, materias duplicadas: ${duplicados.length}, núcleo reusado inconsistente: ${reuseInconsistente.length}`);
if (sinTexto.length || sinDuracion.length || sinIcono.length || duplicados.length || reuseInconsistente.length) {
  console.error({ sinTexto, sinDuracion, sinIcono, duplicados, reuseInconsistente });
  process.exit(1);
}
console.log('OK -- catálogo de Estadística íntegro y núcleo común consistente con Contador Público/Economía.');
