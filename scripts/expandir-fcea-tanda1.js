// Expande 14 materias de FCEA (Contador Público, Economía, Administración,
// Tecnicatura en Administración) con su temario real, sacado de las
// "Fichas de Unidad Curricular" oficiales publicadas en
// fcea.udelar.edu.uy/images/micrositios/bedelia/fichas_UC/... (encontradas
// navegando las páginas de grilla curricular de cada carrera). Paráfrasis
// tipo tabla de contenidos a partir de "Explicitar contenido desagregado",
// nunca copia textual. Varias de estas materias son Unidades Curriculares
// compartidas entre carreras -- el motor en _fcea-engine.js las actualiza
// en todos los catálogos donde aparezcan.
const { aplicarMaterias } = require('./_fcea-engine');

const MATERIAS = [
  ['Conceptos Contables', [
    ['La contabilidad y sus objetivos', '📋', [
      ['Las organizaciones, el patrimonio y el proceso decisorio', 'Fowler Newton - Contabilidad Básica', 'capítulo de organizaciones y administración', 1],
      ['La contabilidad: concepto, funciones y el proceso contable', 'Fowler Newton - Contabilidad Básica', 'capítulo introductorio a la contabilidad', 1],
    ]],
    ['La información contable', '📊', [
      ['Características y requisitos de la información contable', 'Fowler Newton - Cuestiones Contables Fundamentales', 'capítulo de información contable', 1],
      ['Estados financieros: situación financiera, resultados integral, cambios en el patrimonio y flujo de efectivo', 'NIIF para las PYMES', 'secciones de estados financieros', 2],
    ]],
    ['Reconocimiento contable de variaciones patrimoniales', '🔄', [
      ['Actos administrativos, hechos económicos y ecuación contable fundamental', 'Fowler Newton - Contabilidad Básica', 'capítulo de reconocimiento contable', 2],
      ['Documentación respaldatoria de las operaciones', 'Fowler Newton - Contabilidad Básica', 'capítulo de documentación respaldatoria', 1],
    ]],
    ['Las cuentas y el procesamiento de datos', '🗂️', [
      ['El sistema contable: plan y manuales de cuentas', 'Fowler Newton - Contabilidad Básica', 'capítulo de plan de cuentas', 1],
      ['Registros contables básicos: diario, mayor, principales y auxiliares', 'Fowler Newton - Contabilidad Básica', 'capítulo de registros contables', 2],
    ]],
    ['Ciclo contable y ajustes', '🔁', [
      ['Ciclo contable elemental: apertura, gestión, resultados, cierre y reapertura', 'Fowler Newton - Contabilidad Básica', 'capítulo 18: ciclo contable', 2],
      ['Ajustes por balance', 'Fowler Newton - Contabilidad Básica', 'capítulo de ajustes por balance', 1],
    ]],
  ]],
  ['Administración y Gestión de las Organizaciones I', [
    ['Organizaciones y administradores', '🏢', [
      ['Las organizaciones: características, clasificación y entorno', 'Robbins y Coulter - Administración', 'capítulo de las organizaciones', 2],
      ['Administración y administradores: concepto, escuelas clásicas y rol gerencial', 'Robbins y Coulter - Administración', 'capítulo de administración y administradores', 2],
    ]],
    ['El proceso administrativo', '⚙️', [
      ['Planificación: fijación de objetivos y planeamiento estratégico y operativo', 'Robbins y Coulter - Administración', 'capítulo de planificación', 2],
      ['Organización: diseño organizacional, departamentalización y mecanismos de coordinación', 'Robbins y Coulter - Administración', 'capítulo de organización', 2],
      ['Dirección: autoridad, poder y liderazgo', 'Robbins y Coulter - Administración', 'capítulo de dirección', 2],
      ['Control: proceso y principios', 'Robbins y Coulter - Administración', 'capítulo de control', 1],
    ]],
    ['Las funciones internas básicas de la empresa', '🏭', [
      ['Gerencia comercial: mezcla comercial y segmentación de mercado', 'Robbins y Coulter - Administración', 'capítulo de función comercial', 2],
      ['Gerencia de producción u operaciones', 'Robbins y Coulter - Administración', 'capítulo de función de producción', 2],
      ['Gerencia de finanzas: solvencia, rentabilidad y valor tiempo del dinero', 'Robbins y Coulter - Administración', 'capítulo de función financiera', 2],
      ['Gerencia de recursos humanos', 'Robbins y Coulter - Administración', 'capítulo de función de recursos humanos', 1],
      ['Gerencia de tecnología y sistemas de información', 'Robbins y Coulter - Administración', 'capítulo de función de tecnología', 1],
    ]],
    ['Creación y crecimiento de empresas', '🌱', [
      ['Creación de empresas: idea de negocio, estudios y formas jurídicas', 'Robbins y Coulter - Administración', 'capítulo de creación de empresas', 2],
      ['Crecimiento de las empresas: fusiones, matriz de Ansoff y alianzas', 'Robbins y Coulter - Administración', 'capítulo de crecimiento empresarial', 2],
    ]],
  ]],
  ['Introducción a la Microeconomía', [
    ['Modelos y análisis en economía', '📈', [
      ['Problemas de la economía: producto, crecimiento y desigualdad', 'CORE Econ Team - La Economía', 'unidades 1 y 2', 2],
      ['Modelos económicos: equilibrio, incentivos y renta económica', 'CORE Econ Team - La Economía', 'unidad 2', 2],
      ['Precios relativos, tecnología y función de producción', 'CORE Econ Team - La Economía', 'unidad 2', 1],
    ]],
    ['Escasez, trabajo y elección', '⚖️', [
      ['Preferencias y utilidad: curva de indiferencia y tasa marginal de sustitución', 'CORE Econ Team - La Economía', 'unidad 3', 2],
      ['Frontera de posibilidades de producción y productividad', 'CORE Econ Team - La Economía', 'unidad 3', 1],
      ['Efecto ingreso y efecto sustitución en el mercado de trabajo', 'CORE Econ Team - La Economía', 'unidad 3', 2],
    ]],
    ['Conflictos de interés y reglas de juego', '🎲', [
      ['Teoría de juegos: interacciones, estrategias y equilibrio de Nash', 'CORE Econ Team - La Economía', 'unidades 4 y 5', 2],
      ['Asignación eficiente y óptimo de Pareto', 'CORE Econ Team - La Economía', 'unidades 4 y 5', 1],
    ]],
    ['La firma y sus clientes', '🏪', [
      ['Demanda de mercado, costos y función de beneficios de la firma', 'CORE Econ Team - La Economía', 'unidades 7 y 8', 2],
      ['Fijación de precios y equilibrio de mercado', 'CORE Econ Team - La Economía', 'unidades 7 y 8', 2],
      ['Ganancias del intercambio: excedente del consumidor y del productor', 'CORE Econ Team - La Economía', 'unidades 7 y 8', 1],
      ['Elasticidad de demanda y políticas públicas', 'CORE Econ Team - La Economía', 'unidades 7 y 8', 1],
    ]],
    ['La firma: propietarios, administradores y empleados', '👥', [
      ['Firma, división del trabajo y coordinación', 'CORE Econ Team - La Economía', 'capítulo 6', 2],
      ['Renta del empleo, esfuerzo y salarios de eficiencia', 'CORE Econ Team - La Economía', 'capítulo 6', 2],
      ['Mercado de trabajo bajo competencia perfecta', 'CORE Econ Team - La Economía', 'capítulo 6', 1],
    ]],
  ]],
  ['Derecho y Actividad Empresarial I', [
    ['Introducción al derecho privado', '📜', [
      ['Introducción al derecho privado: principios e instituciones', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo introductorio', 1],
      ['Concepto de empresario y empresario societario: tipología social', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo del empresario', 2],
    ]],
    ['Bienes y actuación externa del empresario', '🏬', [
      ['Bienes con regulación especial: establecimiento comercial y propiedad industrial', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo de bienes especiales', 2],
      ['Derecho de la competencia y derecho del consumidor', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo de mercado y consumidor', 1],
      ['Contratos comerciales', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo de contratos comerciales', 2],
      ['Títulos valores', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo de títulos valores', 1],
    ]],
    ['Crisis empresariales', '⚠️', [
      ['Crisis empresariales: principios de derecho concursal', 'Poziomek y Alfaro - Nociones de Derecho Comercial y Nociones de Derecho Civil', 'capítulo de derecho concursal', 2],
    ]],
  ]],
  ['Introducción a la Macroeconomía', [
    ['Fundamentos macroeconómicos', '📊', [
      ['El flujo circular de la renta, la medición del PIB y la demanda agregada', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 3', 2],
      ['El mercado de trabajo: medición, salarios nominales y reales', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 1', 2],
    ]],
    ['Inflación y política macroeconómica', '💰', [
      ['La inflación y su vinculación con el desempleo: curva de Phillips', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 4', 2],
      ['Política macroeconómica: política fiscal y política monetaria', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 5', 2],
    ]],
    ['Sector financiero y economía abierta', '🌐', [
      ['El sector financiero: deuda, dinero y mercados financieros', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 6', 2],
      ['La economía abierta: balanza de pagos y movimientos de capitales', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo de economía abierta', 2],
      ['Política macroeconómica en economía abierta: regímenes cambiarios', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 7', 2],
    ]],
    ['Crecimiento y desarrollo', '📈', [
      ['Crecimiento y desarrollo: contabilidad del crecimiento y convergencia', 'CORE Econ Team - The Economy 2.0: Macroeconomics', 'capítulo 9', 2],
    ]],
  ]],
  ['Contabilidad General II', [
    ['Sistemas contables', '🗄️', [
      ['Sistemas contables: elementos e informes contables financieros y de sostenibilidad', 'NIIF para las PYMES', 'sección 2 y 3', 2],
    ]],
    ['Normas contables', '📖', [
      ['Normas contables: concepto, situación internacional y normativa uruguaya', 'NIIF para las PYMES', 'sección introductoria', 2],
    ]],
    ['Componentes de los estados financieros', '🧾', [
      ['Instrumentos financieros básicos: reconocimiento y medición', 'NIIF para las PYMES', 'sección 11', 2],
      ['Inventarios: costo, valuación y sistemas de registración', 'NIIF para las PYMES', 'sección 13', 2],
      ['Propiedades, planta y equipo: reconocimiento, costo y depreciación', 'NIIF para las PYMES', 'sección 17', 2],
      ['Propiedades de inversión', 'NIIF para las PYMES', 'sección 16', 1],
      ['Intangibles: reconocimiento, medición y depreciación', 'NIIF para las PYMES', 'sección 18', 2],
      ['Cuentas en moneda extranjera', 'NIIF para las PYMES', 'sección 30', 1],
      ['Pasivos y activos contingentes', 'NIIF para las PYMES', 'sección 21', 2],
    ]],
    ['Hechos económicos de sociedades comerciales', '🏛️', [
      ['Sociedades comerciales: tipos y registración de hechos económicos y actos administrativos', 'Madruga, Núñez y Varela - Temas Contables', 'capítulo de sociedades comerciales', 2],
      ['Estado de Cambio en el Patrimonio', 'NIIF para las PYMES', 'sección de estado de cambios en el patrimonio', 1],
    ]],
    ['Ingresos y gastos', '💵', [
      ['Ingresos y gastos: concepto, clasificación y otros resultados integrales', 'NIIF para las PYMES', 'sección 23', 2],
    ]],
  ]],
  ['Contabilidad General III', [
    ['La contabilidad y los informes', '📋', [
      ['Objetivo informativo de la contabilidad: informes financieros y de sostenibilidad', 'Fowler Newton - Contabilidad Básica', 'capítulo 1', 1],
    ]],
    ['Preparación de informes contables', '🔍', [
      ['Control interno: objetivo, requisitos y componentes del sistema', 'Fowler Newton - Contabilidad Básica', 'capítulo 17', 2],
      ['Tareas de preparación: arqueos, conciliaciones y recuento de inventarios', 'Guía de Seguimiento de Teórico y Tomo Práctico de la Unidad Curricular', 'unidad de tareas de preparación', 2],
      ['Ajustes para el reconocimiento de activos, pasivos, ingresos y gastos', 'NIIF para las PYMES', 'secciones de reconocimiento y medición', 2],
    ]],
    ['Presentación de estados financieros', '📑', [
      ['Estados financieros: definición, tipos y características de la información', 'NIIF para las PYMES', 'sección 2 y 3', 2],
      ['Estado de Situación Financiera y Estado de Resultados', 'NIIF para las PYMES', 'sección de estados financieros', 2],
      ['Estado de Cambio en el Patrimonio y Estado de Flujo de Efectivo', 'NIIF para las PYMES', 'sección de estados financieros', 2],
      ['Notas a los estados financieros', 'NIIF para las PYMES', 'sección de notas', 1],
      ['Presentación de estados financieros en la Central de Balances Electrónica (CBE)', 'Instructivo AIN CBE-REC', 'instructivo de presentación electrónica', 1],
    ]],
    ['Informes internos', '📈', [
      ['Informes financieros mensuales internos: tipos y balance mensual de resultados', 'Guía de Seguimiento de Teórico y Tomo Práctico de la Unidad Curricular', 'unidad de informes internos', 2],
    ]],
  ]],
  ['Matemática Financiera', [
    ['Valor tiempo del dinero', '⏱️', [
      ['Interés simple, interés compuesto y descuento de documentos', 'Dumrauf - Matemáticas Financieras', 'capítulo de interés simple y compuesto', 2],
      ['Tasa efectiva, tasa nominal y tasa real', 'Dumrauf - Matemáticas Financieras', 'capítulo de tasas de interés', 1],
    ]],
    ['Rentas y amortización de deudas', '💳', [
      ['Rentas: valuación con cuotas variables, constantes y perpetuas', 'Dumrauf - Matemáticas Financieras', 'capítulo de rentas', 2],
      ['Amortización de deudas y saldo de una deuda', 'Dumrauf - Matemáticas Financieras', 'capítulo de amortización de deudas', 2],
    ]],
    ['Evaluación de inversiones', '📊', [
      ['Inversiones: clasificación, componentes y criterios de evaluación (TIR y VAN)', 'Dumrauf - Matemáticas Financieras', 'capítulo de evaluación de inversiones', 2],
      ['Variables aleatorias aplicadas a los ingresos de una inversión', 'Hillier y Lieberman - Introducción a la Investigación de Operaciones', 'capítulo de análisis probabilístico de inversiones', 2],
    ]],
    ['Seguros', '🛡️', [
      ['Conceptos de demografía y costo puro de seguros', 'Universidad de la República, FCEA - Probabilidad, Fundamentos y Teoría', 'capítulo de matemática actuarial', 1],
    ]],
  ]],
  ['Derecho Digital', [
    ['Introducción al derecho digital', '💻', [
      ['Conceptos de derecho digital y tecnologías de la información', 'Barrio Andrés - Manual de Derecho Digital', 'capítulo introductorio', 1],
      ['Inteligencia artificial', 'Barrio Andrés - Manual de Derecho Digital', 'capítulo de inteligencia artificial', 1],
    ]],
    ['Gobierno electrónico y derechos digitales', '🏛️', [
      ['Gobierno electrónico: AGESIC y políticas públicas de digitalización', 'Delpiazzo y Viega - Lecciones de Derecho Telemático', 'capítulo de gobierno electrónico', 2],
      ['Derechos digitales: protección de datos y del consumidor', 'Delpiazzo - Protección de Datos', 'capítulo de protección de datos', 2],
      ['Documento electrónico, firma electrónica e identificación digital', 'Viega Rodríguez y Rodríguez Acosta - Documento Electrónico y Firma Digital', 'artículo sobre documento y firma electrónica', 1],
      ['Amenazas del sistema: ciberdelito', 'Bergstein - Derecho Penal e Informática', 'artículo en La Justicia Uruguaya', 1],
    ]],
    ['Contratación electrónica y digitalización empresarial', '🤝', [
      ['Contratación electrónica: formación del contrato y jurisdicción aplicable', 'Noblia (coord.) - Contratación Electrónica', 'capítulo de contratación electrónica', 2],
      ['Constitución digital de sociedades y funcionamiento a distancia de órganos sociales', 'Lapique - Digitalización de Sociedades: SA y SAS', 'capítulo de digitalización societaria', 2],
      ['Sistemas de pago, fintech y crowdfunding', 'Gauthier (coord.) - Disrupción, Economía Compartida y Derecho', 'capítulo de fintech y economía digital', 1],
      ['Derecho digital, inteligencia artificial y concurso de acreedores', 'Machado, Gambaro y Marchisio - Los Instrumentos del Administrador Concursal para el Rastreo de Criptoactivos', 'artículo sobre criptoactivos y concurso', 1],
    ]],
  ]],
  ['Legislación Laboral y Seguridad Social', [
    ['Derecho individual y contrato de trabajo', '📝', [
      ['Derecho laboral: concepto, fuentes y principios', 'Pérez del Castillo - Manual Práctico de Normas Laborales', 'capítulo introductorio', 1],
      ['Contrato de trabajo: modalidades, derechos, obligaciones y extinción', 'Pérez del Castillo - Manual Práctico de Normas Laborales', 'capítulo del contrato de trabajo', 2],
      ['Jornada de trabajo: régimen general y descansos', 'Pérez del Castillo - Manual Práctico de Normas Laborales', 'capítulo de jornada de trabajo', 1],
    ]],
    ['Remuneraciones y beneficios', '💵', [
      ['Salarios, aguinaldo y salario vacacional', 'Pérez del Castillo - Manual Práctico de Normas Laborales', 'capítulo de remuneraciones', 2],
      ['Feriados, horas extras y licencias', 'Pérez del Castillo - Manual Práctico de Normas Laborales', 'capítulo de feriados y licencias', 2],
      ['Despido: indemnizaciones y casos especiales', 'Raso Delgue - El Despido', 'capítulo de despido e indemnizaciones', 2],
    ]],
    ['Seguridad social y tributación', '🏦', [
      ['Seguridad social: régimen mixto y prestaciones de actividad', 'Pérez del Castillo y Rodríguez Azcue - Derecho de la Seguridad Social', 'capítulo de régimen de seguridad social', 2],
      ['Tributación a la seguridad social: materia gravada y aportes', 'Pérez del Castillo y Rodríguez Azcue - Derecho de la Seguridad Social', 'capítulo de tributación a la seguridad social', 2],
      ['Sistema Nacional Integrado de Salud: aportes personales y patronales', 'Pérez del Castillo y Rodríguez Azcue - Derecho de la Seguridad Social', 'capítulo del Sistema Nacional Integrado de Salud', 1],
      ['Impuesto a la Renta de las Personas Físicas, Categoría II (dependientes)', 'Pérez del Castillo y Rodríguez Azcue - Derecho de la Seguridad Social', 'capítulo de IRPF categoría II', 2],
    ]],
  ]],
  ['Derecho Tributario', [
    ['Introducción y ingresos estatales', '📜', [
      ['El derecho tributario: concepto y ramas', 'Valdés Costa - Curso de Derecho Tributario', 'capítulo introductorio', 1],
      ['Ingresos estatales: precios, tributos y especies tributarias', 'Valdés Costa - Curso de Derecho Tributario', 'capítulo de ingresos estatales', 2],
    ]],
    ['La norma tributaria', '⚖️', [
      ['Fuentes del derecho tributario y principios constitucionales', 'Valdés Costa - Instituciones de Derecho Tributario', 'capítulo de fuentes y principios', 2],
      ['Interpretación e integración de normas tributarias', 'Valdés Costa - Instituciones de Derecho Tributario', 'capítulo de interpretación', 2],
    ]],
    ['Derecho tributario material', '💰', [
      ['La relación jurídica tributaria: hecho generador y sujetos', 'Valdés Costa, Valdés de Blengio y Sayagués Areco - Código Tributario Comentado y Concordado', 'capítulo de la relación jurídica tributaria', 2],
      ['Exoneraciones y modos de extinción de la obligación tributaria', 'Valdés Costa, Valdés de Blengio y Sayagués Areco - Código Tributario Comentado y Concordado', 'capítulo de exoneraciones y extinción', 2],
    ]],
    ['Derecho tributario formal y procesal', '📋', [
      ['Procedimiento administrativo: liquidación, determinación y facultades de la administración', 'Valdés Costa - Curso de Derecho Tributario', 'capítulo de derecho tributario formal', 2],
      ['Consulta tributaria, devolución de pago indebido y recursos administrativos', 'Valdés Costa - Curso de Derecho Tributario', 'capítulo de procedimientos administrativos', 1],
      ['Medidas cautelares, juicio ejecutivo y acción de nulidad', 'Valdés Costa - Curso de Derecho Tributario', 'capítulo de derecho procesal tributario', 2],
    ]],
    ['Derecho sancionatorio e internacional', '🌍', [
      ['Ilícitos tributarios: mora, defraudación y otras infracciones', 'Berro - Los Ilícitos Tributarios y sus Sanciones', 'capítulo de ilícitos tributarios', 2],
      ['Derecho internacional tributario: doble imposición y tratados', 'Valdés Costa - Curso de Derecho Tributario', 'capítulo de derecho internacional tributario', 2],
    ]],
    ['El sistema tributario nacional', '🏛️', [
      ['Potestad tributaria nacional y departamental', 'Valdés Costa - El Sistema Tributario Uruguayo (Manual de Derecho Financiero)', 'capítulo del sistema tributario uruguayo', 1],
    ]],
  ]],
  ['Contabilidad Social y Ambiental', [
    ['RSE y estándares de sostenibilidad', '🌱', [
      ['La contabilidad y la responsabilidad social empresarial', 'Pampillón y Vidal - Reporte Anual Empresas BIC (Documento Informativo FCEA)', 'documento informativo de la Unidad de Investigación en Contabilidad', 2],
      ['Estándares internacionales de información no financiera: GRI, ODS, NIIF S', 'Vidal y Lagos - S1 y S2: las Primeras NIIF de Sostenibilidad del IFRS', 'documento informativo de la Unidad de Investigación en Contabilidad', 2],
      ['El reporting en las organizaciones', 'Vidal, Ramos y Asuaga - Análisis Comparativo de los Reportes de Sostenibilidad de las Empresas Públicas Uruguayas', 'artículo en Revista Proyecciones', 1],
    ]],
    ['Contabilidad ambiental y social', '🌍', [
      ['La contabilidad ambiental: gestión ambiental e indicadores', 'Vidal y Asuaga - Gestión Ambiental en las Organizaciones: una Revisión de la Literatura', 'artículo en Revista del Instituto Internacional de Costos', 2],
      ['Los costos ambientales', 'Vidal y Núñez - Impactos de la Sostenibilidad en la Contabilidad (Documento Informativo FCEA)', 'documento informativo de la Unidad de Investigación en Contabilidad', 1],
      ['La contabilidad social: contabilidad tridimensional', 'Álvarez - Buscando la Ruta de la Medición-Valoración Ecológica no Monetaria', 'artículo sobre teoría tridimensional', 2],
    ]],
  ]],
  ['Contabilidad Superior I', [
    ['Cuestiones contables fundamentales', '📚', [
      ['El Marco Conceptual para la información financiera del IASB', 'Marco Conceptual para la Información Financiera (IASB)', 'marco conceptual', 2],
      ['Los modelos contables, las NIIF y las NIIF para PYMES', 'Normas Internacionales de Información Financiera (IASB)', 'introducción a las NIIF', 2],
    ]],
    ['Presentación de estados financieros', '📑', [
      ['Presentación de estados financieros, políticas contables y hechos posteriores', 'NIIF para las PYMES', 'secciones 3, 8 y 10', 2],
    ]],
    ['Reconocimiento y medición de activos y pasivos', '🏗️', [
      ['Propiedad, planta y equipo, propiedad de inversión e intangibles', 'NIIF para las PYMES', 'secciones 16, 17 y 18', 2],
      ['Deterioro de activos e instrumentos financieros', 'NIIF para las PYMES', 'secciones 11, 12 y 27', 2],
      ['Provisiones, activos y pasivos contingentes', 'NIIF para las PYMES', 'sección 21', 1],
    ]],
    ['Reconocimiento y medición de resultados', '💹', [
      ['Reconocimiento de ingresos y resultados financieros', 'NIIF para las PYMES', 'secciones 23 y 25', 2],
      ['Impuesto a la renta', 'NIIF para las PYMES', 'sección 29', 1],
    ]],
    ['La unidad de medida', '💱', [
      ['Moneda funcional y conversión de estados financieros a moneda extranjera', 'NIIF para las PYMES', 'sección 30', 2],
    ]],
  ]],
  ['Administración y Planificación Financiera', [
    ['Introducción a la administración financiera', '💼', [
      ['Rol de las finanzas en decisiones personales y organizacionales, y áreas de las finanzas', 'Pascale - Decisiones Financieras', 'capítulo introductorio a las finanzas', 1],
    ]],
    ['Valuación', '💲', [
      ['Valor del dinero en el tiempo, inflación y tasa real', 'Pascale - Decisiones Financieras', 'capítulo de valuación', 2],
      ['Riesgo y rendimiento', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'capítulo de riesgo y rendimiento', 2],
    ]],
    ['Herramientas de análisis financiero', '🔍', [
      ['Estados financieros, indicadores e interpretación del desempeño financiero', 'Pascale - Decisiones Financieras', 'capítulo de análisis financiero', 2],
    ]],
    ['Administración del capital de trabajo', '📦', [
      ['Gestión del efectivo, inventarios, cuentas a cobrar y a pagar', 'Pascale - Decisiones Financieras', 'capítulo de capital de trabajo', 2],
    ]],
    ['Planificación financiera', '📅', [
      ['El proceso de planificación financiera y estados financieros proyectados', 'Pascale - Decisiones Financieras', 'capítulo de planificación financiera', 2],
    ]],
    ['Decisiones de inversión', '📈', [
      ['Flujos de fondos, tasa de retorno requerida e indicadores de inversión', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'capítulo de decisiones de inversión', 2],
    ]],
    ['Decisiones de financiamiento y dividendos', '🏦', [
      ['Estructura de capital, apalancamiento y fuentes de financiamiento', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'capítulo de estructura de capital', 2],
      ['Políticas de dividendos', 'Ross, Westerfield y Jaffe - Finanzas Corporativas', 'capítulo de política de dividendos', 1],
    ]],
    ['Finanzas personales y educación financiera', '👛', [
      ['Presupuesto personal, ahorro, endeudamiento y productos financieros', 'Pascale - Decisiones Financieras', 'capítulo de finanzas personales', 1],
    ]],
  ]],
];

aplicarMaterias(MATERIAS);
