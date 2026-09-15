// Expande 14 materias de FCEA (Contador Público, Economía) con su temario
// real, sacado de las "Fichas de Unidad Curricular" oficiales de
// fcea.udelar.edu.uy. Paráfrasis tipo tabla de contenidos a partir de
// "Explicitar contenido desagregado", nunca copia textual.
const { aplicarMaterias } = require('./_fcea-engine');

const MATERIAS = [
  ['Control Interno', [
    ['Introducción y evolución del control interno', '🔍', [
      ['Origen y evolución del concepto de control interno: AICPA, COSO 1992 y COSO 2013', 'COSO - Control Interno: Marco Integrado (2013)', 'capítulo de evolución histórica del control interno', 1],
    ]],
    ['Marco Integrado COSO 2013', '🧩', [
      ['Definición, objetivos, componentes y principios del control interno', 'COSO - Control Interno: Marco Integrado (2013)', 'capítulo del marco integrado', 2],
      ['Componentes: entorno de control, evaluación de riesgos, actividades de control, información y supervisión', 'COSO - Control Interno: Marco Integrado (2013)', 'capítulo de componentes del control interno', 2],
    ]],
    ['Planificación y gestión del riesgo', '⚠️', [
      ['Planificación estratégica, objetivos y riesgos relacionados', 'COSO - Control Interno: Marco Integrado (2013)', 'capítulo de planificación y riesgos', 2],
      ['Gestión del Riesgo Empresarial (ERM 2017)', 'COSO - Enterprise Risk Management: Integrating with Strategy and Performance (2017)', 'capítulo de gestión del riesgo empresarial', 2],
    ]],
    ['Gobierno corporativo e integración', '🏛️', [
      ['Gobierno corporativo: conceptos, actores y modelos de buenas prácticas', 'Apuntes de cátedra', 'unidad de gobierno corporativo', 1],
      ['Integración entre gobierno corporativo, control interno, gestión de riesgos y planificación estratégica', 'Apuntes de cátedra', 'unidad de integración de conceptos', 1],
    ]],
    ['Evaluación del control interno', '📋', [
      ['Aplicación del control interno en el contexto de PYME', 'COSO - Control Interno: Marco Integrado (2013)', 'guía de aplicación en PYME', 1],
      ['Evaluación del control interno por componentes y ciclos operativos', 'COSO - Control Interno: Marco Integrado (2013)', 'capítulo de evaluación del control interno', 2],
      ['Otros modelos: COCO y modelos focalizados en tecnología de la información', 'Apuntes de cátedra', 'unidad de otros modelos de control', 1],
    ]],
  ]],
  ['Auditoría I', [
    ['Fundamentos de auditoría', '🔎', [
      ['Conceptos generales de auditoría y marco normativo local e internacional', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'marco normativo de auditoría', 1],
      ['La auditoría basada en riesgos', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'NIA 315 y 330: identificación y respuesta a riesgos', 2],
      ['Herramientas de Data Analytics para la auditoría de estados financieros', 'Guía para el Uso de las NIAs en Auditoría de PYMEs (IFAC)', 'guía de orientación práctica', 1],
    ]],
    ['Auditoría por rubro', '📊', [
      ['Auditoría de efectivo, deudores comerciales e inventarios', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'particularidades de auditoría por capítulo contable', 2],
      ['Auditoría de activos no corrientes y acreedores comerciales', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'particularidades de auditoría por capítulo contable', 2],
      ['Auditoría de provisiones, contingencias, patrimonio y resultados', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'particularidades de auditoría por capítulo contable', 2],
    ]],
    ['Finalización de la auditoría', '✅', [
      ['Tareas de finalización: hechos posteriores y empresa en funcionamiento', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'NIA 560 y 570', 1],
      ['Formación de la opinión sobre los estados financieros', 'Normas Internacionales de Auditoría (NIAs, IFAC)', 'NIA 700', 2],
    ]],
  ]],
  ['Tributaria II', [
    ['Imposición a la renta personal', '💰', [
      ['IRPF: hecho generador, sujetos pasivos y elementos cuantificantes', 'Selección de Lecturas de la cátedra de Derecho Tributario', 'unidad I: imposición a la renta personal', 2],
      ['IRPF: deducciones, exoneraciones, liquidación y dividendos fictos', 'Selección de Lecturas de la cátedra de Derecho Tributario', 'unidad I: imposición a la renta personal', 2],
      ['Imposición a la renta de los no residentes (IRNR)', 'Selección de Lecturas de la cátedra de Derecho Tributario', 'unidad I: imposición a la renta personal', 1],
    ]],
    ['Impuesto al patrimonio personal', '🏠', [
      ['Impuesto al Patrimonio personal: hecho generador, sujetos y elementos cuantificantes', 'Quaglia - Manual Práctico de Liquidación del Impuesto al Patrimonio', 'capítulo de impuesto al patrimonio personal', 2],
    ]],
    ['Imposición al consumo', '🛒', [
      ['IVA: hecho generador, sujetos pasivos, alícuotas y liquidación', 'Blanco - El Impuesto al Valor Agregado, Vol. 1', 'capítulo de hecho generador y liquidación del IVA', 2],
      ['IMESI: hecho generador, sujetos pasivos y liquidación', 'Blanco - El Impuesto al Valor Agregado, Vol. 2', 'capítulo del Impuesto Específico Interno', 1],
    ]],
  ]],
  ['Auditoría Interna', [
    ['Fundamentos de la función', '🏢', [
      ['Orígenes y esencia de la función de Auditoría Interna', 'Gubba, Gutfraind, Montone, Rodríguez, Sauleda y Villarmarzo - Auditoría, Guía para su Planificación y Ejecución', 'capítulo 26', 2],
      ['Marco normativo que regula la actividad de Auditoría Interna', 'Instituto de Auditores Internos de España - Más Allá del Aseguramiento: el Auditor Interno como Asesor de Confianza', 'declaración de posición sobre el rol del auditor interno', 1],
    ]],
    ['El proceso de auditoría interna', '🔄', [
      ['El proceso de Auditoría Interna', 'Gubba, Gutfraind, Montone, Rodríguez, Sauleda y Villarmarzo - Auditoría, Guía para su Planificación y Ejecución', 'capítulo del proceso de auditoría', 2],
      ['Auditoría interna y auditoría operativa o de gestión', 'Apuntes de cátedra', 'unidad de auditoría operativa', 1],
      ['Auditoría interna y auditoría de la actividad informática', 'Instituto de Auditores Internos de España - Auditoría Interna del Proceso de Inversión en Tecnologías Emergentes', 'informe sobre auditoría de tecnologías emergentes', 2],
    ]],
    ['Auditoría interna por sector', '🏦', [
      ['Auditoría interna en el sector financiero', 'Apuntes de cátedra', 'unidad de auditoría interna en el sector financiero', 1],
      ['Auditoría interna en el sector público', 'Apuntes de cátedra', 'unidad de auditoría interna en el sector público', 1],
    ]],
    ['Riesgos específicos', '🚨', [
      ['Auditoría interna y los sistemas de prevención del lavado de activos', 'Apuntes de cátedra', 'unidad de prevención de lavado de activos', 2],
      ['Auditoría interna y fraude', 'Apuntes de cátedra', 'unidad de auditoría interna y fraude', 2],
    ]],
  ]],
  ['Macroeconomía I', [
    ['Introducción y hechos macroeconómicos', '📊', [
      ['Hechos macroeconómicos básicos: PIB, desempleo e inflación, ley de Okun y curva de Phillips', 'Blanchard - Macroeconomía', 'capítulos 1 y 2', 2],
    ]],
    ['El corto plazo', '📉', [
      ['El mercado de bienes: composición del PIB y la cruz keynesiana', 'Blanchard - Macroeconomía', 'capítulo 3', 2],
      ['Los mercados financieros: demanda de dinero y política monetaria', 'Blanchard - Macroeconomía', 'capítulo 4', 2],
      ['El modelo IS-LM: mercados de bienes y financieros', 'Blanchard - Macroeconomía', 'capítulo 5', 2],
    ]],
    ['El medio plazo', '⚖️', [
      ['El mercado de trabajo: salarios, precios y desempleo', 'Blanchard - Macroeconomía', 'capítulo 6', 2],
      ['La curva de Phillips y la tasa natural de desempleo', 'Blanchard - Macroeconomía', 'capítulo 8', 2],
      ['Del corto al medio plazo: el modelo IS-LM-PC', 'Blanchard - Macroeconomía', 'capítulo 9', 2],
    ]],
    ['Las expectativas', '🔮', [
      ['Los mercados financieros y las expectativas: precios de bonos y acciones', 'Blanchard - Macroeconomía', 'capítulo 14', 2],
      ['Las expectativas, el consumo y la inversión', 'Blanchard - Macroeconomía', 'capítulo 15', 2],
      ['Las expectativas, la producción y la política macroeconómica', 'Blanchard - Macroeconomía', 'capítulo 16', 1],
    ]],
  ]],
  ['Historia Económica Mundial', [
    ['Fundamentos y crecimiento moderno', '🌍', [
      ['Etapas en la historia económica mundial', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'introducción', 1],
      ['El crecimiento económico moderno y la Gran Divergencia', 'Allen - Historia Económica Mundial: una Breve Introducción', 'capítulos 1 y 2', 2],
    ]],
    ['Capitalismo industrial y primera globalización', '🏭', [
      ['El surgimiento del capitalismo industrial: la Primera Revolución Industrial', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo 5', 2],
      ['La primera globalización capitalista, 1870-1914', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo 6', 2],
    ]],
    ['Guerras y entreguerras', '⚔️', [
      ['Guerra y revolución, 1914-1919: economía de guerra y Revolución Rusa', 'Béjar - Historia del Siglo XX', 'capítulo de la Primera Guerra Mundial', 2],
      ['La economía mundial en los años 20: dilemas monetarios y prosperidad estadounidense', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo de los años 20', 1],
      ['La economía mundial en los años 30: la Gran Depresión y el ascenso del fascismo', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo de la Gran Depresión', 2],
    ]],
    ['Segunda Guerra Mundial y edad dorada', '🕊️', [
      ['La Segunda Guerra Mundial y sus consecuencias económicas', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo de la Segunda Guerra Mundial', 2],
      ['La edad dorada de la economía mundial, 1945-1973', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo de la edad dorada', 2],
    ]],
    ['Socialismo real y periferia', '☭', [
      ['Auge y crisis del socialismo real: la URSS y China', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo del socialismo real', 1],
      ['La economía de las regiones periféricas: descolonización y Tercer Mundo', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo de la periferia', 1],
    ]],
    ['Fin de siglo y economía contemporánea', '🌐', [
      ['El final del siglo XX: crisis, derrumbe del socialismo real y segunda globalización', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo de fin de siglo', 2],
      ['La economía mundial en el siglo XXI: China, mercados mundiales y crisis de 2008', 'Comín - Historia Económica Mundial: de los Orígenes a la Actualidad', 'capítulo del siglo XXI', 1],
    ]],
  ]],
  ['Microeconomía II', [
    ['Equilibrio general y bienestar', '⚖️', [
      ['Equilibrio general y bienestar: asignaciones eficientes y teoremas del bienestar', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo 12', 2],
    ]],
    ['Economía política', '🗳️', [
      ['Economía política: reglas de elección colectiva y teorema de imposibilidad de Arrow', 'Nicholson - Teoría Microeconómica: Principios Básicos y Aplicaciones', 'capítulo 13', 2],
    ]],
    ['Teoría de juegos y oligopolio', '🎲', [
      ['Juegos estáticos y dinámicos con información completa: equilibrio de Nash', 'Gibbons - Un Primer Curso de Teoría de Juegos', 'capítulos 1 y 2', 2],
      ['Modelos de competencia imperfecta: Cournot, Bertrand y Stackelberg', 'Cabral - Economía Industrial', 'capítulo 8.4', 2],
    ]],
    ['Externalidades y bienes públicos', '🌳', [
      ['Externalidades y bienes públicos: internalización e impuestos pigouvianos', 'Cowell - Microeconomics', 'capítulo 9', 2],
    ]],
    ['Regulación de monopolios naturales', '🏭', [
      ['Regulación de monopolios naturales: precios no lineales y precios Ramsey', 'Notas docentes - Regulación de Monopolios Naturales', 'material de la cátedra', 2],
    ]],
  ]],
  ['Macroeconomía III', [
    ['Modelos con tasas constantes', '📐', [
      ['El modelo neoclásico de crecimiento de Solow-Swan', 'Sala-i-Martín - Apuntes de Crecimiento Económico', 'capítulo del modelo de Solow-Swan', 2],
      ['Crecimiento endógeno y otras extensiones del modelo de Solow-Swan', 'Sala-i-Martín - Apuntes de Crecimiento Económico', 'capítulo de extensiones del modelo', 2],
    ]],
    ['Modelos neoclásicos de optimización', '📊', [
      ['Crecimiento neoclásico: el modelo de Ramsey', 'Sala-i-Martín - Apuntes de Crecimiento Económico', 'capítulo del modelo de Ramsey', 2],
      ['El crecimiento exógeno de la productividad', 'Sala-i-Martín - Apuntes de Crecimiento Económico', 'capítulo de productividad exógena', 1],
    ]],
    ['Modelos prototipo de crecimiento endógeno', '🔄', [
      ['El modelo AK y el gasto público en el crecimiento', 'Sala-i-Martín - Apuntes de Crecimiento Económico', 'capítulo de modelos de crecimiento endógeno', 2],
      ['Aprendizaje por la práctica, capital humano y progreso tecnológico endógeno', 'Sala-i-Martín - Apuntes de Crecimiento Económico', 'capítulo de la economía de las ideas', 2],
    ]],
    ['Evidencia empírica y nuevos tópicos', '🤖', [
      ['La literatura empírica del crecimiento económico', 'Barro y Sala-i-Martín - Crecimiento Económico', 'capítulo de evidencia empírica', 1],
      ['Inteligencia artificial y crecimiento económico', 'Acemoglu - The Simple Macroeconomics of AI', 'artículo en Economic Policy', 1],
    ]],
  ]],
  ['Estadística II', [
    ['Teoría de la inferencia estadística', '📐', [
      ['Introducción a la teoría de la inferencia estadística: población, parámetro y muestra', 'Casella y Berger - Statistical Inference', 'capítulo introductorio', 1],
    ]],
    ['Enfoque clásico de la inferencia', '📊', [
      ['Estadísticos y su distribución en el muestreo de poblaciones', 'Casella y Berger - Statistical Inference', 'capítulo de distribuciones muestrales', 2],
      ['Estimación puntual: método de momentos y máxima verosimilitud', 'Casella y Berger - Statistical Inference', 'capítulo de estimación puntual', 2],
      ['Estimación por intervalos de confianza', 'Casella y Berger - Statistical Inference', 'capítulo de estimación por intervalos', 2],
      ['Contrastes de hipótesis paramétricas', 'Casella y Berger - Statistical Inference', 'capítulo de contraste de hipótesis', 2],
      ['Convergencia en probabilidad y teorema del límite central', 'Casella y Berger - Statistical Inference', 'capítulo de teoría asintótica', 2],
    ]],
    ['Muestreo de poblaciones finitas', '🔢', [
      ['Muestreo de poblaciones finitas: estimadores de Horvitz-Thompson', 'Peña Sánchez - Fundamentos de Estadística', 'capítulo de muestreo de poblaciones finitas', 2],
    ]],
  ]],
  ['Introducción a la Metodología', [
    ['La metodología de la economía', '🔬', [
      ['El trabajo profesional del economista como resolución de problemas', 'Apuntes de cátedra', 'módulo I: la metodología de la economía', 1],
    ]],
    ['Ética profesional', '⚖️', [
      ['Ética profesional: bien interno, bien externo, plagio y autoría', 'Cortina - Universalizar la Aristocracia: por una Ética de las Profesiones', 'artículo en Revista de Santander', 1],
      ['Dilemas del uso de inteligencia artificial en el ejercicio profesional', 'DeMartino - Ética Profesional Económica: por qué Debería Importarle a los Economistas Heterodoxos', 'artículo en Economic Thought', 1],
    ]],
    ['Competencias de lectura y escritura', '✍️', [
      ['Estructuración de textos, resúmenes y argumentación en economía', 'Becker - Manual de Escritura para Científicos Sociales', 'capítulos 2 y 3', 1],
    ]],
    ['Metodología de la investigación en economía', '🔎', [
      ['Problema y pregunta de investigación, marco teórico e hipótesis', 'Gerring - Metodología de las Ciencias Sociales', 'capítulos 1 a 4', 2],
      ['Diseño de investigación y revisión bibliográfica', 'Gerring - Case Study Research: Principles and Practices', 'parte I', 2],
    ]],
  ]],
  ['Economía del Uruguay', [
    ['Conceptos básicos introductorios', '📖', [
      ['Conceptos básicos introductorios de la economía uruguaya', 'Astori - Enfoque Crítico de los Modelos de Contabilidad Social', 'capítulo I', 1],
    ]],
    ['El modelo ganadero-exportador', '🐄', [
      ['El surgimiento y la conformación de la economía nacional', 'Barrán y Nahum - El Problema Nacional y el Estado: un Marco Histórico', 'capítulo 2 de Historia Política e Historia Económica', 2],
      ['Sectores agropecuario, industrial, servicios, público y mercado de trabajo del modelo ganadero-exportador', 'Bertino, Bertoni, Jaffé y Tajam - La Larga Marcha hacia un Frágil Resultado 1900-1955', 'capítulo del modelo ganadero-exportador', 2],
    ]],
    ['El modelo industrial', '🏭', [
      ['El modelo industrial: fundamentos de la industrialización', 'Bertino, Bertoni, Jaffé y Tajam - La Larga Marcha hacia un Frágil Resultado 1900-1955', 'capítulo del modelo industrial', 2],
    ]],
    ['Reajuste autoritario y liberalización', '⚙️', [
      ['El reajuste autoritario e inicio del modelo de liberalización y apertura', 'Rodríguez, Barbato y Macadar - La Crisis Uruguaya y el Problema Nacional', 'capítulo del reajuste autoritario', 2],
    ]],
    ['Apertura y liberalización de los 90', '📉', [
      ['El modelo de apertura y liberalización de los 90 y la crisis 1999-2002', 'Olesker - Crecimiento y Exclusión: Nacimiento, Consolidación y Crisis del Nuevo Modelo de Acumulación Capitalista en Uruguay 1968-2000', 'capítulo de la liberalización de los 90', 2],
    ]],
    ['Recuperación económica 2004-2016', '📈', [
      ['La recuperación económica 2004-2016: descripción sectorial', 'Bertino, Bertoni, Jaffé y Tajam - La Larga Marcha hacia un Frágil Resultado 1900-1955', 'capítulo de la recuperación económica', 1],
    ]],
    ['Trayectoria de los modelos de desarrollo', '🛤️', [
      ['Visión de la trayectoria de los modelos de desarrollo uruguayo', 'Astori - Enfoque Crítico de los Modelos de Contabilidad Social', 'capítulo de síntesis', 1],
    ]],
  ]],
  ['Microeconomía III', [
    ['Decisión bajo incertidumbre', '🎲', [
      ['Teoría de la decisión bajo incertidumbre: riesgo, actitudes frente al riesgo y seguros', 'Eeckhoudt, Gollier y Schlesinger - Economic and Financial Decisions under Risk', 'capítulos 1 y 2', 2],
    ]],
    ['Juegos con información incompleta', '🃏', [
      ['Juegos estáticos con información incompleta: equilibrio bayesiano de Nash', 'Gibbons - Un Primer Curso de Teoría de Juegos', 'capítulo 3', 2],
      ['Juegos dinámicos con información incompleta: equilibrio bayesiano perfecto y señalización', 'Gibbons - Un Primer Curso de Teoría de Juegos', 'capítulo 4', 2],
    ]],
    ['Teoría de contratos y economía del comportamiento', '📝', [
      ['Teoría de contratos: selección adversa, riesgo moral y contratos incompletos', 'Laffont y Martimort - The Theory of Incentives: The Principal Agent Model', 'capítulos 1, 2 y 4', 2],
      ['Economía del comportamiento: sesgos, experimentos y avances en teoría de juegos', 'Laffont y Martimort - The Theory of Incentives: The Principal Agent Model', 'capítulo de economía del comportamiento', 1],
    ]],
  ]],
  ['Economía Internacional', [
    ['Comercio internacional', '🚢', [
      ['Patrón de comercio, cadenas de valor y modelo de gravedad', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo introductorio', 2],
      ['La ventaja comparativa de David Ricardo', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo de la ventaja comparativa', 2],
      ['La dotación de factores de Heckscher y Ohlin', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo del modelo Heckscher-Ohlin', 2],
      ['Economías de escala y comercio internacional', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo de economías de escala', 1],
    ]],
    ['Política comercial e integración', '🤝', [
      ['Política comercial y procesos de integración económica', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo de política comercial', 2],
    ]],
    ['Macroeconomía de economías abiertas', '🌐', [
      ['Movimientos financieros internacionales y política monetaria', 'Sachs y Larraín - Macroeconomía en la Economía Global', 'capítulo de movimientos financieros internacionales', 2],
      ['El modelo DD-AA de economía abierta', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo del modelo DD-AA', 2],
      ['El modelo de bienes transables y no transables', 'Sachs y Larraín - Macroeconomía en la Economía Global', 'capítulo de bienes transables', 1],
    ]],
    ['Sistema monetario internacional', '💱', [
      ['Los sistemas monetarios internacionales: aproximación histórica', 'Obstfeld y Rogoff - Foundations of International Macroeconomics', 'capítulo 1', 2],
      ['Globalización financiera: oportunidades y crisis', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo de globalización financiera', 1],
      ['Áreas monetarias óptimas', 'Krugman, Obstfeld y Melitz - Economía Internacional: Teoría y Política', 'capítulo de áreas monetarias óptimas', 1],
    ]],
  ]],
  ['Teorías del Desarrollo Económico', [
    ['Evolución de las teorías del desarrollo', '📚', [
      ['Panorámica y evolución de las teorías del desarrollo y la economía política del desarrollo', 'Bertoni et al. - Manual de Problemas del Desarrollo', 'capítulo 1', 2],
    ]],
    ['Perspectivas sobre acumulación y crecimiento', '📈', [
      ['Perspectivas sobre acumulación, distribución y crecimiento: clásicos, Keynes y Piketty', 'Bustelo - Teorías Contemporáneas del Desarrollo Económico', 'capítulo de tradición clásica y keynesiana', 2],
      ['Los pioneros de la economía del desarrollo: Hirschman, Rosenstein-Rodan, Prebisch y el modelo de Lewis', 'Meier y Seers - Pioneros del Desarrollo', 'capítulos sobre los pioneros del desarrollo', 2],
      ['La innovación en las teorías del desarrollo: Schumpeter y los sistemas de innovación', 'Schumpeter - Teoría del Desenvolvimiento Económico', 'capítulo 2', 2],
    ]],
    ['Instituciones y visión ampliada del desarrollo', '🏛️', [
      ['Las instituciones y el desarrollo: institucionalismo y autogobierno', 'Rutherford - La Economía Institucional: Antes y Ahora', 'artículo en Análisis Económico', 1],
      ['Una visión más amplia: cultura, libertad y justicia en el desarrollo', 'Sen - Teorías del Desarrollo a Principios del Siglo XXI', 'capítulo en El Desarrollo Económico y Social en los Umbrales del Siglo XXI (BID)', 2],
    ]],
    ['Problemas actuales del desarrollo', '🌎', [
      ['Desarrollo económico y la inserción en el mercado global: cadenas globales de valor', 'Bertoni et al. - Manual de Problemas del Desarrollo', 'capítulo de cadenas globales de valor', 2],
      ['Desarrollo y ambiente: desarrollo sostenible y economía ecológica', 'Bertoni et al. - Manual de Problemas del Desarrollo', 'capítulo de desarrollo y ambiente', 1],
      ['Desarrollo y nuevos paradigmas de la innovación', 'Bertoni et al. - Manual de Problemas del Desarrollo', 'capítulo de innovación y desarrollo', 1],
      ['Desarrollo económico territorial', 'Bertoni et al. - Manual de Problemas del Desarrollo', 'capítulo de desarrollo territorial', 1],
    ]],
  ]],
];

aplicarMaterias(MATERIAS);
