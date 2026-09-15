// Reemplaza los placeholders de las 5 materias obligatorias de 1er año de
// Agronomía (Biología General, Matemáticas, Física, Química, AFO I) por su
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
  ['Biología General', [
    ['Química de la vida', '🧪', [
      ['Introducción a la célula y su organización', 'Campbell y Reece - Biología', 'capítulo de introducción a la célula', 1],
      ['El agua y sus propiedades biológicas', 'Campbell y Reece - Biología', 'capítulo de propiedades del agua', 1],
      ['Glúcidos: características químicas y polisacáridos de reserva y estructurales', 'Campbell y Reece - Biología', 'capítulo de macromoléculas: glúcidos', 1],
      ['Lípidos y la membrana celular', 'Campbell y Reece - Biología', 'capítulo de macromoléculas: lípidos y membranas', 1],
      ['Nucleótidos y estructura del ADN y ARN (modelo de Watson y Crick)', 'Campbell y Reece - Biología', 'capítulo de ácidos nucleicos', 2],
      ['Proteínas: estructura, conformación y función enzimática', 'Campbell y Reece - Biología', 'capítulo de macromoléculas: proteínas y enzimas', 2],
    ]],
    ['Célula', '🔬', [
      ['Membranas biológicas y transporte', 'Campbell y Reece - Biología', 'capítulo de membranas celulares', 1],
      ['Fotosíntesis', 'Campbell y Reece - Biología', 'capítulo de fotosíntesis', 2],
      ['Energía de la vida: metabolismo energético celular', 'Campbell y Reece - Biología', 'capítulo de respiración celular', 2],
      ['Ciclo celular', 'Campbell y Reece - Biología', 'capítulo del ciclo celular', 1],
      ['Reproducción celular: meiosis y ciclos sexuales de la vida', 'Campbell y Reece - Biología', 'capítulo de meiosis y reproducción sexual', 1],
    ]],
    ['Bases de la herencia y evolución', '🧬', [
      ['Principios básicos de la herencia: genes, alelos, genotipo y fenotipo', 'Campbell y Reece - Biología', 'capítulo de herencia mendeliana', 2],
      ['Historia evolutiva y diversidad biológica', 'Campbell y Reece - Biología', 'capítulo de evolución y árbol de la vida', 1],
      ['Virus, bacterias, archaea y hongos', 'Campbell y Reece - Biología', 'capítulo de diversidad de microorganismos', 1],
      ['Relación entre microorganismos y organismos pluricelulares', 'Campbell y Reece - Biología', 'capítulo de interacciones microbianas', 1],
    ]],
    ['Reproducción y nutrición de plantas y animales', '🌱', [
      ['Estructura y función en plantas', 'Campbell y Reece - Biología', 'capítulo de estructura vegetal', 1],
      ['Reproducción sexual y asexual en plantas (Angiospermas)', 'Campbell y Reece - Biología', 'capítulo de reproducción vegetal', 2],
      ['Estructura y función en animales', 'Campbell y Reece - Biología', 'capítulo de estructura animal', 1],
      ['Nutrición animal y producción animal aplicada a la biología', 'Campbell y Reece - Biología', 'capítulo de nutrición animal', 1],
      ['Restauración de ecosistemas y especies invasoras en Uruguay', 'Campbell y Reece - Biología', 'capítulo de ecología y conservación', 2],
    ]],
  ]],
  ['Matemáticas', [
    ['Revisión y modelación matemática', '📐', [
      ['Revisión de álgebra elemental, ecuaciones e inecuaciones', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de revisión de conceptos', 1],
      ['Concepto de modelo matemático, niveles y criterios de validación', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de introducción a la modelación', 1],
      ['Elementos de los modelos matemáticos en ciencias agrarias: funciones de producción y curvas de respuesta', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de caracterización de modelos matemáticos', 2],
    ]],
    ['Funciones y cálculo aplicados a la agronomía', '📈', [
      ['Funciones reales de una variable: polinómicas, exponenciales y logarítmicas', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de estudio de modelos matemáticos', 2],
      ['Modelos de crecimiento: función logística y Mitscherlich-Spillman', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de funciones trascendentes aplicadas', 2],
      ['Cálculo integral: integral definida e indefinida, cálculo de áreas', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de cálculo integral', 2],
    ]],
    ['Funciones de varias variables y álgebra lineal', '🔢', [
      ['Funciones de varias variables: extremos y superficies de respuesta', 'Eulacio y Ortiz - Análisis Matemático de Modelos Aplicados en las Ciencias Agrarias', 'capítulo de funciones de varias variables', 2],
      ['Álgebra lineal: matrices y resolución de sistemas lineales', 'Dorf - Introducción al Álgebra de Matrices', 'capítulo de álgebra lineal', 2],
    ]],
  ]],
  ['Física (Agronomía)', [
    ['Fundamentos y cinemática', '📏', [
      ['Conceptos matemáticos básicos: magnitudes, vectores, derivadas e integrales', 'Serway - Física para Ciencias e Ingeniería', 'capítulo introductorio de magnitudes y vectores', 1],
      ['Cinemática lineal y rotacional de la partícula y el rígido', 'Serway - Física para Ciencias e Ingeniería', 'capítulo de cinemática', 2],
    ]],
    ['Dinámica y energía', '⚙️', [
      ['Dinámica de la partícula: fuerzas y leyes de Newton', 'Serway - Física para Ciencias e Ingeniería', 'capítulo de leyes de Newton', 2],
      ['Dinámica del rígido: torque y segunda cardinal', 'Serway - Física para Ciencias e Ingeniería', 'capítulo de dinámica de rotación', 2],
      ['Trabajo, energía y potencia', 'Serway - Física para Ciencias e Ingeniería', 'capítulo de trabajo y energía', 2],
    ]],
    ['Mecánica de fluidos', '💧', [
      ['Mecánica de fluidos: régimen laminar y turbulento', 'Serway - Física para Ciencias e Ingeniería', 'capítulo de mecánica de fluidos', 2],
    ]],
  ]],
  ['Química (Agronomía)', [
    ['Estequiometría y reacciones', '⚗️', [
      ['Cálculos estequiométricos, soluciones y electrolitos', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de estequiometría y soluciones', 2],
      ['Reacciones de oxidación-reducción', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de reacciones redox', 1],
      ['Normalidad y masa equivalente', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de normalidad y equivalentes', 1],
    ]],
    ['Equilibrio químico', '⚖️', [
      ['Equilibrio químico general y autoionización del agua', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de equilibrio químico', 2],
      ['pH de ácidos y bases fuertes y débiles', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de equilibrio ácido-base', 2],
      ['Soluciones amortiguadoras y efecto del ion común', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de soluciones amortiguadoras', 1],
      ['Hidrólisis de sales y equilibrio de sólidos poco solubles', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de equilibrio de solubilidad', 2],
    ]],
    ['Termodinámica química', '🔥', [
      ['Termoquímica: entalpía y calor de reacción', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de termoquímica', 1],
      ['Entropía y energía libre', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de entropía y energía libre', 2],
      ['Potencial químico y cambios de fase', 'Castellan - Fisicoquímica', 'capítulo de potencial químico y diagramas de fase', 2],
      ['Propiedades coligativas de las soluciones', 'Brown, LeMay y Bursten - Química: La Ciencia Central', 'capítulo de propiedades coligativas', 1],
    ]],
  ]],
  ['AFO I: Competencias para el Abordaje de Situaciones Agrarias', [
    ['Universidad, conocimiento y método científico', '🎓', [
      ['El papel de la Universidad y la integralidad (enseñanza, investigación, extensión)', 'Apuntes de cátedra', 'AFO I: sesiones plenarias sobre integralidad', 1],
      ['Tipos de conocimiento y método científico', 'Apuntes de cátedra', 'AFO I: sesiones plenarias sobre conocimiento científico', 1],
    ]],
    ['Herramientas para el trabajo académico', '📚', [
      ['Búsqueda de información académica, integridad académica y citación', 'Apuntes de cátedra', 'AFO I: seminarios de búsqueda de información', 1],
      ['Sistema estadístico agropecuario de Uruguay', 'Apuntes de cátedra', 'AFO I: sesión sobre censos y encuestas agropecuarias', 1],
    ]],
    ['Situaciones agrarias y perfil profesional', '🌾', [
      ['Dimensiones de las situaciones agrarias', 'Apuntes de cátedra', 'AFO I: ciclo de mesas redondas', 1],
      ['Inserción laboral de la Ingeniería Agronómica', 'Apuntes de cátedra', 'AFO I: sesión sobre inserción profesional', 1],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['1'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en año 1 de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias de 1er año de Agronomía actualizadas, ${totalTemas} temas en total.`);
