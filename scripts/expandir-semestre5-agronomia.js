// Reemplaza los placeholders de 4 de las 5 materias del semestre 5 de
// Agronomía (Genética de Poblaciones y Genética Cuantitativa, Reproducción
// y Nutrición Animal, Ecofisiología de Cultivos, Manejo y Conservación de
// Suelos) por su temario real, sacado de los "Formularios de Propuesta de
// Unidades Curriculares" oficiales aprobados por el Consejo de la Facultad
// (portal.fagro.edu.uy/wp-content/uploads/..., Plan de Estudios 2020).
// Paráfrasis tipo tabla de contenidos a partir de la sección "Unidades
// Temáticas" de cada programa, nunca copia textual.
//
// Nota: "AFO II: Sustentabilidad de Sistemas Agrarios" (la 5ta materia del
// semestre) queda pendiente -- no se encontró su formulario oficial
// detallado públicamente indexado (igual que 5 materias del semestre 4:
// Genética I, Estadística II, Economía Agraria, Fisiología y Metabolismo
// Animal, Ecología de Agroecosistemas).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// [nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ]
const MATERIAS = [
  ['Genética de Poblaciones y Genética Cuantitativa', [
    ['Introducción a la genómica', '🧬', [
      ['Introducción a la genómica: dogma central, alelos, haplotipos y marcadores moleculares', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo introductorio de genómica', 1],
    ]],
    ['Genética de poblaciones', '🧫', [
      ['Variación genética y equilibrio de Hardy-Weinberg', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo de equilibrio de Hardy-Weinberg', 2],
      ['Deriva genética: modelo de Wright-Fisher y tamaño efectivo poblacional', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo de deriva genética', 2],
      ['Selección natural: modelo de un locus con dos alelos y sobredominancia', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo de selección natural', 2],
      ['Dinámica de dos loci: desequilibrio de ligamiento y arrastre genético', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo de dinámica de dos loci', 2],
      ['Apareamientos no aleatorios: endocría, identidad por descendencia y efecto Wahlund', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo de apareamientos no aleatorios', 2],
      ['Genética de poblaciones microbianas: transferencia horizontal y genómica poblacional', 'Hartl - A Primer of Population Genetics and Genomics', 'capítulo de genética de poblaciones microbianas', 1],
    ]],
    ['Genética cuantitativa', '📐', [
      ['El modelo genético básico: varianza genotípica y ambiental', 'Falconer y Mackay - Introduction to Quantitative Genetics', 'capítulo del modelo genético básico', 2],
      ['Heredabilidad y repetibilidad', 'Falconer y Mackay - Introduction to Quantitative Genetics', 'capítulo de heredabilidad', 2],
      ['Parentesco y semejanza entre parientes: modelos mixtos lineales', 'Falconer y Mackay - Introduction to Quantitative Genetics', 'capítulo de parentesco y covarianza genética', 2],
    ]],
    ['Selección artificial', '🐄', [
      ['Selección artificial I: respuesta a la selección y ecuación del criador', 'Cardellino y Rovira - Mejoramiento Genético Animal', 'capítulo de respuesta a la selección', 2],
      ['Respuesta correlacionada: correlaciones genéticas y ambientales', 'Falconer y Mackay - Introduction to Quantitative Genetics', 'capítulo de respuesta correlacionada', 1],
      ['Selección artificial II: índices de selección y selección genómica', 'Cardellino y Rovira - Mejoramiento Genético Animal', 'capítulo de métodos de selección', 2],
      ['Endocría, exocría, consanguinidad y depresión endogámica', 'Falconer y Mackay - Introduction to Quantitative Genetics', 'capítulo de consanguinidad', 2],
      ['Normas de reacción e interacción genotipo × ambiente', 'Falconer y Mackay - Introduction to Quantitative Genetics', 'capítulo de interacción genotipo-ambiente', 1],
    ]],
  ]],
  ['Reproducción y Nutrición Animal', [
    ['Nutrición y fisiología reproductiva del animal adulto', '🐖', [
      ['Sistemas de producción y ciclo productivo de animales de interés productivo', 'Cunningham - Fisiología Veterinaria', 'capítulo de sistemas de producción animal', 1],
      ['Requerimientos y aportes de nutrientes en animales adultos', 'McDonald et al. - Nutrición Animal', 'capítulo de requerimientos nutricionales', 2],
      ['Endocrinología de la reproducción: gametogénesis y ciclo estral', 'Hafez - Reproducción e Inseminación Artificial en Animales', 'capítulo de endocrinología reproductiva', 2],
    ]],
    ['Fecundación, gestación y parto', '🤰', [
      ['Transporte de gametos, fecundación y reconocimiento materno de la preñez', 'Senger - Pathways to Pregnancy and Parturition', 'capítulo de fecundación y reconocimiento de la preñez', 2],
      ['Crecimiento y metabolismo embrionario, fetal y placentario: programación fetal', 'Senger - Pathways to Pregnancy and Parturition', 'capítulo de desarrollo placentario y fetal', 2],
      ['Regulación de la partición de nutrientes durante la gestación', 'McDonald et al. - Nutrición Animal', 'capítulo de nutrición en la gestación', 1],
    ]],
    ['Transición, posparto y lactación', '🍼', [
      ['Período de transición: fisiología y control endócrino del parto', 'Senger - Pathways to Pregnancy and Parturition', 'capítulo del parto', 2],
      ['Lactación y glándula mamaria: síntesis de calostro y leche', 'Cunningham - Fisiología Veterinaria', 'capítulo de fisiología de la lactación', 2],
      ['Curvas de lactancia y destete', 'McDonald et al. - Nutrición Animal', 'capítulo de nutrición en la lactancia', 1],
    ]],
    ['Crecimiento, desarrollo y pubertad', '📏', [
      ['Crecimiento y desarrollo posdestete: deposición de tejido muscular y graso', 'McDonald et al. - Nutrición Animal', 'capítulo de crecimiento y composición corporal', 2],
      ['Bases fisiológicas de la pubertad', 'Hafez - Reproducción e Inseminación Artificial en Animales', 'capítulo de pubertad', 1],
    ]],
    ['Eficiencia alimenticia, reproductiva y ambiental', '🌍', [
      ['Indicadores de eficiencia reproductiva, alimenticia y ambiental', 'McDonald et al. - Nutrición Animal', 'capítulo de eficiencia alimenticia y ambiental', 2],
    ]],
  ]],
  ['Ecofisiología de Cultivos', [
    ['Introducción', '🌾', [
      ['Introducción a la ecofisiología: niveles de organización y escalas de los cultivos', 'Dogliotti, Mazzilli y Gambetta - Ecofisiología de Cultivos (guía del curso)', 'unidad introductoria', 1],
    ]],
    ['Producción potencial', '☀️', [
      ['Intercepción de radiación, asimilación de carbono y respiración', 'Sadras y Calderini - Crop Physiology', 'capítulo de intercepción de radiación y fotosíntesis', 2],
      ['Regulación del desarrollo de los cultivos: efecto de la temperatura y el fotoperíodo', 'Sadras y Calderini - Crop Physiology', 'capítulo de desarrollo de cultivos', 2],
      ['Partición de asimilados, crecimiento y estimación del rendimiento potencial', 'Dogliotti, Mazzilli y Gambetta - Ecofisiología de Cultivos (guía del curso)', 'unidad de producción potencial', 2],
    ]],
    ['Producción limitada por agua', '💧', [
      ['Sistema suelo-planta-atmósfera y efectos del déficit hídrico en el rendimiento', 'Sadras y Calderini - Crop Physiology', 'capítulo de relaciones hídricas del cultivo', 2],
      ['Estimación de la demanda de agua y eficiencia de su uso', 'Dogliotti, Mazzilli y Gambetta - Ecofisiología de Cultivos (guía del curso)', 'unidad de producción limitada por agua', 2],
    ]],
    ['Producción limitada por nutrientes', '🌱', [
      ['Función de los nutrientes y estimación de la demanda y respuesta a su disponibilidad', 'Dogliotti, Mazzilli y Gambetta - Ecofisiología de Cultivos (guía del curso)', 'unidad de producción limitada por nutrientes', 2],
      ['Productividad y eficiencia de uso de los nutrientes', 'Hay y Porter - The Physiology of Crop Yield', 'capítulo de eficiencia de uso de nutrientes', 1],
    ]],
    ['Análisis de brechas de rendimiento', '📊', [
      ['Integración de factores que explican el rendimiento actual y brechas de rendimiento', 'Dogliotti, Mazzilli y Gambetta - Ecofisiología de Cultivos (guía del curso)', 'unidad de brechas de rendimiento', 2],
    ]],
  ]],
  ['Manejo y Conservación de Suelos', [
    ['Conservación y degradación de suelos', '🟤', [
      ['Conservación y degradación de suelos: conceptos generales', 'Durán y García Préchac - Suelos del Uruguay, Tomo II', 'capítulo de degradación de suelos', 1],
      ['Elementos para la planificación del uso de la tierra a nivel predial', 'Durán y García Préchac - Suelos del Uruguay, Tomo II', 'capítulo de planificación del uso de la tierra', 2],
    ]],
    ['Manejo mecanizado de suelos', '🚜', [
      ['Compactación de suelos y desarrollo de la tracción: relación maquinaria-suelo', 'Botta - Tractores: Eficiencia de Uso', 'capítulo de tracción y compactación', 2],
      ['Sistemas de laboreo: laboreo conservacionista, cero laboreo y siembra directa', 'Balbuena et al. - Herramientas de Labranza para la Descompactación del Suelo Agrícola', 'capítulo de sistemas de laboreo', 2],
    ]],
    ['Erosión de suelos', '🌧️', [
      ['Factores y proceso de erosión', 'Durán y García Préchac - Suelos del Uruguay, Tomo II', 'capítulo de erosión de suelos', 2],
      ['Ecuación Universal de Pérdida de Suelo (USLE)', 'Durán y García Préchac - Suelos del Uruguay, Tomo II', 'capítulo de estimación de pérdida de suelo', 2],
      ['Medidas de manejo de suelos para reducir erosión y compactación', 'Durán y García Préchac - Suelos del Uruguay, Tomo II', 'capítulo de manejo y conservación de suelos', 1],
      ['Marco legal de conservación de suelos en Uruguay', 'Durán y García Préchac - Suelos del Uruguay, Tomo II', 'capítulo de normativa de conservación de suelos', 1],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['5'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en semestre 5 de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias de semestre 5 de Agronomía actualizadas, ${totalTemas} temas en total.`);
