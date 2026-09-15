// Expande 13 materias de la Tecnicatura en Administración (FCEA) con su
// temario real, sacado de las "Fichas de Unidad Curricular" oficiales de
// fcea.udelar.edu.uy. Paráfrasis tipo tabla de contenidos a partir de
// "Explicitar contenido desagregado", nunca copia textual.
const { aplicarMaterias } = require('./_fcea-engine');

const MATERIAS = [
  ['Derecho Comercial', [
    ['Introducción y mercado', '📜', [
      ['Introducción: origen, evolución, acto de comercio y empresa', 'AA.VV. - Curso de Derecho Comercial', 'capítulo introductorio', 1],
      ['Mercado, empresas y consumidores: competencia desleal y defensa del consumidor', 'AA.VV. - Curso de Derecho Comercial', 'capítulo de defensa de la competencia y del consumidor', 2],
    ]],
    ['Bienes y títulos valores', '💴', [
      ['Bienes: establecimiento comercial y propiedad industrial', 'AA.VV. - Curso de Derecho Comercial', 'capítulo de bienes comerciales', 2],
      ['Títulos valores: letras de cambio, vales y cheques', 'AA.VV. - Curso de Derecho Comercial', 'capítulo de títulos valores', 2],
    ]],
    ['Contratos y crisis empresariales', '⚠️', [
      ['Contratos comerciales: clásicos, codificados y modernos', 'AA.VV. - Curso de Derecho Comercial', 'capítulo de contratación comercial', 2],
      ['Crisis empresariales: fundamentos de la regulación y ley 18.387', 'AA.VV. - Curso de Derecho Comercial', 'capítulo de crisis empresariales', 2],
    ]],
  ]],
  ['Diseño Organizacional', [
    ['Introducción al diseño organizacional', '🏢', [
      ['Las organizaciones y sus variables clave: la organización como sistema', 'Daft - Teoría y Diseño Organizacional', 'capítulo introductorio', 1],
      ['Propósito organizacional y diseño: misión, metas y ventaja competitiva', 'Daft - Teoría y Diseño Organizacional', 'capítulo de propósito organizacional', 2],
    ]],
    ['Formas de organización', '🏗️', [
      ['Configuraciones típicas: estructura simple, funcional, divisional y matricial', 'Daft - Teoría y Diseño Organizacional', 'capítulo de configuraciones estructurales', 2],
    ]],
    ['Metodología de diseño', '🛠️', [
      ['Metodología de diseño: el proceso y las herramientas', 'Kubr - La Consultoría de Empresas: Guía para la Profesión', 'capítulo de metodología de diseño', 2],
      ['Representación de la estructura: organigramas', 'Garbarino y Pintos - Análisis y Diseño de Estructuras Organizacionales', 'capítulo de representación estructural', 1],
    ]],
    ['Elementos del diseño y gestión del cambio', '⚙️', [
      ['Elementos clave del diseño: división del trabajo, autoridad, ámbito de control y coordinación', 'González y Rivas - Ámbito de Control, Delegación y Descentralización', 'capítulo de elementos del diseño estructural', 2],
      ['La importancia de la gestión del cambio en el diseño organizacional', 'Robbins y Judge - Comportamiento Organizacional', 'capítulo de gestión del cambio', 2],
    ]],
  ]],
  ['Compras Públicas para el Desarrollo', [
    ['Introducción a la contratación pública', '📦', [
      ['Cadena de suministro, abastecimiento estratégico y planificación de compras públicas', 'Mendoza y Ceballos - El Abastecimiento Estratégico y su Aplicación en las Empresas', 'capítulo de abastecimiento estratégico', 2],
    ]],
    ['Sistemas de información', '💻', [
      ['Sistemas de información de compras públicas: SICE, RUPE, PAC, Portal de Compras y Observatorio', 'Zuleta - Hacia una Política de Datos Abiertos del Sistema de Compra Pública', 'documento de la RICG', 2],
    ]],
    ['Compras Públicas Sostenibles', '🌱', [
      ['Objetivos de Desarrollo Sostenible, Compras Públicas Sostenibles e informes de sostenibilidad', 'Oviedo - Compras Públicas Sostenibles en América Latina y el Caribe', 'capítulo de compras públicas sostenibles', 2],
    ]],
    ['Transparencia y rendición de cuentas', '🔍', [
      ['Transparencia, datos abiertos y evaluación de sistemas de compras públicas: metodología MAPS', 'Galvis, Marin y Garnica - Guía para la Identificación de Riesgos de Corrupción en Contratación Pública', 'guía sobre ciencia de datos y contratación pública', 2],
    ]],
  ]],
  ['Economía Circular', [
    ['Fundamentos de la economía circular', '🔄', [
      ['Concepto de economía circular: definiciones, principios y vinculación con la economía social', 'Rieradevall y Gasol - Economía Circular: el Camino hacia la Sostenibilidad', 'capítulo introductorio', 2],
      ['Objetivos de Desarrollo Sostenible y economía circular', 'CEPAL - Economía Circular en América Latina y el Caribe: Oportunidades para una Recuperación Transformadora', 'capítulo de ODS y economía circular', 1],
    ]],
    ['Impacto y transformación', '📊', [
      ['Impacto económico de la economía circular: dimensiones de la sostenibilidad', 'Ministerio de Industria, Energía y Minería et al. - Estrategia Nacional de Economía Circular del Uruguay', 'capítulo de impacto económico', 2],
      ['Transformación empresarial y social hacia la economía circular', 'Rieradevall y Gasol - Economía Circular: el Camino hacia la Sostenibilidad', 'capítulo de transformación empresarial', 1],
    ]],
    ['Modelos y medición', '📐', [
      ['Modelos estratégicos para la economía circular: logística inversa y servitización', 'Van Hoof, Núñez y de Miguel - Metodología para la Evaluación de Avances en la Economía Circular', 'documento de la CEPAL', 2],
      ['Medición y reporte: estructura de los reportes y cuadro de mando circular', 'La Medición de la Economía Circular - Grupo de Acción de Economía Circular y Forética', 'guía de medición de la economía circular', 1],
    ]],
    ['Experiencia latinoamericana y uruguaya', '🇺🇾', [
      ['Experiencia latinoamericana y uruguaya de economía circular: incentivos y políticas públicas', 'Ministerio de Industria, Energía y Minería et al. - Estrategia Nacional de Economía Circular del Uruguay', 'capítulo de experiencia uruguaya', 2],
    ]],
  ]],
  ['Derecho Público', [
    ['Fundamentos del derecho público', '⚖️', [
      ['Introducción: derecho público, el Estado y la Constitución uruguaya', 'Casinelli Muñoz - Derecho Público', 'parte I: introducción', 2],
      ['Organización estatal uruguaya: poderes y personas estatales', 'Casinelli Muñoz - Derecho Público', 'parte II: organización estatal uruguaya', 2],
    ]],
    ['Orden jurídico y Constitución', '📜', [
      ['El orden jurídico uruguayo: actos constitucionales, legislativos y administrativos', 'Casinelli Muñoz - Derecho Público', 'parte III: el orden jurídico uruguayo', 2],
      ['La Constitución uruguaya: reformas y régimen constitucional vigente', 'Casinelli Muñoz - Derecho Público', 'parte IV: la Constitución uruguaya', 2],
    ]],
    ['Actos legislativos y administrativos', '📝', [
      ['Los actos legislativos: procedimiento de formación de las leyes', 'Casinelli Muñoz - Derecho Público', 'parte V: los actos legislativos', 2],
      ['Los actos administrativos: potestad reglamentaria', 'Casinelli Muñoz - Derecho Público', 'parte VI: los actos administrativos', 2],
    ]],
    ['Régimen político y derechos fundamentales', '🗳️', [
      ['Régimen político y social uruguayo: derechos fundamentales', 'Casinelli Muñoz - Derecho Público', 'parte VII: régimen político y social uruguayo', 2],
      ['Nacionalidad, ciudadanía, sufragio y partidos políticos', 'Casinelli Muñoz - Derecho Público', 'parte X: nacionalidad, ciudadanía y sufragio', 1],
    ]],
    ['Los poderes del Estado', '🏛️', [
      ['Poder Legislativo: organización y procedimiento parlamentario', 'Casinelli Muñoz - Derecho Público', 'parte XI: Poder Legislativo', 2],
      ['El Poder Ejecutivo: estatuto del Presidente y de los Ministros', 'Casinelli Muñoz - Derecho Público', 'parte XII: el Poder Ejecutivo', 2],
      ['Descentralización administrativa por servicios: entes autónomos', 'Casinelli Muñoz - Derecho Público', 'parte XIII: descentralización administrativa', 2],
    ]],
    ['Hacienda y economía nacional', '💰', [
      ['Hacienda pública: el Tribunal de Cuentas y el régimen presupuestario', 'Casinelli Muñoz - Derecho Público', 'parte XIV: hacienda pública', 2],
      ['Economía nacional: el Consejo de Economía Nacional', 'Casinelli Muñoz - Derecho Público', 'parte XV: economía nacional', 1],
    ]],
    ['Poder Judicial y descentralización territorial', '⚖️', [
      ['Poder Judicial: organización y declaración de inconstitucionalidad', 'Casinelli Muñoz - Derecho Público', 'parte XVI: Poder Judicial', 2],
      ['Descentralización territorial: gobiernos departamentales', 'Casinelli Muñoz - Derecho Público', 'parte XVII: descentralización territorial', 2],
    ]],
    ['Contencioso administrativo y función pública', '📋', [
      ['Lo contencioso administrativo: acción de nulidad y de reparación', 'Casinelli Muñoz - Derecho Público', 'parte XVIII: lo contencioso administrativo', 2],
      ['Justicia electoral: la Corte Electoral', 'Casinelli Muñoz - Derecho Público', 'parte XIX: justicia electoral', 1],
      ['La Administración Pública: contratos administrativos y licitación', 'Casinelli Muñoz - Derecho Público', 'parte XX: la administración pública', 2],
      ['Los funcionarios públicos: estatuto y carrera administrativa', 'Casinelli Muñoz - Derecho Público', 'parte XXI: los funcionarios públicos', 2],
      ['Las medidas prontas de seguridad', 'Casinelli Muñoz - Derecho Público', 'parte XXII: las medidas prontas de seguridad', 1],
    ]],
  ]],
  ['Gestión Financiera del Estado', [
    ['Sector público y presupuesto', '🏛️', [
      ['Características del sector público y sus sistemas de información', 'Texto Ordenado de Contabilidad y Administración Financiera del Estado (TOCAF)', 'capítulo introductorio', 2],
      ['El presupuesto público: principios y técnicas presupuestarias', 'Texto Ordenado de Contabilidad y Administración Financiera del Estado (TOCAF)', 'capítulo del presupuesto público', 2],
    ]],
    ['Ejecución del gasto', '💸', [
      ['La ejecución del presupuesto: el proceso del gasto', 'Texto Ordenado de Contabilidad y Administración Financiera del Estado (TOCAF)', 'capítulo de ejecución presupuestal', 2],
      ['Los procedimientos de contratación: licitación pública y compras sustentables', 'Texto Ordenado de Contabilidad y Administración Financiera del Estado (TOCAF)', 'capítulo de contrataciones del Estado', 2],
    ]],
    ['Control y evaluación de la gestión', '🔍', [
      ['El control y la evaluación de la gestión: TOCAF y Normas Internacionales de Contabilidad del Sector Público', 'Texto Ordenado de Contabilidad y Administración Financiera del Estado (TOCAF)', 'capítulo de control y evaluación', 2],
      ['Organismos de control: Contaduría General de la Nación, AIN y Tribunal de Cuentas', 'Texto Ordenado de Contabilidad y Administración Financiera del Estado (TOCAF)', 'capítulo de organismos de control', 1],
    ]],
  ]],
  ['Transformación Cultural', [
    ['Fundamentos de la cultura organizacional', '🏢', [
      ['Introducción al concepto de cultura organizacional', 'Groysberg, Lee, Price y Cheng - The Leader\'s Guide to Corporate Culture', 'capítulo introductorio', 1],
      ['Tipos de cultura según la industria o sector de la organización', 'Fernández-Ríos - Eficacia Organizacional: Concepto, Desarrollo y Evaluación', 'capítulo 1', 2],
    ]],
    ['Diagnóstico y visión de la cultura', '🔎', [
      ['Diagnóstico cultural: identificación de subculturas', 'Rodríguez - Diagnóstico Organizacional', 'capítulo 8: diagnóstico de la cultura organizacional', 2],
      ['Visión de la cultura organizacional deseada en línea con la estrategia', 'Melián - La Cultura como Clave para Gestionar Exitosamente la Estrategia... y Todo lo Demás', 'documento de la cátedra', 1],
    ]],
    ['Cambio cultural', '🔄', [
      ['Habilitadores y barreras para el cambio cultural', 'Groysberg, Lee, Price y Cheng - The Leader\'s Guide to Corporate Culture', 'capítulo de cambio cultural', 2],
      ['Transición de la cultura actual a la cultura deseada', 'How Leaders Can Create a Purpose-Driven Culture - Harvard Business Review', 'artículo de Harvard Business Review', 1],
    ]],
    ['Desafíos actuales de la transformación cultural', '🌐', [
      ['Transformación digital, cultura basada en datos, brechas generacionales y multiculturalidad', '10 Steps to Creating a Data-Driven Culture - Harvard Business Review', 'artículo de Harvard Business Review', 2],
      ['Monitoreo y medición del proceso de cambio cultural', 'Informe Anual de Tendencias Globales en Capital Humano de Deloitte', 'informe anual de Deloitte', 1],
    ]],
  ]],
  ['EFI Cooperativas de Trabajo y Colectivos Autogestionados', [
    ['Extensión e integralidad', '🎓', [
      ['Fundamentos de la extensión universitaria y los Espacios de Formación Integral', 'Arocena - Integralidad, Tensiones y Perspectivas', 'Cuaderno de Extensión 1', 2],
    ]],
    ['Economía social, solidaria y feminista', '🤝', [
      ['Economía Social y Solidaria y Economía Feminista: articulaciones de teoría y praxis', 'Andrade, Veras Iglesias y Rieiro - Miradas Feministas sobre la Economía Social y Solidaria en Uruguay', 'artículo en Revista Idelcoop', 2],
    ]],
    ['Sostenibilidad en la Economía Social y Solidaria', '🌱', [
      ['Construcción de viabilidad social, productiva y económica en emprendimientos colectivos', 'Arizaga, García y Planchesteiner - Gestión y Sostenibilidad Cooperativa', 'documento sobre pistas feministas para cooperativas', 2],
    ]],
    ['Autogestión y cooperativismo', '🏭', [
      ['Autogestión y gestión colectiva: organización interna y gobernanza', 'Bertullo et al. - El Cooperativismo en Uruguay', 'documento de trabajo del Rectorado UdelaR', 2],
    ]],
    ['Cooperativas de trabajo y sociales', '📜', [
      ['Marco normativo, aspectos tributarios y contables de cooperativas de trabajo y sociales', 'Bertullo et al. - El Cooperativismo en Uruguay', 'capítulo de marco normativo', 2],
    ]],
  ]],
  ['EFI: MicroCECEA', [
    ['Extensión universitaria e integralidad', '🎓', [
      ['La extensión universitaria y los Espacios de Formación Integral en la Udelar', 'Arocena, Tommasino, Rodríguez, Sutz, Alvarez Pedrosian y Romano - Cuadernos de Extensión N°1: Integralidad, Tensiones y Perspectivas', 'cuaderno de extensión', 2],
    ]],
    ['Sostenibilidad de emprendimientos productivos', '🌱', [
      ['Dimensiones de la sostenibilidad y aporte de los microemprendimientos al desarrollo humano', 'Rodriguez Miranda, Fernandez Pavlovich, Sbrocca y Assandri - Desarrollo de Capacidades para Emprender', 'manual para equipos técnicos e instituciones', 2],
      ['Desafíos de los microemprendimientos: brechas, sesgos y políticas públicas de apoyo', 'Maca-Urbano - Emprendimiento, Subjetividad y Gubernamentalidad', 'artículo en Revista Brasileira de Estudos Organizacionais', 1],
    ]],
    ['Gestión estratégica', '🗺️', [
      ['Influencia del entorno y planificación prospectiva para microemprendimientos', 'Rodriguez Miranda, Fernandez Pavlovich, Sbrocca y Assandri - Desarrollo de Capacidades para Emprender', 'capítulo de gestión estratégica', 2],
      ['Metodologías ágiles para la formulación del negocio: metodología CANVA', 'Rodriguez Miranda, Fernandez Pavlovich, Sbrocca y Assandri - Desarrollo de Capacidades para Emprender', 'capítulo de metodologías ágiles', 1],
    ]],
    ['Acompañamiento a microemprendimientos', '🤲', [
      ['Comercialización, comercio electrónico, comunicación y redes sociales', 'Freira, Di Giovanni, Tuimil y Vázquez - Limitaciones Tecnológicas en la Comercialización Digital de Emprendimientos', 'ponencia en Jornadas Académicas FCEA', 2],
      ['Planificación financiera y viabilidad económica de microemprendimientos', 'Rodriguez Miranda, Fernandez Pavlovich, Sbrocca y Assandri - Desarrollo de Capacidades para Emprender', 'capítulo de viabilidad económica', 2],
    ]],
  ]],
  ['Análisis Institucional y Planificación en el Sector Público', [
    ['Estado y democracia', '🏛️', [
      ['Estado y régimen democrático: conceptos básicos para el análisis de la política pública', 'Dahl - La Democracia: una Guía para los Ciudadanos', 'capítulo introductorio (selección)', 2],
    ]],
    ['Paradigmas de la Administración Pública', '📈', [
      ['Evolución de los paradigmas de la Administración Pública y el sector público uruguayo', 'Weber - Qué es la Burocracia', 'capítulo sobre burocracia y administración pública', 2],
    ]],
    ['Análisis de la política pública', '🔬', [
      ['El ciclo de la política pública, toma de decisiones y burocracia', 'Lindblom - El Proceso de Elaboración de Políticas Públicas', 'selección de la Municipal Administration Publications', 2],
    ]],
    ['Planificación en el Sector Público', '🗺️', [
      ['Planificación estratégica: niveles, actores y herramientas', 'OPP - Guía Metodológica de Planificación Estratégica', 'guía metodológica', 2],
    ]],
  ]],
  ['Marketing de Servicios', [
    ['Introducción y ambiente del servicio', '🛎️', [
      ['Introducción al marketing de servicios: características y triángulo del marketing de servicios', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo introductorio', 2],
      ['Ambiente del servicio: tipos de ambientes y evidencia física', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de ambiente del servicio', 1],
    ]],
    ['El cliente y sus relaciones', '🤝', [
      ['El cliente y su comportamiento en los servicios: proceso de decisión y expectativas', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo del comportamiento del cliente', 2],
      ['Construcción de relaciones con el cliente: valor del cliente y segmentación', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de marketing de relaciones', 2],
    ]],
    ['Demanda y diseño del servicio', '📐', [
      ['Demanda del servicio: patrones de demanda y estrategias de capacidad', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de administración de la demanda', 2],
      ['Estrategias para el diseño del servicio: desarrollo, estándares y recuperación del servicio', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de diseño del servicio', 2],
    ]],
    ['Prestación y comercialización del servicio', '💼', [
      ['Prestación y desempeño del servicio: papel de empleados y clientes', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de prestación del servicio', 2],
      ['Fijación del precio en los servicios', 'Cobra - Marketing de Servicios', 'capítulo de fijación de precios', 1],
      ['Sistema de distribución de los servicios', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de distribución de servicios', 1],
      ['Comunicación integral en el marketing de servicios', 'Zeithaml, Bitner y Gremler - Marketing de Servicios', 'capítulo de comunicación integral', 2],
    ]],
  ]],
  ['Marketing Digital', [
    ['Introducción y objetivos', '💻', [
      ['Introducción al marketing digital: entorno digital y comportamiento del nuevo consumidor', 'Estrade Nieto, Soro y Hernández - Marketing Digital: Marketing Móvil, SEO y Analítica Web', 'capítulo introductorio', 2],
      ['Objetivos y métricas del marketing digital: analítica web', 'Estrade Nieto, Soro y Hernández - Marketing Digital: Marketing Móvil, SEO y Analítica Web', 'capítulo de métricas y analítica web', 1],
    ]],
    ['Presencia online y captación de clientes', '🌐', [
      ['Presencia online: tipos de sitios web, usabilidad y accesibilidad', 'Somalo Peciña - El Comercio Electrónico: una Guía Completa para Gestionar la Venta Online', 'capítulo de presencia online', 2],
      ['Estrategias de captación de clientes en internet', 'Fonseca - Fundamentos del E-commerce', 'capítulo de captación de clientes', 1],
    ]],
    ['SEO y SEM', '🔎', [
      ['SEO: posicionamiento orgánico en buscadores', 'Estrade Nieto, Soro y Hernández - Marketing Digital: Marketing Móvil, SEO y Analítica Web', 'capítulo de SEO', 2],
      ['SEM: campañas de enlaces patrocinados', 'Estrade Nieto, Soro y Hernández - Marketing Digital: Marketing Móvil, SEO y Analítica Web', 'capítulo de SEM', 2],
    ]],
    ['Canales digitales', '📱', [
      ['Email marketing: estrategias de campañas y permission marketing', 'Godin - El Marketing del Permiso', 'capítulo de permission marketing', 1],
      ['Social media y community management', 'Kotler, Kartajaya y Setiawan - Marketing 4.0: Moving from Traditional to Digital', 'capítulo de social media', 2],
      ['E-commerce: modalidades, tecnología de pagos y tienda online', 'Fonseca - Fundamentos del E-commerce', 'capítulo de comercio electrónico', 2],
    ]],
    ['Plan de marketing digital', '📋', [
      ['Plan de marketing digital: componentes y armado', 'Estrade Nieto, Soro y Hernández - Marketing Digital: Marketing Móvil, SEO y Analítica Web', 'capítulo de plan de marketing digital', 1],
    ]],
  ]],
  ['Liderazgo para la Innovación Social', [
    ['Conceptos introductorios', '💡', [
      ['Transformaciones en curso: cambio social y brechas', 'Hernández-Ascanio, Tirado-Valencia y Ariza-Montes - El Concepto de Innovación Social: Ámbitos, Definiciones y Alcances Teóricos', 'artículo en CIRIEC-España', 1],
      ['Objetivos de Desarrollo Sostenible e innovación social', 'De la Mata - Manual de Innovación Social', 'capítulo introductorio', 1],
      ['Modelos de innovación social y oportunidades en Uruguay', 'López, Blanco y Guerra - Evolución de los Modelos de la Gestión de Innovación', 'artículo sobre modelos de innovación', 1],
    ]],
    ['Liderar proyectos de innovación social', '👥', [
      ['Liderazgo: conceptos introductorios y liderazgo distribuido', 'Contreras Torres y Barbosa Ramírez - Del Liderazgo Transaccional al Liderazgo Transformacional', 'capítulo de liderazgo transformacional', 2],
      ['Construcción de una visión compartida y trabajo en equipo', 'De Bono - El Pensamiento Lateral: Manual de Creatividad', 'capítulo de creatividad en equipos', 1],
    ]],
    ['Innovación social', '🚀', [
      ['Exploración de la problemática y mapeo de actores clave', 'Hernández-Ascanio, Valle, López y Viruel - Medir la Capacidad de Innovación Social en Organizaciones Complejas del Tercer Sector', 'artículo en Empiria', 2],
      ['Diseño centrado en las personas: el CANVA aplicado a la innovación social', 'IDEO.org - Field Guide to Human-Centered Design', 'guía de diseño centrado en las personas', 2],
      ['Del prototipo a la validación, financiamiento y medición de impactos', 'Espínola Verdín y Torres González - Análisis Cualitativo de Modelos de Negocio para el Emprendimiento Social', 'artículo en Entreciencias', 1],
    ]],
  ]],
];

aplicarMaterias(MATERIAS);
