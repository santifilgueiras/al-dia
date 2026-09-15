// Completa las 3 últimas materias de Agronomía que quedaban pendientes
// (Genética I, Estadística II: Diseño y Regresión, Ecología de
// Agroecosistemas -- todas semestre 4) con su temario real, encontradas
// navegando directamente las páginas de los Departamentos de Biología
// Vegetal, Biometría/Estadística/Computación y Sistemas Ambientales en
// portal.fagro.edu.uy. Con esto, las 36 materias del plan de estudios de
// Agronomía (semestres 1 a 8, más Trabajo Final de Grado sin temario)
// quedan con programa oficial real.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// [nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ]
const MATERIAS = [
  ['Genética I (Agronomía)', [
    ['Fundamentos de la variabilidad genética', '🧬', [
      ['Variabilidad, fenotipo, genotipo y ambiente: origen de la variabilidad, ADN, mutaciones, genes y alelos', 'Klug y Cummings - Conceptos de Genética', 'capítulo introductorio de variabilidad genética', 2],
      ['Implicancias genéticas de los sistemas de reproducción: mitosis y meiosis', 'Klug y Cummings - Conceptos de Genética', 'capítulo de división celular y reproducción', 2],
    ]],
    ['Cromosomas y herencia mendeliana', '🔬', [
      ['Cariotipo y variaciones en estructura y número de cromosomas: reestructuras y poliploidía', 'Klug y Cummings - Conceptos de Genética', 'capítulo de citogenética', 2],
      ['El modelo mendeliano: leyes de Mendel, genealogías y herencia ligada al sexo', 'Klug y Cummings - Conceptos de Genética', 'capítulo de herencia mendeliana', 2],
      ['Genes ligados: entrecruzamiento, recombinación y mapas genéticos', 'Klug y Cummings - Conceptos de Genética', 'capítulo de ligamiento génico', 2],
      ['Interacción génica: epistasis y herencia multifactorial', 'Griffiths et al. - Genética', 'capítulo de interacción génica', 1],
    ]],
    ['Genómica y biotecnología', '💻', [
      ['Estructura del gen eucariótico y regulación de la expresión génica', 'Klug y Cummings - Conceptos de Genética', 'capítulo de expresión génica', 2],
      ['Genómica estructural y funcional: organización del genoma eucariótico', 'Pierce - Genetics: A Conceptual Approach', 'capítulo de genómica', 1],
      ['Análisis y manipulación del genoma: ingeniería genética y edición génica', 'Pierce - Genetics: A Conceptual Approach', 'capítulo de ingeniería genética', 2],
    ]],
  ]],
  ['Estadística II: Diseño y Regresión', [
    ['Diseño experimental', '🧪', [
      ['Repaso de conceptos básicos: población, muestra y método científico', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo introductorio de diseño experimental', 1],
      ['El diseño de experimentos: diseños clásicos DCA y DBCA', 'Montgomery - Design and Analysis of Experiments', 'capítulo de diseños experimentales clásicos', 2],
      ['El modelo lineal de clasificación: definiciones y supuestos', 'Montgomery - Design and Analysis of Experiments', 'capítulo del modelo lineal', 1],
      ['La técnica del análisis de la varianza: partición de la variación y prueba de hipótesis', 'Montgomery - Design and Analysis of Experiments', 'capítulo de análisis de varianza', 2],
      ['Pruebas de comparación de medias: DMS y Tukey', 'Steel y Torrie - Bioestadística: Principios y Procedimientos', 'capítulo de comparaciones múltiples', 1],
      ['Arreglo factorial de tratamientos: efectos principales e interacción', 'Montgomery - Design and Analysis of Experiments', 'capítulo de diseños factoriales', 2],
    ]],
    ['Correlación', '📈', [
      ['Asociación y dependencia de variables: correlación de Pearson y Spearman', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de correlación', 2],
    ]],
    ['Análisis de regresión', '📉', [
      ['Regresión lineal: el modelo, notación y estimación de parámetros', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de regresión lineal', 2],
      ['Prueba de hipótesis en regresión: análisis de varianza del modelo', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de inferencia en regresión', 2],
      ['Ajuste del modelo: coeficiente de determinación y análisis de residuales', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de diagnóstico del modelo', 2],
      ['Predicciones: intervalos de confianza para valores puntuales y medias', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de predicción en regresión', 1],
      ['Modelos de regresión múltiple y análisis de residuos parciales', 'Montgomery - Design and Analysis of Experiments', 'capítulo de regresión múltiple', 2],
    ]],
  ]],
  ['Ecología de Agroecosistemas', [
    ['Fundamentos de ecología aplicada', '🌍', [
      ['Ecología y agricultura: los agroecosistemas como objeto de estudio', 'Smith y Smith - Ecología', 'capítulo introductorio de ecología', 1],
      ['Evolución, selección natural y adaptación', 'Smith y Smith - Ecología', 'capítulo de evolución y selección natural', 2],
    ]],
    ['Ecología de poblaciones y comunidades', '👥', [
      ['Ecología de poblaciones: dinámica poblacional y modelos de crecimiento', 'Begon, Harper y Townsend - Ecology', 'capítulo de ecología de poblaciones', 2],
      ['Interacciones entre organismos: competencia, mutualismo y depredación', 'Begon, Harper y Townsend - Ecology', 'capítulo de interacciones bióticas', 2],
      ['Las comunidades bióticas: mecanismos de coexistencia y redes tróficas', 'Smith y Smith - Ecología', 'capítulo de ecología de comunidades', 2],
    ]],
    ['Ecosistemas y su manejo', '🔄', [
      ['Flujo de energía en los ecosistemas: niveles tróficos y eficiencia energética', 'Smith y Smith - Ecología', 'capítulo de flujo de energía', 2],
      ['Ciclos biogeoquímicos: carbono, nitrógeno, agua y fósforo', 'Smith y Smith - Ecología', 'capítulo de ciclos biogeoquímicos', 2],
      ['Sucesión ecológica: integración de niveles población-comunidad-ecosistema', 'Begon, Harper y Townsend - Ecology', 'capítulo de sucesión ecológica', 1],
    ]],
    ['Aplicación a problemas agronómicos', '🌾', [
      ['Aplicación de la teoría ecológica: servicios ecosistémicos y sustentabilidad', 'Smith y Smith - Ecología', 'capítulo de servicios ecosistémicos', 2],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['4'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en semestre 4 de Agronomía`);

  materia.modulos = MODULOS.map(([modulo, , temas]) => ({
    modulo,
    temas: temas.map(([nombre]) => nombre),
  }));

  MODULOS.forEach(([modulo, icono, temas]) => {
    if (!iconos[modulo]) iconos[modulo] = icono;
    temas.forEach(([nombre, libro, seccion, dias]) => {
      textos[nombre] = { libro, seccion };
      duraciones[nombre] = dias;
      totalTemas++;
    });
  });

  totalMateriasActualizadas++;
});

fs.writeFileSync(path.join(DATA, 'catalogo-agronomia.json'), JSON.stringify(catalogo, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');

console.log(`${totalMateriasActualizadas} materias completadas, ${totalTemas} temas en total.`);
