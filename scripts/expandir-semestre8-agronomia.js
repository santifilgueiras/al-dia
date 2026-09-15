// Reemplaza el placeholder de 1 de las 3 materias del semestre 8 de
// Agronomía (Producción de Granos: Cultivos de Invierno) por su temario
// real, sacado del "Formulario de Propuesta de Unidades Curriculares"
// oficial aprobado por el Consejo de la Facultad
// (portal.fagro.edu.uy/wp-content/uploads/..., Plan de Estudios 2020).
// Paráfrasis tipo tabla de contenidos a partir de la sección "Unidades
// Temáticas" del programa, nunca copia textual.
//
// Nota: de las 3 materias del semestre 8, esta es la única con formulario
// oficial detallado localizable públicamente -- Gestión de Empresas
// Agrarias y AFO III: Agrícola-ganadero quedaron pendientes (mismo caso que
// Genética I, Estadística II, Economía Agraria, Fisiología y Metabolismo
// Animal, Ecología de Agroecosistemas del semestre 4, y AFO II del
// semestre 5).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

const materia = catalogo['8'].find(m => m.nombre === 'Producción de Granos: Cultivos de Invierno');
if (!materia) throw new Error('No se encontró "Producción de Granos: Cultivos de Invierno" en semestre 8 de Agronomía');

// [modulo, icono, [ [tema, libro, seccion, dias], ... ] ]
const MODULOS = [
  ['Preparación de suelos y ecofisiología', '🌾', [
    ['Preparación de suelos para cultivos de invierno: laboreo, barbecho y manejo de malezas', 'Facultad de Agronomía - Sistemas de Laboreo para Trigo (Documento Nº2)', 'documento de la cátedra sobre laboreo', 2],
    ['Ecofisiología y manejo de trigo, cebada y colza', 'Facultad de Agronomía - Revista Cangüé (fisiología, rendimiento, densidad y época de siembra de trigo y cebada)', 'artículos de ecofisiología de cultivos de invierno', 2],
  ]],
  ['Nutrición y elección de cultivares', '🧪', [
    ['Nutrición de cultivos y criterios de fertilización: nitrógeno, fósforo y potasio', 'Guía SATA - Guía Uruguaya para la Protección y Fertilización Vegetal', 'sección de fertilización de cultivos de invierno', 2],
    ['Elección de cultivares: marco legal, criterios y calidad de granos', 'Facultad de Agronomía - Revista Cangüé (elección de cultivares)', 'artículos de elección de cultivares de invierno', 2],
  ]],
  ['Malezas, enfermedades y plagas', '🐛', [
    ['Manejo de malezas en cultivos de invierno', 'Guía SATA - Guía Uruguaya para la Protección y Fertilización Vegetal', 'sección de manejo de malezas en cultivos de invierno', 2],
    ['Principales enfermedades de los cultivos de invierno: prevención y control', 'Guía SATA - Guía Uruguaya para la Protección y Fertilización Vegetal', 'sección de enfermedades de cultivos de invierno', 2],
    ['Manejo de plagas: reconocimiento, umbral de daño económico y control', 'Guía SATA - Guía Uruguaya para la Protección y Fertilización Vegetal', 'sección de plagas de cultivos de invierno', 1],
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

console.log(`"Producción de Granos: Cultivos de Invierno" ahora tiene ${materia.modulos.length} módulos / ${totalTemas} temas.`);
