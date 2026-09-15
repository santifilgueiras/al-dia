// Reemplaza los placeholders de las 4 materias obligatorias de 2do año de
// Agronomía (Botánica, Bioquímica, Biología Animal, Introducción a las
// Geociencias) por su temario real, sacado de los "Formularios de Propuesta
// de Unidades Curriculares" oficiales aprobados por el Consejo de la
// Facultad (portal.fagro.edu.uy/wp-content/uploads/..., Plan de Estudios
// 2020). Paráfrasis tipo tabla de contenidos a partir de la sección
// "Unidades Temáticas" de cada programa, nunca copia textual.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// [nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ]
const MATERIAS = [
  ['Botánica', [
    ['Anatomía y morfología vegetal', '🌿', [
      ['Anatomía vegetal: tejidos, meristemas y ontogenia del cuerpo de la planta', 'Esau - Anatomy of Seed Plants', 'capítulo de anatomía de órganos vegetativos', 2],
      ['Morfología de órganos vegetativos y reproductivos en las principales familias botánicas', 'Izco (coord.) - Botánica', 'capítulo de morfología y organología', 2],
      ['Reconocimiento de especies mediante herramientas de identificación', 'Font Quer - Diccionario de Botánica', 'uso de claves y herramientas de identificación', 1],
    ]],
    ['Reproducción y sistemática vegetal', '🌸', [
      ['Ciclo biológico y reproducción de Angiospermas: sexual y asexual', 'Izaguirre - Ciclo Biológico de las Fanerógamas', 'publicación AEA sobre ciclo biológico', 2],
      ['Sistemática vegetal: taxones, concepto de especie y nomenclatura botánica', 'Judd et al. - Plant Systematics: A Phylogenetic Approach', 'capítulo de principios de sistemática vegetal', 2],
    ]],
  ]],
  ['Bioquímica (Agronomía)', [
    ['Célula y membranas', '🔬', [
      ['Organización celular y biomoléculas estructurales y metabólicas', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de fundamentos celulares y moleculares', 2],
      ['Membrana celular: modelo del mosaico fluido y transporte', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de membranas biológicas y transporte', 2],
    ]],
    ['Bioenergética y enzimas', '⚡', [
      ['Cadena respiratoria y fosforilación oxidativa en el metabolismo animal y vegetal', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de fosforilación oxidativa', 2],
      ['Enzimas: cinética de Michaelis-Menten y regulación de la actividad enzimática', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de enzimas', 2],
    ]],
    ['Metabolismo de glúcidos', '🍬', [
      ['Glucólisis y vía de las pentosas fosfato en el metabolismo de plantas y animales de producción', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de glucólisis', 2],
      ['Gluconeogénesis y particularidades del metabolismo de la glucosa en rumiantes', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de gluconeogénesis', 2],
      ['Ciclo de Krebs: reacciones, balance y regulación', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo del ciclo del ácido cítrico', 2],
    ]],
    ['Metabolismo de lípidos y fotosíntesis', '🌻', [
      ['Degradación y síntesis de ácidos grasos', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de metabolismo de lípidos', 2],
      ['Fotosíntesis: fase luminosa y fijación de CO2 en plantas C3, C4 y CAM', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de fotosíntesis', 2],
    ]],
    ['Metabolismo del nitrógeno e integración metabólica', '🌾', [
      ['Metabolismo de compuestos nitrogenados: fijación, transaminación y ciclo de la urea', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de metabolismo de aminoácidos y nitrógeno', 2],
      ['Integración y regulación metabólica', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de integración del metabolismo', 1],
    ]],
    ['Biología molecular', '🧬', [
      ['Duplicación del ADN: horquilla de replicación y ADN polimerasa', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de replicación del ADN', 2],
      ['Síntesis de ARN y regulación de la transcripción', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de transcripción', 2],
      ['Síntesis proteica: traducción y modificaciones postraduccionales', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de traducción', 2],
      ['Mutaciones y mecanismos de reparación del ADN', 'Nelson y Cox - Lehninger Principios de Bioquímica', 'capítulo de mutación y reparación del ADN', 1],
    ]],
  ]],
  ['Biología Animal', [
    ['Sistemas biológicos e introducción a la fauna', '🐛', [
      ['Sistema biológico animal: interrelaciones y recursos zoogenéticos', 'Campbell y Reece - Biología', 'capítulo de sistemas biológicos animales', 1],
      ['Diversidad de la fauna edáfica e introducción a los artrópodos', 'Campbell y Reece - Biología', 'capítulo de diversidad de invertebrados', 1],
    ]],
    ['Vertebrados y ciclos biológicos', '🐄', [
      ['Características generales de los vertebrados: ciclo biológico de aves y mamíferos', 'Cunningham - Fisiología Veterinaria', 'capítulo de características de los vertebrados', 2],
      ['Etapas del crecimiento y desarrollo: gestación, parto, lactación y pubertad', 'Cunningham - Fisiología Veterinaria', 'capítulo de desarrollo y ciclos productivos', 2],
    ]],
    ['Homeostasis y regulación', '⚖️', [
      ['Homeostasis y equilibrio del medio interno', 'Cunningham - Fisiología Veterinaria', 'capítulo de homeostasis', 2],
      ['Sistema nervioso y sistema endócrino: regulación e integración', 'Cunningham - Fisiología Veterinaria', 'capítulo de sistema nervioso y endócrino', 2],
      ['Captación de estímulos externos: visión, olfato y sistema tegumentario', 'Cunningham - Fisiología Veterinaria', 'capítulo de órganos de los sentidos', 1],
    ]],
    ['Soporte y desplazamiento', '🦴', [
      ['Sistema óseo: estructura, plasticidad y homeostasis del calcio', 'Tortora y Derrickson - Principios de Anatomía y Fisiología', 'capítulo de sistema óseo', 2],
      ['Sistema muscular: estructura, función y transformación en carne', 'Tortora y Derrickson - Principios de Anatomía y Fisiología', 'capítulo de sistema muscular', 2],
    ]],
    ['Mantenimiento del medio interno', '🫀', [
      ['Sistema circulatorio y linfático', 'García Sacristán (coord.) - Fisiología Veterinaria', 'capítulo de sistema circulatorio', 2],
      ['Sistema respiratorio y su vinculación con el sistema cardiovascular', 'García Sacristán (coord.) - Fisiología Veterinaria', 'capítulo de sistema respiratorio', 2],
      ['Sistema inmunológico y sistema excretor', 'García Sacristán (coord.) - Fisiología Veterinaria', 'capítulo de sistema inmunitario y excretor', 2],
    ]],
    ['Digestión y reproducción', '🍽️', [
      ['Sistema digestivo: procesos digestivos en rumiantes y no rumiantes', 'Cunningham - Fisiología Veterinaria', 'capítulo de fisiología digestiva', 2],
      ['Estrategias reproductivas y reproducción comparada de hembras y machos', 'Cunningham - Fisiología Veterinaria', 'capítulo de fisiología de la reproducción', 2],
      ['Lactación e integración de los procesos fisiológicos', 'Cunningham - Fisiología Veterinaria', 'capítulo de lactación', 1],
    ]],
  ]],
  ['Introducción a las Geociencias', [
    ['Sistema climático', '🌤️', [
      ['Sistema climático: composición atmosférica, componentes del clima y diagramas ombrotérmicos', 'Barry y Chorley - Atmósfera, Tiempo y Clima', 'capítulo de sistema climático', 2],
    ]],
    ['Bases geológicas', '🪨', [
      ['Introducción a la geología y minerales primarios', 'Bossi, Ortíz, Caggiano y Olveira - Manual Didáctico de Geología para Estudiantes de Agronomía', 'capítulo de introducción a la geología y minerales', 2],
      ['Tipos de rocas de Uruguay: ígneas, metamórficas y sedimentarias', 'Bossi, Ortíz, Caggiano y Olveira - Manual Didáctico de Geología para Estudiantes de Agronomía', 'capítulo de tipos de rocas', 2],
      ['Meteorización y minerales secundarios', 'Bossi, Ortíz, Caggiano y Olveira - Manual Didáctico de Geología para Estudiantes de Agronomía', 'capítulo de meteorización', 2],
      ['Materiales parentales y su relación con la formación de suelos', 'Bossi, Ortíz, Caggiano y Olveira - Manual Didáctico de Geología para Estudiantes de Agronomía', 'capítulo de materiales parentales', 2],
    ]],
    ['Hidrología', '💧', [
      ['Hidrología superficial: ciclo hidrológico y cuencas hidrográficas', 'Chow, Maidment y Mays - Hidrología Aplicada', 'capítulo de hidrología superficial y cuencas', 2],
      ['Hidrología subterránea: acuíferos y unidades hidrogeológicas', 'Chow, Maidment y Mays - Hidrología Aplicada', 'capítulo de aguas subterráneas', 2],
    ]],
    ['Historia y cambio climático', '🌍', [
      ['Historia del clima y cambio climático actual', 'Barros - El Cambio Climático Global', 'capítulo de historia del clima y cambio climático', 2],
    ]],
    ['Ecorregiones', '🗺️', [
      ['Ecorregiones del Uruguay y uso agrario del territorio', 'Achkar, Domínguez y Pesce - Ecorregiones del Uruguay', 'capítulo de caracterización de ecorregiones', 2],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['2'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en año 2 de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias de 2do año de Agronomía actualizadas, ${totalTemas} temas en total.`);
