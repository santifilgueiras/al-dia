// Reemplaza los placeholders de las 6 materias obligatorias de 3er año de
// Agronomía (Fisiología Vegetal, Microbiología General, Estadística I,
// Agrometeorología, Edafología, Teoría Económica) por su temario real,
// sacado de los "Formularios de Propuesta de Unidades Curriculares"
// oficiales aprobados por el Consejo de la Facultad
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
  ['Fisiología Vegetal', [
    ['Relaciones hídricas y nutrición mineral', '💧', [
      ['Relaciones hídricas: potencial hídrico, absorción, transpiración y estrés hídrico', 'Azcón-Bieto y Talón - Fundamentos de Fisiología Vegetal', 'capítulo de relaciones hídricas', 2],
      ['Nutrición mineral: macro y micronutrientes, mecanismos de incorporación y transporte de iones', 'Azcón-Bieto y Talón - Fundamentos de Fisiología Vegetal', 'capítulo de nutrición mineral', 2],
    ]],
    ['Fotosíntesis y transporte de fotoasimilados', '🌞', [
      ['Asimilación del carbono: fases de la fotosíntesis y metabolismo C3, C4 y CAM', 'Taiz y Zeiger - Plant Physiology', 'capítulo de fotosíntesis', 2],
      ['Translocación de fotoasimilados: transporte floemático y partición fuente-fosa', 'Azcón-Bieto y Talón - Fundamentos de Fisiología Vegetal', 'capítulo de transporte floemático', 2],
    ]],
    ['Regulación del desarrollo vegetal', '🌱', [
      ['Fitohormonas: biosíntesis, transporte y modo de acción', 'Taiz y Zeiger - Plant Physiology', 'capítulo de hormonas vegetales', 2],
      ['Regulación del desarrollo vegetal por factores externos: luz y temperatura', 'Taiz y Zeiger - Plant Physiology', 'capítulo de fotomorfogénesis y fotoperiodismo', 2],
    ]],
    ['Reproducción y semillas', '🌾', [
      ['Floración, fructificación y senescencia', 'Azcón-Bieto y Talón - Fundamentos de Fisiología Vegetal', 'capítulo de desarrollo reproductivo', 2],
      ['Fisiología de semillas: maduración, germinación y dormición', 'Azcón-Bieto y Talón - Fundamentos de Fisiología Vegetal', 'capítulo de fisiología de semillas', 2],
    ]],
  ]],
  ['Microbiología General (Agronomía)', [
    ['Fundamentos de microbiología', '🦠', [
      ['Introducción a la microbiología: dominios Archaea, Bacteria y Eukarya, hongos y virus', 'Madigan et al. - Biología de los Microorganismos', 'capítulo introductorio de microbiología', 1],
      ['Nutrición y metabolismo microbiano: respiración, fermentación y fotosíntesis', 'Madigan et al. - Biología de los Microorganismos', 'capítulo de metabolismo microbiano', 2],
      ['Crecimiento microbiano: cultivo, esterilización y métodos de evaluación', 'Madigan et al. - Biología de los Microorganismos', 'capítulo de crecimiento microbiano', 2],
    ]],
    ['Genética e identificación de microorganismos', '🧫', [
      ['Genética bacteriana: plásmidos, fagos y transferencia horizontal de genes', 'Madigan et al. - Biología de los Microorganismos', 'capítulo de genética microbiana', 1],
      ['Identificación de microorganismos: caracteres morfológicos, bioquímicos y moleculares', 'Prescott, Harley y Klein - Microbiología', 'capítulo de identificación de microorganismos', 2],
    ]],
    ['Microorganismos en sistemas agropecuarios', '🌍', [
      ['Interacciones entre microorganismos y control biológico de fitopatógenos', 'Madigan et al. - Biología de los Microorganismos', 'capítulo de interacciones microbianas', 1],
      ['El suelo como ambiente: rizósfera y ciclos biogeoquímicos', 'Madigan et al. - Biología de los Microorganismos', 'capítulo de microbiología del suelo', 2],
      ['Interacciones microorganismo-planta: fijación biológica de nitrógeno y micorrizas', 'Madigan et al. - Biología de los Microorganismos', 'capítulo de simbiosis planta-microorganismo', 2],
      ['Microbiología de otros ambientes agropecuarios: rumen, silo, compost y efluentes', 'Prescott, Harley y Klein - Microbiología', 'capítulo de microbiología aplicada', 1],
    ]],
  ]],
  ['Estadística I: Probabilidad e Inferencia (Agronomía)', [
    ['Estadística descriptiva y probabilidad', '📊', [
      ['Estadística descriptiva e introducción a la inferencia: población, muestra y estimador', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de estadística descriptiva', 2],
      ['Nociones elementales de probabilidad: experimento aleatorio y axiomas de probabilidad', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de probabilidad', 2],
    ]],
    ['Variables aleatorias y modelos de probabilidad', '🎲', [
      ['Variables aleatorias: funciones de distribución y densidad, momentos, esperanza y varianza', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de variables aleatorias', 2],
      ['Modelos teóricos de probabilidad: variables discretas y continuas', 'Steel y Torrie - Bioestadística: Principios y Procedimientos', 'capítulo de distribuciones de probabilidad', 2],
    ]],
    ['Muestreo e inferencia estadística', '📈', [
      ['Muestreo de una población infinita: distribución de la media y la varianza muestrales', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de muestreo', 2],
      ['Estimación puntual y por intervalo de confianza', 'Di Rienzo et al. - Estadística para las Ciencias Agropecuarias', 'capítulo de estimación', 2],
      ['Prueba de hipótesis: errores tipo I y II, hipótesis sobre medias y proporciones', 'Steel y Torrie - Bioestadística: Principios y Procedimientos', 'capítulo de prueba de hipótesis', 2],
    ]],
  ]],
  ['Agrometeorología', [
    ['Sistema climático y radiación', '☀️', [
      ['Sistema climático: tiempo, clima y clasificaciones climáticas globales', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de sistema climático', 1],
      ['Radiación solar y balance de energía', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de radiación y balance de energía', 2],
    ]],
    ['Temperatura', '🌡️', [
      ['Temperatura del suelo: régimen térmico diario y estacional', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de temperatura del suelo', 1],
      ['Temperatura del aire: evolución e indicadores climáticos en Uruguay', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de temperatura del aire', 2],
      ['Heladas: factores, régimen agroclimático y métodos de control', 'Burgos - Las Heladas en la República Argentina', 'capítulo de heladas agrometeorológicas', 2],
    ]],
    ['Fenología y circulación atmosférica', '🌬️', [
      ['Fenología: índices agrometeorológicos y efectos del cambio climático', 'De Fina y Ravelo - Climatología y Fenología Agrícolas', 'capítulo de fenología', 1],
      ['Circulación general de la atmósfera: masas de aire y tipos de frentes', 'Barry y Chorley - Atmósfera, Tiempo y Clima', 'capítulo de circulación atmosférica', 1],
      ['Cambio climático y sus efectos en la temperatura del aire', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de cambio climático', 1],
    ]],
    ['Ciclo hidrológico y balance hídrico', '💧', [
      ['Ciclo hidrológico y régimen de precipitaciones de Uruguay', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de ciclo hidrológico', 2],
      ['Relaciones hídricas suelo-planta-atmósfera: evapotranspiración y balance hídrico', 'Allen, Pereira, Raes y Smith - Evapotranspiración del Cultivo (FAO Riego y Drenaje 56)', 'guía de evapotranspiración de referencia', 2],
      ['Aplicaciones del balance hídrico: sequías agronómicas y evapotranspiración de cultivos', 'Allen, Pereira, Raes y Smith - Evapotranspiración del Cultivo (FAO Riego y Drenaje 56)', 'guía de requerimientos de agua de los cultivos', 2],
    ]],
    ['Aplicaciones agropecuarias del clima', '🐄', [
      ['Influencia del clima en la adaptación y producción animal: estrés térmico', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de clima y producción animal', 1],
      ['Aspectos agrometeorológicos del control de plagas y enfermedades', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de agrometeorología fitosanitaria', 1],
      ['Viento y barreras protectoras', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de viento y barreras protectoras', 1],
      ['Sustentabilidad, variabilidad y cambio climático en sistemas agropecuarios', 'Elías Castillo y Castellví Sentis - Agrometeorología', 'capítulo de sustentabilidad y cambio climático', 1],
    ]],
  ]],
  ['Edafología', [
    ['Morfología y componentes del suelo', '🟤', [
      ['Morfología del suelo: fases sólida, líquida y gaseosa, horizontes y perfil', 'Durán - Los Suelos del Uruguay', 'capítulo de morfología del suelo', 2],
      ['Componentes minerales, materia orgánica y biota del suelo', 'Durán - Los Suelos del Uruguay', 'capítulo de composición del suelo', 2],
    ]],
    ['Propiedades del suelo', '🧪', [
      ['Propiedades fisicoquímicas: intercambio catiónico, pH, salinidad y potencial redox', 'García Préchac y Durán - Suelos del Uruguay, Tomo I', 'capítulo de propiedades fisicoquímicas', 2],
      ['Propiedades físicas: textura, estructura, densidad, consistencia y color', 'García Préchac y Durán - Suelos del Uruguay, Tomo I', 'capítulo de propiedades físicas', 2],
      ['Propiedades hídricas: retención, potencial y movimiento del agua en el suelo', 'García Préchac y Durán - Suelos del Uruguay, Tomo I', 'capítulo de propiedades hídricas', 2],
    ]],
    ['Génesis, taxonomía y capacidad de uso', '🗂️', [
      ['Factores y procesos de formación del suelo', 'Durán - Los Suelos del Uruguay', 'capítulo de génesis del suelo', 2],
      ['Taxonomía de suelos: horizontes diagnósticos y órdenes de suelos del Uruguay', 'García Préchac y Durán - Suelos del Uruguay, Tomo II', 'capítulo de taxonomía de suelos', 2],
      ['Capacidad de uso, degradación, erosión e índices CONEAT', 'Altamirano - Carta de Reconocimiento de Suelos del Uruguay, Tomo I', 'capítulo de capacidad de uso e índices CONEAT', 2],
    ]],
  ]],
  ['Teoría Económica', [
    ['Microeconomía: mercado y producción', '📉', [
      ['Oferta y demanda: equilibrio de mercado y sus desplazamientos', 'Varian - Microeconomía Intermedia', 'capítulo de oferta y demanda', 1],
      ['Teoría de la firma: producción, costos y optimización', 'Varian - Microeconomía Intermedia', 'capítulo de teoría de la firma', 2],
    ]],
    ['Consumidor y estructuras de mercado', '🛒', [
      ['Teoría del consumidor: preferencias, restricción presupuestaria y elasticidades', 'Nicholson - Microeconomía Intermedia y sus Aplicaciones', 'capítulo de teoría del consumidor', 2],
      ['Estructuras de mercado: monopolio, oligopolio y competencia monopolística', 'Varian - Microeconomía Intermedia', 'capítulo de estructuras de mercado', 2],
      ['Riesgo e incertidumbre en la toma de decisiones', 'Varian - Microeconomía Intermedia', 'capítulo de riesgo e incertidumbre', 1],
    ]],
    ['Economía ambiental y de los recursos naturales', '🌳', [
      ['Externalidades, bienes públicos y derechos de propiedad ambiental', 'Tietenberg y Lewis - Environmental & Natural Resource Economics', 'capítulo de externalidades y bienes públicos', 2],
      ['Uso múltiple de la tierra y el agua como recursos naturales', 'Tietenberg y Lewis - Environmental & Natural Resource Economics', 'capítulo de recursos naturales renovables', 2],
    ]],
    ['Macroeconomía aplicada', '🏦', [
      ['Contabilidad nacional, balanza de pagos e inflación en Uruguay', 'Blanchard - Macroeconomía', 'capítulo de contabilidad nacional', 2],
      ['El modelo IS-LM: equilibrio en los mercados de bienes y financiero', 'Blanchard - Macroeconomía', 'capítulo del modelo IS-LM', 2],
    ]],
  ]],
];

let totalMateriasActualizadas = 0;
let totalTemas = 0;

MATERIAS.forEach(([nombreMateria, MODULOS]) => {
  const materia = catalogo['3'].find(m => m.nombre === nombreMateria);
  if (!materia) throw new Error(`No se encontró "${nombreMateria}" en año 3 de Agronomía`);

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

console.log(`${totalMateriasActualizadas} materias de 3er año de Agronomía actualizadas, ${totalTemas} temas en total.`);
