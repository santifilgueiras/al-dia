// Completa 5 de las 8 materias de Agronomía que habían quedado pendientes
// en rondas anteriores por no encontrarse su formulario oficial indexado
// en búsquedas genéricas -- se encontraron navegando directamente las
// páginas de los Departamentos de Producción Animal y Pasturas y de
// Ciencias Sociales en portal.fagro.edu.uy, que listan los PDFs de todas
// sus materias. Mismo criterio de siempre: paráfrasis tipo tabla de
// contenidos a partir de "Unidades Temáticas", nunca copia textual.
//
// Siguen pendientes (sin formulario detallado localizado): Genética I y
// Estadística II: Diseño y Regresión (semestre 4), Ecología de
// Agroecosistemas (semestre 4) -- esta última pertenece a otro
// departamento (Sistemas Ambientales) no explorado todavía.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// [semestre, nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ]
const MATERIAS = [
  ['4', 'Economía Agraria', [
    ['Renta de la tierra y esquemas de abordaje', '🌾', [
      ['Renta de la tierra: teorías, conceptos y precio de la tierra en Uruguay', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de renta y precio de la tierra', 2],
      ['Esquemas de abordaje del sector agropecuario: cadenas, complejos y cadenas de valor', 'Buxedas - Enfoque para el Análisis del Sistema Agropecuario y los Complejos Agroindustriales', 'selección de lecturas de la cátedra de Economía Agraria', 2],
    ]],
    ['Innovación, políticas y mercado mundial', '🌐', [
      ['El proceso tecnológico y la innovación en el agro', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de proceso tecnológico e innovación', 2],
      ['Políticas agrarias y económicas en Uruguay', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de políticas agrarias', 2],
      ['El mercado mundial y los impactos del comercio en la agricultura', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de mercado mundial y comercio agrario', 1],
    ]],
    ['Dinámica sectorial agropecuaria', '📈', [
      ['La evolución del sector y la dinámica agropecuaria uruguaya', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de dinámica y competencia intrasectorial', 2],
    ]],
    ['Cadenas y complejos agroindustriales', '🏭', [
      ['La cadena de carne vacuna: estructura, productores y mercado', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de la cadena de carne vacuna', 2],
      ['El complejo lechero: estructura, cambio técnico y competitividad', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo del complejo lechero', 2],
      ['La agricultura de secano: cultivos e innovaciones tecnológicas', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo de agricultura de secano', 1],
      ['El complejo arrocero: estructura, política y perspectivas', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo del complejo arrocero', 1],
      ['El complejo forestal: evolución e inversiones', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo del complejo forestal', 1],
      ['Cadenas y complejos del sector granjero: hortícola y citrícola', 'Vassallo (ed.) - Dinámica y Competencia Intrasectorial en el Agro Uruguay 2000-2010', 'capítulo del sector granjero', 1],
    ]],
  ]],
  ['4', 'Fisiología y Metabolismo Animal', [
    ['Evolución, ambiente y funcionalidad digestiva', '🐄', [
      ['Adaptación evolutiva y análisis comparativo del sistema digestivo', 'Van Soest - Nutritional Ecology of the Ruminant', 'capítulo de anatomía comparada del sistema digestivo', 2],
    ]],
    ['Ingestión, digestión y absorción', '🍽️', [
      ['Consumo y su regulación: valor nutritivo de los alimentos y factores que lo afectan', 'Church - Fisiología Digestiva y Nutrición', 'capítulo de regulación del consumo', 2],
      ['Digestión y absorción de nutrientes en monogástricos y rumiantes', 'Church - Fisiología Digestiva y Nutrición', 'capítulo de digestión y absorción', 2],
    ]],
    ['Transporte y metabolismo', '🔬', [
      ['Transporte de nutrientes y metabolismo energético y del nitrógeno', 'Van Soest - Nutritional Ecology of the Ruminant', 'capítulo de metabolismo de nutrientes', 2],
    ]],
    ['Integración y regulación', '⚙️', [
      ['Modelos de integración de consumo, digestión y metabolismo intermediario', 'McDonald et al. - Nutrición Animal', 'capítulo de integración metabólica', 2],
    ]],
  ]],
  ['5', 'AFO II: Sustentabilidad de Sistemas Agrarios', [
    ['Enfoque de la sustentabilidad', '🌱', [
      ['Sustentabilidad y sistemas: indicadores sociales, económicos y productivos', 'Apuntes de cátedra', 'AFO II: enfoque de la sustentabilidad', 1],
    ]],
    ['Caracterización del área de estudio', '🗺️', [
      ['Caracterización socioeconómica y de recursos naturales: SIG, vegetación y suelos', 'García Préchac y Durán - Suelos del Uruguay, Tomo II', 'capítulo de caracterización de recursos naturales', 2],
    ]],
    ['Definición y cálculo de indicadores', '📊', [
      ['Indicadores ambientales, económicos y productivos de sustentabilidad', 'Apuntes de cátedra', 'AFO II: definición y cálculo de indicadores', 2],
    ]],
    ['Discusión y síntesis', '📝', [
      ['Síntesis de la sustentabilidad de un sistema agrario y elaboración del informe final', 'Apuntes de cátedra', 'AFO II: discusión y síntesis de la información', 1],
    ]],
  ]],
  ['8', 'Gestión de Empresas Agrarias', [
    ['Introducción y contabilidad', '📋', [
      ['Introducción a la gestión agraria: ciclos biológicos y formas de organización', 'Álvarez, Arbeletche, Correa, Molina, Pedemonte y Tamosiunas - Manual de Gestión de Empresas Agropecuarias', 'capítulo introductorio a la gestión agraria', 1],
      ['Contabilidad e información en la unidad de producción: registros e indicadores', 'Álvarez, Arbeletche, Correa, Molina, Pedemonte y Tamosiunas - Manual de Gestión de Empresas Agropecuarias', 'capítulo de contabilidad e información', 2],
    ]],
    ['Comercialización y costos', '💰', [
      ['Comercialización y mercados agrarios: precios, tarifas y formas de pago', 'Álvarez, Arbeletche, Correa, Molina, Pedemonte y Tamosiunas - Manual de Gestión de Empresas Agropecuarias', 'capítulo de comercialización y mercados agrarios', 2],
      ['Costos: clasificación, tratamiento contable, margen y punto de equilibrio', 'Barnard y Nix - Planeamiento y Control Agropecuarios', 'capítulo de costos agropecuarios', 2],
    ]],
    ['Diagnóstico y planificación', '🔍', [
      ['Diagnóstico en la empresa agraria: árbol de indicadores y árbol de problemas', 'Álvarez, Arbeletche, Correa, Molina, Pedemonte y Tamosiunas - Manual de Gestión de Empresas Agropecuarias', 'capítulo de diagnóstico de la empresa agraria', 2],
      ['Planificación: presupuesto parcial y total, incertidumbre y riesgo', 'Barnard y Nix - Planeamiento y Control Agropecuarios', 'capítulo de planificación y presupuestación', 2],
    ]],
    ['Finanzas de la empresa agraria', '🏦', [
      ['Matemáticas financieras: fuentes de financiamiento e indicadores financieros', 'Pascale - Decisiones Financieras', 'capítulo de matemáticas financieras', 2],
      ['Decisiones de inversión de mediano y largo plazo: flujo de fondos y evaluación de conveniencia', 'Mokate - Evaluación Financiera de Proyectos de Inversión', 'capítulo de evaluación de proyectos de inversión', 2],
    ]],
  ]],
  ['8', 'AFO III: Agrícola-ganadero', [
    ['Enfoque global y herramientas de relevamiento', '🔎', [
      ['Enfoque global de la explotación agropecuaria (EGEA)', 'Apuntes de cátedra', 'AFO III: enfoque global de la explotación agropecuaria', 2],
      ['Entrenamiento en QGis: fotointerpretación y relevamiento de recursos forrajeros', 'Apuntes de cátedra', 'AFO III: herramientas de información geográfica', 2],
    ]],
    ['Organización y sustentabilidad', '⚖️', [
      ['Organización del trabajo en la empresa agropecuaria: metodología del balance de trabajo', 'Álvarez, Arbeletche, Correa, Molina, Pedemonte y Tamosiunas - Manual de Gestión de Empresas Agropecuarias', 'capítulo de balance de trabajo', 2],
      ['Indicadores de sustentabilidad en empresas ganaderas y agrícola-ganaderas', 'Apuntes de cátedra', 'AFO III: indicadores de sustentabilidad', 2],
    ]],
    ['Diagnóstico global de la explotación', '📑', [
      ['Diagnóstico global de la explotación agropecuaria (DGEA): informes contables y análisis FODA', 'Álvarez, Arbeletche, Correa, Molina, Pedemonte y Tamosiunas - Manual de Gestión de Empresas Agropecuarias', 'capítulo de diagnóstico de empresas agropecuarias', 2],
    ]],
    ['Presupuestación y proyección', '📐', [
      ['Presupuestación forrajera', 'Apuntes de cátedra', 'AFO III: presupuestación forrajera', 1],
      ['Proyección del sistema de producción: selección de alternativas y análisis de riesgos', 'Barry, Hopkin y Baker - Riesgo e Incertidumbre', 'material de la cátedra sobre riesgo e incertidumbre', 2],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([semestre, nombreMateria, MODULOS]) => {
  const materia = catalogo[semestre].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en semestre ${semestre} de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias pendientes de Agronomía completadas, ${totalTemas} temas en total.`);
