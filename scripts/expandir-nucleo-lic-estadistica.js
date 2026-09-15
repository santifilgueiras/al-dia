// Expande el núcleo obligatorio (áreas Matemática + Instrumental + Inferencia
// Estadística + Perfil del Egresado, perfil Económico) de la Licenciatura en
// Estadística de FCEA con el temario REAL sacado de las Fichas de Unidad
// Curricular oficiales (fcea.udelar.edu.uy, vigencia 2025-2026). Pedido de
// Santiago tras notar que catalogo-estadistica.json (12 materias, 3-4 temas
// c/u) era un placeholder, igual que pasó con MC40 "Introducción a la
// Estadística" (ver scripts/expandir-mc40-estadistica.js).
//
// Alcance decidido con Santiago (AskUserQuestion): solo el núcleo obligatorio,
// SIN las decenas de materias optativas de los 4 perfiles (Económico,
// Tecnológico, Bioestadístico, Actuarial-Demográfico).
//
// Varias de estas UC son compartidas con otras carreras de FCEA ya cargadas
// (Cálculo I/II/III, Álgebra Lineal, Economía Descriptiva, Econometría I) --
// se actualizan en TODOS los catálogos donde aparecen para no desincronizarlos
// (mismo criterio que expandir-mc40-estadistica.js). Economía Descriptiva y
// Econometría I además se agregan de cero a catalogo-estadistica.json (semestre
// 2 y 6 respectivamente) porque son obligatorias ahí pero no estaban.
// "Programación I" se renombra a "Programación Imperativa" (nombre real del
// curso que efectivamente se cursa, dictado por el Instituto de Computación de
// FING).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Cada entrada: { nombreActual, nombreNuevo?, archivos: [...], modulos: [...] }
// modulos: [ [nombreModulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ]
// ---------------------------------------------------------------------------
const MATERIAS = [
  {
    nombreActual: 'Cálculo I',
    archivos: ['catalogo-administracion.json', 'catalogo-contador-publico.json', 'catalogo-economia.json', 'catalogo-estadistica.json'],
    modulos: [
      ['Derivada y aplicaciones', '📐', [
        ['Funciones lineales, cuadrática, exponencial y logarítmica', 'Peláez - Introducción al Cálculo', 'capítulo de funciones elementales', 1],
        ['Cálculo de derivadas y regla de la cadena', 'Peláez - Introducción al Cálculo', 'capítulo de derivación', 1],
        ['Teorema del valor medio y estudio de crecimiento/decrecimiento', 'Peláez - Introducción al Cálculo', 'capítulo de aplicaciones de la derivada', 1],
        ['Aplicaciones económicas: costo, ingreso, utilidad marginal y elasticidad', 'Peláez - Introducción al Cálculo', 'capítulo de aplicaciones económicas de la derivada', 2],
      ]],
      ['Función inversa', '🔁', [
        ['Inyectividad, sobreyectividad y biyectividad', 'Peláez - Introducción al Cálculo', 'capítulo de funciones inversas', 1],
        ['Continuidad y derivabilidad de la función inversa', 'Peláez - Introducción al Cálculo', 'capítulo de funciones inversas', 1],
        ['Funciones trigonométricas y sus inversas', 'Peláez - Introducción al Cálculo', 'capítulo de funciones trigonométricas', 1],
      ]],
      ['Aproximación polinómica (Taylor)', '📈', [
        ['Teorema de Taylor: resto de Lagrange e infinitesimal', 'Peláez - Introducción al Cálculo', 'capítulo de polinomio de Taylor', 2],
        ['Desarrollos de funciones elementales y aplicación a límites', 'Peláez - Introducción al Cálculo', 'capítulo de polinomio de Taylor', 1],
        ['Serie geométrica y sus derivadas', 'Peláez - Introducción al Cálculo', 'capítulo de series', 1],
      ]],
      ['Integración', '🧮', [
        ['Primitivas, teorema fundamental del cálculo y regla de Barrow', 'Peláez - Introducción al Cálculo', 'capítulo de integración', 1],
        ['Métodos de integración: partes, sustitución, cocientes de polinomios', 'Peláez - Introducción al Cálculo', 'capítulo de métodos de integración', 2],
        ['Cálculo de áreas y aplicaciones económicas (excedentes)', 'Peláez - Introducción al Cálculo', 'capítulo de aplicaciones de la integral', 1],
        ['Integrales impropias y criterio del equivalente', 'Peláez - Introducción al Cálculo', 'capítulo de integrales impropias', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Cálculo II',
    archivos: ['catalogo-economia.json', 'catalogo-estadistica.json'],
    modulos: [
      ['Topología y funciones de varias variables', '🗺️', [
        ['Conjuntos abiertos, cerrados, acotados y puntos de acumulación', 'Apostol - Calculus, Vol. 2', 'capítulo de topología en Rⁿ', 1],
        ['Dominio, gráfico y conjuntos de nivel', 'Apostol - Calculus, Vol. 2', 'capítulo de funciones de varias variables', 1],
        ['Límites, continuidad y derivadas parciales', 'Apostol - Calculus, Vol. 2', 'capítulo de derivadas parciales', 2],
      ]],
      ['Diferenciabilidad', '📐', [
        ['Condiciones de diferenciabilidad y desarrollo de Taylor de segundo orden', 'Apostol - Calculus, Vol. 2', 'capítulo de diferenciabilidad', 2],
        ['Función compuesta y regla de la cadena en varias variables', 'Apostol - Calculus, Vol. 2', 'capítulo de la regla de la cadena', 1],
      ]],
      ['Integrales dobles', '🧮', [
        ['Integrales dobles en rectángulos y regiones típicas', 'Apostol - Calculus, Vol. 2', 'capítulo de integrales dobles', 1],
        ['Cálculo por integrales iteradas', 'Apostol - Calculus, Vol. 2', 'capítulo de integrales iteradas', 1],
        ['Cambio de variable: transformación lineal y coordenadas polares', 'Apostol - Calculus, Vol. 2', 'capítulo de cambio de variable', 2],
        ['Integrales dobles impropias', 'Apostol - Calculus, Vol. 2', 'capítulo de integrales impropias', 1],
      ]],
      ['Optimización', '🧭', [
        ['Extremos relativos y absolutos; condición de Hess', 'Apostol - Calculus, Vol. 2', 'capítulo de extremos de funciones de varias variables', 2],
        ['Conjuntos y funciones convexas', 'Apostol - Calculus, Vol. 2', 'capítulo de convexidad', 1],
        ['Multiplicadores de Lagrange (restricciones de igualdad)', 'Apostol - Calculus, Vol. 2', 'capítulo de multiplicadores de Lagrange', 2],
        ['Condiciones de Kuhn-Tucker (restricciones de desigualdad)', 'Apostol - Calculus, Vol. 2', 'capítulo de optimización con restricciones de desigualdad', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Cálculo III',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Sucesiones y series', '➰', [
        ['Conjuntos abiertos/cerrados, ínfimo, supremo y numerabilidad', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de sucesiones y conjuntos', 1],
        ['Sucesiones, subsucesiones y sucesiones por recurrencia', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de sucesiones', 1],
        ['Sucesiones de Cauchy y completitud', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de completitud', 2],
        ['Criterios de convergencia para series de términos positivos', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de series', 2],
      ]],
      ['Ecuaciones diferenciales', '📉', [
        ['Ecuaciones diferenciales lineales de primer y segundo orden', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de ecuaciones diferenciales lineales', 2],
        ['Ecuaciones de variables separables', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de ecuaciones de variables separables', 1],
        ['Diagrama de fase, análisis cualitativo y estabilidad lineal', 'Peláez - Notas para el curso de Cálculo 3', 'capítulo de estabilidad', 2],
      ]],
      ['Teoría de la medida', '📏', [
        ['Sigma-álgebras, medidas y extensión de pre-medidas', 'Stein y Shakarchi - Real Analysis', 'capítulo de teoría de la medida', 2],
        ['Conjuntos no medibles y conjuntos borelianos', 'Stein y Shakarchi - Real Analysis', 'capítulo de medida de Lebesgue', 2],
        ['Lema de Borel-Cantelli', 'Stein y Shakarchi - Real Analysis', 'capítulo de teoría de la medida', 1],
        ['Funciones medibles y aproximación por funciones simples', 'Stein y Shakarchi - Real Analysis', 'capítulo de funciones medibles', 2],
      ]],
      ['Integración y convergencia', '🧮', [
        ['Integral de Lebesgue', 'Stein y Shakarchi - Real Analysis', 'capítulo de integración de Lebesgue', 2],
        ['Teoremas de convergencia monótona y dominada', 'Stein y Shakarchi - Real Analysis', 'capítulo de teoremas de convergencia', 2],
        ['Modos de convergencia: puntual, en medida, c.t.p. y en Lp', 'Stein y Shakarchi - Real Analysis', 'capítulo de espacios Lp', 2],
      ]],
      ['Diferenciación avanzada y Fubini', '🧩', [
        ['Teorema de diferenciación de Lebesgue', 'Stein y Shakarchi - Real Analysis', 'capítulo de diferenciación', 2],
        ['Versión simple del teorema de Radon-Nikodym', 'Stein y Shakarchi - Real Analysis', 'capítulo de diferenciación de medidas', 2],
        ['Teorema de Tonelli-Fubini', 'Stein y Shakarchi - Real Analysis', 'capítulo de integración en producto de medidas', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Álgebra Lineal',
    archivos: ['catalogo-contador-publico.json', 'catalogo-economia.json', 'catalogo-estadistica.json'],
    modulos: [
      ['Sistemas de ecuaciones lineales y matrices', '🧮', [
        ['Matriz asociada a un sistema de ecuaciones y operaciones con matrices', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de sistemas lineales', 1],
        ['Método de escalerización y rango de una matriz', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de escalerización', 1],
        ['Sistemas cuadrados y matrices invertibles', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de matrices invertibles', 1],
      ]],
      ['El espacio vectorial Rⁿ', '📍', [
        ['Operaciones básicas e interpretación geométrica en R² y R³', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de vectores en Rⁿ', 1],
        ['Rectas y planos en R³', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de geometría vectorial', 1],
        ['Combinaciones lineales y dependencia/independencia lineal', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de independencia lineal', 2],
      ]],
      ['Subespacios de Rⁿ', '🧱', [
        ['Generador de un subespacio, bases y dimensión', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de espacios vectoriales', 2],
        ['Rango y núcleo de una matriz; relación nulidad-rango', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de rango y núcleo', 1],
      ]],
      ['El espacio euclidiano Rⁿ', '📐', [
        ['Producto interno, norma, distancia y ángulos', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de producto interno', 1],
        ['Desigualdad de Cauchy-Schwarz', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de producto interno', 1],
        ['Conjuntos ortogonales/ortonormales y proyección ortogonal', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de ortogonalidad', 2],
        ['Mínimos cuadrados', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de mínimos cuadrados', 1],
      ]],
      ['Diagonalización', '🔷', [
        ['Determinantes, valores y vectores propios', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de valores propios', 2],
        ['Matrices diagonalizables: condiciones necesarias y suficientes', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de diagonalización', 2],
        ['Diagonalización de matrices simétricas', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de matrices simétricas', 1],
        ['Descomposición en valores singulares (SVD) y aplicaciones', 'Lay - Álgebra Lineal y sus Aplicaciones', 'capítulo de descomposición SVD', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Estadística Descriptiva',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Introducción a la estadística', '🔎', [
        ['Estadística descriptiva vs. inferencial', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo introductorio', 1],
      ]],
      ['Descripción univariada de datos', '📊', [
        ['Tipos de variables y distribuciones de frecuencias', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de distribución de frecuencias', 1],
        ['Medidas de resumen y representaciones gráficas', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de medidas de resumen', 1],
      ]],
      ['Introducción al lenguaje R', '💻', [
        ['Instalación, uso inicial y operaciones básicas en R', 'Irizarry - Introducción a la Ciencia de Datos', 'capítulo de introducción a R', 1],
        ['Descripción numérica y gráfica de datos en R', 'Irizarry - Introducción a la Ciencia de Datos', 'capítulo de visualización de datos', 1],
      ]],
      ['Exploración bivariada y multivariada', '🔗', [
        ['Tablas de contingencia y medidas de asociación y correlación', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de asociación entre variables', 2],
        ['Gráficos para variables categóricas y numéricas; diagramas de dispersión', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de representación gráfica bivariada', 1],
        ['Álgebra lineal aplicada a estructuras de datos y visualización multivariada', 'Irizarry - Introducción a la Ciencia de Datos', 'capítulo de álgebra lineal aplicada', 2],
      ]],
      ['Indicadores, índices y desigualdad', '📈', [
        ['Curva de Lorenz e Índice de Gini', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de medidas de desigualdad', 2],
        ['Medidas de desigualdad basadas en teoría de la información', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de medidas de desigualdad', 2],
        ['Tasas, razones, proporciones y tasas de variación', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de indicadores', 1],
        ['Números índice: Laspeyres, Paasche y cambio de base', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de números índice', 2],
      ]],
      ['Detección de outliers', '🚨', [
        ['Métodos gráficos: boxplot y violin plot', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de detección de valores atípicos', 1],
        ['Criterios univariados y multivariados de detección', 'Espejo Miranda et al. - Estadística Descriptiva y Probabilidad', 'capítulo de detección de valores atípicos', 1],
      ]],
    ],
  },
  {
    nombreActual: 'Probabilidad I',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Fundamentos y espacio de probabilidad', '🎲', [
        ['Espacio muestral, sucesos, álgebras y sigma-álgebras', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de espacios de probabilidad', 1],
        ['Definición axiomática de Kolmogorov y consecuencias', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de axiomas de probabilidad', 2],
        ['Interpretaciones de la probabilidad y métodos de conteo', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de combinatoria', 1],
      ]],
      ['Probabilidad condicional e independencia', '🔗', [
        ['Independencia estocástica', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de independencia', 1],
        ['Teorema de la probabilidad total y teorema de Bayes', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de probabilidad condicional', 2],
      ]],
      ['Variables aleatorias', '🔢', [
        ['Función medible, variable aleatoria y función de distribución', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de variables aleatorias', 2],
        ['Variables discretas (función de cuantía) y continuas (densidad)', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de distribuciones discretas y continuas', 2],
        ['Transformaciones medibles y función cuantil', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de transformación de variables', 1],
      ]],
      ['Vectores aleatorios', '🧭', [
        ['Distribución conjunta, marginales e independencia', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de distribuciones conjuntas', 2],
        ['Vectores discretos y continuos: cuantía/densidad conjunta y condicional', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de distribuciones condicionales', 2],
        ['Transformaciones medibles de vectores aleatorios', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de transformación de vectores', 1],
      ]],
      ['Características y desigualdades', '⚖️', [
        ['Esperanza, momentos y varianza', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de esperanza y momentos', 1],
        ['Desigualdades de Markov, Chebyshev, Jensen, Hölder y Minkowski', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de desigualdades', 2],
        ['Funciones generatrices y características; esperanza condicional', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de funciones generatrices', 2],
        ['Covarianza y matriz de varianzas-covarianzas', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de covarianza', 1],
      ]],
      ['Modelos de distribución especiales', '🎯', [
        ['Distribuciones discretas univariadas y multivariadas', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de modelos discretos', 2],
        ['Distribuciones absolutamente continuas univariadas y multivariadas', 'Blitzstein y Hwang - Introduction to Probability', 'capítulo de modelos continuos', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Inferencia I',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Fundamentos de la inferencia', '🔎', [
        ['Población, modelo poblacional, parámetro y espacio paramétrico', 'Casella y Berger - Statistical Inference', 'capítulo de fundamentos de la inferencia', 1],
        ['Familia exponencial y familia de posición y escala', 'Casella y Berger - Statistical Inference', 'capítulo de familias de distribuciones', 2],
        ['Muestra, experimento estadístico, estadístico y estimador', 'Casella y Berger - Statistical Inference', 'capítulo de estadísticos y estimadores', 1],
      ]],
      ['Distribución en el muestreo', '🧮', [
        ['Muestreo aleatorio simple con reemplazo', 'Casella y Berger - Statistical Inference', 'capítulo de muestreo', 1],
        ['Distribución de la suma y la media muestral', 'Casella y Berger - Statistical Inference', 'capítulo de distribuciones muestrales', 2],
        ['Distribuciones especiales: chi-cuadrado, t y F', 'Casella y Berger - Statistical Inference', 'capítulo de distribuciones derivadas de la normal', 2],
        ['Estadísticos de orden', 'Casella y Berger - Statistical Inference', 'capítulo de estadísticos de orden', 1],
      ]],
      ['Estimación puntual', '🎯', [
        ['Método de los momentos', 'Casella y Berger - Statistical Inference', 'capítulo de estimación puntual', 1],
        ['Función de verosimilitud y estimadores máximo-verosímiles', 'Casella y Berger - Statistical Inference', 'capítulo de máxima verosimilitud', 2],
        ['Error cuadrático medio, insesgamiento y suficiencia', 'Casella y Berger - Statistical Inference', 'capítulo de propiedades de estimadores', 2],
      ]],
      ['Contraste de hipótesis', '⚖️', [
        ['Tipos de error, nivel de significación y región de rechazo', 'Casella y Berger - Statistical Inference', 'capítulo de contraste de hipótesis', 1],
        ['Lema de Neyman-Pearson (hipótesis simples y compuestas)', 'Casella y Berger - Statistical Inference', 'capítulo de contrastes óptimos', 2],
        ['Contrastes de razón de verosimilitudes y valor-p', 'Casella y Berger - Statistical Inference', 'capítulo de razón de verosimilitudes', 2],
      ]],
      ['Estimación por intervalos', '📏', [
        ['Intervalos de confianza e interpretación del coeficiente de confianza', 'Casella y Berger - Statistical Inference', 'capítulo de estimación por intervalos', 1],
        ['Inversión de un contraste y cantidades pivotales', 'Casella y Berger - Statistical Inference', 'capítulo de cantidades pivotales', 2],
        ['Optimalidad: intervalos de mínima amplitud', 'Casella y Berger - Statistical Inference', 'capítulo de optimalidad de intervalos', 1],
      ]],
      ['Inferencia en muestras grandes', '♾️', [
        ['Convergencia en probabilidad, media cuadrática y distribución', 'Casella y Berger - Statistical Inference', 'capítulo de convergencia', 2],
        ['Teorema Central del Límite y método delta', 'Casella y Berger - Statistical Inference', 'capítulo de teoría asintótica', 2],
        ['Estimadores consistentes, intervalos/contrastes asintóticos y bootstrap', 'Casella y Berger - Statistical Inference', 'capítulo de inferencia asintótica', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Inferencia II',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Fundamentos de la inferencia bayesiana', '🎱', [
        ['Pensamiento bayesiano vs. frecuentista', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo introductorio al pensamiento bayesiano', 1],
        ['Modelo binomial y distribución posterior', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo del modelo Beta-Binomial', 2],
        ['Distribuciones previas informativas', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de distribuciones previas', 1],
        ['Estimación puntual y por intervalo bayesiana (uno y varios parámetros)', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de estimación bayesiana', 2],
      ]],
      ['Métodos de simulación clásicos', '🎰', [
        ['Muestreo de aceptación/rechazo', 'Albert - Bayesian Computation with R', 'capítulo de métodos de simulación', 2],
        ['Muestreo por importancia (con y sin re-muestreo)', 'Albert - Bayesian Computation with R', 'capítulo de muestreo por importancia', 2],
      ]],
      ['MCMC', '🔗', [
        ['Cadenas de Markov discretas', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de cadenas de Markov', 2],
        ['Algoritmos de Metropolis y Metropolis-Hastings', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de MCMC', 2],
        ['Muestreo de Gibbs', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de muestreo de Gibbs', 2],
        ['Diagnóstico y monitoreo de convergencia', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de diagnóstico de MCMC', 1],
      ]],
      ['Modelación jerárquica y comparación de modelos', '🏗️', [
        ['Simulación desde la posterior y análisis de sensibilidad bayesiano', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de modelos jerárquicos', 2],
        ['Comparación de modelos bayesianos', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de comparación de modelos', 1],
      ]],
      ['Regresión bayesiana', '📉', [
        ['Análisis bayesiano del modelo lineal clásico', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de regresión bayesiana', 2],
        ['Selección de variables', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de selección de variables', 1],
        ['Modelos lineales generalizados (enfoque bayesiano)', 'Johnson, Ott y Dogucu - Bayes Rules!', 'capítulo de modelos lineales generalizados bayesianos', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Muestreo y Planificación de Encuestas I',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Fundamentos de inferencia basada en el diseño', '🎯', [
        ['Población objetivo y marcos muestrales', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de fundamentos del muestreo', 1],
        ['Errores de cobertura, muestrales y no muestrales', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de errores en encuestas', 1],
      ]],
      ['Muestreo aleatorio y estimación', '🧮', [
        ['Distribución en el muestreo, varianza y error estándar', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de estimación en muestreo', 2],
        ['Diseño muestral y probabilidad de inclusión', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de diseño muestral', 1],
        ['Estimador de Horvitz-Thompson y ponderadores', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo del estimador Horvitz-Thompson', 2],
        ['Efecto de diseño', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de efecto de diseño', 1],
      ]],
      ['Métodos de muestreo', '🗂️', [
        ['Muestreo aleatorio simple y sistemático', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de muestreo simple y sistemático', 1],
        ['Muestreo con probabilidad proporcional al tamaño', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de muestreo PPT', 2],
        ['Muestreo estratificado: construcción de estratos y asignación', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de muestreo estratificado', 2],
        ['Muestreo por conglomerados (una o varias etapas)', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de muestreo por conglomerados', 2],
      ]],
      ['Estimación avanzada y aplicación', '🇺🇾', [
        ['Métodos de estimación de varianza y estimación en dominios', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de estimación de varianza', 2],
        ['Principales encuestas oficiales sociodemográficas de Uruguay', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de aplicaciones a encuestas oficiales', 1],
        ['Uso de librerías R para encuestas: sampling, survey, srvyr', 'Gutiérrez Rojas - Estrategias de Muestreo', 'capítulo de implementación en R', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Modelos Lineales',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Tipos de estudio y comparación de medias', '🧪', [
        ['Estudios observacionales vs. experimentales', 'Faraway - Linear Models with R', 'capítulo introductorio de diseño de estudios', 1],
        ['Estimación de la media normal y prueba t', 'Faraway - Linear Models with R', 'capítulo de comparación de medias', 2],
      ]],
      ['Análisis de Varianza (ANOVA)', '📊', [
        ['Comparación de más de 2 medias y estimación por mínimos cuadrados', 'Faraway - Linear Models with R', 'capítulo de ANOVA', 2],
        ['Teorema de Gauss-Markov y contrastes lineales', 'Faraway - Linear Models with R', 'capítulo de Gauss-Markov', 2],
      ]],
      ['Regresión simple', '📉', [
        ['Modelo continuo para la media condicional', 'Faraway - Linear Models with R', 'capítulo de regresión simple', 1],
        ['Estimación por mínimos cuadrados y máxima verosimilitud', 'Faraway - Linear Models with R', 'capítulo de estimación', 2],
        ['Predicción de nuevos valores', 'Faraway - Linear Models with R', 'capítulo de predicción', 1],
      ]],
      ['Regresión múltiple', '📈', [
        ['Estimación del modelo y propiedades de los estimadores', 'Faraway - Linear Models with R', 'capítulo de regresión múltiple', 2],
        ['Inferencia, predicción, diagnóstico y selección de modelos', 'Faraway - Linear Models with R', 'capítulo de diagnóstico y selección de modelos', 2],
      ]],
      ['Regresión logística', '🔀', [
        ['Modelos para variable de respuesta binaria', 'Faraway - Linear Models with R', 'capítulo de regresión logística', 1],
        ['Estimación por máxima verosimilitud y aplicaciones', 'Faraway - Linear Models with R', 'capítulo de estimación en regresión logística', 2],
      ]],
      ['Extensiones del modelo lineal', '🧩', [
        ['Modelos lineales generalizados y modelos mixtos', 'Faraway - Linear Models with R', 'capítulo de modelos lineales generalizados', 2],
        ['Regresión no lineal y métodos computacionales', 'Faraway - Linear Models with R', 'capítulo de regresión no lineal', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Análisis Multivariado I',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Introducción y fundamentos', '🔎', [
        ['Repaso de álgebra matricial aplicada a datos multivariantes', 'Blanco - Introducción al Análisis Multivariado', 'capítulo introductorio', 1],
        ['Aprendizaje supervisado vs. no supervisado', 'Blanco - Introducción al Análisis Multivariado', 'capítulo introductorio', 1],
      ]],
      ['Reducción de dimensionalidad', '🗜️', [
        ['Análisis de Componentes Principales', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de Componentes Principales', 2],
        ['Análisis de correspondencias simples y múltiples', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de análisis de correspondencias', 2],
        ['Análisis Factorial de datos mixtos', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de análisis factorial', 2],
      ]],
      ['Análisis de conglomerados (cluster)', '🧬', [
        ['Métodos jerárquicos y no jerárquicos', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de análisis de cluster', 2],
        ['Métodos probabilísticos y mapas de Kohonen (SOM)', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de cluster probabilístico', 2],
      ]],
      ['Distribuciones multivariantes e inferencia', '⚖️', [
        ['Introducción a la inferencia con datos multivariantes', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de inferencia multivariante', 2],
      ]],
      ['Análisis supervisado / clasificación', '🏷️', [
        ['Análisis discriminante lineal, cuadrático y logístico', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de análisis discriminante', 2],
        ['Análisis discriminante no probabilístico', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de análisis discriminante', 1],
        ['Introducción a árboles de clasificación', 'Blanco - Introducción al Análisis Multivariado', 'capítulo de árboles de clasificación', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Series Cronológicas I',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Procesos estocásticos estacionarios', '🌊', [
        ['Series de tiempo y ruido blanco', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo introductorio', 1],
        ['Procesos AR, MA y ARMA', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de procesos estacionarios', 2],
        ['Teorema de Wold', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de representación de Wold', 2],
      ]],
      ['Predicción', '🔮', [
        ['Predicción óptima, puntual y por intervalos', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de predicción', 2],
        ['Incertidumbre de las predicciones y transformación logarítmica', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de predicción', 1],
      ]],
      ['Estimación', '🎯', [
        ['Estimación de media, autocorrelación y autocorrelación parcial', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de estimación', 2],
        ['Estimación por máxima verosimilitud (AR, MA, ARMA)', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de estimación por máxima verosimilitud', 2],
        ['Contrastes e intervalos de confianza', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de inferencia', 1],
      ]],
      ['Análisis espectral', '📡', [
        ['Función generatriz de autocovarianzas y espectro poblacional', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de análisis espectral', 2],
        ['Filtros y función de transferencia', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de filtros lineales', 2],
      ]],
      ['Construcción de modelos y no estacionariedad', '🏗️', [
        ['Identificación, diagnóstico y validación del modelo', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de construcción de modelos', 2],
        ['Análisis de intervención y puntos anómalos', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de análisis de intervención', 2],
        ['Procesos no estacionarios y modelos ARIMA', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de modelos ARIMA', 2],
        ['Tendencias, raíces unitarias, estacionalidad y modelos SARIMA', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de modelos SARIMA', 2],
      ]],
      ['Otros tópicos', '🧵', [
        ['Contrastes de raíces unitarias estacionales', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de raíces unitarias estacionales', 2],
        ['Modelización automática y extracción de señales (X12-ARIMA)', 'Box, Jenkins y Reinsel - Time Series Analysis: Forecasting and Control', 'capítulo de extracción de señales', 2],
      ]],
    ],
  },
  {
    nombreActual: 'Programación I',
    nombreNuevo: 'Programación Imperativa',
    archivos: ['catalogo-estadistica.json'],
    modulos: [
      ['Introducción a la computación y al lenguaje', '💻', [
        ['Modelo de computación, algoritmo y estructura de un programa', 'Konvalina y Wileman - Programación con Pascal', 'capítulo introductorio', 1],
        ['Sintaxis, semántica, compilación y tipos de errores', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de fundamentos del lenguaje', 1],
        ['Identificadores, variables, expresiones y asignación', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de variables y expresiones', 1],
      ]],
      ['Estructuras de control', '🔁', [
        ['Secuencia, selección e iteración', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de estructuras de control', 1],
        ['Recursión: diseño e implementación de algoritmos recursivos', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de recursión', 2],
      ]],
      ['Tipos de datos', '🗃️', [
        ['Tipos elementales', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de tipos de datos', 1],
        ['Tipos estructurados: arreglos y registros', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de tipos estructurados', 2],
      ]],
      ['Subprogramas', '🧩', [
        ['Procedimientos y funciones; pre y post condiciones', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de subprogramas', 1],
        ['Pasaje de parámetros (valor/referencia) y reglas de alcance', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de parámetros y alcance', 2],
      ]],
      ['Algoritmos básicos', '🔍', [
        ['Búsqueda lineal y búsqueda binaria', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de algoritmos de búsqueda', 1],
        ['Algoritmos de ordenación', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de algoritmos de ordenación', 2],
        ['Nociones elementales de eficiencia de algoritmos', 'Konvalina y Wileman - Programación con Pascal', 'capítulo de análisis de eficiencia', 1],
      ]],
    ],
  },
  {
    nombreActual: 'Economía Descriptiva',
    archivos: ['catalogo-administracion.json'],
    agregarEn: [{ archivo: 'catalogo-estadistica.json', semestre: '2' }],
    modulos: [
      ['Sistema de Cuentas Nacionales', '🏦', [
        ['Objetivos y características generales de la economía descriptiva', 'Apuntes de cátedra', 'Economía Descriptiva: introducción al Sistema de Cuentas Nacionales', 1],
        ['Elementos básicos y Cuadro de Oferta y Utilización', 'Apuntes de cátedra', 'Economía Descriptiva: introducción al Sistema de Cuentas Nacionales', 2],
        ['Las Cuentas Nacionales: Revisión 1993 y Revisión 2008', 'Apuntes de cátedra', 'Economía Descriptiva: introducción al Sistema de Cuentas Nacionales', 2],
      ]],
      ['Balanza de pagos', '🌐', [
        ['Funcionamiento descriptivo, análisis e interpretación', 'Apuntes de cátedra', 'Economía Descriptiva: Balanza de Pagos', 2],
        ['La Balanza de Pagos en Uruguay', 'Apuntes de cátedra', 'Economía Descriptiva: Balanza de Pagos', 1],
      ]],
      ['Números índice y precios constantes', '🔢', [
        ['Concepto, tipos y criterios de construcción de números índice', 'Apuntes de cátedra', 'Economía Descriptiva: Números Índices y Precios Constantes', 2],
        ['Descripción económica a precios constantes', 'Apuntes de cátedra', 'Economía Descriptiva: Números Índices y Precios Constantes', 1],
        ['Índices del Sistema Estadístico Nacional', 'Apuntes de cátedra', 'Economía Descriptiva: Números Índices y Precios Constantes', 1],
      ]],
      ['Mercado de trabajo', '👷', [
        ['Clasificación económica de la población', 'Apuntes de cátedra', 'Economía Descriptiva: Mercado de Trabajo', 1],
        ['Indicadores de actividad, empleo y desempleo en Uruguay', 'Apuntes de cátedra', 'Economía Descriptiva: Mercado de Trabajo', 1],
      ]],
    ],
  },
  {
    nombreActual: 'Econometría I',
    archivos: ['catalogo-economia.json'],
    agregarEn: [{ archivo: 'catalogo-estadistica.json', semestre: '6' }],
    modulos: [
      ['Fundamentos del modelo de regresión', '📉', [
        ['La naturaleza de la econometría y los datos económicos', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo introductorio', 1],
        ['El modelo de regresión simple y estimadores MCO', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo del modelo de regresión simple', 2],
        ['Regresión múltiple: mecánica, interpretación y teorema Gauss-Markov', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de regresión múltiple: estimación', 2],
      ]],
      ['Inferencia y análisis asintótico', '♾️', [
        ['Distribución muestral, prueba t e intervalos de confianza', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de regresión múltiple: inferencia', 2],
        ['Pruebas F para restricciones lineales múltiples', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de regresión múltiple: inferencia', 2],
        ['Consistencia y normalidad asintótica de los MCO', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de MCO asintóticos', 2],
      ]],
      ['Forma funcional e información cualitativa', '🏷️', [
        ['Forma funcional, bondad de ajuste y mala especificación', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de temas adicionales de regresión múltiple', 2],
        ['Variables binarias (dummy) e interacciones', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de información cualitativa', 1],
        ['Regresión con variable dependiente binaria: logit y probit', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de variable dependiente binaria', 2],
      ]],
      ['Heterocedasticidad', '⚠️', [
        ['Consecuencias e inferencia robusta a la heterocedasticidad', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de heterocedasticidad', 2],
        ['Pruebas de heterocedasticidad y mínimos cuadrados ponderados', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de heterocedasticidad', 2],
      ]],
      ['Evaluación y endogeneidad', '🔬', [
        ['Validez interna y externa de estudios basados en regresión', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de evaluación de estudios', 1],
        ['Variables instrumentales y sesgo por variables omitidas', 'Wooldridge - Introducción a la Econometría: Un Enfoque Moderno', 'capítulo de variables instrumentales', 2],
      ]],
    ],
  },
];

function encontrarMateria(catalogo, nombre) {
  for (const semestre of Object.keys(catalogo)) {
    const m = catalogo[semestre].find(x => x.nombre === nombre);
    if (m) return m;
  }
  return null;
}

let materiasActualizadas = 0;
let materiasAgregadas = 0;

for (const spec of MATERIAS) {
  const modulosFinales = spec.modulos.map(([modulo, , temas]) => ({
    modulo,
    temas: temas.map(([nombre]) => nombre),
  }));

  for (const archivo of spec.archivos) {
    const p = path.join(DATA, archivo);
    const catalogo = JSON.parse(fs.readFileSync(p, 'utf8'));
    const materia = encontrarMateria(catalogo, spec.nombreActual);
    if (!materia) throw new Error(`No se encontró "${spec.nombreActual}" en ${archivo}`);
    if (spec.nombreNuevo) materia.nombre = spec.nombreNuevo;
    materia.modulos = modulosFinales;
    fs.writeFileSync(p, JSON.stringify(catalogo, null, 2) + '\n');
    materiasActualizadas++;
  }

  if (spec.agregarEn) {
    for (const { archivo, semestre } of spec.agregarEn) {
      const p = path.join(DATA, archivo);
      const catalogo = JSON.parse(fs.readFileSync(p, 'utf8'));
      const nombreFinal = spec.nombreNuevo || spec.nombreActual;
      const yaEsta = catalogo[semestre] && catalogo[semestre].some(m => m.nombre === nombreFinal);
      if (!yaEsta) {
        if (!catalogo[semestre]) catalogo[semestre] = [];
        catalogo[semestre].push({ nombre: nombreFinal, modulos: modulosFinales });
        materiasAgregadas++;
      }
      fs.writeFileSync(p, JSON.stringify(catalogo, null, 2) + '\n');
    }
  }

  // TEXTOS / DURACIONES / ICONOS
  spec.modulos.forEach(([modulo, icono, temas]) => {
    if (!iconos[modulo]) iconos[modulo] = icono;
    temas.forEach(([nombre, libro, seccion, dias]) => {
      textos[nombre] = { libro, seccion };
      duraciones[nombre] = dias;
    });
  });
}

fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');

console.log(`Materias actualizadas (archivo x materia): ${materiasActualizadas}`);
console.log(`Materias agregadas de cero: ${materiasAgregadas}`);
console.log('Listo.');
