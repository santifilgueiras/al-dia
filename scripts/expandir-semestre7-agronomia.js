// Reemplaza los placeholders de las 2 materias del semestre 7 de Agronomía
// (Bovinos de Carne, Producción de Granos: Cultivos de Verano) por su
// temario real, sacado de los "Formularios de Propuesta de Unidades
// Curriculares" oficiales aprobados por el Consejo de la Facultad
// (portal.fagro.edu.uy/wp-content/uploads/..., Plan de Estudios 2020).
// Paráfrasis tipo tabla de contenidos a partir de la sección "Unidades
// Temáticas" de cada programa, nunca copia textual.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// [nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ]
const MATERIAS = [
  ['Bovinos de Carne', [
    ['Introducción a la producción ganadera', '🐄', [
      ['Introducción a la producción ganadera en Uruguay y el mundo', 'Peyrou - La Cadena de la Carne Vacuna', 'capítulo de caracterización del complejo cárnico', 1],
    ]],
    ['Cría vacuna', '🐮', [
      ['Estado nutricional y eficiencia reproductiva en vacas de cría', 'Rovira - Manejo Nutritivo de los Rodeos de Cría en Pastoreo', 'capítulo de estado nutricional y reproducción', 2],
      ['Manejo general del rodeo de cría y herramienta genética: selección y cruzamientos', 'González - Cruzamientos en Bovinos de Carne', 'serie técnica de cruzamientos en ganado de carne', 2],
    ]],
    ['Recría y engorde', '🥩', [
      ['Factores que afectan el crecimiento y manejo de la invernada en pastoreo', 'Di Marco - Crecimiento de Vacunos para Ganado de Carne', 'capítulo de crecimiento y manejo de invernada', 2],
      ['Manejo de la invernada en confinamiento y calidad de canal y carne', 'Franco - Importancia de los Factores Productivos, Tecnológicos y de Manejo en la Calidad de la Canal y de la Carne Vacuna', 'capítulo de calidad de canal y carne', 2],
    ]],
    ['Rol profesional', '👨‍🌾', [
      ['El rol profesional del Ingeniero Agrónomo en la producción ganadera', 'Peyrou - La Cadena de la Carne Vacuna', 'capítulo de asistencia técnica en sistemas ganaderos', 1],
    ]],
  ]],
  ['Producción de Granos: Cultivos de Verano', [
    ['Preparación de suelos y ecofisiología', '🌽', [
      ['Preparación de suelos para cultivos de verano: laboreo, barbecho y manejo de malezas', 'Ernst - Criterios Generales a Considerar en el Laboreo de Suelos para Cultivos de Verano', 'artículo de la revista Cangüé', 2],
      ['Ecofisiología y manejo de maíz, soja, sorgo y girasol', 'Andrade - Ecofisiología de Maíz, Girasol y Soja', 'capítulos de ecofisiología por cultivo', 2],
    ]],
    ['Malezas, enfermedades y plagas', '🐛', [
      ['Manejo de malezas en cultivos de verano', 'García-Torres y Fernández Quintanilla - Fundamentos sobre Malas Hierbas y Herbicidas', 'capítulo de manejo de malezas en cultivos de verano', 2],
      ['Principales enfermedades de los cultivos de verano: prevención y control', 'Guía SATA - Guía Uruguaya para la Protección y Fertilización Vegetal', 'sección de enfermedades de cultivos de verano', 2],
      ['Manejo de plagas: reconocimiento, umbral de daño económico y control', 'Guía SATA - Guía Uruguaya para la Protección y Fertilización Vegetal', 'sección de plagas de cultivos de verano', 2],
    ]],
    ['Fertilización', '🧪', [
      ['Manejo de la fertilización en cultivos de verano: nitrógeno y fósforo', 'Hoffman, Siri y Ernst - Cultivos de Verano: Posibles Manejos para Minimizar Pérdidas de Nitrógeno', 'artículo de la revista Cangüé', 2],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['7'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en semestre 7 de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias de semestre 7 de Agronomía actualizadas, ${totalTemas} temas en total.`);
