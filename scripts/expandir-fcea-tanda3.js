// Expande 13 materias de FCEA (Economía, Administración, Tecnicatura en
// Administración) con su temario real, sacado de las "Fichas de Unidad
// Curricular" oficiales de fcea.udelar.edu.uy. Paráfrasis tipo tabla de
// contenidos a partir de "Explicitar contenido desagregado", nunca copia
// textual.
const { aplicarMaterias } = require('./_fcea-engine');

const MATERIAS = [
  ['Econometría II', [
    ['Series de tiempo estacionarias', '📈', [
      ['Introducción al análisis de series de tiempo: fundamentos estadísticos y modelos dinámicos', 'Hamilton - Time Series Analysis', 'capítulo introductorio', 2],
      ['Análisis de series de tiempo estacionarias: FAC, FACP y modelos ARMA', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulos de procesos estocásticos estacionarios', 2],
    ]],
    ['Series de tiempo no estacionarias y predicción', '📉', [
      ['Modelización de series no estacionarias: raíces unitarias y modelos ARIMA', 'Peña - Análisis de Series Temporales', 'capítulos 3, 4 y 5', 2],
      ['Predicción con modelos univariantes de series de tiempo', 'Peña - Análisis de Series Temporales', 'capítulo 7', 2],
      ['Análisis de intervención y acontecimientos atípicos', 'Peña - Análisis de Series Temporales', 'capítulo 8', 1],
    ]],
    ['Modelos multivariantes y cointegración', '🔗', [
      ['Modelos multivariantes con series estacionarias: causalidad de Granger y modelos VAR', 'Peña - Análisis de Series Temporales', 'capítulo 11', 2],
      ['Raíces unitarias y cointegración: el enfoque de Engle y Granger', 'Hamilton - Time Series Analysis', 'capítulo de cointegración', 2],
    ]],
    ['Modelos avanzados', '🧮', [
      ['Modelos de variable dependiente limitada: Tobit y Heckman', 'Wooldridge - Introducción a la Econometría: un Enfoque Moderno', 'capítulo 17', 2],
      ['Método de los Momentos y Método Generalizado de los Momentos', 'Hansen - Econometrics', 'capítulo 13', 2],
      ['Modelos lineales para datos de panel', 'Wooldridge - Introducción a la Econometría: un Enfoque Moderno', 'capítulos 13 y 14', 2],
    ]],
  ]],
  ['Historia del Pensamiento Económico', [
    ['Introducción y economía política clásica', '📜', [
      ['Panorama de la historia del pensamiento económico', 'Backhouse - The Penguin History of Economics', 'capítulo introductorio', 1],
      ['Adam Smith y el nacimiento de la economía política clásica', 'Barber - Historia del Pensamiento Económico', 'capítulo de Adam Smith', 2],
      ['Economía clásica: Ricardo, Malthus y John Stuart Mill', 'Barber - Historia del Pensamiento Económico', 'capítulo de la escuela clásica', 2],
    ]],
    ['Marxismo y revolución marginalista', '⚙️', [
      ['Fundamentos de la economía política: el marxismo', 'Sweezy - Teoría del Desarrollo Capitalista', 'capítulo del marxismo', 2],
      ['La revolución marginalista: Jevons, Walras, Menger y Marshall', 'Screpanti y Zamagni - Panorama de la Historia del Pensamiento Económico', 'capítulo de la revolución marginalista', 2],
    ]],
    ['Primera mitad del siglo XX', '🏛️', [
      ['Escuela austríaca y nacimiento de la econometría', 'Ekelund y Hébert - Historia de la Teoría Económica y de su Método', 'capítulo 17', 1],
      ['Keynes y el nacimiento de la macroeconomía', 'Snowdon y Vane - Modern Macroeconomics: its Origins, Development and Current State', 'capítulo de Keynes', 2],
    ]],
    ['Síntesis y debates contemporáneos', '🔬', [
      ['La síntesis neoclásico-keynesiana y la crisis del keynesianismo', 'Landreth y Colander - Historia del Pensamiento Económico', 'capítulo de la síntesis neoclásica', 2],
      ['De Kuhn a la injusticia epistémica: paradigmas y metodología económica', 'Blaug - La Metodología de la Economía', 'capítulo de metodología', 2],
      ['Desarrollos recientes: economía comportamental y la revolución de la credibilidad', 'Backhouse y Cherrier - The Age of the Applied Economist', 'artículo en History of Political Economy', 1],
    ]],
  ]],
  ['Administración y Gestión de las Organizaciones II', [
    ['Profundización de funciones gerenciales', '🏢', [
      ['Función gerencial y sus límites: ambiente y cultura', 'Daft - Teoría y Diseño Organizacional', 'capítulo de la función gerencial', 2],
      ['Flujos y configuraciones organizacionales (Mintzberg)', 'Daft - Teoría y Diseño Organizacional', 'capítulo de configuraciones estructurales', 2],
      ['Estrategia, proceso estratégico y planificación estratégica', 'Thompson y Strickland - Administración Estratégica', 'capítulo de proceso estratégico', 2],
      ['Implementación de la estrategia', 'Thompson y Strickland - Administración Estratégica', 'capítulo de implementación estratégica', 1],
      ['Toma de decisiones gerenciales', 'Daft - Teoría y Diseño Organizacional', 'capítulo de toma de decisiones', 1],
    ]],
    ['Administración de organizaciones particulares', '🏭', [
      ['Administración de micro, pequeñas y medianas empresas', 'Longenecker et al. - Administración de Pequeñas Empresas', 'capítulo de PYMEs', 2],
      ['Administración de empresas familiares', 'Gersick, Davis, Hampton y Lansberg - Empresas Familiares, Generación a Generación', 'capítulo de empresas familiares', 2],
      ['Administración de cooperativas', 'Dávila et al. - Éxito e Innovación en la Gestión: las Cooperativas como Agentes del Desarrollo Local', 'artículo sobre cooperativas', 1],
      ['Administración de asociaciones sin fines de lucro', 'Guía Básica para la Gestión Económico-Financiera en Organizaciones no Lucrativas', 'guía del Observatorio del Tercer Sector de Bizkaia', 1],
    ]],
    ['Administración: pasado, presente y futuro', '🕰️', [
      ['Reseña histórica de la administración: de Fayol a Mintzberg', 'Daft - Teoría y Diseño Organizacional', 'capítulo de evolución del pensamiento administrativo', 2],
      ['Temas actuales: organización que aprende, gobierno corporativo e inteligencia artificial', 'Apuntes de cátedra', 'tomos teóricos de la unidad curricular', 2],
    ]],
  ]],
  ['Procesos y Sistemas de Información', [
    ['Creación de la organización', '🏗️', [
      ['Creación de la organización: propuesta de valor, estrategia y arquitectura organizacional', 'Messina - El Camino Emprendedor', 'capítulo de creación de la organización', 2],
    ]],
    ['Procesos, procedimientos y sistemas de información', '⚙️', [
      ['Conceptos básicos de procesos de negocio, procedimientos y sistemas de información', 'Stair y Reynolds - Principios de Sistemas de Información: un Enfoque Administrativo', 'capítulo de procesos y sistemas', 2],
      ['Categorización e instrumentos de graficación de procesos', 'González - Análisis de Procesos', 'capítulo de graficación de procesos', 2],
    ]],
    ['Mejoramiento de procesos', '🔄', [
      ['Cambio organizacional y su vinculación con el mejoramiento de procesos', 'Rodríguez y Guerrero - Gestión Estratégica de y por Procesos', 'capítulo de cambio organizacional y procesos', 2],
      ['Metodologías para el diseño y mejoramiento de procesos y sistemas de información', 'Penengo - Metodología de los Procesos de Mejoramiento Administrativo', 'capítulo de metodologías de mejoramiento', 2],
    ]],
  ]],
  ['Administración de Recursos Humanos', [
    ['Conceptos generales y básicos', '📋', [
      ['Origen y desarrollo de la disciplina de Recursos Humanos', 'Chiavenato - Gestión del Talento Humano', 'capítulo introductorio', 1],
      ['El soporte de la función en la organización y la planificación de Recursos Humanos', 'Dessler - Administración de Personal', 'capítulo de planificación de RRHH', 2],
    ]],
    ['Sistemas de retención de personal', '📊', [
      ['Clasificación, análisis, descripción, evaluación y valoración de cargos', 'Dessler - Administración de Personal', 'capítulo de análisis y valoración de cargos', 2],
      ['Los servicios de apoyo al personal', 'Chiavenato - Gestión del Talento Humano', 'capítulo de servicios al personal', 1],
    ]],
    ['Sistemas de obtención de personal', '🎯', [
      ['Reclutamiento y selección técnica de personal', 'Chiavenato - Gestión del Talento Humano', 'capítulo de reclutamiento y selección', 2],
      ['Inducción, capacitación y gestión del conocimiento', 'Chiavenato - Gestión del Talento Humano', 'capítulo de capacitación y desarrollo', 2],
    ]],
    ['Sistemas de desarrollo de personal', '📈', [
      ['Evaluación del desempeño y desplazamientos del personal', 'Dessler - Administración de Personal', 'capítulo de evaluación del desempeño', 2],
    ]],
    ['Sistemas de control de personal', '🗂️', [
      ['Relaciones con los empleados y sistema de información de Recursos Humanos', 'Chiavenato - Gestión del Talento Humano', 'capítulo de relaciones laborales y SIRH', 1],
    ]],
    ['Evaluación de la gestión de personal', '✅', [
      ['Auditoría de personal y responsabilidad social de las organizaciones', 'Nevado Peña - Control de Gestión Social: la Auditoría de los Recursos Humanos', 'capítulo de auditoría de RRHH', 2],
    ]],
  ]],
  ['Economía de las Decisiones Empresariales', [
    ['Mercados, organizaciones y microeconomía', '🏢', [
      ['Introducción: mercados, organizaciones y decisiones empresariales', 'Brickley, Smith y Zimmerman - Economía Empresarial y Arquitectura de la Organización', 'capítulo introductorio', 2],
      ['Fundamentos de microeconomía: demanda, producción y costos', 'Krugman y Wells - Introducción a la Economía: Microeconomía', 'capítulo de fundamentos de microeconomía', 2],
    ]],
    ['Comportamiento y organización interna', '🧠', [
      ['Economía del comportamiento: aversión al riesgo y racionalidad', 'Thaler y Sunstein - Un Pequeño Empujón (Nudge)', 'capítulo de economía del comportamiento', 1],
      ['Organización interna: conflictos de intereses e información asimétrica', 'Brickley, Smith y Zimmerman - Economía Empresarial y Arquitectura de la Organización', 'capítulo de organización interna', 2],
    ]],
    ['Estrategia empresarial', '♟️', [
      ['La estrategia empresarial: captura y creación de valor', 'Brickley, Smith y Zimmerman - Economía Empresarial y Arquitectura de la Organización', 'capítulo de estrategia empresarial', 2],
      ['La estrategia empresarial: teoría de juegos', 'Brickley, Smith y Zimmerman - Economía Empresarial y Arquitectura de la Organización', 'capítulo de teoría de juegos', 1],
      ['Poder de mercado y fijación de precios', 'Pepall, Richards y Norman - Organización Industrial: Teoría y Prácticas Contemporáneas', 'capítulo de fijación de precios', 2],
    ]],
    ['Relaciones entre empresas y con el Estado', '🏛️', [
      ['Relaciones entre empresas: integración vertical', 'Brickley, Smith y Zimmerman - Economía Empresarial y Arquitectura de la Organización', 'capítulo de integración vertical', 2],
      ['Economía de los bienes de información', 'Brickley, Smith y Zimmerman - Economía Empresarial y Arquitectura de la Organización', 'capítulo de bienes de información', 1],
      ['La empresa y el Estado: motivos económicos para la intervención', 'Domingo, Ponce y Zipitría - Regulación Económica para Economías en Desarrollo', 'capítulo de intervención del Estado', 2],
    ]],
  ]],
  ['Taller de Ética y Responsabilidad Social', [
    ['Administración y Responsabilidad Social de las Empresas', '🌱', [
      ['Concepto de Responsabilidad Social de las Empresas: stakeholders y esfera de influencia', 'Vives y Peinado-Vara (eds.) - RSE: la Responsabilidad Social de la Empresa en América Latina', 'capítulo introductorio a la RSE', 2],
    ]],
    ['Ética en los negocios', '⚖️', [
      ['La naturaleza de la ética en los negocios y dilemas éticos en la toma de decisiones', 'Velásquez - Ética en los Negocios: Conceptos y Casos', 'capítulo de ética en los negocios', 2],
      ['Gobierno corporativo y código de conducta', 'IFC (Grupo Banco Mundial) - Guía de Gobierno Corporativo para las PYMES', 'capítulo de gobierno corporativo', 1],
    ]],
    ['La RSE como modelo estratégico de gestión', '📊', [
      ['Gestión de la RSE: indicadores de gestión y relaciones con los stakeholders', 'Licandro - Responsabilidad Social Empresaria: Reflexiones, Investigaciones y Casos', 'capítulo de gestión estratégica de la RSE', 2],
    ]],
    ['Medición y comunicación de la RSE', '📢', [
      ['Reportes y memorias de sustentabilidad: elaboración y verificación externa', 'Global Reporting Initiative (GRI) - Guías para la Elaboración de Memorias de Sostenibilidad', 'guía de reportes de sostenibilidad', 2],
    ]],
    ['Evolución, desarrollo y tendencias', '🌍', [
      ['De la RSE a la sustentabilidad: los Objetivos de Desarrollo Sostenible', 'Naciones Unidas - Objetivos de Desarrollo Sostenible', 'guía de los ODS', 1],
    ]],
  ]],
  ['Comportamiento Organizacional', [
    ['Introducción al comportamiento organizacional', '🔍', [
      ['Introducción al comportamiento organizacional: variables y modelos', 'Robbins - Comportamiento Organizacional', 'capítulo introductorio', 1],
    ]],
    ['Comportamiento individual', '🧠', [
      ['Características biográficas, habilidades y percepción', 'Robbins - Comportamiento Organizacional', 'capítulo de fundamentos del comportamiento individual', 2],
      ['Actitudes, satisfacción en el trabajo y emociones', 'Robbins - Comportamiento Organizacional', 'capítulo de actitudes y emociones', 2],
      ['Personalidad y valores', 'Robbins - Comportamiento Organizacional', 'capítulo de personalidad y valores', 1],
      ['Motivación: teorías de necesidades y de proceso', 'Robbins - Comportamiento Organizacional', 'capítulo de motivación', 2],
    ]],
    ['Comportamiento grupal', '👥', [
      ['Comportamiento de grupo y equipos de trabajo', 'Robbins - Comportamiento Organizacional', 'capítulo de fundamentos del comportamiento grupal', 2],
      ['Comunicación organizacional', 'Robbins - Comportamiento Organizacional', 'capítulo de comunicación', 1],
      ['Poder y política en las organizaciones', 'Robbins - Comportamiento Organizacional', 'capítulo de poder y política', 1],
      ['Liderazgo: teorías y enfoques contemporáneos', 'Robbins - Comportamiento Organizacional', 'capítulo de liderazgo', 2],
      ['El conflicto organizacional y la negociación', 'Fisher, Ury y Patton - Sí ¡de Acuerdo!', 'capítulo de negociación', 2],
    ]],
    ['Sistemas organizacionales', '🏛️', [
      ['Cultura organizacional: funciones y tipología', 'Robbins - Comportamiento Organizacional', 'capítulo de cultura organizacional', 2],
      ['Cambio organizacional: resistencia y transformación cultural', 'Bridges y Bridges - Managing Transitions: Making the Most of Change', 'capítulo de gestión del cambio', 2],
    ]],
  ]],
  ['Dirección Estratégica de las Organizaciones', [
    ['Ética y fundamentos estratégicos', '⚖️', [
      ['Aspectos éticos de la dirección estratégica y gobierno corporativo', 'Guerras Martín y Navas López - Fundamentos de Dirección Estratégica de la Empresa', 'capítulo de ética y gobierno corporativo', 2],
      ['Introducción a la dirección estratégica: escuelas y proceso estratégico', 'Guerras Martín y Navas López - Fundamentos de Dirección Estratégica de la Empresa', 'capítulo introductorio', 2],
    ]],
    ['Empresa y entorno', '🌐', [
      ['Empresa y entorno: competitividad sistémica', 'Esser, Hillebrand, Messner y Meyer-Stamer - Competitividad Sistémica: Nuevo Desafío para las Empresas y la Política', 'artículo en Revista de la CEPAL', 2],
      ['Dirección estratégica de mercado: análisis externo e interno', 'Guerras Martín y Navas López - La Dirección Estratégica de la Empresa: Teoría y Aplicaciones', 'capítulo de análisis estratégico', 2],
    ]],
    ['Decisiones estratégicas', '♟️', [
      ['Evaluación y toma de decisiones estratégicas: estrategia corporativa', 'Bueno Campos - Fundamentos Teóricos de la Dirección Estratégica', 'capítulo de decisiones estratégicas', 2],
      ['Estrategias internacionales', 'Guerras Martín y Navas López - Fundamentos de Dirección Estratégica de la Empresa', 'capítulo de estrategias internacionales', 1],
    ]],
    ['Implementación y transformación', '🚀', [
      ['Implementación y control de la gestión estratégica: cuadro de mando integral', 'Bueno Campos, Salmador Sánchez, Merino Moreno y Martín Castilla - Dirección Estratégica: Desarrollo de la Estrategia y Análisis de Casos', 'capítulo de control de gestión estratégica', 2],
      ['Transformación digital e inteligencia artificial en la estrategia', 'Arias-Abelaira, Pache-Durán, Rodríguez-Ariza y Calderón-Macías - Transformación Digital y Digitalización: Estudio Bibliométrico', 'artículo en Transinformação', 1],
      ['La dirección en entornos organizacionales diversos: liderazgo inclusivo', 'Bueno Campos, Salmador Sánchez y Morcillo Ortega - Dirección Estratégica: Nuevas Perspectivas Teóricas', 'capítulo de liderazgo en entornos diversos', 1],
    ]],
  ]],
  ['Cambio Organizacional', [
    ['Aspectos conceptuales del cambio', '🔄', [
      ['Transformación y cambio organizacional: factores y tipos de cambio', 'García - Gestión de Cambios Organizacionales: Modelo Integrado', 'capítulo introductorio', 2],
      ['El proceso de cambio organizacional', 'Kotter - La Organización del Futuro: un Nuevo Modelo para un Mundo de Cambio Acelerado', 'capítulo del proceso de cambio', 2],
    ]],
    ['Gestión del cambio organizacional', '🛠️', [
      ['Modelos de gestión y diagnóstico organizacional', 'García - Gestión de Cambios Organizacionales: Modelo Integrado', 'capítulo de diagnóstico organizacional', 2],
      ['Metodologías para el cambio, clima y plan de cambio', 'Senge, Roberts, Ross, Roth y Smith - La Danza del Cambio', 'capítulo de metodologías de cambio', 2],
    ]],
    ['Componentes del cambio', '🧩', [
      ['Estructura de incentivos, liderazgo y comunicación en el cambio', 'Muñoz - Comunicación para el Cambio Organizacional', 'material de la unidad curricular', 1],
      ['Gestión de la resistencia, el conflicto y la tecnología en el cambio', 'Duck - El Monstruo del Cambio', 'capítulo de resistencia al cambio', 2],
    ]],
  ]],
  ['Proyectos de Inversión', [
    ['Concepto de proyecto de inversión', '💡', [
      ['La inversión: parámetros estructurales y tipos de inversiones', 'Porteiro - Evaluación de Proyectos de Inversión: Perspectiva Empresarial', 'capítulo introductorio', 1],
      ['El proyecto de inversión y su visión estratégica', 'Sapag Chain y Sapag Chain - Preparación y Evaluación de Proyectos', 'capítulo de proyectos y planeamiento estratégico', 1],
    ]],
    ['Formulación de proyectos', '📝', [
      ['Justificación comercial: demanda, oferta y precios', 'Sapag Chain y Sapag Chain - Preparación y Evaluación de Proyectos', 'capítulo de estudio de mercado', 2],
      ['Justificación técnica: tamaño, proceso y localización', 'Sapag Chain y Sapag Chain - Preparación y Evaluación de Proyectos', 'capítulo de estudio técnico', 2],
      ['Estudios económicos y financieros del proyecto', 'Porteiro - Evaluación de Proyectos de Inversión: Perspectiva Empresarial', 'capítulo de estudios económico-financieros', 2],
      ['Planeamiento de la ejecución', 'Sapag Chain y Sapag Chain - Preparación y Evaluación de Proyectos', 'capítulo de implementación', 1],
    ]],
    ['Evaluación de proyectos', '📊', [
      ['Evaluación microeconómica: flujo de fondos e indicadores de rentabilidad', 'Porteiro - Evaluación de Proyectos de Inversión: Perspectiva Empresarial', 'capítulo de evaluación microeconómica', 2],
      ['Evaluación socioeconómica y multicriterio', 'Sapag - Proyectos de Inversión: Formulación y Evaluación', 'capítulo de evaluación social', 2],
      ['La promoción de inversiones en Uruguay', 'Lemes, Comas, Danza y Porteiro - Proyectos de Inversión, Formulación y Evaluación: Perspectiva Empresarial', 'capítulo de promoción de inversiones', 1],
      ['Valuación de empresas', 'Porteiro - Evaluación de Proyectos de Inversión: Perspectiva Empresarial', 'capítulo de valuación de empresas', 2],
    ]],
    ['Particularidades de tipos de proyectos', '🌾', [
      ['Proyectos agropecuarios, turísticos, de servicios y nuevos emprendimientos', 'Price Gittinger - Análisis Económico de Proyectos Agrícolas', 'capítulo de proyectos agropecuarios', 2],
      ['Proyectos de participación público-privada y Project Finance', 'Lemes, Comas, Danza y Porteiro - Proyectos de Inversión, Formulación y Evaluación: Perspectiva Empresarial', 'capítulo de PPP y Project Finance', 1],
    ]],
  ]],
  ['Derecho Civil', [
    ['Introducción al derecho privado', '📜', [
      ['Concepto de derecho, norma jurídica y fuentes del derecho', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo introductorio', 2],
      ['Hechos y actos jurídicos: forma, prueba e ineficacia', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de actos jurídicos', 2],
    ]],
    ['Personas', '👤', [
      ['La persona física y las personas jurídicas: capacidad e incapacidades', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de personas', 2],
      ['Ley de violencia basada en género y ley de derechos de las personas trans', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de situación jurídica de personas', 1],
    ]],
    ['Bienes y modos de adquirir', '🏠', [
      ['Patrimonio, clasificación de bienes y derecho de propiedad', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de bienes', 2],
      ['Propiedad horizontal, usufructo, servidumbre y posesión', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de modos de adquirir', 2],
    ]],
    ['Obligaciones', '📑', [
      ['Definición, elementos y fuentes de las obligaciones', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de obligaciones', 2],
      ['El contrato: formación, requisitos y efectos jurídicos', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo del contrato', 2],
      ['Incumplimiento, transmisión y extinción de las obligaciones', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de extinción de obligaciones', 2],
    ]],
    ['Contratos', '🤝', [
      ['Compraventa, permuta, arrendamiento y sociedad conyugal', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de contratos clásicos', 2],
      ['Mandato, préstamo, fianza, prenda e hipoteca', 'Manual de Derecho Civil (CSIC-UDELAR, FCEA)', 'capítulo de contratos de garantía', 2],
    ]],
  ]],
  ['Investigación Colaborativa Internacional en Gestión de Personas', [
    ['Internacionalización e investigación colaborativa', '🌎', [
      ['Metodología COIL y gestión de personas en América Latina', 'Armstrong - Strategic Human Resource Management: a Guide to Action', 'capítulo de gestión estratégica de personas', 2],
      ['Formación de equipos internacionales y competencias interculturales', 'Backhaus y Tikoo - Conceptualizing and Researching Employer Branding', 'artículo en Career Development International', 2],
    ]],
    ['Diseño de la investigación comparada', '🔬', [
      ['Diagnóstico de problemáticas y construcción del problema de investigación', 'Ambler y Barrow - The Employer Brand', 'artículo en Journal of Brand Management', 2],
      ['Diseño metodológico: construcción y validación de instrumentos', 'Berthon, Ewing y Hah - Captivating Company: Dimensions of Attractiveness in Employer Branding', 'artículo en International Journal of Advertising', 1],
    ]],
    ['Trabajo de campo internacional', '🗺️', [
      ['Aplicación de entrevistas y cuestionarios, registro de información', 'Barrow y Mosley - The Employer Brand: Bringing the Best of Brand Management to People at Work', 'capítulo de trabajo de campo', 2],
    ]],
    ['Análisis comparado', '📊', [
      ['Codificación, comparación internacional y elaboración de recomendaciones', 'Knox y Freeman - Measuring and Managing Employer Brand Image in the Service Industry', 'artículo en Journal of Marketing Management', 2],
    ]],
  ]],
];

aplicarMaterias(MATERIAS);
