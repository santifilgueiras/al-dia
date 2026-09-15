// Expande las 13 ultimas materias de FCEA (Contador Público, Economía,
// Administración, Tecnicatura en Administración) con su temario real,
// sacado de las "Fichas de Unidad Curricular" oficiales de
// fcea.udelar.edu.uy. Paráfrasis tipo tabla de contenidos a partir de
// "Explicitar contenido desagregado", nunca copia textual. Con esta tanda
// se completan las 78 materias de FCEA que quedaban pendientes.
const { aplicarMaterias } = require('./_fcea-engine');

const MATERIAS = [
  ['Contabilidad General I', [
    ['Normas contables', '📖', [
      ['Normas contables: concepto, utilidad y normas adecuadas en Uruguay', 'NIIF para las PYMES', 'secciones introductorias', 2],
    ]],
    ['Efectivo y créditos por ventas', '💵', [
      ['Efectivo y equivalentes: sistemas de caja, arqueo y conciliación bancaria', 'NIIF para las PYMES', 'sección 7', 2],
      ['Créditos por ventas: endoso, descuento y provisión por deudores incobrables', 'NIIF para las PYMES', 'sección 11', 2],
    ]],
    ['Inventarios', '📦', [
      ['Inventarios: concepto, costo y tratamiento como gasto', 'NIIF para las PYMES', 'sección 13', 2],
      ['Sistemas de registración del costo de ventas y valuación de inventarios', 'Madruga, Núñez y Varela - Temas Contables', 'capítulo de inventarios', 2],
    ]],
    ['Propiedades, planta y equipo', '🏗️', [
      ['Propiedades, planta y equipo: reconocimiento, costo y depreciación', 'NIIF para las PYMES', 'sección 17', 2],
      ['Valuación posterior, deterioro y baja de PPyE', 'NIIF para las PYMES', 'sección 17', 2],
    ]],
    ['Asiento de apertura y estados financieros', '📑', [
      ['Asiento de apertura: concepto y diferencia con el asiento de inicio de actividades', 'Fowler Newton - Contabilidad Básica', 'capítulos 8 y 9', 2],
      ['Presentación de estados financieros: situación financiera y resultados', 'NIIF para las PYMES', 'secciones 3 y 4', 2],
    ]],
  ]],
  ['Procesos Contables', [
    ['Introducción a la asignatura', '📋', [
      ['Introducción a la asignatura: terminología básica de procesos y entidades', 'Apuntes de cátedra', 'unidad introductoria', 1],
    ]],
    ['Sistema contable y controles', '🔍', [
      ['Impacto del sistema contable, los controles internos y el procesamiento de datos', 'Apuntes de cátedra', 'unidad de sistema contable y controles', 2],
    ]],
    ['Estados financieros y procesos', '📊', [
      ['Estados financieros y los procesos de una entidad: ciclos y tareas preparatorias', 'NIIF para las PYMES', 'sección de estados financieros', 2],
    ]],
    ['Análisis de procesos', '🔬', [
      ['Análisis detallado de los procesos: naturaleza, documentación y necesidades de control', 'Apuntes de cátedra', 'unidad de análisis de procesos', 2],
    ]],
  ]],
  ['Modelos y Sistemas de Costos', [
    ['Teoría general del costo', '💡', [
      ['Introducción a la Teoría General del Costo: proceso generador de valor y factores de producción', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo introductorio', 2],
    ]],
    ['Modelos de costos', '📊', [
      ['Modelos de costos: costeo completo, variable, resultante y eficiente', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo de modelos de costeo', 2],
    ]],
    ['Centros de costos', '🏭', [
      ['Centros de costos: técnicas de asignación y distribución primaria y secundaria', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo de centros de costos', 2],
    ]],
    ['El marco temporal', '📅', [
      ['El marco temporal: presupuesto, costos adjudicados y producción equivalente', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo del marco temporal', 2],
    ]],
    ['Sistemas de costos', '⚙️', [
      ['Sistemas de costos: técnicas relativas a materiales, factor trabajo y otros factores', 'Hansen y Mowen - Administración de Costos: Contabilidad y Control', 'capítulo de sistemas de costos', 2],
    ]],
    ['Producción conjunta y contabilidad de costos', '🔗', [
      ['Producción conjunta y la contabilidad de costos: registración de la producción industrial', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo de producción conjunta', 1],
    ]],
  ]],
  ['Ética y Ejercicio Profesional', [
    ['Ética en la formación y actuación profesional', '⚖️', [
      ['Ética en la formación y actuación del Contador Público: códigos de ética y corrupción', 'Montone, Rodríguez y Villarmarzo - Informes de Contador Público: la Actuación Profesional Vinculada a Estados Contables', 'capítulo de ética profesional', 2],
      ['Aspectos formales de la actuación del Contador Público: responsabilidad profesional', 'Montone, Rodríguez y Villarmarzo - Informes de Contador Público: la Actuación Profesional Vinculada a Estados Contables', 'capítulo de responsabilidad profesional', 2],
    ]],
    ['Campos de acción profesional', '📄', [
      ['Distintos campos de acción: informes y certificaciones', 'Montone, Rodríguez y Villarmarzo - Informes de Contador Público: la Actuación Profesional Vinculada a Estados Contables', 'capítulo de informes y certificaciones', 2],
      ['Arancel profesional y regulación de honorarios profesionales', 'Dotta Bardier - Honorarios de Contadores Públicos en el Uruguay', 'documento del CCEAU', 1],
    ]],
    ['Actuación en situaciones especiales', '🏢', [
      ['La actuación del Contador Público en transferencias de establecimientos y concentración empresarial', 'Montone, Rodríguez y Villarmarzo - Informes de Contador Público: la Actuación Profesional Vinculada a Estados Contables', 'capítulo de transferencias empresariales', 2],
      ['La actuación del Contador en situaciones especiales de sociedades comerciales', 'Montone, Rodríguez y Villarmarzo - Informes de Contador Público: la Actuación Profesional Vinculada a Estados Contables', 'capítulo de situaciones societarias especiales', 1],
    ]],
    ['Resolución de conflictos y seguros', '🤝', [
      ['Métodos no adversariales de resolución de conflictos: mediación y arbitraje', 'Henón Risso - Manual de Conciliación y Mediación', 'capítulo de mediación', 2],
      ['La actuación del Contador Público en los contratos de seguros', 'Montone, Rodríguez y Villarmarzo - Informes de Contador Público: la Actuación Profesional Vinculada a Estados Contables', 'capítulo de contratos de seguros', 1],
    ]],
  ]],
  ['Contabilidad Gerencial', [
    ['Introducción a la contabilidad gerencial', '📊', [
      ['La Contabilidad Gerencial y el rol del Contador y el Licenciado en Administración', 'Amat - El Control de Gestión: una Perspectiva de Dirección', 'capítulo 1', 1],
    ]],
    ['Modelos de costeo y toma de decisiones', '💡', [
      ['Los modelos de costeo y la toma de decisiones: críticas al costeo completo', 'Bimani, Horngren, Datar y Rajan - Management and Cost Accounting', 'capítulo de modelos de costeo para decisiones', 2],
    ]],
    ['Análisis marginal', '📈', [
      ['Análisis marginal: punto de equilibrio, planeamiento de utilidades y restricciones de producción', 'Yardin - El Análisis Marginal: la Mejor Herramienta para Tomar Decisiones sobre Precios y Costos', 'capítulo de análisis marginal', 2],
    ]],
    ['Presupuestación y control', '📋', [
      ['Proceso de planificación, presupuestación y control por resultados', 'Lavolpe, Capasso y Smolje - La Gestión Presupuestaria', 'capítulos 2 y 3', 2],
    ]],
  ]],
  ['Tributaria I', [
    ['Imposición a la renta empresarial', '💰', [
      ['IRAE: hecho generador, sujetos pasivos y elementos cuantificantes', 'Título 4 del Texto Ordenado 2023', 'capítulo del IRAE', 2],
      ['IRAE: exoneraciones y liquidación', 'Título 4 del Texto Ordenado 2023', 'capítulo de exoneraciones y liquidación', 2],
      ['IMEBA como tributo alternativo', 'Título 4 del Texto Ordenado 2023', 'capítulo del IMEBA', 1],
    ]],
    ['Imposición al patrimonio empresarial', '🏢', [
      ['Impuesto al Patrimonio empresarial: hecho generador y elementos cuantificantes', 'Título 14 del Texto Ordenado 2023', 'capítulo del Impuesto al Patrimonio empresarial', 2],
      ['Impuesto al Patrimonio Agropecuario', 'Título 14 del Texto Ordenado 2023', 'capítulo del Impuesto al Patrimonio Agropecuario', 1],
    ]],
  ]],
  ['Microeconomía I', [
    ['Teoría del consumidor y demanda', '🛒', [
      ['Preferencia y utilidad: axiomatización y función de utilidad', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de teoría del consumidor', 2],
      ['Maximización de la utilidad, minimización del gasto y elasticidades', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de demanda del consumidor', 2],
    ]],
    ['Producción y oferta', '🏭', [
      ['Función de producción, rendimientos a escala y funciones de costos', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de producción', 2],
      ['Maximización del beneficio y demanda de factores', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de oferta de la empresa', 1],
    ]],
    ['Formación de precios', '💲', [
      ['Formación de precios en mercados competitivos: equilibrio de corto y largo plazo', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de mercados competitivos', 2],
      ['Formación de precios en mercados monopólicos: discriminación de precios', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de monopolio', 2],
    ]],
    ['Economía comportamental', '🧠', [
      ['Economía comportamental: límites de la racionalidad, heurísticas y sesgos', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo de economía comportamental', 1],
    ]],
  ]],
  ['Macroeconomía II', [
    ['El largo plazo', '📈', [
      ['El largo plazo: acumulación de capital, progreso tecnológico e instituciones', 'Blanchard - Macroeconomía', 'capítulos 11, 12 y 13', 2],
    ]],
    ['La economía abierta', '🌐', [
      ['La economía abierta: tipo de cambio y paridad de tasas de interés', 'Blanchard - Macroeconomía', 'capítulo 17', 2],
      ['El modelo IS-LM de economía abierta y regímenes cambiarios', 'Blanchard - Macroeconomía', 'capítulos 18, 19 y 20', 2],
    ]],
    ['Inflación y política macroeconómica', '💵', [
      ['La inflación: financiación monetaria y teoría de la inflación de costos', 'Gagliardi - Macroeconomía de Economías Abiertas, Tomo II', 'capítulos 16, 17 y 18', 2],
      ['La política fiscal, la deuda y la política monetaria', 'Blanchard - Macroeconomía', 'capítulos 22 y 23', 2],
    ]],
  ]],
  ['Estadística I', [
    ['Métodos descriptivos y probabilidad', '📊', [
      ['Métodos descriptivos univariados: distribuciones de frecuencias y medidas de resumen', 'Peña - Fundamentos de Estadística', 'capítulo de estadística descriptiva', 2],
      ['Probabilidad: experimento aleatorio, sucesos y axiomas de Kolmogoroff', 'Peña - Fundamentos de Estadística', 'capítulo de probabilidad', 2],
    ]],
    ['Probabilidad condicionada y variables aleatorias', '🎲', [
      ['Probabilidad condicionada: teorema de la multiplicidad y teorema de Bayes', 'Peña - Fundamentos de Estadística', 'capítulo de probabilidad condicionada', 2],
      ['Variables aleatorias: función de distribución, discretas y continuas', 'Peña - Fundamentos de Estadística', 'capítulo de variables aleatorias', 2],
    ]],
    ['Características de variables aleatorias', '📐', [
      ['Esperanza, momentos y medidas de dispersión de una variable aleatoria', 'Peña - Fundamentos de Estadística', 'capítulo de características de variables aleatorias', 2],
    ]],
    ['Vectores aleatorios y modelos de probabilidad', '🔢', [
      ['Vectores aleatorios: distribuciones marginales y condicionadas', 'Peña - Fundamentos de Estadística', 'capítulo de vectores aleatorios', 2],
      ['Características de vectores aleatorios: covarianza y correlación', 'Peña - Fundamentos de Estadística', 'capítulo de covarianza y correlación', 1],
      ['Modelos de probabilidad: familias de distribuciones discretas y continuas', 'Peña - Fundamentos de Estadística', 'capítulo de modelos de probabilidad', 2],
    ]],
  ]],
  ['Derecho del Empresario', [
    ['Introducción y el empresario', '👔', [
      ['Introducción al estudio de derecho del empresario: concepto y clasificación', 'Holz y Poziomek (dirs.) - Curso de Derecho Comercial', 'capítulo introductorio', 1],
      ['El empresario: modalidades de actuación y sociedades comerciales', 'Poziomek y Alfaro - Sociedades Comerciales (Incluye SAS)', 'capítulo de tipos societarios', 2],
    ]],
    ['Mercado y bienes', '🏪', [
      ['Actuación del empresario en el mercado: competencia y defensa del consumidor', 'Martínez Blanco - Curso de Derecho de la Competencia Uruguayo', 'capítulo de derecho de la competencia', 2],
      ['Bienes afectados a la actividad empresarial: establecimiento y propiedad industrial', 'Holz y Poziomek (dirs.) - Curso de Derecho Comercial', 'capítulo de bienes empresariales', 2],
    ]],
    ['Transmisión de empresas y contratos', '🤝', [
      ['Transmisión de empresas: compraventa de establecimiento y fusión', 'Holz y Poziomek (dirs.) - Curso de Derecho Comercial', 'capítulo de transmisión de empresas', 2],
      ['Contratos empresariales: compraventa, distribución y contratos bancarios', 'Holz y Poziomek (dirs.) - Curso de Derecho Comercial', 'capítulo de contratos empresariales', 2],
    ]],
    ['Crisis empresariales', '⚠️', [
      ['Regulación de las crisis empresariales: concurso, convenio y liquidación', 'Holz y Rippe - Reorganización Empresarial y Concursos, Ley 18.387', 'capítulo de regulación concursal', 2],
    ]],
  ]],
  ['Marketing Básico', [
    ['Introducción y era digital', '💡', [
      ['Introducción al marketing: conceptos básicos y evolución del concepto', 'Kotler - Mercadotecnia', 'capítulo introductorio', 2],
      ['Marketing en la era digital: relaciones B2C, B2B y comercio online', 'Kotler, Kartajaya y Setiawan - Marketing 4.0', 'capítulo de marketing digital', 1],
    ]],
    ['Entorno y consumidor', '🌐', [
      ['El entorno de la empresa: microambiente y macroambiente', 'Kotler - Mercadotecnia', 'capítulo del entorno de la empresa', 2],
      ['Comportamiento del consumidor: proceso de decisión de compra', 'Kotler - Mercadotecnia', 'capítulo de comportamiento del consumidor', 2],
    ]],
    ['Mercado y segmentación', '🎯', [
      ['Mercado y demanda: medición y pronóstico de la demanda', 'Kotler - Mercadotecnia', 'capítulo de medición de la demanda', 2],
      ['Segmentación de mercados y posicionamiento', 'Ries y Trout - Posicionamiento', 'capítulo de posicionamiento', 2],
      ['Investigación de mercados y sistemas de información de marketing', 'Kotler - Mercadotecnia', 'capítulo de investigación de mercados', 1],
    ]],
    ['Las 4 P del marketing', '🧩', [
      ['Producto: clasificación, marca y ciclo de vida', 'Kotler - Mercadotecnia', 'capítulo de producto', 2],
      ['Precio: fijación de precios y estrategias', 'Kotler - Mercadotecnia', 'capítulo de precio', 2],
      ['Distribución: canales, comercio detallista y mayorista', 'Kotler - Mercadotecnia', 'capítulo de distribución', 1],
      ['Comunicación: publicidad, promoción de ventas y fuerza de ventas', 'Kotler - Mercadotecnia', 'capítulo de comunicación', 2],
    ]],
  ]],
  ['Costos para la Gestión', [
    ['Teoría general del costo', '💡', [
      ['Introducción a la Teoría General del Costo: proceso generador de valor y factores de producción', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo introductorio', 2],
    ]],
    ['Modelos de costos', '📊', [
      ['Modelos de costos: costeo completo, variable, resultante y estándar', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'capítulo de modelos de costeo', 2],
    ]],
    ['Sistemas de costos', '⚙️', [
      ['Sistemas de costos: costo estándar, por procesos, por órdenes y ABC', 'Hansen y Mowen - Administración de Costos: Contabilidad y Control', 'capítulo de sistemas de costos', 2],
    ]],
    ['Herramientas para la mejora operacional', '🛠️', [
      ['Gestión del costo de actividades, indicadores y cuadro de mando integral', 'Hansen y Mowen - Administración de Costos: Contabilidad y Control', 'capítulo de herramientas de gestión', 2],
    ]],
  ]],
  ['Marketing Estratégico', [
    ['Introducción y comportamiento del comprador', '🧭', [
      ['Introducción: funciones del marketing en la empresa y en la economía', 'Lambin - Marketing Estratégico', 'capítulo introductorio', 1],
      ['Los comportamientos de respuesta del comprador: cognitiva, afectiva y comportamental', 'Lambin - Marketing Estratégico', 'capítulo de comportamiento del comprador', 2],
    ]],
    ['Atractivo del mercado', '📊', [
      ['Atractivo del mercado: demanda global, ciclo de vida y previsión de la demanda', 'Lambin - Marketing Estratégico', 'capítulo de atractivo del mercado', 2],
    ]],
    ['Análisis de la competitividad', '⚔️', [
      ['Análisis de la competitividad: ventaja competitiva y rivalidad ampliada', 'Lambin - Marketing Estratégico', 'capítulo de análisis de la competitividad', 2],
      ['La ventaja en costos y el efecto de experiencia', 'Lambin - Marketing Estratégico', 'capítulo del efecto de experiencia', 1],
    ]],
    ['Estrategias de desarrollo', '🚀', [
      ['Análisis de la cartera de negocios: matriz BCG y matriz atractivo-competitividad', 'Lambin - Marketing Estratégico', 'capítulo de análisis de cartera', 2],
      ['Estrategias de desarrollo y estrategias competitivas', 'Lambin - Marketing Estratégico', 'capítulo de estrategias competitivas', 2],
    ]],
    ['Modelos de negocio', '🧩', [
      ['Modelos de negocio: tipos, patrones y evaluación', 'Osterwalder y Pigneur - Generación de Modelos de Negocios', 'capítulo de modelos de negocio', 2],
    ]],
    ['El plan de marketing', '📋', [
      ['El plan de marketing: estructura, auditoría estratégica y análisis de riesgo', 'Abell y Hammond - Planeación Estratégica de Mercado', 'capítulo del plan de marketing', 2],
    ]],
  ]],
];

aplicarMaterias(MATERIAS);
