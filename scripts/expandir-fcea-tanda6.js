// Expande las ultimas 9 materias de FCEA (Contador Público, Economía,
// Administración, Tecnicatura en Administración) con su temario real,
// sacado de las "Fichas de Unidad Curricular" oficiales de
// fcea.udelar.edu.uy. Paráfrasis tipo tabla de contenidos a partir de
// "Explicitar contenido desagregado", nunca copia textual.
const { aplicarMaterias } = require('./_fcea-engine');

const MATERIAS = [
  ['Informes Profesionales del Contador Público', [
    ['Aspectos generales de los informes profesionales', '📋', [
      ['Tipos de informes profesionales y normativa de referencia: NIAs y pronunciamientos del Colegio de Contadores', 'Pronunciamientos del Colegio de Contadores del Uruguay', 'informes profesionales', 2],
      ['Responsabilidad profesional del auditor: el fraude (NIA 240) y la prevención del lavado de activos', 'Normas Internacionales de Auditoría (IFAC)', 'NIA 240', 2],
    ]],
    ['Informe de auditoría y de revisión limitada', '🔍', [
      ['Informe de auditoría: tipos de opinión, texto del dictamen y cuestiones clave de auditoría', 'Normas Internacionales de Auditoría (IFAC)', 'informe del auditor', 2],
      ['Informe de revisión limitada: contenido, procedimientos y modelos de informe', 'Normas Internacionales de Auditoría (IFAC)', 'normas de encargos de revisión', 2],
    ]],
    ['Compilación, certificación y atestiguamiento', '📝', [
      ['Informes de compilación y de certificación contable: normativa y modelos', 'Normas Internacionales de Auditoría (IFAC)', 'normas de servicios relacionados', 2],
      ['NITA 3000: informes para atestiguar sobre información histórica y el informe PLAFT-BCU', 'Normas Internacionales de Auditoría (IFAC)', 'NITA 3000', 2],
      ['NITA 3400: auditoría de proyecciones financieras, objetivos y procedimientos básicos', 'Normas Internacionales de Auditoría (IFAC)', 'NITA 3400', 2],
    ]],
    ['Procedimientos acordados, due diligence y sostenibilidad', '📑', [
      ['Informe sobre procedimientos previamente acordados: contenido y modelos', 'Fowler Newton - Tratado de Auditoría', 'informes especiales', 2],
      ['Informe de due diligence: concepto, objetivo y alcance', 'Fowler Newton - Tratado de Auditoría', 'due diligence', 2],
      ['Informes solicitados por el BCU e introducción a los informes sobre reportes de sostenibilidad', 'Fowler Newton - Tratado de Auditoría', 'informes a organismos de contralor', 1],
    ]],
  ]],
  ['Contabilidad en Sistemas Integrados de Gestión/ERP', [
    ['Introducción a las TIC y los sistemas de información', '💻', [
      ['Teoría de sistemas y tecnologías de la información: tipos de sistemas y evolución hacia el SIG/ERP', 'Ray - Enterprise Resource Planning', 'introducción a los ERP', 2],
      ['Competencias y conocimientos en TIC exigidos al contador según las Normas Internacionales de Educación', 'Material elaborado por la Unidad Curricular', 'competencias en TIC', 1],
    ]],
    ['Sistemas integrados de gestión (SIG/ERP)', '🖥️', [
      ['Opciones de SIG/ERP, componentes, módulos de contabilidad y de gestión y su ciclo de vida', 'Ray - Enterprise Resource Planning', 'componentes y módulos', 2],
      ['Especificación de requerimientos, contratación e implementación de un SIG', 'Bradford - Modern ERP: Select, Implement, and Use Today\'s Advanced Business Systems', 'implementación', 2],
    ]],
    ['Tratamiento contable en el ERP', '📊', [
      ['Entrada de mercadería y recepción de facturas, contabilidad en moneda extranjera y diferencia de cambio', 'Material elaborado por la Unidad Curricular', 'tratamiento contable de casos', 2],
      ['Gestión de stocks, partidas abiertas, devengamientos y presentación de estados contables', 'Material elaborado por la Unidad Curricular', 'tratamiento contable de casos', 2],
    ]],
    ['Integración de sistemas', '🔗', [
      ['Webservices, facturación electrónica y XBRL: impacto en la contabilidad y el control de gestión', 'Ray - Enterprise Resource Planning', 'integración de sistemas', 2],
    ]],
  ]],
  ['Prospectiva Estratégica: Con la Mirada en el Futuro', [
    ['Introducción a la prospectiva', '🔮', [
      ['La prospectiva como herramienta de planificación estratégica: escuelas y enfoques de análisis', 'Medina y Ocampo - Manual de Prospectiva y Decisión Estratégica (ILPES-CEPAL)', 'introducción', 2],
    ]],
    ['Metodología de la prospectiva', '🧭', [
      ['Procesos y etapas de la prospectiva: exploración, análisis y anticipación', 'Medina y Ocampo - Manual de Prospectiva y Decisión Estratégica (ILPES-CEPAL)', 'metodología', 2],
      ['Métodos de prospectiva: clasificación y utilidad de los enfoques cualitativos, cuantitativos y semicuantitativos', 'Beinstein - Manual de Prospectiva', 'métodos', 2],
    ]],
    ['Aplicaciones a Uruguay y la región', '🌎', [
      ['Hacia una estrategia nacional de desarrollo: visión sectorial y prospectiva territorial', 'OPP - Introducción a la Prospectiva: Síntesis Metodológica', 'aplicaciones a Uruguay', 2],
    ]],
    ['Ejercicio práctico de prospectiva', '🛠️', [
      ['Diseño de un ejercicio prospectivo: focalizar, diseñar, implementar, analizar y diseminar hipótesis', 'Medina y Ocampo - Manual de Prospectiva y Decisión Estratégica (ILPES-CEPAL)', 'ejercicio práctico', 2],
    ]],
  ]],
  ['EFI: Costos para la Gestión de Emprendimientos Sociales y Comunitarios', [
    ['Extensión universitaria e integralidad', '🤝', [
      ['La extensión universitaria y los Espacios de Formación Integral en la Segunda Reforma Universitaria', 'Arocena - Curricularización de la Extensión: ¿Por Qué, Cuál, Cómo?', 'extensión e integralidad', 2],
    ]],
    ['Información operativa y contable del emprendimiento', '📈', [
      ['Caracterización del proceso productivo e indicadores de productividad y gestión operativa', 'Horngren, Foster y Datar - Contabilidad de Costos: un Enfoque Gerencial', 'indicadores de gestión', 2],
      ['Instrumentos de costos: estados contables, flujo de caja, presupuestos y análisis marginal', 'Hansen y Mowen - Administración de Costos: Contabilidad y Control', 'costos para la toma de decisiones', 2],
    ]],
    ['Trabajo de campo con la contraparte', '🌱', [
      ['Acompañamiento a emprendimientos sociales y predios rurales en costos y control de gestión', 'Material del curso de Modelos y Sistemas de Costos y Contabilidad Gerencial', 'trabajo de campo', 2],
    ]],
  ]],
  ['Taller de Gestión de Cargos y Remuneraciones', [
    ['Gestión de cargos', '🗂️', [
      ['Conceptos básicos de tarea, cargo y grupo: clasificación y diseño de cargos', 'Chiavenato - Gestión del Talento Humano', 'diseño de cargos', 2],
      ['Análisis, descripción y especificación de cargos clásica y por competencias', 'Dessler - Administración de Personal', 'análisis y descripción de cargos', 2],
      ['Evaluación de cargos: métodos y asignación por puntos', 'Dessler - Administración de Personal', 'evaluación de cargos', 2],
    ]],
    ['Sistema de remuneraciones', '💰', [
      ['Escala y bandas salariales: nube de puntos e intervalos de valoración', 'Chiavenato - Gestión del Talento Humano', 'sistema de remuneraciones', 2],
      ['Incentivos salariales y beneficios sociales', 'Chiavenato - Gestión del Talento Humano', 'incentivos y beneficios', 2],
      ['Política de remuneraciones: investigación salarial, equidad interna y competitividad externa', 'Dessler - Administración de Personal', 'política de remuneraciones', 2],
    ]],
  ]],
  ['Derecho y Actividad Empresarial II', [
    ['Sociedades comerciales', '🏢', [
      ['Tipos sociales (SRL, SA y SAS) y sociedades familiares: funcionamiento orgánico y transferencia de participaciones', 'Poziomek y Alfaro Borges - Nociones de Derecho Comercial', 'sociedades comerciales', 2],
      ['Reorganización societaria: fusión, escisión y aumentos de capital con series de acciones', 'Poziomek y Alfaro Borges - Sociedades Comerciales', 'reorganización societaria', 2],
      ['Concentración empresarial: participación, control societario y grupos de empresas', 'Poziomek y Alfaro Borges - Sociedades Comerciales', 'concentración empresarial', 2],
    ]],
    ['Contratación moderna y concursos', '⚖️', [
      ['Particularidades de la contratación electrónica en la contratación moderna', 'Bugallo - Manual Básico de Derecho de Empresa', 'contratación moderna', 1],
      ['Procedimiento concursal: presupuestos, órganos, síndico e interventor y acuerdos entre deudor y acreedores', 'Rodríguez Mascardi - Cuadernos de Derecho Concursal', 'procedimiento concursal', 2],
    ]],
  ]],
  ['Finanzas Corporativas', [
    ['Introducción a las finanzas corporativas', '💹', [
      ['Objetivos y alcance de las finanzas: la función financiera en la empresa y su relación con los mercados', 'Pascale - Decisiones Financieras', 'la función financiera', 2],
      ['Elementos de valuación: criterios de valuación y el modelo de flujos de fondos', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'valuación', 2],
    ]],
    ['Decisiones de inversión y riesgo', '📉', [
      ['Criterios de análisis de decisiones de inversión: flujos de fondos, tasa de descuento e inflación', 'Pascale - Decisiones Financieras', 'decisiones de inversión', 2],
      ['Riesgo y rendimiento: teoría del portafolio, diversificación y Capital Asset Pricing Model', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'riesgo y rendimiento', 2],
    ]],
    ['Decisiones de financiamiento y estructura financiera', '🏦', [
      ['Efecto leverage y determinación del costo de los fondos propios y prestados', 'Pascale - Decisiones Financieras', 'decisiones de financiamiento', 2],
      ['Teoría de Modigliani y Miller y modelos de financiamiento de la empresa', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'estructura financiera', 2],
    ]],
    ['Finanzas de corto plazo e instrumentos derivados', '📐', [
      ['Capital de trabajo, liquidez y gestión de activos y pasivos corrientes', 'Pascale - Decisiones Financieras', 'finanzas de corto plazo', 2],
      ['Instrumentos financieros derivados: opciones, futuros y gestión de riesgos', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'instrumentos derivados', 2],
    ]],
  ]],
  ['EFI: Contabilidad en las Escuelas', [
    ['Extensión y gestión financiera del Estado', '🏫', [
      ['La extensión universitaria en el marco de la Segunda Reforma Universitaria y los Espacios de Formación Integral', 'Arocena - Curricularización de la Extensión: ¿Por Qué, Cuál, Cómo?', 'extensión universitaria', 2],
      ['El sector público uruguayo: presupuesto público y etapas del proceso del gasto', 'Apuntes de cátedra', 'gestión financiera del Estado', 2],
    ]],
    ['Rendiciones de cuentas en el DGEIP', '🧾', [
      ['Responsabilidades de los obligados a rendir cuentas según el TOCAF y la normativa del DGEIP', 'ANEP - CEIP - Reglamento de Comisiones de Fomento', 'rendición de cuentas', 2],
      ['Hechos económicos de la Comisión de Fomento: cobro de partidas, comprobantes y requisitos de los comprobantes', 'ANEP - CEIP - Reglamento de Comisiones de Fomento', 'hechos económicos', 2],
      ['Registración en el Libro de Caja y Banco y controles con el Libro de Comprobantes', 'ANEP - CEIP - Reglamento de Comisiones de Fomento', 'registración', 2],
    ]],
    ['Liquidación de sueldos, RUPE y Libro de Caja Digital', '💻', [
      ['Liquidación de sueldos: aportes patronales y personales y tasas de FONASA', 'Apuntes de cátedra', 'liquidación de sueldos', 2],
      ['RUPE: normativa, funcionamiento general y estados de los proveedores', 'Apuntes de cátedra', 'RUPE', 1],
      ['Libro de Caja Digital de la DGEIP: aspectos normativos y principales funcionalidades', 'Apuntes de cátedra', 'Libro de Caja Digital', 1],
    ]],
  ]],
  ['Economía de América Latina', [
    ['Perspectivas de largo plazo', '📜', [
      ['Modelos de desarrollo en América Latina: de la herencia colonial al boom de los commodities', 'Bértola y Ocampo - El Desarrollo Económico de América Latina desde la Independencia', 'modelos de desarrollo', 2],
      ['Desarrollo humano, niveles de vida y desigualdad en el largo plazo', 'Bértola y Williamson - Has Latin American Inequality Changed Direction?', 'desigualdad de largo plazo', 2],
    ]],
    ['Estructura productiva y dinámica económica', '🏭', [
      ['Cambio estructural y especialización productiva: estructura sectorial y diversificación', 'Barletta y Yoguel - Manufactura y Cambio Estructural', 'cambio estructural', 2],
      ['La interpretación neoestructuralista y los desafíos ambientales de la especialización productiva', 'Cimoli y Porcile - Tecnología, Heterogeneidad y Crecimiento', 'neoestructuralismo', 2],
    ]],
    ['Desigualdades en América Latina', '⚖️', [
      ['Tendencias de largo plazo y cambios recientes: pobreza y concentración del ingreso', 'Amarante, Lustig y Vigorito - El Desafío de la Desigualdad de Ingresos en América Latina', 'pobreza y concentración del ingreso', 2],
      ['Desigualdad de género y entre generaciones en la región', 'Berniell, Fernández y Krutikova - Gender Inequality in Latin America', 'género y generaciones', 2],
    ]],
    ['Instituciones y economía política', '🏛️', [
      ['Interpretaciones sobre la economía política de América Latina: la interpretación dependentista', 'Bértola - Patrones de Desarrollo y Estados de Bienestar en América Latina', 'economía política', 2],
      ['Grupos de poder, estructura productiva y desigualdad: el debate sobre las estrategias de rent-seeking', 'Doner y Schneider - The Middle-Income Trap: More Politics than Economics', 'rent-seeking e instituciones', 2],
    ]],
  ]],
];

aplicarMaterias(MATERIAS);
