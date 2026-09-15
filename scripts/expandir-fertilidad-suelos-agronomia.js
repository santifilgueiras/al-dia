// Reemplaza el placeholder de "Fertilidad de Suelos y Fertilizantes"
// (Agronomía, semestre 4) por su temario real, sacado del "Formulario de
// Propuesta de Unidades Curriculares" oficial aprobado por el Consejo de la
// Facultad (portal.fagro.edu.uy/wp-content/uploads/..., Plan de Estudios
// 2020). Paráfrasis tipo tabla de contenidos a partir de la sección
// "Unidades Temáticas" del programa, nunca copia textual.
//
// Nota: de las 6 materias del semestre 4, esta es la única con formulario
// oficial detallado localizable públicamente -- Genética I, Estadística II,
// Economía Agraria, Fisiología y Metabolismo Animal y Ecología de
// Agroecosistemas quedaron pendientes (solo se encontraron objetivos
// generales, sin desglose de unidades temáticas ni bibliografía completa).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

const materia = catalogo['4'].find(m => m.nombre === 'Fertilidad de Suelos y Fertilizantes');
if (!materia) throw new Error('No se encontró "Fertilidad de Suelos y Fertilizantes" en semestre 4 de Agronomía');

// [modulo, icono, [ [tema, libro, seccion, dias], ... ] ]
const LIBRO = 'Rabuffetti - La Fertilidad del Suelo y su Manejo';
const MODULOS = [
  ['Fundamentos de la fertilidad y nutrientes minerales', '🌱', [
    ['Fertilidad del suelo: definición y su rol como factor de producción vegetal', LIBRO, 'volumen 1: introducción a la fertilidad del suelo', 1],
    ['Nutrientes minerales: absorción de iones y efectos del suelo sobre la raíz', LIBRO, 'volumen 1: nutrición mineral de las plantas', 2],
  ]],
  ['Cationes, acidez y nitrógeno', '⚗️', [
    ['Potasio, calcio y magnesio: formas en el suelo, disponibilidad y fertilizantes', LIBRO, 'volumen 1: nutrición catiónica', 2],
    ['Acidez y alcalinidad del suelo: efectos en el crecimiento vegetal y encalado', LIBRO, 'volumen 1: acidez y encalado', 2],
    ['Nitrógeno: ciclo, mineralización, fijación simbiótica y fertilizantes nitrogenados', LIBRO, 'volumen 1: nitrógeno', 2],
  ]],
  ['Fósforo, azufre y micronutrientes', '🧪', [
    ['Fósforo: formas en el suelo, dinámica y fertilizantes fosfatados', LIBRO, 'volumen 1: fósforo', 2],
    ['Azufre: reacciones, disponibilidad y fertilizantes azufrados', LIBRO, 'volumen 1: azufre', 1],
    ['Micronutrientes: disponibilidad, deficiencias y toxicidad en Uruguay', LIBRO, 'volumen 1: micronutrientes', 1],
  ]],
  ['Manejo de la fertilidad y muestreo', '📋', [
    ['Enmiendas orgánicas y abonos verdes como fuente de nitrógeno y materia orgánica', LIBRO, 'volumen 2: enmiendas orgánicas', 1],
    ['Muestreo de suelos: criterios, profundidad e instrumentos', LIBRO, 'volumen 2: muestreo de suelos', 1],
    ['Tecnología de fertilizantes: producción y mezclas fertilizantes', LIBRO, 'volumen 2: tecnología de fertilizantes', 1],
  ]],
  ['Diagnóstico y recomendación de fertilización', '📊', [
    ['Respuesta vegetal al suministro de nutrientes: curvas de respuesta y dosis óptima', LIBRO, 'volumen 2: respuesta vegetal a la fertilización', 2],
    ['Análisis de suelo: selección, calibración y metodología de evaluación de la fertilidad', LIBRO, 'volumen 2: análisis de suelo', 2],
    ['Análisis foliar: interpretación, niveles críticos y metodología DRIS', LIBRO, 'volumen 2: análisis foliar', 2],
    ['Aplicación de fertilizantes: momento, forma, fertirrigación y fertilización foliar', LIBRO, 'volumen 2: aplicación de fertilizantes', 1],
    ['Consideraciones ambientales de la fertilización nitrogenada y fosfatada', LIBRO, 'volumen 2: fertilización y ambiente', 1],
    ['Recomendación de dosis de fertilización y manejo de nutrientes por agricultura de precisión', LIBRO, 'volumen 2: recomendación de dosis y agricultura de precisión', 2],
  ]],
];

materia.modulos = MODULOS.map(([modulo, , temas]) => ({
  modulo,
  temas: temas.map(([nombre]) => nombre),
}));

let totalTemas = 0;
MODULOS.forEach(([modulo, icono, temas]) => {
  if (!iconos[modulo]) iconos[modulo] = icono;
  temas.forEach(([nombre, libro, seccion, dias]) => {
    textos[nombre] = { libro, seccion };
    duraciones[nombre] = dias;
    totalTemas++;
  });
});

fs.writeFileSync(path.join(DATA, 'catalogo-agronomia.json'), JSON.stringify(catalogo, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');

console.log(`"Fertilidad de Suelos y Fertilizantes" ahora tiene ${materia.modulos.length} módulos / ${totalTemas} temas.`);
