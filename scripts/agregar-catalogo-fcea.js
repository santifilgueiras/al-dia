// Script de integridad usado al agregar la Facultad de Ciencias Económicas y
// de Administración (FCEA, UDELAR) al catálogo -- ver data/catalogo-contador-
// publico.json, data/catalogo-economia.json, data/catalogo-administracion.json
// y el comentario en mockup-firme.html cerca de FACULTADES.contador_publico/
// economia/administracion. Queda en scripts/ como registro de cómo se armó
// la bibliografía/duraciones/íconos, mismo criterio que
// scripts/agregar-catalogo-agronomia.js.
//
// A diferencia de una migración, este script YA CORRIÓ UNA VEZ (mergeó sus
// datos en data/textos.json, data/duraciones.json y data/modulo-icons.json).
// Volver a correrlo es seguro: como las claves ya están en esos diccionarios
// con el mismo valor, no las vuelve a escribir -- solo valida que los 3
// catálogos sigan íntegros (0 temas sin bibliografía, 0 módulos sin ícono,
// 0 duplicados de materia por semestre dentro de cada carrera, Y que las 4
// UC del núcleo común -- Conceptos Contables, Administración y Gestión de
// las Organizaciones I, Introducción a la Microeconomía, Cálculo I -- más
// las 8 UC adicionales que también comparten código real entre dos carreras
// (Contabilidad General I, Álgebra Lineal, Introducción a la Macroeconomía,
// Introducción a la Estadística, Matemática Financiera, Macroeconomía I,
// Contabilidad Gerencial, Finanzas Corporativas) tengan contenido IDÉNTICO
// en los catálogos que las comparten -- y avisa si alguna clave quedó
// pisada por otra facultad con un valor DISTINTO al que se cargó acá.
//
// Uso: node scripts/agregar-catalogo-fcea.js
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');

// Mapeo tema -> { libro, seccion, duracion }. Bibliografía por área según lo
// indicado en la investigación de las 3 mallas curriculares reales (Plan
// 2024 de Contador Público, Plan 2012 de Economía y Administración): textos
// clásicos reconocidos internacionalmente para las áreas troncales
// (Contabilidad: Horngren; Microeconomía: Pindyck & Rubinfeld; Macroeconomía:
// Blanchard; Cálculo: Stewart; Álgebra Lineal: Grossman; Estadística:
// Walpole/Myers; Matemática Financiera: Ayres & Hass; Econometría: Wooldridge;
// Auditoría: Arens/Elder/Beasley; Finanzas Corporativas: Ross/Westerfield/
// Jaffe; Marketing: Kotler & Armstrong; Administración/Comportamiento
// Organizacional: Robbins) y "Apuntes de cátedra" para Derecho (empresarial,
// tributario, laboral, digital -- doctrina y normativa uruguaya específica,
// sin texto clásico internacional aplicable), Ética/Responsabilidad Social,
// Historia Económica/del Pensamiento Económico y las materias de contexto
// uruguayo específico (Economía del Uruguay, Economía de América Latina),
// mismo criterio ya usado en Medicina/Ingeniería/Agronomía para materias sin
// programa detallado público. Para áreas no cubiertas explícitamente por la
// investigación (Economía Internacional, Teoría de Juegos, Desarrollo
// Económico, Sistemas de Información Gerencial) se usó bibliografía clásica
// adicional igualmente reconocida (Krugman/Obstfeld/Melitz, Gibbons, Todaro
// & Smith, Laudon & Laudon).
const BIBLIOGRAFIA = {
  // --- Núcleo común (sem 1, Contador Público/Economía/Administración) ---
  "Partida doble y ecuación patrimonial": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Partida doble y ecuación patrimonial", duracion: 2 },
  "Registro contable de operaciones básicas": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Registro de operaciones básicas", duracion: 2 },
  "Ciclo contable: apertura, ajustes y cierre": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "El ciclo contable", duracion: 2 },
  "Estados contables básicos: Estado de Situación Patrimonial y Estado de Resultados": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Estados contables básicos", duracion: 2 },

  "Evolución del pensamiento administrativo": { libro: "Robbins & Coulter - Administración", seccion: "Evolución del pensamiento administrativo", duracion: 1 },
  "El proceso administrativo: planificación, organización, dirección y control": { libro: "Robbins & Coulter - Administración", seccion: "El proceso administrativo", duracion: 2 },
  "La organización como sistema abierto y su entorno": { libro: "Robbins & Coulter - Administración", seccion: "La organización y su entorno", duracion: 1 },
  "Estructura organizativa y diseño de la organización": { libro: "Robbins & Coulter - Administración", seccion: "Diseño organizacional", duracion: 2 },

  "Curvas de oferta y demanda y determinación del precio de equilibrio": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Oferta, demanda y equilibrio de mercado", duracion: 2 },
  "Elasticidades de la demanda y de la oferta": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Elasticidades", duracion: 1 },
  "Teoría del consumidor: preferencias y elección óptima": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Teoría del consumidor", duracion: 2 },
  "Teoría de la empresa: producción y costos": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Producción y costos de la empresa", duracion: 2 },

  "Límites, continuidad y su aplicación a funciones económicas": { libro: "Stewart - Cálculo de una variable", seccion: "Límites y continuidad", duracion: 2 },
  "Derivadas y su interpretación económica: costo e ingreso marginal": { libro: "Stewart - Cálculo de una variable", seccion: "Derivadas y su interpretación económica", duracion: 2 },
  "Optimización de funciones de una variable": { libro: "Stewart - Cálculo de una variable", seccion: "Optimización", duracion: 2 },
  "Integrales y su aplicación al cálculo de excedentes": { libro: "Stewart - Cálculo de una variable", seccion: "Integrales aplicadas a excedentes económicos", duracion: 2 },

  // --- Compartidas por código real entre 2 carreras ---
  "Registro contable de compraventa de mercaderías": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Compraventa de mercaderías", duracion: 2 },
  "Documentación comercial y su registración": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Documentación comercial", duracion: 1 },
  "Ajustes contables de fin de ejercicio": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Ajustes de fin de ejercicio", duracion: 2 },
  "Cierre de ejercicio y determinación del resultado": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Cierre de ejercicio", duracion: 2 },

  "Vectores, matrices y operaciones matriciales": { libro: "Grossman - Álgebra Lineal", seccion: "Vectores y matrices", duracion: 2 },
  "Determinantes y matriz inversa": { libro: "Grossman - Álgebra Lineal", seccion: "Determinantes y matriz inversa", duracion: 2 },
  "Sistemas de ecuaciones lineales y método de Gauss": { libro: "Grossman - Álgebra Lineal", seccion: "Sistemas de ecuaciones lineales", duracion: 2 },
  "Aplicaciones del álgebra lineal a modelos económicos": { libro: "Grossman - Álgebra Lineal", seccion: "Aplicaciones a modelos económicos", duracion: 1 },

  "Producto Bruto Interno y cuentas nacionales": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "PBI y cuentas nacionales", duracion: 2 },
  "Inflación, desempleo y sus indicadores": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Inflación y desempleo", duracion: 2 },
  "Mercado de bienes y mercado monetario: un primer enfoque": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Mercado de bienes y mercado de dinero", duracion: 2 },
  "Política fiscal y monetaria: introducción": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Introducción a la política fiscal y monetaria", duracion: 1 },

  "Organización y descripción de datos: medidas de tendencia central y dispersión": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Estadística descriptiva", duracion: 2 },
  "Representación gráfica de datos": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Representación gráfica de datos", duracion: 1 },
  "Probabilidad básica y variables aleatorias": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Probabilidad y variables aleatorias", duracion: 2 },
  "Distribuciones de probabilidad discretas y continuas más usadas": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Distribuciones de probabilidad usuales", duracion: 2 },

  "Interés simple y compuesto": { libro: "Ayres & Hass - Matemáticas Financieras (Schaum)", seccion: "Interés simple y compuesto", duracion: 1 },
  "Valor actual y valor futuro de capitales": { libro: "Ayres & Hass - Matemáticas Financieras (Schaum)", seccion: "Valor actual y valor futuro", duracion: 2 },
  "Rentas: cálculo de valor actual y valor final": { libro: "Ayres & Hass - Matemáticas Financieras (Schaum)", seccion: "Rentas", duracion: 2 },
  "Sistemas de amortización de préstamos": { libro: "Ayres & Hass - Matemáticas Financieras (Schaum)", seccion: "Sistemas de amortización", duracion: 2 },

  "Modelo de determinación del ingreso: enfoque keynesiano": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Modelo de determinación del ingreso", duracion: 2 },
  "Multiplicador del gasto y política fiscal": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "El multiplicador y la política fiscal", duracion: 2 },
  "Oferta y demanda de dinero": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Mercado monetario", duracion: 1 },
  "Modelo IS-LM": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "El modelo IS-LM", duracion: 2 },

  "Costos relevantes para la toma de decisiones": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Costos relevantes para decisiones", duracion: 2 },
  "Análisis costo-volumen-utilidad": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Análisis costo-volumen-utilidad", duracion: 2 },
  "Presupuestos operativos y financieros": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Presupuestos", duracion: 2 },
  "Indicadores de gestión y cuadro de mando": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Indicadores de gestión", duracion: 1 },

  "Valor del dinero en el tiempo aplicado a decisiones financieras": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Valor del dinero en el tiempo", duracion: 2 },
  "Evaluación de proyectos de inversión: VAN y TIR": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "VAN y TIR", duracion: 2 },
  "Estructura de capital y costo de capital": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Estructura y costo de capital", duracion: 2 },
  "Riesgo, rendimiento y política de dividendos": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Riesgo, rendimiento y dividendos", duracion: 2 },

  // --- Contador Público (exclusivas) ---
  "Sujetos de derecho y formas jurídicas de organización empresarial": { libro: "Apuntes de cátedra", seccion: "Derecho y Actividad Empresarial I: sujetos y formas jurídicas", duracion: 1 },
  "Sociedades comerciales: constitución y tipos societarios": { libro: "Apuntes de cátedra", seccion: "Derecho y Actividad Empresarial I: sociedades comerciales", duracion: 2 },
  "Constitución y funcionamiento contable de sociedades comerciales": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Contabilización de sociedades comerciales", duracion: 2 },
  "Contratos comerciales típicos: compraventa, mandato, agencia": { libro: "Apuntes de cátedra", seccion: "Derecho y Actividad Empresarial II: contratos típicos", duracion: 2 },
  "Títulos valores y su circulación": { libro: "Apuntes de cátedra", seccion: "Derecho y Actividad Empresarial II: títulos valores", duracion: 1 },
  "Diseño de sistemas de información contable": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Sistemas de información contable", duracion: 2 },
  "Control interno de los procesos contables": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Control interno de procesos contables", duracion: 2 },
  "Operaciones de fusión, escisión y transformación societaria": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Fusión, escisión y transformación societaria", duracion: 2 },
  "Documento y firma electrónica": { libro: "Apuntes de cátedra", seccion: "Derecho Digital: documento y firma electrónica", duracion: 1 },
  "Protección de datos personales y comercio electrónico": { libro: "Apuntes de cátedra", seccion: "Derecho Digital: datos personales y comercio electrónico", duracion: 1 },
  "Contrato de trabajo y remuneraciones": { libro: "Apuntes de cátedra", seccion: "Legislación Laboral: contrato de trabajo y remuneraciones", duracion: 2 },
  "Jornada laboral, licencias y despido": { libro: "Apuntes de cátedra", seccion: "Legislación Laboral: jornada, licencias y despido", duracion: 2 },
  "Sistema de seguridad social uruguayo y aportes": { libro: "Apuntes de cátedra", seccion: "Seguridad social uruguaya y aportes", duracion: 2 },
  "Costeo por órdenes y por procesos": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Costeo por órdenes y por procesos", duracion: 2 },
  "Costeo variable y costeo por absorción": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Costeo variable y por absorción", duracion: 2 },
  "Costeo basado en actividades (ABC)": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Costeo ABC", duracion: 2 },
  "Relación jurídico-tributaria y clasificación de tributos": { libro: "Apuntes de cátedra", seccion: "Derecho Tributario: relación jurídico-tributaria", duracion: 1 },
  "Principios constitucionales tributarios": { libro: "Apuntes de cátedra", seccion: "Derecho Tributario: principios constitucionales", duracion: 1 },
  "Reportes de sostenibilidad y responsabilidad social empresarial": { libro: "Apuntes de cátedra", seccion: "Contabilidad Social y Ambiental: reportes de sostenibilidad", duracion: 1 },
  "Contabilidad ambiental y su medición": { libro: "Apuntes de cátedra", seccion: "Contabilidad ambiental", duracion: 2 },
  "Principios éticos y normas de conducta del Contador Público": { libro: "Apuntes de cátedra", seccion: "Ética profesional del Contador Público", duracion: 1 },
  "Independencia y responsabilidad profesional": { libro: "Apuntes de cátedra", seccion: "Independencia y responsabilidad profesional", duracion: 1 },
  "Normas Internacionales de Información Financiera (NIIF)": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "NIIF", duracion: 2 },
  "Valuación de activos y pasivos según normativa contable": { libro: "Horngren, Sundem & Elliott - Introducción a la Contabilidad Financiera", seccion: "Valuación de activos y pasivos", duracion: 2 },
  "Impuesto a las Rentas de las Actividades Económicas (IRAE)": { libro: "Apuntes de cátedra", seccion: "Tributaria I: IRAE", duracion: 2 },
  "Impuesto al Patrimonio": { libro: "Apuntes de cátedra", seccion: "Tributaria I: Impuesto al Patrimonio", duracion: 1 },
  "Presupuesto financiero y flujo de caja proyectado": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Presupuesto financiero y flujo de caja", duracion: 2 },
  "Planificación financiera de corto y largo plazo": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Planificación financiera", duracion: 2 },
  "Componentes del control interno (marco COSO)": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Marco COSO", duracion: 2 },
  "Evaluación de riesgos y actividades de control": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Evaluación de riesgos y actividades de control", duracion: 2 },
  "Normas de auditoría y responsabilidad del auditor": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Normas de auditoría y responsabilidad del auditor", duracion: 2 },
  "Planificación de la auditoría y evaluación de riesgos": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Planificación de la auditoría", duracion: 2 },
  "Evidencia de auditoría y procedimientos sustantivos": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Evidencia y procedimientos sustantivos", duracion: 2 },
  "Impuesto al Valor Agregado (IVA)": { libro: "Apuntes de cátedra", seccion: "Tributaria II: IVA", duracion: 2 },
  "Otros tributos: comercio exterior y tributos municipales": { libro: "Apuntes de cátedra", seccion: "Tributaria II: comercio exterior y tributos municipales", duracion: 1 },
  "Rol y alcance de la auditoría interna en la organización": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Rol de la auditoría interna", duracion: 1 },
  "Planificación y ejecución de trabajos de auditoría interna": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Planificación y ejecución de auditoría interna", duracion: 2 },
  "Informe de auditoría y tipos de opinión": { libro: "Arens, Elder & Beasley - Auditoría. Un enfoque integral", seccion: "Informe de auditoría y tipos de opinión", duracion: 2 },
  "Otros informes profesionales del Contador Público": { libro: "Apuntes de cátedra", seccion: "Otros informes profesionales del Contador Público", duracion: 1 },
  "Sistemas ERP y su módulo contable-financiero": { libro: "Apuntes de cátedra", seccion: "ERP: módulo contable-financiero", duracion: 2 },
  "Control y auditoría de la información contable en sistemas integrados": { libro: "Apuntes de cátedra", seccion: "Control y auditoría en sistemas integrados", duracion: 2 },

  // --- Licenciatura en Economía (exclusivas) ---
  "Funciones de varias variables y optimización aplicada a economía": { libro: "Stewart - Cálculo de varias variables", seccion: "Funciones de varias variables y optimización", duracion: 2 },
  "Derivadas parciales y multiplicadores de Lagrange": { libro: "Stewart - Cálculo de varias variables", seccion: "Derivadas parciales y multiplicadores de Lagrange", duracion: 2 },
  "Revolución industrial y expansión del capitalismo": { libro: "Apuntes de cátedra", seccion: "Historia Económica Mundial: revolución industrial", duracion: 1 },
  "Crisis económicas mundiales del siglo XX": { libro: "Apuntes de cátedra", seccion: "Historia Económica Mundial: crisis del siglo XX", duracion: 1 },
  "Elección del consumidor bajo incertidumbre": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Elección bajo incertidumbre", duracion: 2 },
  "Efecto sustitución y efecto ingreso": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Efecto sustitución y efecto ingreso", duracion: 2 },
  "Competencia perfecta y monopolio": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Competencia perfecta y monopolio", duracion: 2 },
  "Competencia monopolística y oligopolio": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Competencia monopolística y oligopolio", duracion: 2 },
  "Modelos de crecimiento económico: el modelo de Solow": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "El modelo de Solow", duracion: 2 },
  "Determinantes de la productividad y el crecimiento de largo plazo": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Productividad y crecimiento de largo plazo", duracion: 2 },
  "Fluctuaciones económicas y modelos de ciclo": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Ciclos económicos", duracion: 2 },
  "Estimación puntual e intervalos de confianza": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Estimación e intervalos de confianza", duracion: 2 },
  "Contraste de hipótesis en el análisis económico": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Contraste de hipótesis", duracion: 2 },
  "Externalidades y bienes públicos": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Externalidades y bienes públicos", duracion: 2 },
  "Economía del bienestar y eficiencia de Pareto": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Economía del bienestar", duracion: 2 },
  "Modelos de industrialización por sustitución de importaciones": { libro: "Apuntes de cátedra", seccion: "Economía de América Latina: industrialización sustitutiva", duracion: 1 },
  "Reformas estructurales y apertura económica en América Latina": { libro: "Apuntes de cátedra", seccion: "Economía de América Latina: reformas estructurales", duracion: 1 },
  "Balanza de pagos y tipo de cambio": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Balanza de pagos y tipo de cambio", duracion: 2 },
  "Modelo Mundell-Fleming en economía abierta": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Modelo Mundell-Fleming", duracion: 2 },
  "Regresión lineal simple y múltiple aplicada a datos económicos": { libro: "Walpole, Myers & Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Regresión lineal aplicada a economía", duracion: 2 },
  "Series de tiempo: nociones básicas": { libro: "Wooldridge - Introducción a la Econometría: un enfoque moderno", seccion: "Nociones básicas de series de tiempo", duracion: 2 },
  "Diseño de investigación y formulación de hipótesis en economía": { libro: "Apuntes de cátedra", seccion: "Metodología: diseño de investigación en economía", duracion: 1 },
  "Fuentes de datos económicos y su análisis": { libro: "Apuntes de cátedra", seccion: "Metodología: fuentes de datos económicos", duracion: 1 },
  "Evolución macroeconómica de Uruguay": { libro: "Apuntes de cátedra", seccion: "Economía del Uruguay: evolución macroeconómica", duracion: 2 },
  "Estructura productiva y comercio exterior de Uruguay": { libro: "Apuntes de cátedra", seccion: "Economía del Uruguay: estructura productiva y comercio exterior", duracion: 2 },
  "Juegos estáticos y equilibrio de Nash": { libro: "Gibbons - Un Primer Curso de Teoría de Juegos", seccion: "Juegos estáticos y equilibrio de Nash", duracion: 2 },
  "Juegos dinámicos e información asimétrica": { libro: "Gibbons - Un Primer Curso de Teoría de Juegos", seccion: "Juegos dinámicos e información asimétrica", duracion: 2 },
  "Estimación por mínimos cuadrados ordinarios": { libro: "Wooldridge - Introducción a la Econometría: un enfoque moderno", seccion: "Mínimos cuadrados ordinarios", duracion: 2 },
  "Supuestos del modelo clásico y violaciones (heterocedasticidad, autocorrelación)": { libro: "Wooldridge - Introducción a la Econometría: un enfoque moderno", seccion: "Supuestos del modelo clásico y sus violaciones", duracion: 2 },
  "Teorías del comercio internacional: ventaja comparativa y modelos modernos": { libro: "Krugman, Obstfeld & Melitz - Economía Internacional: Teoría y Política", seccion: "Teorías del comercio internacional", duracion: 2 },
  "Política comercial: aranceles y barreras no arancelarias": { libro: "Krugman, Obstfeld & Melitz - Economía Internacional: Teoría y Política", seccion: "Política comercial", duracion: 2 },
  "Teorías clásicas y estructuralistas del desarrollo": { libro: "Todaro & Smith - Economic Development", seccion: "Teorías clásicas y estructuralistas del desarrollo", duracion: 2 },
  "Desarrollo humano y enfoque de capacidades": { libro: "Todaro & Smith - Economic Development", seccion: "Desarrollo humano y enfoque de capacidades", duracion: 1 },
  "Modelos de variable dependiente cualitativa": { libro: "Wooldridge - Introducción a la Econometría: un enfoque moderno", seccion: "Variable dependiente cualitativa", duracion: 2 },
  "Datos de panel": { libro: "Wooldridge - Introducción a la Econometría: un enfoque moderno", seccion: "Datos de panel", duracion: 2 },
  "Clásicos y neoclásicos: de Smith a Marshall": { libro: "Apuntes de cátedra", seccion: "Historia del Pensamiento Económico: clásicos y neoclásicos", duracion: 1 },
  "Keynes y las escuelas heterodoxas del siglo XX": { libro: "Apuntes de cátedra", seccion: "Historia del Pensamiento Económico: Keynes y heterodoxia", duracion: 1 },

  // --- Licenciatura en Administración (exclusivas) ---
  "Toma de decisiones y liderazgo en las organizaciones": { libro: "Robbins & Coulter - Administración", seccion: "Toma de decisiones y liderazgo", duracion: 2 },
  "Motivación y trabajo en equipo": { libro: "Robbins & Judge - Comportamiento Organizacional", seccion: "Motivación y trabajo en equipo", duracion: 2 },
  "Cultura organizacional y su gestión": { libro: "Robbins & Coulter - Administración", seccion: "Cultura organizacional", duracion: 2 },
  "Sistema de cuentas nacionales e indicadores macroeconómicos descriptivos": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Sistema de cuentas nacionales", duracion: 2 },
  "Indicadores de comercio exterior y precios": { libro: "Blanchard, Amighini & Giavazzi - Macroeconomía", seccion: "Indicadores de comercio exterior y precios", duracion: 1 },
  "Sistemas de información para la gestión organizacional": { libro: "Laudon & Laudon - Sistemas de Información Gerencial", seccion: "Sistemas de información para la gestión", duracion: 2 },
  "Modelado y mejora de procesos de negocio": { libro: "Laudon & Laudon - Sistemas de Información Gerencial", seccion: "Modelado y mejora de procesos", duracion: 2 },
  "Estatuto del comerciante y actos de comercio": { libro: "Apuntes de cátedra", seccion: "Derecho del Empresario: estatuto del comerciante", duracion: 1 },
  "Formas jurídicas de organización de la empresa": { libro: "Apuntes de cátedra", seccion: "Derecho del Empresario: formas jurídicas", duracion: 1 },
  "Reclutamiento, selección e inducción de personal": { libro: "Robbins & Coulter - Administración", seccion: "Reclutamiento, selección e inducción", duracion: 2 },
  "Evaluación de desempeño y desarrollo del personal": { libro: "Robbins & Coulter - Administración", seccion: "Evaluación de desempeño y desarrollo", duracion: 2 },
  "El proceso de marketing y comportamiento del consumidor": { libro: "Kotler & Armstrong - Fundamentos de Marketing", seccion: "Proceso de marketing y comportamiento del consumidor", duracion: 2 },
  "Marketing mix: producto, precio, plaza y promoción": { libro: "Kotler & Armstrong - Fundamentos de Marketing", seccion: "Marketing mix", duracion: 2 },
  "Clasificación de costos y su uso gerencial": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Clasificación de costos", duracion: 2 },
  "Punto de equilibrio y análisis marginal": { libro: "Horngren - Contabilidad de Costos: un enfoque gerencial", seccion: "Punto de equilibrio y análisis marginal", duracion: 2 },
  "Análisis de mercado y decisiones de precio de la empresa": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Análisis de mercado y decisiones de precio", duracion: 2 },
  "Decisiones de producción bajo incertidumbre": { libro: "Pindyck & Rubinfeld - Microeconomía", seccion: "Decisiones bajo incertidumbre", duracion: 2 },
  "Responsabilidad social empresarial y sus dimensiones": { libro: "Apuntes de cátedra", seccion: "Responsabilidad social empresarial", duracion: 1 },
  "Dilemas éticos en la gestión de las organizaciones": { libro: "Apuntes de cátedra", seccion: "Dilemas éticos en la gestión", duracion: 1 },
  "Negociación colectiva y sindicalismo": { libro: "Apuntes de cátedra", seccion: "Relaciones de Trabajo: negociación colectiva y sindicalismo", duracion: 2 },
  "Conflictos laborales y su resolución": { libro: "Apuntes de cátedra", seccion: "Relaciones de Trabajo: conflictos laborales", duracion: 1 },
  "Percepción, actitudes y personalidad en el trabajo": { libro: "Robbins & Judge - Comportamiento Organizacional", seccion: "Percepción, actitudes y personalidad", duracion: 2 },
  "Dinámica de grupos y equipos de trabajo": { libro: "Robbins & Judge - Comportamiento Organizacional", seccion: "Dinámica de grupos y equipos", duracion: 2 },
  "Poder, política y conflicto organizacional": { libro: "Robbins & Judge - Comportamiento Organizacional", seccion: "Poder, política y conflicto", duracion: 2 },
  "Análisis estratégico del entorno y la organización": { libro: "Robbins & Coulter - Administración", seccion: "Análisis estratégico", duracion: 2 },
  "Formulación e implementación de la estrategia competitiva": { libro: "Robbins & Coulter - Administración", seccion: "Formulación e implementación estratégica", duracion: 2 },
  "Modelos de gestión del cambio organizacional": { libro: "Robbins & Coulter - Administración", seccion: "Modelos de gestión del cambio", duracion: 2 },
  "Resistencia al cambio y estrategias de superación": { libro: "Robbins & Coulter - Administración", seccion: "Resistencia al cambio", duracion: 1 },
  "Formulación y evaluación de proyectos de inversión": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Formulación y evaluación de proyectos", duracion: 2 },
  "Análisis de sensibilidad y riesgo en proyectos": { libro: "Ross, Westerfield & Jaffe - Finanzas Corporativas", seccion: "Análisis de sensibilidad y riesgo", duracion: 2 },
};

// Mapeo módulo -> ícono (emoji). Varios íconos se repiten a propósito entre
// módulos distintos (mismo criterio ya usado en las demás facultades) --
// algunos coinciden con íconos ya usados por Ingeniería para módulos de
// nombre igual o muy similar (ej. "Estadística descriptiva", "Límites y
// derivadas") -- eso es intencional y no un bug: mismo emoji para un
// concepto equivalente entre facultades distintas.
const ICONOS = {
  "Fundamentos de la partida doble": "📒",
  "Estados contables y ciclo contable": "📋",
  "Fundamentos de administración": "📊",
  "La organización como sistema": "🏢",
  "Mercado, oferta y demanda": "📈",
  "Teoría del consumidor y de la empresa": "🛒",
  "Límites y derivadas": "📉",
  "Optimización e integrales": "➗",
  "Registro de operaciones comerciales": "📒",
  "Ajustes y cierre del ejercicio": "📋",
  "Marco jurídico de la empresa": "⚖️",
  "Variables macroeconómicas fundamentales": "🏛️",
  "Mercados agregados": "💹",
  "Vectores y matrices": "🧮",
  "Sistemas de ecuaciones lineales": "🧮",
  "Contabilización de sociedades y operaciones especiales": "📒",
  "Contratos comerciales": "⚖️",
  "Estadística descriptiva": "📊",
  "Nociones de probabilidad": "🎲",
  "Sistemas y procesos de información contable": "💻",
  "Interés y valor del dinero en el tiempo": "🧮",
  "Rentas y sistemas de amortización": "🧮",
  "Regulación jurídica de las tecnologías digitales": "⚖️",
  "Régimen laboral individual": "⚖️",
  "Seguridad social": "🛡️",
  "Sistemas de costeo": "🧾",
  "Modelos de costos para la gestión": "🧾",
  "Teoría general del tributo": "⚖️",
  "Reportes no financieros": "🌱",
  "Ética profesional del contador": "🤝",
  "Normas contables adecuadas": "📒",
  "Información contable para la toma de decisiones": "🧾",
  "Presupuestos y control de gestión": "📊",
  "Impuestos a la renta y al patrimonio": "⚖️",
  "Planificación financiera de la empresa": "💰",
  "Sistema de control interno": "🔍",
  "Fundamentos de auditoría": "🔍",
  "Evidencia y procedimientos de auditoría": "🔍",
  "Impuesto al valor agregado y otros tributos": "⚖️",
  "Valor y decisiones de inversión": "💰",
  "Estructura de capital y riesgo": "💰",
  "La función de auditoría interna": "🔍",
  "Informes y dictámenes profesionales": "📄",
  "Contabilidad en entornos ERP": "💻",
  "Modelo de ingreso-gasto": "📉",
  "Mercado monetario": "💹",
  "Cálculo en varias variables": "🧊",
  "Procesos económicos históricos": "🏛️",
  "Teoría del consumidor avanzada": "🛒",
  "Estructuras de mercado": "📈",
  "Crecimiento económico": "📈",
  "Ciclos económicos": "📉",
  "Inferencia estadística": "📊",
  "Bienestar y fallas de mercado": "📈",
  "Desarrollo económico latinoamericano": "🌎",
  "Economía abierta": "🌐",
  "Modelos de regresión": "📊",
  "Metodología de la investigación económica": "🔬",
  "Estructura económica uruguaya": "🇺🇾",
  "Teoría de juegos": "🎲",
  "Modelo de regresión lineal": "📊",
  "Comercio internacional": "🌐",
  "Enfoques del desarrollo": "🌎",
  "Modelos avanzados de econometría": "📊",
  "Escuelas del pensamiento económico": "🏛️",
  "Procesos de dirección": "💼",
  "Cambio y cultura organizacional": "🧠",
  "Indicadores económicos": "📉",
  "Sistemas de información en la organización": "💻",
  "Régimen jurídico del empresario": "⚖️",
  "Gestión del capital humano": "💼",
  "Fundamentos del marketing": "🎯",
  "Costos para la toma de decisiones gerenciales": "🧾",
  "Análisis económico de decisiones empresariales": "📈",
  "Ética y responsabilidad social empresarial": "🤝",
  "Relaciones laborales colectivas": "⚖️",
  "Comportamiento individual y grupal": "🧠",
  "Poder y cambio organizacional": "🧠",
  "Formulación e implementación estratégica": "🧭",
  "Gestión del cambio": "🔄",
  "Evaluación de proyectos de inversión": "💰",
};

const catalogos = {
  'contador-publico': path.join(ROOT, 'data', 'catalogo-contador-publico.json'),
  'economia': path.join(ROOT, 'data', 'catalogo-economia.json'),
  'administracion': path.join(ROOT, 'data', 'catalogo-administracion.json'),
};
const textosPath = path.join(ROOT, 'data', 'textos.json');
const duracionesPath = path.join(ROOT, 'data', 'duraciones.json');
const iconosPath = path.join(ROOT, 'data', 'modulo-icons.json');

const cats = {};
Object.entries(catalogos).forEach(([k, p]) => { cats[k] = JSON.parse(fs.readFileSync(p, 'utf8')); });
const textos = JSON.parse(fs.readFileSync(textosPath, 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(duracionesPath, 'utf8'));
const modIcons = JSON.parse(fs.readFileSync(iconosPath, 'utf8'));

let nMaterias = 0, nModulosInstancias = 0, nTemasInstancias = 0;
const modulosUnicos = new Set();
const temasUnicos = new Set();
const dupMateriaPorSem = [];
const temasSinBiblio = [];
const modulosSinIcono = [];
const valorTextoDistinto = [];
const valorIconoDistinto = [];
const materiaPorNombre = new Map(); // nombre -> JSON.stringify(materia), para chequear núcleo/compartidas idénticas

Object.entries(cats).forEach(([carrera, cat]) => {
  Object.entries(cat).forEach(([sem, materias]) => {
    const nombresVistos = new Set();
    materias.forEach((m) => {
      if (nombresVistos.has(m.nombre)) dupMateriaPorSem.push(`${carrera}/${sem}:${m.nombre}`);
      nombresVistos.add(m.nombre);
      nMaterias++;

      const serial = JSON.stringify(m);
      if (materiaPorNombre.has(m.nombre) && materiaPorNombre.get(m.nombre) !== serial) {
        console.error(`INCONSISTENCIA: "${m.nombre}" tiene contenido distinto entre carreras que deberían compartirlo (código real de UC igual).`);
        process.exitCode = 1;
      }
      materiaPorNombre.set(m.nombre, serial);

      (m.modulos || []).forEach((mod) => {
        nModulosInstancias++;
        modulosUnicos.add(mod.modulo);
        if (!ICONOS[mod.modulo]) modulosSinIcono.push(mod.modulo);
        if (modIcons[mod.modulo] && modIcons[mod.modulo] !== ICONOS[mod.modulo]) {
          valorIconoDistinto.push(mod.modulo);
        }
        (mod.temas || []).forEach((t) => {
          nTemasInstancias++;
          temasUnicos.add(t);
          if (!BIBLIOGRAFIA[t]) temasSinBiblio.push(t);
          else if (textos[t] && (textos[t].libro !== BIBLIOGRAFIA[t].libro || textos[t].seccion !== BIBLIOGRAFIA[t].seccion)) {
            valorTextoDistinto.push(t);
          }
        });
      });
    });
  });
});

console.log('--- Integridad del catálogo de FCEA (Contador Público / Economía / Administración) ---');
console.log('materias (instancias, sumando las 3 carreras):', nMaterias);
console.log('modulos (instancias):', nModulosInstancias, '| unicos:', modulosUnicos.size);
console.log('temas (instancias):', nTemasInstancias, '| unicos:', temasUnicos.size);
console.log('materias duplicadas dentro del mismo semestre de una misma carrera:', dupMateriaPorSem);
console.log('temas sin entrada de bibliografia preparada:', temasSinBiblio);
console.log('modulos sin icono preparado:', modulosSinIcono);
console.log('temas cuyo textos.json actual difiere del esperado (posible pisada por otra facultad):', valorTextoDistinto);
console.log('modulos cuyo modulo-icons.json actual difiere del esperado:', valorIconoDistinto);

if (dupMateriaPorSem.length || temasSinBiblio.length || modulosSinIcono.length || valorTextoDistinto.length || valorIconoDistinto.length || process.exitCode) {
  console.error('\nABORTADO: hay problemas de integridad, no se escribió nada.');
  process.exit(1);
}

temasUnicos.forEach((t) => {
  textos[t] = { libro: BIBLIOGRAFIA[t].libro, seccion: BIBLIOGRAFIA[t].seccion };
  duraciones[t] = BIBLIOGRAFIA[t].duracion;
});
modulosUnicos.forEach((m) => {
  modIcons[m] = ICONOS[m];
});

fs.writeFileSync(textosPath, JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(duracionesPath, JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(iconosPath, JSON.stringify(modIcons, null, 2) + '\n');

console.log('\nOK:', temasUnicos.size, 'temas en textos.json/duraciones.json y', modulosUnicos.size, 'modulos en modulo-icons.json.');
