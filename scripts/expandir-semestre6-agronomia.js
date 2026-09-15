// Reemplaza los placeholders de 3 materias del semestre 6 de Agronomía
// (Fitotecnia, Entomología, Fitopatología) por su temario real, sacado de
// los "Formularios de Propuesta de Unidades Curriculares" oficiales
// aprobados por el Consejo de la Facultad
// (portal.fagro.edu.uy/wp-content/uploads/..., Plan de Estudios 2020).
// Paráfrasis tipo tabla de contenidos a partir de la sección "Unidades
// Temáticas" de cada programa, nunca copia textual.
//
// No toca "Procesos Sociales y Herramientas de Intervención en el
// Territorio" (la 4ta materia del semestre 6) -- esa ya tiene 5 de 13 temas
// reales de una ronda anterior, sin cambios acá.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// [nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ]
const MATERIAS = [
  ['Fitotecnia', [
    ['Introducción al mejoramiento genético', '🌱', [
      ['Introducción al mejoramiento genético vegetal', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo introductorio', 1],
      ['Multiplicación y calidad de semillas: sistemas de semillas y normativas', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de producción de semillas', 2],
    ]],
    ['Interacción genotipo-ambiente y recursos genéticos', '🌍', [
      ['Interacción genotipo-ambiente: estabilidad de cultivares y evaluación', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de interacción genotipo-ambiente', 2],
      ['Diversidad y estructura genética de poblaciones vegetales', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de diversidad genética', 2],
      ['Recursos fitogenéticos: conservación, legislación y acervo genético', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de recursos fitogenéticos', 2],
    ]],
    ['Creación de variabilidad y métodos de mejoramiento', '🧬', [
      ['Creación de variabilidad y selección de progenitores', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de creación de variabilidad', 2],
      ['Mejoramiento de especies autógamas', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de mejoramiento en autógamas', 2],
      ['Mejoramiento de especies alógamas', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de mejoramiento en alógamas', 2],
      ['Mejoramiento de especies clonales', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de mejoramiento en especies clonales', 1],
      ['Poliploidía y utilización del acervo genético secundario de los cultivos', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de poliploidía', 2],
    ]],
    ['Herramientas biotecnológicas', '🔬', [
      ['Herramientas biotecnológicas: marcadores moleculares y edición genómica', 'Poehlman y Sleper - Mejoramiento Genético de las Cosechas', 'capítulo de biotecnología aplicada al mejoramiento', 2],
    ]],
  ]],
  ['Entomología', [
    ['Anatomía y biología de los insectos', '🦗', [
      ['Introducción y anatomía general de los insectos', 'Bentancourt - Manual de Entomología', 'capítulo de anatomía de insectos', 1],
      ['Tegumento, sistemas internos y biología del desarrollo de los insectos', 'Bentancourt - Manual de Entomología', 'capítulo de biología del desarrollo', 2],
    ]],
    ['Ecología y manejo de plagas', '🐛', [
      ['Ecología de poblaciones de insectos y manejo integrado de plagas', 'Metcalf y Luckmann - Introducción al Manejo de Plagas de Insectos', 'capítulo de ecología de poblaciones y manejo de plagas', 2],
      ['Control biológico: parasitoides, depredadores y microorganismos entomopatógenos', 'Basso - Control Biológico de Insectos', 'capítulo de control biológico', 2],
      ['Control etológico y cultural: feromonas y técnica del insecto estéril', 'Bentancourt - Manual de Entomología', 'capítulo de control etológico y cultural', 1],
      ['Variedades resistentes a insectos', 'Bentancourt - Manual de Entomología', 'capítulo de resistencia varietal', 1],
    ]],
    ['Control químico y ecotoxicología', '🧪', [
      ['Control químico: clasificación de insecticidas, modo de acción y resistencia', 'Bentancourt - Manual de Entomología', 'capítulo de control químico', 2],
      ['Ecotoxicología: impacto ambiental de los insecticidas', 'Bentancourt - Manual de Entomología', 'capítulo de ecotoxicología', 1],
    ]],
  ]],
  ['Fitopatología', [
    ['Introducción y sintomatología', '🔎', [
      ['Introducción a la fitopatología: concepto de enfermedad y patogénesis', 'Agrios - Fitopatología', 'capítulo introductorio', 1],
      ['Sintomatología: síntomas, signos y agentes patogénicos bióticos y abióticos', 'Agrios - Fitopatología', 'capítulo de sintomatología', 1],
    ]],
    ['Agentes causales de enfermedades', '🦠', [
      ['Hongos y cromistas fitopatógenos: Ascomycota, Zigomycota, Basidiomycota y Oomycetes', 'Agrios - Fitopatología', 'capítulo de hongos fitopatógenos', 2],
      ['Virus fitopatógenos', 'Gepp - Virus y Viroides Fitopatógenos', 'publicación de la cátedra de Fitopatología', 2],
      ['Bacterias fitopatógenas', 'Agrios - Fitopatología', 'capítulo de bacterias fitopatógenas', 2],
      ['Nematodos fitopatógenos', 'Agrios - Fitopatología', 'capítulo de nematodos fitopatógenos', 1],
    ]],
    ['Diagnóstico y epidemiología', '📋', [
      ['Diagnóstico de enfermedades: postulados de Koch', 'Agrios - Fitopatología', 'capítulo de diagnóstico', 1],
      ['Epidemiología: cuantificación y modelos matemáticos de enfermedades', 'Gepp - Apuntes sobre Epidemiología', 'material de la cátedra de Fitopatología', 2],
    ]],
    ['Resistencia y manejo de enfermedades', '🛡️', [
      ['Mecanismos de defensa y resistencia genética: teoría gen por gen', 'Agrios - Fitopatología', 'capítulo de resistencia genética', 2],
      ['Control químico: fungicidas, bactericidas y resistencia a fungicidas', 'Agrios - Fitopatología', 'capítulo de control químico', 2],
      ['Control cultural y biológico de enfermedades vegetales', 'Mondino y Vero - Control Biológico de Patógenos en Plantas', 'capítulo de control biológico', 2],
      ['Manejo integrado de enfermedades vegetales', 'Agrios - Fitopatología', 'capítulo de manejo integrado', 1],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['6'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en semestre 6 de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias de semestre 6 de Agronomía actualizadas, ${totalTemas} temas en total.`);
