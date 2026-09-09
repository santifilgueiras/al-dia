// Agrega la Facultad de Información y Comunicación (FIC, UDELAR) con sus 3
// carreras con malla curricular pública completa: Licenciatura en
// Comunicación (orientación Periodismo cargada como representativa de las 7
// orientaciones reales), Licenciatura en Archivología y Licenciatura en
// Bibliotecología. Ingeniería de Medios (4ta carrera de FIC, arrancó marzo
// 2026) NO se carga -- ver el comentario en mockup-firme.html y el bloque de
// abajo para el motivo.
//
// Fuente: https://mallas-curriculares.fic.edu.uy/ (páginas de cada carrera,
// verificadas con WebFetch dirigido para distinguir obligatorio/optativo
// real). Las páginas de malla no traen programa temático detallado (solo
// nombre de UC + semestre) -- los 2-4 temas por materia se destilaron con
// currícula estándar de cada disciplina y bibliografía clásica reconocida
// por área (ver funciones de bibliografía más abajo).
//
// 13 UC (+ la variante I/II de una de ellas) son el mismo curso real en más
// de una de estas 3 carreras -- se cargan con el mismo objeto JS (mismos
// `modulos`, por referencia) en cada catálogo donde aparecen, así el
// contenido queda byte a byte idéntico: Curso Introductorio, Introducción a
// la Epistemología, Historia de las Ideas, Metodología de la Investigación
// en Información y Comunicación, Fundamentos de Inteligencia Artificial,
// Diseño Asistido de Software, Diseño y Análisis, Estadística Básica,
// Administración en Unidades de Información I/II, Documentación Audiovisual,
// Introducción a la Preservación Digital, Redes y Sistemas, Bases de Datos.
//
// "Estudios de Usuarios de Información" y "Planeamiento en el Área de la
// Información" también existen con el mismo nombre en Archivología y
// Bibliotecología, pero la fuente NO los marca como el mismo código de UC
// compartido (a diferencia de los 13 de arriba) -- se cargaron con
// contenido similar pero tematizado distinto para cada carrera (ver
// materiasArchivologia/materiasBibliotecologia), a propósito no
// byte-idénticos.
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');

// ---------------------------------------------------------------------
// Helpers de bibliografía (una función por texto clásico de referencia,
// mismo patrón que scripts/agregar-catalogo-estadistica.js y
// scripts/agregar-catalogo-fcea.js)
// ---------------------------------------------------------------------
const APUNTES = { libro: 'Apuntes de cátedra', seccion: 'material de curso (sin libro de texto clásico único)' };
function mattelart(seccion) { return { libro: 'Mattelart & Mattelart -- Historia de las teorías de la comunicación', seccion }; }
function wolf(seccion) { return { libro: 'Wolf -- La investigación de la comunicación de masas', seccion }; }
function eco(seccion) { return { libro: 'Eco -- Tratado de semiótica general', seccion }; }
function aumont(seccion) { return { libro: 'Aumont -- Estética del cine', seccion }; }
function bordwellThompson(seccion) { return { libro: 'Bordwell & Thompson -- El arte cinematográfico', seccion }; }
function kovachRosenstiel(seccion) { return { libro: 'Kovach & Rosenstiel -- Los elementos del periodismo', seccion }; }
function martinezAlbertos(seccion) { return { libro: 'Martínez Albertos -- Curso general de redacción periodística', seccion }; }
function frascara(seccion) { return { libro: 'Frascara -- Diseño gráfico y comunicación', seccion }; }
function walpole(seccion) { return { libro: 'Walpole, Myers & Myers -- Probabilidad y Estadística para Ingeniería y Ciencias', seccion }; }
function russellNorvig(seccion) { return { libro: 'Russell & Norvig -- Inteligencia Artificial: un enfoque moderno', seccion }; }
function cruzMundet(seccion) { return { libro: 'Cruz Mundet -- Manual de Archivística', seccion }; }
function ogden(seccion) { return { libro: 'Ogden -- Preservación de materiales bibliotecarios y de archivo', seccion }; }
function gilUrdiciain(seccion) { return { libro: 'Gil Urdiciain -- Manual de lenguajes documentales', seccion }; }
function chaumier(seccion) { return { libro: 'Chaumier -- Análisis y lenguajes documentales', seccion }; }
function isbdRda(seccion) { return { libro: 'ISBD/RDA -- Apuntes de cátedra (normativa técnica)', seccion }; }
function gomezHernandez(seccion) { return { libro: 'Gómez Hernández -- Gestión de bibliotecas', seccion }; }
function hernandezSampieri(seccion) { return { libro: 'Hernández Sampieri -- Metodología de la investigación', seccion }; }
function tanenbaum(seccion) { return { libro: 'Tanenbaum -- Redes de computadoras', seccion }; }
function silberschatz(seccion) { return { libro: 'Silberschatz, Korth & Sudarshan -- Fundamentos de bases de datos', seccion }; }

function materia(nombre, modulos) { return { nombre, modulos }; }
function mod(modulo, temas) { return { modulo, temas }; }

// ---------------------------------------------------------------------
// Materias compartidas byte a byte entre las 3 carreras (o entre 2 de
// ellas) -- se reusa el MISMO objeto JS en cada catálogo.
// ---------------------------------------------------------------------
const cursoIntroductorio = materia('Curso Introductorio', [
  mod('La universidad y la vida académica', [
    'Organización de la Universidad de la República y la vida estudiantil',
    'Herramientas y estrategias para el estudio universitario',
  ]),
  mod('Introducción al campo de la información y la comunicación', [
    'Panorama de las disciplinas de la información y la comunicación en la FIC',
    'La sociedad de la información y el conocimiento',
  ]),
]);

const introEpistemologia = materia('Introducción a la Epistemología', [
  mod('Qué es la ciencia y el conocimiento científico', [
    'Criterios de demarcación entre ciencia y no-ciencia',
    'Corrientes epistemológicas clásicas: positivismo, falsacionismo y paradigmas',
  ]),
  mod('Epistemología de las ciencias sociales y humanas', [
    'Particularidades del conocimiento en las ciencias sociales',
    'Debates contemporáneos sobre la construcción social del conocimiento',
  ]),
]);

const historiaDeLasIdeas = materia('Historia de las Ideas', [
  mod('Del pensamiento clásico a la modernidad', [
    'Ideas filosóficas y políticas de la Antigüedad y el mundo clásico',
    'La Ilustración y el pensamiento moderno',
  ]),
  mod('Pensamiento contemporáneo', [
    'Corrientes del pensamiento social y político de los siglos XIX y XX',
    'Recepción y circulación de las ideas en América Latina',
  ]),
]);

const metodologiaInvestigacion = materia('Metodología de la Investigación en Información y Comunicación', [
  mod('Diseño de la investigación', [
    'El proceso de investigación: planteamiento del problema y objetivos',
    'Enfoques cuantitativo y cualitativo en información y comunicación',
  ]),
  mod('Técnicas de recolección y análisis', [
    'Técnicas de recolección de datos: encuesta, entrevista y análisis documental',
    'Elaboración del proyecto de investigación y del informe final',
  ]),
]);

const fundamentosIA = materia('Fundamentos de Inteligencia Artificial', [
  mod('Fundamentos y técnicas de IA', [
    'Historia y fundamentos de la inteligencia artificial',
    'Aprendizaje automático: conceptos básicos y tipos de aprendizaje',
  ]),
  mod('IA aplicada a la información y la sociedad', [
    'Procesamiento del lenguaje natural y recuperación de información',
    'Ética y sesgos en sistemas de inteligencia artificial',
  ]),
]);

const disenioAsistidoSoftware = materia('Diseño Asistido de Software', [
  mod('Herramientas de diseño asistido por computadora', [
    'Software de diseño gráfico y edición para unidades de información',
    'Principios de usabilidad y diseño de interfaces',
  ]),
  mod('Diseño de flujos y procesos con software', [
    'Modelado de procesos y diagramación con herramientas digitales',
    'Buenas prácticas de documentación técnica de un proyecto de software',
  ]),
]);

const disenioYAnalisis = materia('Diseño y Análisis', [
  mod('Fundamentos del diseño gráfico', [
    'Elementos y principios de composición visual',
    'Tipografía, color y retícula en el diseño de piezas gráficas',
  ]),
  mod('Diseño para la comunicación de información', [
    'Diseño de información y visualización de datos',
    'Análisis crítico de piezas de diseño gráfico y comunicacional',
  ]),
]);

const estadisticaBasica = materia('Estadística Básica', [
  mod('Estadística descriptiva aplicada a información y comunicación', [
    'Organización y presentación de datos: tablas y gráficos',
    'Medidas de tendencia central y de dispersión aplicadas a estudios de usuarios',
  ]),
  mod('Nociones de probabilidad y muestreo', [
    'Nociones básicas de probabilidad y variables aleatorias',
    'Diseño de muestras para estudios de usuarios y bibliotecas',
  ]),
]);

const adminUnidadesInfoI = materia('Administración en Unidades de Información I', [
  mod('Fundamentos de la administración de unidades de información', [
    'Planificación estratégica en bibliotecas y archivos',
    'Estructura organizativa y funciones del personal en unidades de información',
  ]),
  mod('Gestión de recursos', [
    'Gestión de recursos humanos, materiales y presupuestarios',
    'Evaluación de servicios y calidad en unidades de información',
  ]),
]);

const adminUnidadesInfoII = materia('Administración en Unidades de Información II', [
  mod('Planeamiento y marketing de servicios', [
    'Marketing y difusión de servicios de información',
    'Planificación de proyectos en unidades de información',
  ]),
  mod('Dirección y evaluación', [
    'Liderazgo y dirección de equipos en bibliotecas y archivos',
    'Indicadores de gestión y evaluación de desempeño',
  ]),
]);

const documentacionAudiovisual = materia('Documentación Audiovisual', [
  mod('Tratamiento documental de materiales audiovisuales', [
    'Características y soportes de los documentos audiovisuales',
    'Descripción y catalogación de materiales audiovisuales',
  ]),
  mod('Gestión y difusión de archivos audiovisuales', [
    'Conservación y digitalización de fondos audiovisuales',
    'Acceso y difusión de colecciones audiovisuales',
  ]),
]);

const introPreservacionDigital = materia('Introducción a la Preservación Digital', [
  mod('Fundamentos de la preservación digital', [
    'Riesgos de obsolescencia tecnológica y pérdida de información digital',
    'Estrategias de preservación: migración, emulación y metadatos de preservación',
  ]),
  mod('Modelos y políticas de preservación', [
    'El modelo de referencia OAIS',
    'Políticas institucionales de preservación digital a largo plazo',
  ]),
]);

const redesYSistemas = materia('Redes y Sistemas', [
  mod('Fundamentos de redes de computadoras', [
    'Modelo de capas y protocolos de comunicación en redes',
    'Internet y arquitectura cliente-servidor aplicada a sistemas de información',
  ]),
  mod('Sistemas de información en unidades de información', [
    'Componentes de un sistema integrado de gestión bibliotecaria/archivística',
    'Seguridad básica y administración de sistemas en unidades de información',
  ]),
]);

const basesDeDatos = materia('Bases de Datos', [
  mod('Modelo relacional y diseño de bases de datos', [
    'El modelo relacional: entidades, atributos y relaciones',
    'Normalización de bases de datos',
  ]),
  mod('Lenguaje SQL y aplicaciones', [
    'Consultas SQL para la gestión de datos documentales',
    'Bases de datos documentales y su aplicación en archivos y bibliotecas',
  ]),
]);

const trabajoFinalDeGrado = materia('Trabajo Final de Grado', []);

// ---------------------------------------------------------------------
// Licenciatura en Comunicación (orientación Periodismo)
// ---------------------------------------------------------------------
const materiasComunicacion = {
  '1': [
    cursoIntroductorio,
    materia('Introducción al Estudio del Audiovisual', [
      mod('Elementos del lenguaje audiovisual', [
        'Plano, encuadre y composición de la imagen en movimiento',
        'Montaje y narración audiovisual',
      ]),
      mod('Historia y géneros audiovisuales', [
        'Hitos históricos del cine y la televisión',
        'Géneros y formatos audiovisuales',
      ]),
    ]),
    materia('Teoría de la Comunicación I', [
      mod('Modelos clásicos de la comunicación', [
        'El modelo informacional y las teorías funcionalistas de la comunicación',
        'La Escuela de Frankfurt y la crítica a la industria cultural',
      ]),
      mod('Comunicación y sociedad de masas', [
        'Estudios culturales y recepción activa de las audiencias',
        'La comunicación mediada y la esfera pública',
      ]),
    ]),
    materia('Pensamiento Social', [
      mod('Clásicos de la teoría social', [
        'Los fundadores de la sociología: Durkheim, Weber y Marx',
        'Estructura, acción y cambio social',
      ]),
      mod('Pensamiento social contemporáneo', [
        'Modernidad, posmodernidad y sociedad de la información',
        'Pensamiento social latinoamericano',
      ]),
    ]),
    materia('Historia Contemporánea', [
      mod('El mundo desde el siglo XIX', [
        'Revoluciones, industrialización y formación de los Estados-nación',
        'Los conflictos mundiales del siglo XX',
      ]),
      mod('Uruguay y América Latina contemporáneos', [
        'Procesos políticos y sociales de Uruguay en el siglo XX',
        'Uruguay y América Latina en el contexto global contemporáneo',
      ]),
    ]),
    introEpistemologia,
  ],
  '2': [
    materia('Discurso, Técnica y Comunicación', [
      mod('Discurso y sentido', [
        'El discurso como práctica social y su análisis',
        'Retórica y argumentación en los discursos mediáticos',
      ]),
      mod('Técnica y mediatización', [
        'Las tecnologías de la comunicación y su impacto en la producción de sentido',
        'Cultura digital y nuevas formas de mediatización',
      ]),
    ]),
    materia('Economía y Política', [
      mod('Fundamentos de economía política', [
        'Conceptos básicos de organización económica y mercados',
        'Economía política de los medios de comunicación',
      ]),
      mod('Sistema político y comunicación', [
        'Instituciones políticas y toma de decisiones públicas',
        'Comunicación política y opinión pública',
      ]),
    ]),
    metodologiaInvestigacion,
    materia('Introducción a las Profesiones de la Comunicación', [
      mod('El campo profesional de la comunicación', [
        'Perfiles y ámbitos de inserción laboral del comunicador',
        'Ética y responsabilidad profesional en comunicación',
      ]),
      mod('Orientaciones de la Licenciatura en Comunicación', [
        'Las orientaciones de la carrera y sus campos de especialización',
        'Mercado de trabajo y nuevas figuras profesionales en comunicación',
      ]),
    ]),
  ],
  '3': [
    materia('Lenguaje, Cultura y Pensamiento', [
      mod('Lenguaje y cognición', [
        'Relación entre lenguaje, pensamiento y cultura',
        'Lenguaje verbal y no verbal en la comunicación humana',
      ]),
      mod('Cultura y diversidad', [
        'Cultura, identidad y diversidad cultural',
        'Interculturalidad y comunicación',
      ]),
    ]),
    materia('Comunicación Sonora', [
      mod('Elementos del lenguaje sonoro', [
        'El sonido como materia prima: voz, música y efectos sonoros',
        'Narrativa y montaje sonoro',
      ]),
      mod('Producción sonora', [
        'Géneros y formatos de la radio y el podcast',
        'Técnicas básicas de grabación y edición de audio',
      ]),
    ]),
    materia('Ontologías de la Comunicación Contemporánea', [
      mod('Perspectivas teóricas contemporáneas', [
        'Debates ontológicos sobre qué es la comunicación',
        'La comunicación en la era digital y las redes',
      ]),
      mod('Comunicación, tecnología y sociedad red', [
        'Cultura de la convergencia y sociedad red',
        'Nuevas materialidades de la comunicación: plataformas y algoritmos',
      ]),
    ]),
    estadisticaBasica,
  ],
  '4': [
    materia('Teoría del Cine y Medios Audiovisuales', [
      mod('Teorías del cine', [
        'Principales corrientes teóricas del cine: realismo, formalismo y semiótica fílmica',
        'Autor, industria y estética cinematográfica',
      ]),
      mod('Medios audiovisuales contemporáneos', [
        'Televisión, streaming y nuevas plataformas audiovisuales',
        'Convergencia entre cine, televisión y medios digitales',
      ]),
    ]),
    disenioYAnalisis,
    materia('Introducción al Periodismo', [
      mod('Fundamentos del periodismo', [
        'Concepto, funciones y valores del periodismo',
        'Géneros periodísticos informativos, interpretativos y de opinión',
      ]),
      mod('El campo periodístico contemporáneo', [
        'La organización de una redacción y el proceso de producción de noticias',
        'Desafíos del periodismo en la era digital',
      ]),
    ]),
  ],
  '5': [
    materia('Lengua, Sociedad y Variación', [
      mod('Lengua y variación social', [
        'Variación lingüística: dialectos, sociolectos y registros',
        'Norma, prestigio y actitudes lingüísticas',
      ]),
      mod('Lengua y comunicación mediática', [
        'El español del Uruguay y el Río de la Plata',
        'Uso del lenguaje en los medios de comunicación',
      ]),
    ]),
    materia('Semiótica', [
      mod('Fundamentos de la semiótica', [
        'Signo, significante y significado',
        'Connotación y denotación',
      ]),
      mod('Semiótica aplicada', [
        'Semiótica de la imagen',
        'Análisis semiótico de textos mediáticos y publicitarios',
      ]),
    ]),
    materia('Periodismo Radial I', [
      mod('El lenguaje radiofónico', [
        'Códigos y lenguaje de la radio',
        'Géneros y formatos radiofónicos informativos',
      ]),
      mod('Producción radiofónica', [
        'Guion y locución para radio',
        'Edición y realización de piezas radiofónicas',
      ]),
    ]),
    materia('Periodismo Informativo', [
      mod('La noticia y su construcción', [
        'Criterios de noticiabilidad y valores-noticia',
        'Estructura de la noticia: pirámide invertida y lead',
      ]),
      mod('Redacción informativa', [
        'Técnicas de redacción periodística informativa',
        'Fuentes de información y verificación periodística',
      ]),
    ]),
  ],
  '6': [
    materia('Periodismo Narrativo', [
      mod('Fundamentos del periodismo narrativo', [
        'Recursos narrativos y literarios aplicados al periodismo',
        'La crónica y el reportaje en profundidad',
      ]),
      mod('Construcción de relatos periodísticos', [
        'Investigación y documentación para relatos periodísticos extensos',
        'Voz, punto de vista y estructura narrativa en el periodismo',
      ]),
    ]),
    materia('Periodismo Radial II', [
      mod('Formatos avanzados de radio', [
        'Programas periodísticos de radio: entrevista y debate',
        'El periodismo radial en vivo y la cobertura de actualidad',
      ]),
      mod('Nuevos formatos sonoros', [
        'El podcast periodístico como formato emergente',
        'Estrategias de distribución y audiencia en medios sonoros digitales',
      ]),
    ]),
  ],
  '7': [
    materia('Libertades Informativas y Regulación del Periodismo', [
      mod('Marco normativo de la comunicación', [
        'Libertad de expresión y derecho a la información',
        'Regulación de los medios de comunicación en Uruguay',
      ]),
      mod('Ética y responsabilidad periodística', [
        'Códigos de ética periodística y autorregulación',
        'Difamación, derecho de réplica y responsabilidad ulterior',
      ]),
    ]),
    materia('Sala de Redacción', [
      mod('Organización y rutinas de producción', [
        'Organización y flujo de trabajo de una redacción periodística',
        'Edición y control de calidad de contenidos periodísticos',
      ]),
      mod('Producción integrada multiplataforma', [
        'Producción periodística para múltiples plataformas y soportes',
        'Trabajo en equipo y coordinación editorial en la redacción',
      ]),
    ]),
    // Sin programa temático propio (varía según la orientación del
    // estudiante) -- mismo criterio que Trabajo Final/Trabajo de
    // Iniciación a la Investigación en el resto del catálogo.
    materia('Seminario Trabajo de Grado por Orientación', []),
  ],
  '8': [
    trabajoFinalDeGrado,
  ],
};

// ---------------------------------------------------------------------
// Licenciatura en Archivología
// ---------------------------------------------------------------------
const materiasArchivologia = {
  '1': [
    materia('Introducción a la Archivología y Ciencia de la Información', [
      mod('El campo disciplinar de la archivología', [
        'Objeto de estudio y evolución histórica de la archivología',
        'La archivología en el marco de las ciencias de la información',
      ]),
      mod('El documento y el archivo', [
        'Concepto de documento y de archivo',
        'Funciones y valor del archivo en las organizaciones y la sociedad',
      ]),
    ]),
    introEpistemologia,
    materia('Historia Institucional del Uruguay', [
      mod('Formación del Estado uruguayo', [
        'Organización institucional del Uruguay desde la independencia',
        'Evolución de la administración pública uruguaya',
      ]),
      mod('Instituciones y fuentes documentales', [
        'Principales instituciones generadoras de documentos en Uruguay',
        'Los archivos como fuente para la historia institucional',
      ]),
    ]),
    cursoIntroductorio,
    historiaDeLasIdeas,
  ],
  '2': [
    fundamentosIA,
    metodologiaInvestigacion,
    materia('Taller Servicios de Información y Acceso a la Información Pública', [
      mod('Servicios de información', [
        'Tipos de servicios de información y sus usuarios',
        'Atención y orientación al usuario en unidades de información',
      ]),
      mod('Acceso a la información pública', [
        'Marco normativo del derecho de acceso a la información pública en Uruguay',
        'Transparencia, datos abiertos y gestión documental en el Estado',
      ]),
    ]),
    materia('Gestión Documental I', [
      mod('El ciclo de vida del documento', [
        'Ciclo de vida del documento y edades del archivo',
        'Producción y trámite documental',
      ]),
      mod('Instrumentos de gestión documental', [
        'Tablas de plazos de conservación y disposición documental',
        'Normalización de la gestión documental en las organizaciones',
      ]),
    ]),
  ],
  '3': [
    disenioAsistidoSoftware,
    estadisticaBasica,
    materia('Gestión Documental II', [
      mod('Gestión documental avanzada', [
        'Gestión de documentos electrónicos y sistemas de gestión documental',
        'Interoperabilidad y metadatos en la gestión documental',
      ]),
      mod('Auditoría y control de la gestión documental', [
        'Auditoría de sistemas de gestión documental',
        'Indicadores de calidad en la gestión de documentos',
      ]),
    ]),
    materia('Organización Documental', [
      mod('Principios de organización de fondos', [
        'Principio de procedencia y de orden original',
        'Cuadros de clasificación de fondos documentales',
      ]),
      mod('Ordenación y control', [
        'Sistemas de ordenación de series documentales',
        'Instrumentos de control y ubicación topográfica',
      ]),
    ]),
  ],
  '4': [
    adminUnidadesInfoI,
    disenioYAnalisis,
    materia('Taller de Legislación Archivística', [
      mod('Marco legal de los archivos', [
        'Legislación archivística nacional e internacional',
        'El Sistema Nacional de Archivos en Uruguay',
      ]),
      mod('Responsabilidad y patrimonio documental', [
        'Régimen jurídico del patrimonio documental',
        'Responsabilidades legales en la gestión y custodia de archivos',
      ]),
    ]),
    materia('Taller de Elaboración de Cuadros de Clasificación', [
      mod('Fundamentos de la clasificación archivística', [
        'Criterios funcionales y orgánicos para clasificar documentos',
        'Metodología para la elaboración de cuadros de clasificación',
      ]),
      mod('Aplicación práctica', [
        'Elaboración de cuadros de clasificación para instituciones reales',
        'Validación y actualización de cuadros de clasificación',
      ]),
    ]),
    materia('Descripción Documental', [
      mod('Principios de la descripción archivística', [
        'Normas internacionales de descripción archivística (ISAD-G)',
        'Niveles de descripción: fondo, sección, serie y unidad documental',
      ]),
      mod('Instrumentos descriptivos', [
        'Elaboración de inventarios, guías y catálogos de archivo',
        'Puntos de acceso y descripción de productores (ISAAR-CPF)',
      ]),
    ]),
  ],
  '5': [
    materia('Conservación I: Conservación Preventiva y Gestión de Riesgos', [
      mod('Fundamentos de la conservación documental', [
        'Agentes de deterioro de los documentos',
        'Condiciones ambientales y de almacenamiento para la conservación',
      ]),
      mod('Gestión de riesgos', [
        'Identificación y evaluación de riesgos en archivos',
        'Planes de emergencia y gestión de desastres en unidades de información',
      ]),
    ]),
    materia('Evaluación Documental', [
      mod('Fundamentos de la valoración documental', [
        'Valores primarios y secundarios de los documentos',
        'Criterios y metodologías de valoración documental',
      ]),
      mod('Selección y eliminación', [
        'Procesos de selección y expurgo documental',
        'Comités de evaluación documental y su rol institucional',
      ]),
    ]),
    materia('Difusión Archivística', [
      mod('Extensión y difusión del patrimonio archivístico', [
        'Estrategias de difusión y extensión cultural de los archivos',
        'Exposiciones y actividades educativas con fondos documentales',
      ]),
      mod('Archivos y comunidad', [
        'Archivos, memoria social y derechos humanos',
        'Uso educativo y ciudadano de los archivos',
      ]),
    ]),
    materia('Organización del Conocimiento y Recuperación de la Información', [
      mod('Organización del conocimiento', [
        'Lenguajes documentales: tesauros, clasificaciones y listas de encabezamientos',
        'Indización y representación temática de la información',
      ]),
      mod('Recuperación de la información', [
        'Sistemas de recuperación de información y estrategias de búsqueda',
        'Evaluación de la recuperación de información: precisión y exhaustividad',
      ]),
    ]),
  ],
  '6': [
    adminUnidadesInfoII,
    materia('Estudios de Usuarios de Información', [
      mod('Fundamentos de los estudios de usuarios', [
        'Necesidades, búsqueda y uso de información en el contexto archivístico',
        'Métodos y técnicas para el estudio de usuarios de archivos',
      ]),
      mod('Aplicación a servicios archivísticos', [
        'Perfiles de usuarios de archivos históricos y administrativos',
        'Uso de los estudios de usuarios para la mejora de servicios archivísticos',
      ]),
    ]),
    materia('Archivos Históricos', [
      mod('El archivo histórico', [
        'Concepto y función del archivo histórico',
        'Fondos documentales históricos y su valor patrimonial',
      ]),
      mod('Tratamiento de fondos históricos', [
        'Investigación histórica a partir de fuentes archivísticas',
        'Digitalización y acceso a archivos históricos',
      ]),
    ]),
    basesDeDatos,
  ],
  '7': [
    materia('Planeamiento en el Área de la Información', [
      mod('Planificación estratégica', [
        'Diagnóstico y planificación estratégica de servicios de información',
        'Formulación de proyectos en unidades de información',
      ]),
      mod('Gestión de proyectos', [
        'Herramientas de gestión de proyectos aplicadas a archivos y bibliotecas',
        'Evaluación de resultados e impacto de proyectos de información',
      ]),
    ]),
    documentacionAudiovisual,
    introPreservacionDigital,
  ],
  '8': [
    materia('Micrografía y Digitalización', [
      mod('Micrografía documental', [
        'Fundamentos y técnicas de microfilmación de documentos',
        'Normas de calidad para la reproducción documental',
      ]),
      mod('Digitalización de documentos', [
        'Procesos y estándares de digitalización de fondos documentales',
        'Gestión de metadatos y formatos de conservación digital',
      ]),
    ]),
    redesYSistemas,
    trabajoFinalDeGrado,
  ],
};

// ---------------------------------------------------------------------
// Licenciatura en Bibliotecología
// ---------------------------------------------------------------------
const materiasBibliotecologia = {
  '1': [
    materia('Introducción a la Bibliotecología y Ciencia de la Información', [
      mod('El campo disciplinar de la bibliotecología', [
        'Objeto de estudio y evolución histórica de la bibliotecología',
        'La bibliotecología en el marco de las ciencias de la información',
      ]),
      mod('La biblioteca como institución', [
        'Tipología de bibliotecas y su función social',
        'Bibliotecas y sociedad de la información',
      ]),
    ]),
    introEpistemologia,
    materia('Historia de los Documentos', [
      mod('Del documento manuscrito al libro impreso', [
        'Historia del libro manuscrito y la escritura',
        'La imprenta y la transformación de la circulación del conocimiento',
      ]),
      mod('El documento en la era contemporánea', [
        'Evolución de los soportes documentales en los siglos XIX y XX',
        'El documento digital y sus transformaciones recientes',
      ]),
    ]),
    cursoIntroductorio,
    historiaDeLasIdeas,
  ],
  '2': [
    metodologiaInvestigacion,
    materia('Taller la Biblioteca y la Comunidad', [
      mod('La biblioteca en su entorno social', [
        'La biblioteca pública y su rol en la comunidad',
        'Extensión bibliotecaria y programas de fomento a la lectura',
      ]),
      mod('Vínculos institucionales', [
        'Articulación de la biblioteca con instituciones educativas y sociales',
        'Inclusión social y accesibilidad en bibliotecas',
      ]),
    ]),
    fundamentosIA,
    materia('Metodología del Trabajo Bibliográfico', [
      mod('Fundamentos del trabajo bibliográfico', [
        'Elaboración de bibliografías y repertorios bibliográficos',
        'Normas de citación y referencia bibliográfica',
      ]),
      mod('Fuentes y control bibliográfico', [
        'Control bibliográfico universal y nacional',
        'Bases de datos bibliográficas y su uso en la investigación',
      ]),
    ]),
    materia('Referencia y Servicios al Usuario', [
      mod('El servicio de referencia', [
        'La entrevista de referencia y el proceso de búsqueda de información',
        'Tipología de servicios de referencia presenciales y virtuales',
      ]),
      mod('Atención al usuario', [
        'Alfabetización informacional de usuarios',
        'Evaluación de la calidad de los servicios de referencia',
      ]),
    ]),
  ],
  '3': [
    estadisticaBasica,
    materia('Organización del Conocimiento I', [
      mod('Fundamentos de la organización del conocimiento', [
        'Lenguajes documentales: clasificación, tesauros y encabezamientos de materia',
        'Sistemas de clasificación bibliográfica (CDU, LCC, Dewey)',
      ]),
      mod('Indización y representación temática', [
        'Principios de indización de documentos',
        'Representación temática y análisis de contenido documental',
      ]),
    ]),
    materia('Descripción y Acceso I', [
      mod('Fundamentos de la catalogación', [
        'Principios de la descripción bibliográfica',
        'Normas de catalogación (ISBD, RDA)',
      ]),
      mod('Puntos de acceso', [
        'Puntos de acceso: autor, título y materia',
        'Catálogos y su función en la recuperación de información',
      ]),
    ]),
    disenioAsistidoSoftware,
  ],
  '4': [
    disenioYAnalisis,
    materia('Taller Integrador de Análisis de la Información', [
      mod('Análisis documental integrado', [
        'Análisis formal y de contenido de distintos tipos documentales',
        'Integración de procesos técnicos en la cadena documental',
      ]),
      mod('Aplicación práctica', [
        'Elaboración de productos documentales integrados (resúmenes, índices)',
        'Evaluación de la calidad del análisis documental',
      ]),
    ]),
    materia('Fuentes de Información Especializada', [
      mod('Tipología de fuentes de información', [
        'Fuentes primarias, secundarias y terciarias de información',
        'Fuentes de información especializadas por área del conocimiento',
      ]),
      mod('Evaluación y uso de fuentes', [
        'Criterios de evaluación de fuentes de información',
        'Estrategias de búsqueda en fuentes especializadas',
      ]),
    ]),
    adminUnidadesInfoI,
  ],
  '5': [
    materia('Descripción y Acceso II', [
      mod('Catalogación avanzada', [
        'Descripción de materiales especiales (audiovisuales, cartográficos, electrónicos)',
        'Control de autoridades de nombres y materias',
      ]),
      mod('Metadatos y catálogos', [
        'Metadatos descriptivos y esquemas de metadatos',
        'Catálogos en línea de acceso público (OPAC) y su evolución',
      ]),
    ]),
    materia('Organización del Conocimiento II', [
      mod('Herramientas avanzadas de organización', [
        'Elaboración y mantenimiento de tesauros especializados',
        'Ontologías y esquemas de metadatos para la organización del conocimiento',
      ]),
      mod('Organización del conocimiento en entornos digitales', [
        'Web semántica y datos enlazados aplicados a la organización del conocimiento',
        'Interoperabilidad entre sistemas de organización del conocimiento',
      ]),
    ]),
    materia('Historia de la Ciencia', [
      mod('De la ciencia antigua a la revolución científica', [
        'El conocimiento científico en la Antigüedad y la Edad Media',
        'La revolución científica de los siglos XVI y XVII',
      ]),
      mod('Ciencia moderna y contemporánea', [
        'Desarrollo de las disciplinas científicas en los siglos XIX y XX',
        'Comunicación científica y su evolución histórica',
      ]),
    ]),
    materia('Taller de Fuentes de Información en Ciencias Sociales y Humanidades', [
      mod('Fuentes en ciencias sociales', [
        'Fuentes de información en ciencias sociales: bases de datos y repositorios',
        'Particularidades de la búsqueda de información en humanidades',
      ]),
      mod('Estrategias de búsqueda especializada', [
        'Evaluación de fuentes en ciencias sociales y humanidades',
        'Elaboración de guías temáticas de recursos en ciencias sociales y humanidades',
      ]),
    ]),
    materia('Taller de Bibliotecas Universitarias y Especializadas', [
      mod('La biblioteca universitaria', [
        'Funciones y servicios de la biblioteca universitaria',
        'Gestión de colecciones en apoyo a la docencia y la investigación',
      ]),
      mod('Bibliotecas especializadas', [
        'Bibliotecas especializadas y centros de documentación',
        'Servicios de información especializados para comunidades científicas',
      ]),
    ]),
  ],
  '6': [
    materia('Taller de Elaboración de Tesauros', [
      mod('Fundamentos de los tesauros documentales', [
        'Estructura y relaciones de un tesauro documental',
        'Normas para la construcción de tesauros (ISO 25964)',
      ]),
      mod('Construcción y mantenimiento', [
        'Metodología para la elaboración de un tesauro especializado',
        'Actualización y validación de tesauros documentales',
      ]),
    ]),
    materia('Taller de Recuperación Electrónica', [
      mod('Sistemas de recuperación electrónica', [
        'Motores de búsqueda y bases de datos electrónicas',
        'Operadores de búsqueda y estrategias de recuperación electrónica',
      ]),
      mod('Evaluación de la recuperación', [
        'Indicadores de precisión y exhaustividad en la recuperación electrónica',
        'Recuperación de información en repositorios digitales',
      ]),
    ]),
    materia('Formación y Desarrollo de Colecciones', [
      mod('Políticas de desarrollo de colecciones', [
        'Selección y adquisición de materiales bibliográficos',
        'Políticas de desarrollo de colecciones en bibliotecas',
      ]),
      mod('Gestión de colecciones', [
        'Evaluación y expurgo de colecciones',
        'Desarrollo de colecciones digitales',
      ]),
    ]),
    basesDeDatos,
    materia('Estudios de Usuarios de Información', [
      mod('Fundamentos de los estudios de usuarios', [
        'Necesidades, búsqueda y uso de información en bibliotecas',
        'Métodos y técnicas para el estudio de usuarios de bibliotecas',
      ]),
      mod('Aplicación a servicios bibliotecarios', [
        'Perfiles de usuarios de bibliotecas públicas, universitarias y especializadas',
        'Uso de los estudios de usuarios para la mejora de servicios bibliotecarios',
      ]),
    ]),
    adminUnidadesInfoII,
  ],
  '7': [
    documentacionAudiovisual,
    introPreservacionDigital,
    materia('Planeamiento en el Área de la Información', [
      mod('Planificación estratégica en unidades de información', [
        'Diagnóstico y planificación estratégica de servicios bibliotecarios',
        'Formulación de proyectos en bibliotecas y centros de documentación',
      ]),
      mod('Gestión de proyectos', [
        'Herramientas de gestión de proyectos aplicadas a bibliotecas',
        'Evaluación de resultados e impacto de proyectos bibliotecarios',
      ]),
    ]),
  ],
  '8': [
    redesYSistemas,
    trabajoFinalDeGrado,
  ],
};

// ---------------------------------------------------------------------
// Bibliografía y duraciones para todos los temas NUEVOS (los de las
// materias compartidas se listan una sola vez -- el objeto es el mismo).
// tema -> [entradaTextos, días de estudio]
// ---------------------------------------------------------------------
const TEXTOS_NUEVOS = {
  // Curso Introductorio
  'Organización de la Universidad de la República y la vida estudiantil': [APUNTES, 1],
  'Herramientas y estrategias para el estudio universitario': [APUNTES, 1],
  'Panorama de las disciplinas de la información y la comunicación en la FIC': [APUNTES, 1],
  'La sociedad de la información y el conocimiento': [APUNTES, 1],
  // Introducción a la Epistemología
  'Criterios de demarcación entre ciencia y no-ciencia': [APUNTES, 2],
  'Corrientes epistemológicas clásicas: positivismo, falsacionismo y paradigmas': [APUNTES, 2],
  'Particularidades del conocimiento en las ciencias sociales': [APUNTES, 2],
  'Debates contemporáneos sobre la construcción social del conocimiento': [APUNTES, 2],
  // Historia de las Ideas
  'Ideas filosóficas y políticas de la Antigüedad y el mundo clásico': [APUNTES, 2],
  'La Ilustración y el pensamiento moderno': [APUNTES, 2],
  'Corrientes del pensamiento social y político de los siglos XIX y XX': [APUNTES, 2],
  'Recepción y circulación de las ideas en América Latina': [APUNTES, 2],
  // Metodología de la Investigación en Información y Comunicación
  'El proceso de investigación: planteamiento del problema y objetivos': [hernandezSampieri('cap. de planteamiento del problema'), 2],
  'Enfoques cuantitativo y cualitativo en información y comunicación': [hernandezSampieri('cap. de enfoques de investigación'), 2],
  'Técnicas de recolección de datos: encuesta, entrevista y análisis documental': [hernandezSampieri('cap. de recolección de datos'), 2],
  'Elaboración del proyecto de investigación y del informe final': [hernandezSampieri('cap. de elaboración del reporte de investigación'), 2],
  // Fundamentos de Inteligencia Artificial
  'Historia y fundamentos de la inteligencia artificial': [russellNorvig('cap. de introducción a la IA'), 1],
  'Aprendizaje automático: conceptos básicos y tipos de aprendizaje': [russellNorvig('cap. de aprendizaje automático'), 2],
  'Procesamiento del lenguaje natural y recuperación de información': [russellNorvig('cap. de procesamiento del lenguaje natural'), 2],
  'Ética y sesgos en sistemas de inteligencia artificial': [russellNorvig('cap. de filosofía y ética de la IA'), 1],
  // Diseño Asistido de Software
  'Software de diseño gráfico y edición para unidades de información': [APUNTES, 1],
  'Principios de usabilidad y diseño de interfaces': [APUNTES, 2],
  'Modelado de procesos y diagramación con herramientas digitales': [APUNTES, 2],
  'Buenas prácticas de documentación técnica de un proyecto de software': [APUNTES, 1],
  // Diseño y Análisis
  'Elementos y principios de composición visual': [frascara('cap. de elementos del diseño'), 1],
  'Tipografía, color y retícula en el diseño de piezas gráficas': [frascara('cap. de tipografía y retícula'), 2],
  'Diseño de información y visualización de datos': [frascara('cap. de diseño de información'), 2],
  'Análisis crítico de piezas de diseño gráfico y comunicacional': [frascara('cap. de análisis de piezas gráficas'), 2],
  // Estadística Básica
  'Organización y presentación de datos: tablas y gráficos': [walpole('cap. de estadística descriptiva'), 1],
  'Medidas de tendencia central y de dispersión aplicadas a estudios de usuarios': [walpole('cap. de estadística descriptiva'), 2],
  'Nociones básicas de probabilidad y variables aleatorias': [walpole('cap. de probabilidad básica'), 2],
  'Diseño de muestras para estudios de usuarios y bibliotecas': [walpole('cap. de muestreo'), 2],
  // Administración en Unidades de Información I
  'Planificación estratégica en bibliotecas y archivos': [gomezHernandez('cap. de planificación estratégica'), 2],
  'Estructura organizativa y funciones del personal en unidades de información': [gomezHernandez('cap. de organización y personal'), 2],
  'Gestión de recursos humanos, materiales y presupuestarios': [gomezHernandez('cap. de gestión de recursos'), 2],
  'Evaluación de servicios y calidad en unidades de información': [gomezHernandez('cap. de evaluación de servicios'), 2],
  // Administración en Unidades de Información II
  'Marketing y difusión de servicios de información': [gomezHernandez('cap. de marketing de servicios'), 2],
  'Planificación de proyectos en unidades de información': [gomezHernandez('cap. de planificación de proyectos'), 2],
  'Liderazgo y dirección de equipos en bibliotecas y archivos': [gomezHernandez('cap. de dirección de equipos'), 2],
  'Indicadores de gestión y evaluación de desempeño': [gomezHernandez('cap. de indicadores de gestión'), 2],
  // Documentación Audiovisual
  'Características y soportes de los documentos audiovisuales': [cruzMundet('cap. de documentos especiales'), 1],
  'Descripción y catalogación de materiales audiovisuales': [cruzMundet('cap. de descripción de fondos audiovisuales'), 2],
  'Conservación y digitalización de fondos audiovisuales': [ogden('cap. de conservación de materiales audiovisuales'), 2],
  'Acceso y difusión de colecciones audiovisuales': [cruzMundet('cap. de difusión de fondos audiovisuales'), 2],
  // Introducción a la Preservación Digital
  'Riesgos de obsolescencia tecnológica y pérdida de información digital': [ogden('cap. de riesgos de la información digital'), 2],
  'Estrategias de preservación: migración, emulación y metadatos de preservación': [ogden('cap. de estrategias de preservación digital'), 2],
  'El modelo de referencia OAIS': [ogden('cap. del modelo OAIS'), 2],
  'Políticas institucionales de preservación digital a largo plazo': [ogden('cap. de políticas de preservación'), 2],
  // Redes y Sistemas
  'Modelo de capas y protocolos de comunicación en redes': [tanenbaum('cap. introductorio de redes'), 2],
  'Internet y arquitectura cliente-servidor aplicada a sistemas de información': [tanenbaum('cap. de aplicaciones e Internet'), 2],
  'Componentes de un sistema integrado de gestión bibliotecaria/archivística': [APUNTES, 2],
  'Seguridad básica y administración de sistemas en unidades de información': [tanenbaum('cap. de seguridad en redes'), 2],
  // Bases de Datos
  'El modelo relacional: entidades, atributos y relaciones': [silberschatz('cap. del modelo relacional'), 2],
  'Normalización de bases de datos': [silberschatz('cap. de diseño de bases de datos relacionales'), 3],
  'Consultas SQL para la gestión de datos documentales': [silberschatz('cap. de SQL'), 2],
  'Bases de datos documentales y su aplicación en archivos y bibliotecas': [silberschatz('cap. de aplicaciones de bases de datos'), 2],

  // -- Comunicación (Periodismo) --
  'Plano, encuadre y composición de la imagen en movimiento': [aumont('cap. de la imagen cinematográfica'), 2],
  'Montaje y narración audiovisual': [bordwellThompson('cap. de montaje'), 2],
  'Hitos históricos del cine y la televisión': [bordwellThompson('cap. de historia del cine'), 1],
  'Géneros y formatos audiovisuales': [bordwellThompson('cap. de géneros cinematográficos'), 1],
  'El modelo informacional y las teorías funcionalistas de la comunicación': [mattelart('cap. de los orígenes de la investigación en comunicación'), 2],
  'La Escuela de Frankfurt y la crítica a la industria cultural': [mattelart('cap. de la Escuela de Frankfurt'), 2],
  'Estudios culturales y recepción activa de las audiencias': [wolf('cap. de estudios culturales y recepción'), 2],
  'La comunicación mediada y la esfera pública': [wolf('cap. de esfera pública y opinión'), 2],
  'Los fundadores de la sociología: Durkheim, Weber y Marx': [APUNTES, 2],
  'Estructura, acción y cambio social': [APUNTES, 2],
  'Modernidad, posmodernidad y sociedad de la información': [APUNTES, 2],
  'Pensamiento social latinoamericano': [APUNTES, 2],
  'Revoluciones, industrialización y formación de los Estados-nación': [APUNTES, 1],
  'Los conflictos mundiales del siglo XX': [APUNTES, 1],
  'Procesos políticos y sociales de Uruguay en el siglo XX': [APUNTES, 2],
  'Uruguay y América Latina en el contexto global contemporáneo': [APUNTES, 2],
  'El discurso como práctica social y su análisis': [APUNTES, 2],
  'Retórica y argumentación en los discursos mediáticos': [APUNTES, 2],
  'Las tecnologías de la comunicación y su impacto en la producción de sentido': [APUNTES, 2],
  'Cultura digital y nuevas formas de mediatización': [APUNTES, 2],
  'Conceptos básicos de organización económica y mercados': [APUNTES, 1],
  'Economía política de los medios de comunicación': [mattelart('cap. de economía política de la comunicación'), 2],
  'Instituciones políticas y toma de decisiones públicas': [APUNTES, 2],
  'Comunicación política y opinión pública': [wolf('cap. de comunicación política'), 2],
  'Perfiles y ámbitos de inserción laboral del comunicador': [APUNTES, 1],
  'Ética y responsabilidad profesional en comunicación': [APUNTES, 1],
  'Las orientaciones de la carrera y sus campos de especialización': [APUNTES, 1],
  'Mercado de trabajo y nuevas figuras profesionales en comunicación': [APUNTES, 1],
  'Relación entre lenguaje, pensamiento y cultura': [APUNTES, 2],
  'Lenguaje verbal y no verbal en la comunicación humana': [APUNTES, 2],
  'Cultura, identidad y diversidad cultural': [APUNTES, 2],
  'Interculturalidad y comunicación': [APUNTES, 2],
  'El sonido como materia prima: voz, música y efectos sonoros': [APUNTES, 1],
  'Narrativa y montaje sonoro': [APUNTES, 2],
  'Géneros y formatos de la radio y el podcast': [APUNTES, 1],
  'Técnicas básicas de grabación y edición de audio': [APUNTES, 2],
  'Debates ontológicos sobre qué es la comunicación': [wolf('cap. de teorías contemporáneas de la comunicación'), 2],
  'La comunicación en la era digital y las redes': [wolf('cap. de comunicación digital'), 2],
  'Cultura de la convergencia y sociedad red': [APUNTES, 2],
  'Nuevas materialidades de la comunicación: plataformas y algoritmos': [APUNTES, 2],
  'Principales corrientes teóricas del cine: realismo, formalismo y semiótica fílmica': [aumont('cap. de teorías del cine'), 2],
  'Autor, industria y estética cinematográfica': [aumont('cap. de estética del cine'), 2],
  'Televisión, streaming y nuevas plataformas audiovisuales': [bordwellThompson('cap. de nuevas tecnologías audiovisuales'), 2],
  'Convergencia entre cine, televisión y medios digitales': [bordwellThompson('cap. de convergencia de medios'), 2],
  'Concepto, funciones y valores del periodismo': [kovachRosenstiel('cap. de los elementos del periodismo'), 1],
  'Géneros periodísticos informativos, interpretativos y de opinión': [martinezAlbertos('cap. de géneros periodísticos'), 2],
  'La organización de una redacción y el proceso de producción de noticias': [martinezAlbertos('cap. de organización de la redacción'), 2],
  'Desafíos del periodismo en la era digital': [kovachRosenstiel('cap. del periodismo en la era digital'), 2],
  'Variación lingüística: dialectos, sociolectos y registros': [APUNTES, 2],
  'Norma, prestigio y actitudes lingüísticas': [APUNTES, 2],
  'El español del Uruguay y el Río de la Plata': [APUNTES, 1],
  'Uso del lenguaje en los medios de comunicación': [APUNTES, 1],
  'Signo, significante y significado': [eco('cap. de la teoría del signo'), 2],
  'Connotación y denotación': [eco('cap. de connotación y denotación'), 2],
  'Semiótica de la imagen': [eco('cap. de semiótica de la imagen'), 2],
  'Análisis semiótico de textos mediáticos y publicitarios': [eco('cap. de semiótica aplicada'), 2],
  'Códigos y lenguaje de la radio': [APUNTES, 1],
  'Géneros y formatos radiofónicos informativos': [APUNTES, 1],
  'Guion y locución para radio': [APUNTES, 2],
  'Edición y realización de piezas radiofónicas': [APUNTES, 2],
  'Criterios de noticiabilidad y valores-noticia': [martinezAlbertos('cap. de valores-noticia'), 2],
  'Estructura de la noticia: pirámide invertida y lead': [martinezAlbertos('cap. de estructura de la noticia'), 1],
  'Técnicas de redacción periodística informativa': [martinezAlbertos('cap. de redacción informativa'), 2],
  'Fuentes de información y verificación periodística': [kovachRosenstiel('cap. de verificación y disciplina de la verificación'), 2],
  'Recursos narrativos y literarios aplicados al periodismo': [kovachRosenstiel('cap. de periodismo narrativo'), 2],
  'La crónica y el reportaje en profundidad': [martinezAlbertos('cap. de géneros interpretativos'), 2],
  'Investigación y documentación para relatos periodísticos extensos': [kovachRosenstiel('cap. de investigación periodística'), 2],
  'Voz, punto de vista y estructura narrativa en el periodismo': [kovachRosenstiel('cap. de narrativa periodística'), 2],
  'Programas periodísticos de radio: entrevista y debate': [APUNTES, 2],
  'El periodismo radial en vivo y la cobertura de actualidad': [APUNTES, 2],
  'El podcast periodístico como formato emergente': [APUNTES, 1],
  'Estrategias de distribución y audiencia en medios sonoros digitales': [APUNTES, 2],
  'Libertad de expresión y derecho a la información': [kovachRosenstiel('cap. de libertad de prensa'), 2],
  'Regulación de los medios de comunicación en Uruguay': [APUNTES, 2],
  'Códigos de ética periodística y autorregulación': [kovachRosenstiel('cap. de ética periodística'), 2],
  'Difamación, derecho de réplica y responsabilidad ulterior': [APUNTES, 2],
  'Organización y flujo de trabajo de una redacción periodística': [martinezAlbertos('cap. de organización de la redacción'), 2],
  'Edición y control de calidad de contenidos periodísticos': [martinezAlbertos('cap. de edición periodística'), 2],
  'Producción periodística para múltiples plataformas y soportes': [kovachRosenstiel('cap. de periodismo multiplataforma'), 2],
  'Trabajo en equipo y coordinación editorial en la redacción': [APUNTES, 1],

  // -- Archivología --
  'Objeto de estudio y evolución histórica de la archivología': [cruzMundet('cap. introductorio'), 1],
  'La archivología en el marco de las ciencias de la información': [cruzMundet('cap. introductorio'), 1],
  'Concepto de documento y de archivo': [cruzMundet('cap. del concepto de documento y archivo'), 1],
  'Funciones y valor del archivo en las organizaciones y la sociedad': [cruzMundet('cap. de las funciones del archivo'), 2],
  'Organización institucional del Uruguay desde la independencia': [APUNTES, 2],
  'Evolución de la administración pública uruguaya': [APUNTES, 2],
  'Principales instituciones generadoras de documentos en Uruguay': [APUNTES, 2],
  'Los archivos como fuente para la historia institucional': [APUNTES, 2],
  'Tipos de servicios de información y sus usuarios': [APUNTES, 1],
  'Atención y orientación al usuario en unidades de información': [APUNTES, 1],
  'Marco normativo del derecho de acceso a la información pública en Uruguay': [APUNTES, 2],
  'Transparencia, datos abiertos y gestión documental en el Estado': [APUNTES, 2],
  'Ciclo de vida del documento y edades del archivo': [cruzMundet('cap. del ciclo vital del documento'), 2],
  'Producción y trámite documental': [cruzMundet('cap. de producción documental'), 1],
  'Tablas de plazos de conservación y disposición documental': [cruzMundet('cap. de valoración y disposición'), 2],
  'Normalización de la gestión documental en las organizaciones': [cruzMundet('cap. de normalización de la gestión documental'), 2],
  'Gestión de documentos electrónicos y sistemas de gestión documental': [cruzMundet('cap. de documentos electrónicos'), 2],
  'Interoperabilidad y metadatos en la gestión documental': [cruzMundet('cap. de metadatos de gestión documental'), 2],
  'Auditoría de sistemas de gestión documental': [cruzMundet('cap. de auditoría de sistemas de gestión documental'), 2],
  'Indicadores de calidad en la gestión de documentos': [cruzMundet('cap. de calidad en la gestión documental'), 2],
  'Principio de procedencia y de orden original': [cruzMundet('cap. de principios archivísticos'), 2],
  'Cuadros de clasificación de fondos documentales': [cruzMundet('cap. de clasificación de fondos'), 2],
  'Sistemas de ordenación de series documentales': [cruzMundet('cap. de ordenación documental'), 2],
  'Instrumentos de control y ubicación topográfica': [cruzMundet('cap. de control topográfico'), 1],
  'Legislación archivística nacional e internacional': [APUNTES, 2],
  'El Sistema Nacional de Archivos en Uruguay': [APUNTES, 2],
  'Régimen jurídico del patrimonio documental': [APUNTES, 2],
  'Responsabilidades legales en la gestión y custodia de archivos': [APUNTES, 2],
  'Criterios funcionales y orgánicos para clasificar documentos': [cruzMundet('cap. de criterios de clasificación'), 2],
  'Metodología para la elaboración de cuadros de clasificación': [cruzMundet('cap. de elaboración de cuadros de clasificación'), 2],
  'Elaboración de cuadros de clasificación para instituciones reales': [cruzMundet('cap. de aplicación práctica de la clasificación'), 3],
  'Validación y actualización de cuadros de clasificación': [cruzMundet('cap. de mantenimiento de cuadros de clasificación'), 2],
  'Normas internacionales de descripción archivística (ISAD-G)': [cruzMundet('cap. de descripción archivística'), 2],
  'Niveles de descripción: fondo, sección, serie y unidad documental': [cruzMundet('cap. de niveles de descripción'), 2],
  'Elaboración de inventarios, guías y catálogos de archivo': [cruzMundet('cap. de instrumentos de descripción'), 2],
  'Puntos de acceso y descripción de productores (ISAAR-CPF)': [cruzMundet('cap. de descripción de productores'), 2],
  'Agentes de deterioro de los documentos': [ogden('cap. de agentes de deterioro'), 1],
  'Condiciones ambientales y de almacenamiento para la conservación': [ogden('cap. de condiciones ambientales'), 2],
  'Identificación y evaluación de riesgos en archivos': [ogden('cap. de gestión de riesgos'), 2],
  'Planes de emergencia y gestión de desastres en unidades de información': [ogden('cap. de planes de emergencia'), 2],
  'Valores primarios y secundarios de los documentos': [cruzMundet('cap. de valoración documental'), 2],
  'Criterios y metodologías de valoración documental': [cruzMundet('cap. de metodologías de valoración'), 2],
  'Procesos de selección y expurgo documental': [cruzMundet('cap. de selección y expurgo'), 2],
  'Comités de evaluación documental y su rol institucional': [cruzMundet('cap. de comités de evaluación'), 1],
  'Estrategias de difusión y extensión cultural de los archivos': [cruzMundet('cap. de difusión archivística'), 2],
  'Exposiciones y actividades educativas con fondos documentales': [cruzMundet('cap. de extensión educativa'), 1],
  'Archivos, memoria social y derechos humanos': [cruzMundet('cap. de archivos y memoria'), 2],
  'Uso educativo y ciudadano de los archivos': [cruzMundet('cap. de uso social de los archivos'), 1],
  'Lenguajes documentales: tesauros, clasificaciones y listas de encabezamientos': [gilUrdiciain('cap. de lenguajes documentales'), 2],
  'Indización y representación temática de la información': [gilUrdiciain('cap. de indización'), 2],
  'Sistemas de recuperación de información y estrategias de búsqueda': [chaumier('cap. de recuperación de información'), 2],
  'Evaluación de la recuperación de información: precisión y exhaustividad': [chaumier('cap. de evaluación de la recuperación'), 2],
  'Necesidades, búsqueda y uso de información en el contexto archivístico': [APUNTES, 2],
  'Métodos y técnicas para el estudio de usuarios de archivos': [APUNTES, 2],
  'Perfiles de usuarios de archivos históricos y administrativos': [APUNTES, 1],
  'Uso de los estudios de usuarios para la mejora de servicios archivísticos': [APUNTES, 2],
  'Concepto y función del archivo histórico': [cruzMundet('cap. de archivos históricos'), 1],
  'Fondos documentales históricos y su valor patrimonial': [cruzMundet('cap. de valor patrimonial de los fondos'), 2],
  'Investigación histórica a partir de fuentes archivísticas': [APUNTES, 2],
  'Digitalización y acceso a archivos históricos': [ogden('cap. de digitalización de fondos históricos'), 2],
  'Diagnóstico y planificación estratégica de servicios de información': [gomezHernandez('cap. de planificación estratégica'), 2],
  'Formulación de proyectos en unidades de información': [gomezHernandez('cap. de formulación de proyectos'), 2],
  'Herramientas de gestión de proyectos aplicadas a archivos y bibliotecas': [gomezHernandez('cap. de gestión de proyectos'), 2],
  'Evaluación de resultados e impacto de proyectos de información': [gomezHernandez('cap. de evaluación de proyectos'), 2],
  'Fundamentos y técnicas de microfilmación de documentos': [ogden('cap. de micrografía'), 2],
  'Normas de calidad para la reproducción documental': [ogden('cap. de normas de reproducción'), 1],
  'Procesos y estándares de digitalización de fondos documentales': [ogden('cap. de digitalización de fondos'), 2],
  'Gestión de metadatos y formatos de conservación digital': [ogden('cap. de metadatos de preservación'), 2],

  // -- Bibliotecología --
  'Objeto de estudio y evolución histórica de la bibliotecología': [gilUrdiciain('cap. introductorio de bibliotecología'), 1],
  'La bibliotecología en el marco de las ciencias de la información': [gilUrdiciain('cap. introductorio de bibliotecología'), 1],
  'Tipología de bibliotecas y su función social': [APUNTES, 1],
  'Bibliotecas y sociedad de la información': [APUNTES, 1],
  'Historia del libro manuscrito y la escritura': [APUNTES, 2],
  'La imprenta y la transformación de la circulación del conocimiento': [APUNTES, 2],
  'Evolución de los soportes documentales en los siglos XIX y XX': [APUNTES, 2],
  'El documento digital y sus transformaciones recientes': [APUNTES, 2],
  'La biblioteca pública y su rol en la comunidad': [APUNTES, 1],
  'Extensión bibliotecaria y programas de fomento a la lectura': [APUNTES, 2],
  'Articulación de la biblioteca con instituciones educativas y sociales': [APUNTES, 2],
  'Inclusión social y accesibilidad en bibliotecas': [APUNTES, 2],
  'Elaboración de bibliografías y repertorios bibliográficos': [APUNTES, 2],
  'Normas de citación y referencia bibliográfica': [APUNTES, 1],
  'Control bibliográfico universal y nacional': [APUNTES, 2],
  'Bases de datos bibliográficas y su uso en la investigación': [APUNTES, 2],
  'La entrevista de referencia y el proceso de búsqueda de información': [APUNTES, 2],
  'Tipología de servicios de referencia presenciales y virtuales': [APUNTES, 1],
  'Alfabetización informacional de usuarios': [APUNTES, 2],
  'Evaluación de la calidad de los servicios de referencia': [APUNTES, 2],
  'Lenguajes documentales: clasificación, tesauros y encabezamientos de materia': [gilUrdiciain('cap. de lenguajes documentales'), 2],
  'Sistemas de clasificación bibliográfica (CDU, LCC, Dewey)': [gilUrdiciain('cap. de sistemas de clasificación'), 2],
  'Principios de indización de documentos': [gilUrdiciain('cap. de indización'), 2],
  'Representación temática y análisis de contenido documental': [chaumier('cap. de análisis de contenido'), 2],
  'Principios de la descripción bibliográfica': [isbdRda('sección de principios de descripción'), 2],
  'Normas de catalogación (ISBD, RDA)': [isbdRda('sección de normas ISBD/RDA'), 2],
  'Puntos de acceso: autor, título y materia': [isbdRda('sección de puntos de acceso'), 2],
  'Catálogos y su función en la recuperación de información': [chaumier('cap. de catálogos y recuperación'), 2],
  'Análisis formal y de contenido de distintos tipos documentales': [chaumier('cap. de análisis documental'), 2],
  'Integración de procesos técnicos en la cadena documental': [gilUrdiciain('cap. de procesos técnicos documentales'), 2],
  'Elaboración de productos documentales integrados (resúmenes, índices)': [chaumier('cap. de productos documentales'), 2],
  'Evaluación de la calidad del análisis documental': [chaumier('cap. de evaluación del análisis documental'), 2],
  'Fuentes primarias, secundarias y terciarias de información': [APUNTES, 1],
  'Fuentes de información especializadas por área del conocimiento': [APUNTES, 2],
  'Criterios de evaluación de fuentes de información': [APUNTES, 2],
  'Estrategias de búsqueda en fuentes especializadas': [APUNTES, 2],
  'Descripción de materiales especiales (audiovisuales, cartográficos, electrónicos)': [isbdRda('sección de materiales especiales'), 2],
  'Control de autoridades de nombres y materias': [isbdRda('sección de control de autoridades'), 2],
  'Metadatos descriptivos y esquemas de metadatos': [chaumier('cap. de metadatos descriptivos'), 2],
  'Catálogos en línea de acceso público (OPAC) y su evolución': [chaumier('cap. de catálogos en línea'), 2],
  'Elaboración y mantenimiento de tesauros especializados': [gilUrdiciain('cap. de construcción de tesauros'), 2],
  'Ontologías y esquemas de metadatos para la organización del conocimiento': [chaumier('cap. de ontologías documentales'), 2],
  'Web semántica y datos enlazados aplicados a la organización del conocimiento': [chaumier('cap. de web semántica'), 2],
  'Interoperabilidad entre sistemas de organización del conocimiento': [chaumier('cap. de interoperabilidad'), 2],
  'El conocimiento científico en la Antigüedad y la Edad Media': [APUNTES, 2],
  'La revolución científica de los siglos XVI y XVII': [APUNTES, 2],
  'Desarrollo de las disciplinas científicas en los siglos XIX y XX': [APUNTES, 2],
  'Comunicación científica y su evolución histórica': [APUNTES, 2],
  'Fuentes de información en ciencias sociales: bases de datos y repositorios': [APUNTES, 2],
  'Particularidades de la búsqueda de información en humanidades': [APUNTES, 2],
  'Evaluación de fuentes en ciencias sociales y humanidades': [APUNTES, 1],
  'Elaboración de guías temáticas de recursos en ciencias sociales y humanidades': [APUNTES, 2],
  'Funciones y servicios de la biblioteca universitaria': [APUNTES, 1],
  'Gestión de colecciones en apoyo a la docencia y la investigación': [APUNTES, 2],
  'Bibliotecas especializadas y centros de documentación': [APUNTES, 1],
  'Servicios de información especializados para comunidades científicas': [APUNTES, 2],
  'Estructura y relaciones de un tesauro documental': [gilUrdiciain('cap. de estructura de tesauros'), 2],
  'Normas para la construcción de tesauros (ISO 25964)': [gilUrdiciain('cap. de normas de construcción de tesauros'), 2],
  'Metodología para la elaboración de un tesauro especializado': [gilUrdiciain('cap. de metodología de elaboración de tesauros'), 3],
  'Actualización y validación de tesauros documentales': [gilUrdiciain('cap. de mantenimiento de tesauros'), 2],
  'Motores de búsqueda y bases de datos electrónicas': [chaumier('cap. de motores de búsqueda'), 2],
  'Operadores de búsqueda y estrategias de recuperación electrónica': [chaumier('cap. de operadores de búsqueda'), 2],
  'Indicadores de precisión y exhaustividad en la recuperación electrónica': [chaumier('cap. de evaluación de la recuperación'), 2],
  'Recuperación de información en repositorios digitales': [chaumier('cap. de repositorios digitales'), 2],
  'Selección y adquisición de materiales bibliográficos': [APUNTES, 2],
  'Políticas de desarrollo de colecciones en bibliotecas': [APUNTES, 2],
  'Evaluación y expurgo de colecciones': [APUNTES, 2],
  'Desarrollo de colecciones digitales': [APUNTES, 2],
  'Necesidades, búsqueda y uso de información en bibliotecas': [APUNTES, 2],
  'Métodos y técnicas para el estudio de usuarios de bibliotecas': [APUNTES, 2],
  'Perfiles de usuarios de bibliotecas públicas, universitarias y especializadas': [APUNTES, 1],
  'Uso de los estudios de usuarios para la mejora de servicios bibliotecarios': [APUNTES, 2],
  'Diagnóstico y planificación estratégica de servicios bibliotecarios': [gomezHernandez('cap. de planificación estratégica'), 2],
  'Formulación de proyectos en bibliotecas y centros de documentación': [gomezHernandez('cap. de formulación de proyectos'), 2],
  'Herramientas de gestión de proyectos aplicadas a bibliotecas': [gomezHernandez('cap. de gestión de proyectos'), 2],
  'Evaluación de resultados e impacto de proyectos bibliotecarios': [gomezHernandez('cap. de evaluación de proyectos'), 2],
};

// ---------------------------------------------------------------------
// Íconos de módulo (por nombre de módulo -- si el módulo ya existe en
// modulo-icons.json con otro ícono, no se pisa, mismo criterio que el
// resto de las rondas de catálogo).
// ---------------------------------------------------------------------
const MODULOS_ICONOS = {
  'La universidad y la vida académica': '🎓',
  'Introducción al campo de la información y la comunicación': '🎓',
  'Qué es la ciencia y el conocimiento científico': '🧠',
  'Epistemología de las ciencias sociales y humanas': '🧠',
  'Del pensamiento clásico a la modernidad': '🧠',
  'Pensamiento contemporáneo': '🧠',
  'Diseño de la investigación': '🔍',
  'Técnicas de recolección y análisis': '🔍',
  'Fundamentos y técnicas de IA': '🤖',
  'IA aplicada a la información y la sociedad': '🤖',
  'Herramientas de diseño asistido por computadora': '🖥️',
  'Diseño de flujos y procesos con software': '🖥️',
  'Fundamentos del diseño gráfico': '🎨',
  'Diseño para la comunicación de información': '🎨',
  'Estadística descriptiva aplicada a información y comunicación': '📊',
  'Nociones de probabilidad y muestreo': '📊',
  'Fundamentos de la administración de unidades de información': '🏢',
  'Gestión de recursos': '🏢',
  'Planeamiento y marketing de servicios': '🏢',
  'Dirección y evaluación': '🏢',
  'Tratamiento documental de materiales audiovisuales': '🎬',
  'Gestión y difusión de archivos audiovisuales': '🎬',
  'Fundamentos de la preservación digital': '💾',
  'Modelos y políticas de preservación': '💾',
  'Fundamentos de redes de computadoras': '🌐',
  'Sistemas de información en unidades de información': '🌐',
  'Modelo relacional y diseño de bases de datos': '🗃️',
  'Lenguaje SQL y aplicaciones': '🗃️',
  'Elementos del lenguaje audiovisual': '🎬',
  'Historia y géneros audiovisuales': '🎬',
  'Modelos clásicos de la comunicación': '📡',
  'Comunicación y sociedad de masas': '📡',
  'Clásicos de la teoría social': '🧠',
  'Pensamiento social contemporáneo': '🧠',
  'El mundo desde el siglo XIX': '🏛️',
  'Uruguay y América Latina contemporáneos': '🏛️',
  'Discurso y sentido': '📡',
  'Técnica y mediatización': '📡',
  'Fundamentos de economía política': '🏛️',
  'Sistema político y comunicación': '🏛️',
  'El campo profesional de la comunicación': '📡',
  'Orientaciones de la Licenciatura en Comunicación': '📡',
  'Lenguaje y cognición': '🧠',
  'Cultura y diversidad': '🧠',
  'Elementos del lenguaje sonoro': '🎙️',
  'Producción sonora': '🎙️',
  'Perspectivas teóricas contemporáneas': '📡',
  'Comunicación, tecnología y sociedad red': '📡',
  'Teorías del cine': '🎬',
  'Medios audiovisuales contemporáneos': '🎬',
  'Fundamentos del periodismo': '🗞️',
  'El campo periodístico contemporáneo': '🗞️',
  'Lengua y variación social': '🧠',
  'Lengua y comunicación mediática': '🧠',
  'Fundamentos de la semiótica': '🔣',
  'Semiótica aplicada': '🔣',
  'El lenguaje radiofónico': '🎙️',
  'Producción radiofónica': '🎙️',
  'La noticia y su construcción': '🗞️',
  'Redacción informativa': '🗞️',
  'Fundamentos del periodismo narrativo': '🗞️',
  'Construcción de relatos periodísticos': '🗞️',
  'Formatos avanzados de radio': '🎙️',
  'Nuevos formatos sonoros': '🎙️',
  'Marco normativo de la comunicación': '🗞️',
  'Ética y responsabilidad periodística': '🗞️',
  'Organización y rutinas de producción': '🗞️',
  'Producción integrada multiplataforma': '🗞️',
  'El campo disciplinar de la archivología': '🗂️',
  'El documento y el archivo': '🗂️',
  'Formación del Estado uruguayo': '🏛️',
  'Instituciones y fuentes documentales': '🏛️',
  'Servicios de información': '🗂️',
  'Acceso a la información pública': '🗂️',
  'El ciclo de vida del documento': '🗂️',
  'Instrumentos de gestión documental': '🗂️',
  'Gestión documental avanzada': '🗂️',
  'Auditoría y control de la gestión documental': '🗂️',
  'Principios de organización de fondos': '🗂️',
  'Ordenación y control': '🗂️',
  'Marco legal de los archivos': '🗂️',
  'Responsabilidad y patrimonio documental': '🗂️',
  'Fundamentos de la clasificación archivística': '🗂️',
  'Aplicación práctica': '🔖',
  'Principios de la descripción archivística': '🔖',
  'Instrumentos descriptivos': '🔖',
  'Fundamentos de la conservación documental': '🛡️',
  'Gestión de riesgos': '🛡️',
  'Fundamentos de la valoración documental': '⚖️',
  'Selección y eliminación': '⚖️',
  'Extensión y difusión del patrimonio archivístico': '🗂️',
  'Archivos y comunidad': '🗂️',
  'Organización del conocimiento': '🔖',
  'Recuperación de la información': '🔖',
  'Fundamentos de los estudios de usuarios': '👥',
  'Aplicación a servicios archivísticos': '👥',
  'El archivo histórico': '🏛️',
  'Tratamiento de fondos históricos': '🏛️',
  'Planificación estratégica': '📋',
  'Gestión de proyectos': '📋',
  'Micrografía documental': '💾',
  'Digitalización de documentos': '💾',
  'El campo disciplinar de la bibliotecología': '📚',
  'La biblioteca como institución': '📚',
  'Del documento manuscrito al libro impreso': '🏛️',
  'El documento en la era contemporánea': '🏛️',
  'La biblioteca en su entorno social': '📚',
  'Vínculos institucionales': '📚',
  'Fundamentos del trabajo bibliográfico': '📚',
  'Fuentes y control bibliográfico': '📚',
  'El servicio de referencia': '📚',
  'Atención al usuario': '📚',
  'Fundamentos de la organización del conocimiento': '🔖',
  'Indización y representación temática': '🔖',
  'Fundamentos de la catalogación': '🔖',
  'Puntos de acceso': '🔖',
  'Análisis documental integrado': '🔖',
  'Tipología de fuentes de información': '📚',
  'Evaluación y uso de fuentes': '📚',
  'Catalogación avanzada': '🔖',
  'Metadatos y catálogos': '🔖',
  'Herramientas avanzadas de organización': '🔖',
  'Organización del conocimiento en entornos digitales': '🔖',
  'De la ciencia antigua a la revolución científica': '🏛️',
  'Ciencia moderna y contemporánea': '🏛️',
  'Fuentes en ciencias sociales': '📚',
  'Estrategias de búsqueda especializada': '📚',
  'La biblioteca universitaria': '📚',
  'Bibliotecas especializadas': '📚',
  'Fundamentos de los tesauros documentales': '🔖',
  'Construcción y mantenimiento': '🔖',
  'Sistemas de recuperación electrónica': '🗃️',
  'Evaluación de la recuperación': '🗃️',
  'Políticas de desarrollo de colecciones': '📚',
  'Gestión de colecciones': '📚',
  'Aplicación a servicios bibliotecarios': '👥',
  'Planificación estratégica en unidades de información': '📋',
};

// ---------------------------------------------------------------------
// Escritura + validación
// ---------------------------------------------------------------------
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const modIcons = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

let agregadosTexto = 0, agregadosDuracion = 0, agregadosIcono = 0, colisiones = [];
for (const [tema, [entradaTexto, dias]] of Object.entries(TEXTOS_NUEVOS)) {
  if (textos[tema] !== undefined) { colisiones.push(['textos', tema]); continue; }
  if (duraciones[tema] !== undefined) { colisiones.push(['duraciones', tema]); continue; }
  textos[tema] = entradaTexto;
  duraciones[tema] = dias;
  agregadosTexto++;
  agregadosDuracion++;
}
for (const [modulo, icono] of Object.entries(MODULOS_ICONOS)) {
  if (modIcons[modulo] === undefined) { modIcons[modulo] = icono; agregadosIcono++; }
}

if (colisiones.length) {
  console.error('COLISIONES DETECTADAS (no se sobreescribió nada):', colisiones);
  process.exit(1);
}

fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(modIcons, null, 2) + '\n');

fs.writeFileSync(path.join(DATA, 'catalogo-comunicacion.json'), JSON.stringify(materiasComunicacion, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'catalogo-archivologia.json'), JSON.stringify(materiasArchivologia, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'catalogo-bibliotecologia.json'), JSON.stringify(materiasBibliotecologia, null, 2) + '\n');

// Integridad: todo tema tiene bibliografía, duración e ícono de módulo; sin
// duplicados de materia dentro de un semestre; las UC oficialmente
// compartidas (ver el comentario de arriba) coinciden byte a byte entre las
// carreras donde aparecen.
const catalogos = {
  comunicacion: materiasComunicacion,
  archivologia: materiasArchivologia,
  bibliotecologia: materiasBibliotecologia,
};
let sinTexto = [], sinDuracion = [], sinIcono = [], duplicados = [], reuseInconsistente = [];
let totalMaterias = 0, totalModulos = 0, totalTemas = 0;
const porCarrera = {};
for (const [nombreCarrera, catalogo] of Object.entries(catalogos)) {
  let materias = 0, modulos = 0, temas = 0;
  for (const [sem, mats] of Object.entries(catalogo)) {
    const nombres = new Set();
    mats.forEach(m => {
      if (nombres.has(m.nombre)) duplicados.push(`${nombreCarrera} sem ${sem}: ${m.nombre}`);
      nombres.add(m.nombre);
      materias++;
      (m.modulos || []).forEach(mo => {
        modulos++;
        if (!modIcons[mo.modulo]) sinIcono.push(`${nombreCarrera}: ${mo.modulo}`);
        mo.temas.forEach(t => {
          temas++;
          if (!textos[t]) sinTexto.push(`${nombreCarrera}: ${t}`);
          if (duraciones[t] === undefined) sinDuracion.push(`${nombreCarrera}: ${t}`);
        });
      });
    });
  }
  porCarrera[nombreCarrera] = { materias, modulos, temas };
  totalMaterias += materias; totalModulos += modulos; totalTemas += temas;
}

// UC oficialmente compartidas (mismo código real de UC) -- deben ser
// byte-idénticas entre TODAS las carreras donde aparecen.
const UC_COMPARTIDAS = [
  'Curso Introductorio', 'Introducción a la Epistemología', 'Historia de las Ideas',
  'Metodología de la Investigación en Información y Comunicación',
  'Fundamentos de Inteligencia Artificial', 'Diseño Asistido de Software',
  'Diseño y Análisis', 'Estadística Básica',
  'Administración en Unidades de Información I', 'Administración en Unidades de Información II',
  'Documentación Audiovisual', 'Introducción a la Preservación Digital',
  'Redes y Sistemas', 'Bases de Datos',
];
function encontrarMateria(catalogo, nombre) {
  return [].concat(...Object.values(catalogo)).find(m => m.nombre === nombre);
}
UC_COMPARTIDAS.forEach(nombre => {
  const apariciones = Object.entries(catalogos)
    .map(([carrera, cat]) => [carrera, encontrarMateria(cat, nombre)])
    .filter(([, m]) => m);
  if (apariciones.length < 2) return; // solo aparece en 1 carrera, nada que comparar
  const [, primera] = apariciones[0];
  const refJson = JSON.stringify(primera.modulos);
  apariciones.slice(1).forEach(([carrera, m]) => {
    if (JSON.stringify(m.modulos) !== refJson) reuseInconsistente.push(`${nombre} (${carrera})`);
  });
});

console.log(`Textos agregados: ${agregadosTexto}, duraciones agregadas: ${agregadosDuracion}, íconos agregados: ${agregadosIcono}`);
console.log('Por carrera:', porCarrera);
console.log(`Totales -- materias: ${totalMaterias}, módulos: ${totalModulos}, temas: ${totalTemas}`);
console.log(`Integridad -- sin texto: ${sinTexto.length}, sin duración: ${sinDuracion.length}, sin ícono: ${sinIcono.length}, materias duplicadas: ${duplicados.length}, núcleo compartido inconsistente: ${reuseInconsistente.length}`);
if (sinTexto.length || sinDuracion.length || sinIcono.length || duplicados.length || reuseInconsistente.length) {
  console.error({ sinTexto, sinDuracion, sinIcono, duplicados, reuseInconsistente });
  process.exit(1);
}
console.log('OK -- catálogos de FIC (Comunicación/Archivología/Bibliotecología) íntegros y núcleo común consistente.');
