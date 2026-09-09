// Script de integridad usado al agregar la Facultad de Agronomía al catálogo
// (ver data/catalogo-agronomia.json y el comentario en mockup-firme.html
// cerca de FACULTADES.agronomia). Queda en scripts/ como registro de cómo se
// armó la bibliografía/duraciones/íconos, mismo criterio que
// scripts/expandir-uc19.js.
//
// A diferencia de una migración, este script YA CORRIÓ UNA VEZ (mergeó sus
// datos en data/textos.json, data/duraciones.json y data/modulo-icons.json).
// Volver a correrlo es seguro y no hace nada raro: como las claves ya están
// en esos diccionarios con el mismo valor, no las vuelve a escribir -- solo
// valida que el catálogo siga íntegro (0 temas sin bibliografía, 0 módulos
// sin ícono, 0 duplicados de materia por semestre) y avisa si alguna clave
// quedó pisada por otra facultad con un valor DISTINTO al que se cargó acá
// (lo cual sí sería un bug real a investigar).
//
// Uso: node scripts/agregar-catalogo-agronomia.js
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');

// Mapeo tema -> { libro, seccion, duracion }. Bibliografía clásica reconocida
// por área (las descripciones oficiales de los cursos de Agronomía no citan
// libros de texto -- son párrafos de objetivos, no programas numerados como
// sí tenía Medicina) -- mismo criterio ya usado en Ingeniería para carreras
// sin programa detallado público. "Apuntes de cátedra" para AFO I/II y
// Gestión de Empresas Agrarias/Procesos Sociales (formación general y
// contexto uruguayo específico, sin libro de texto clásico obvio).
const BIBLIOGRAFIA = {
  // --- Semestre 1 ---
  "Estructura y organización celular": { libro: "Raven/Johnson - Biología", seccion: "Cap. estructura y organización celular", duracion: 1 },
  "Procesos biológicos que mantienen y perpetúan la vida": { libro: "Raven/Johnson - Biología", seccion: "Cap. metabolismo, reproducción y herencia", duracion: 2 },
  "Biología aplicada a sistemas de producción agropecuaria": { libro: "Raven/Johnson - Biología", seccion: "Cap. biología aplicada a sistemas productivos", duracion: 1 },
  "Método científico en las ciencias biológicas": { libro: "Raven/Johnson - Biología", seccion: "Introducción: el método científico", duracion: 1 },

  "Funciones de varias variables aplicadas a modelos biológicos": { libro: "Stewart - Cálculo", seccion: "Funciones de varias variables", duracion: 2 },
  "Cálculo integral aplicado a modelos biológicos": { libro: "Stewart - Cálculo", seccion: "Integrales aplicadas a modelos de crecimiento", duracion: 2 },
  "Álgebra lineal: vectores, matrices y sistemas de ecuaciones aplicados a la agronomía": { libro: "Grossman - Álgebra Lineal", seccion: "Vectores, matrices y sistemas de ecuaciones", duracion: 2 },

  "Tipos de conocimiento y método científico": { libro: "Apuntes de cátedra", seccion: "AFO I: tipos de conocimiento y método científico", duracion: 1 },
  "Búsqueda de información académica, integridad y citación": { libro: "Apuntes de cátedra", seccion: "AFO I: búsqueda de información, integridad y citas", duracion: 1 },
  "Rol de la universidad y la profesión en los problemas agrarios nacionales": { libro: "Apuntes de cátedra", seccion: "AFO I: rol de la Universidad y la Facultad de Agronomía", duracion: 1 },
  "Sistema estadístico agropecuario de Uruguay": { libro: "Apuntes de cátedra", seccion: "AFO I: sistema estadístico agropecuario uruguayo", duracion: 1 },
  "Inserción profesional del Ingeniero Agrónomo": { libro: "Apuntes de cátedra", seccion: "AFO I: inserción laboral del Ingeniero Agrónomo", duracion: 1 },

  "Cinemática y dinámica aplicadas a sistemas agronómicos": { libro: "Serway/Jewett - Física para ciencias e ingeniería", seccion: "Cinemática y leyes de Newton", duracion: 2 },
  "Trabajo, energía y potencia en sistemas mecánicos agrícolas": { libro: "Serway/Jewett - Física para ciencias e ingeniería", seccion: "Trabajo, energía y potencia", duracion: 2 },
  "Hidrostática e hidrodinámica aplicadas al manejo del agua": { libro: "Serway/Jewett - Física para ciencias e ingeniería", seccion: "Mecánica de fluidos", duracion: 2 },

  "Cálculos estequiométricos y concentración de soluciones": { libro: "Chang - Química", seccion: "Estequiometría y soluciones", duracion: 2 },
  "Equilibrio ácido-base y reacciones redox en sistemas naturales": { libro: "Chang - Química", seccion: "Equilibrio ácido-base y electroquímica", duracion: 2 },
  "Termodinámica de reacciones químicas naturales": { libro: "Chang - Química", seccion: "Termodinámica química", duracion: 2 },

  // --- Semestre 2 ---
  "Morfología externa e interna de las plantas": { libro: "Raven - Biología de las Plantas", seccion: "Morfología vegetal externa e interna", duracion: 2 },
  "Terminología botánica y clasificación taxonómica": { libro: "Raven - Biología de las Plantas", seccion: "Taxonomía y clasificación vegetal", duracion: 1 },
  "Nomenclatura botánica": { libro: "Raven - Biología de las Plantas", seccion: "Nomenclatura botánica", duracion: 1 },
  "Reproducción sexual y asexual en plantas": { libro: "Raven - Biología de las Plantas", seccion: "Reproducción en plantas", duracion: 2 },

  "Estructura y función de proteínas y enzimas": { libro: "Lehninger - Principios de Bioquímica", seccion: "Proteínas y enzimas", duracion: 2 },
  "Estructura y función de lípidos y ácidos nucleicos": { libro: "Lehninger - Principios de Bioquímica", seccion: "Lípidos y ácidos nucleicos", duracion: 2 },
  "Vías metabólicas: catabolismo y anabolismo en vegetales y animales": { libro: "Lehninger - Principios de Bioquímica", seccion: "Catabolismo y anabolismo", duracion: 2 },
  "Herencia, expresión y traducción de la información genética": { libro: "Lehninger - Principios de Bioquímica", seccion: "Expresión y traducción de la información genética", duracion: 2 },

  "Organización anatómica de animales de producción": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Anatomía de animales de producción", duracion: 1 },
  "Digestión en animales productivos": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Fisiología de la digestión", duracion: 2 },
  "Reproducción en animales de producción": { libro: "Hafez - Reproducción e Inseminación Artificial en Animales", seccion: "Fisiología de la reproducción animal", duracion: 2 },
  "Homeostasis frente a perturbaciones ambientales": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Homeostasis y adaptación ambiental", duracion: 1 },

  "Sistema climático y variabilidad climática": { libro: "Rosenberg - Microclimate: The Biological Environment", seccion: "Sistema climático y variabilidad", duracion: 1 },
  "Geología general y geomorfología": { libro: "Apuntes de cátedra", seccion: "Geología general y geomorfología", duracion: 1 },
  "Hidrología superficial y subterránea y cuencas hidrográficas": { libro: "Apuntes de cátedra", seccion: "Hidrología superficial y subterránea", duracion: 1 },
  "Edafología general y ecorregiones de Uruguay": { libro: "Porta/López-Acevedo - Edafología", seccion: "Introducción a la edafología y ecorregiones", duracion: 1 },

  // --- Semestre 3 ---
  "Crecimiento y desarrollo vegetal a lo largo del ciclo biológico": { libro: "Taiz & Zeiger - Fisiología Vegetal", seccion: "Crecimiento y desarrollo vegetal", duracion: 2 },
  "Interacción planta-ambiente": { libro: "Taiz & Zeiger - Fisiología Vegetal", seccion: "Respuesta de las plantas al ambiente", duracion: 2 },

  "Características estructurales y funcionales de los microorganismos": { libro: "Madigan - Brock, Biología de los Microorganismos", seccion: "Estructura y función microbiana", duracion: 2 },
  "Rol de los microorganismos en el sistema suelo-planta": { libro: "Madigan - Brock, Biología de los Microorganismos", seccion: "Microbiología del suelo", duracion: 2 },

  "Probabilidad y variables aleatorias en problemas agronómicos": { libro: "Walpole/Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Probabilidad y variables aleatorias", duracion: 2 },
  "Distribuciones de probabilidad y modelos teóricos": { libro: "Walpole/Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Distribuciones de probabilidad", duracion: 2 },
  "Inferencia estadística aplicada a problemas agronómicos": { libro: "Walpole/Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Estimación y contraste de hipótesis", duracion: 2 },

  "Microeconomía aplicada a problemas productivos agropecuarios": { libro: "Mankiw - Principios de Economía", seccion: "Microeconomía aplicada", duracion: 1 },
  "Contexto macroeconómico y comportamiento de empresas agropecuarias": { libro: "Mankiw - Principios de Economía", seccion: "Macroeconomía y contexto empresarial", duracion: 1 },

  "Interdependencias entre el clima y las actividades agropecuarias": { libro: "Rosenberg - Microclimate: The Biological Environment", seccion: "Clima y actividad agropecuaria", duracion: 1 },
  "Variabilidad climática y regionalización agroclimática de Uruguay": { libro: "Rosenberg - Microclimate: The Biological Environment", seccion: "Regionalización agroclimática", duracion: 1 },
  "Eventos meteorológicos extremos y cambio climático": { libro: "Rosenberg - Microclimate: The Biological Environment", seccion: "Extremos climáticos y cambio climático", duracion: 1 },

  "Descripción y clasificación de suelos": { libro: "Porta/López-Acevedo - Edafología", seccion: "Descripción y clasificación de suelos", duracion: 2 },
  "Propiedades agronómicas del suelo y capacidad de uso": { libro: "Porta/López-Acevedo - Edafología", seccion: "Propiedades agronómicas y capacidad de uso", duracion: 2 },

  // --- Semestre 4 ---
  "Mecanismos físico-químicos de la diversidad en plantas y animales": { libro: "Griffiths - Genética", seccion: "Bases moleculares de la variación genética", duracion: 2 },
  "Patrones de herencia en plantas y animales": { libro: "Griffiths - Genética", seccion: "Patrones de herencia mendeliana y no mendeliana", duracion: 2 },
  "Organización del genoma en células eucarióticas": { libro: "Griffiths - Genética", seccion: "Organización del genoma eucariótico", duracion: 2 },
  "Herramientas moleculares aplicadas al mejoramiento genético": { libro: "Griffiths - Genética", seccion: "Herramientas moleculares en genética aplicada", duracion: 2 },

  "Diseño experimental en ensayos agronómicos": { libro: "Walpole/Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Diseño de experimentos", duracion: 2 },
  "Modelos lineales de regresión y clasificación": { libro: "Walpole/Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Regresión lineal", duracion: 2 },
  "Análisis de datos experimentales con software estadístico": { libro: "Walpole/Myers - Probabilidad y Estadística para Ingeniería y Ciencias", seccion: "Análisis de datos experimentales", duracion: 1 },

  "Competitividad de la agricultura y agroindustria uruguaya": { libro: "Barry/Ellinger - Financial Management in Agriculture", seccion: "Competitividad agroindustrial", duracion: 1 },
  "Cadenas agroindustriales y desarrollo tecnológico": { libro: "Barry/Ellinger - Financial Management in Agriculture", seccion: "Cadenas agroindustriales y tecnología", duracion: 1 },
  "Competitividad en el mercado agropecuario mundial": { libro: "Barry/Ellinger - Financial Management in Agriculture", seccion: "Mercado agropecuario mundial", duracion: 1 },

  "Ingestión, digestión y metabolismo de animales productivos": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Ingestión, digestión y metabolismo", duracion: 2 },
  "Consumo y eficiencia digestiva y metabólica": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Eficiencia digestiva y metabólica", duracion: 2 },

  "Componentes físico-biológicos de agroecosistemas e interacciones bióticas": { libro: "Gliessman - Agroecología", seccion: "Componentes e interacciones del agroecosistema", duracion: 2 },
  "Flujo energético y ciclos biogeoquímicos en agroecosistemas": { libro: "Gliessman - Agroecología", seccion: "Flujo de energía y ciclos biogeoquímicos", duracion: 2 },
  "Efectos del manejo agronómico sobre el agroecosistema": { libro: "Gliessman - Agroecología", seccion: "Manejo agronómico y sustentabilidad", duracion: 1 },

  "Dinámica de nutrientes en el sistema suelo-planta": { libro: "Porta/López-Acevedo - Edafología", seccion: "Dinámica de nutrientes suelo-planta", duracion: 2 },
  "Diagnóstico del nivel de fertilidad del suelo": { libro: "Porta/López-Acevedo - Edafología", seccion: "Diagnóstico de fertilidad", duracion: 1 },
  "Medidas tecnológicas de corrección de la fertilidad: fertilizantes y enmiendas": { libro: "Porta/López-Acevedo - Edafología", seccion: "Fertilizantes y enmiendas", duracion: 2 },

  // --- Semestre 5 ---
  "Base genética de la variación de caracteres a nivel poblacional": { libro: "Griffiths - Genética", seccion: "Genética de poblaciones", duracion: 2 },
  "Enfoque genómico de la variación cuantitativa": { libro: "Griffiths - Genética", seccion: "Genética cuantitativa: enfoque genómico", duracion: 2 },
  "Bases genéticas del mejoramiento animal y vegetal": { libro: "Griffiths - Genética", seccion: "Bases del mejoramiento genético", duracion: 2 },

  "Ciclo reproductivo en especies de interés productivo": { libro: "Hafez - Reproducción e Inseminación Artificial en Animales", seccion: "Ciclo reproductivo en especies productivas", duracion: 2 },
  "Interrelación entre sistemas biológicos, nutricionales y ambientales": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Interacción nutrición-ambiente-reproducción", duracion: 2 },

  "Bases fisiológicas y ecológicas del crecimiento y desarrollo de cultivos": { libro: "Loomis & Connor - Crop Ecology", seccion: "Bases fisiológicas del crecimiento de cultivos", duracion: 2 },
  "Determinación ecofisiológica del rendimiento": { libro: "Loomis & Connor - Crop Ecology", seccion: "Determinación del rendimiento", duracion: 2 },
  "Respuesta de los cultivos a la radiación, la temperatura y el agua": { libro: "Loomis & Connor - Crop Ecology", seccion: "Respuesta a radiación, temperatura y agua", duracion: 2 },
  "Respuesta de los cultivos al manejo de nutrientes": { libro: "Loomis & Connor - Crop Ecology", seccion: "Respuesta al manejo de nutrientes", duracion: 1 },

  "Procesos de degradación de suelos y estrategias de mitigación": { libro: "Brady & Weil - The Nature and Properties of Soils", seccion: "Degradación de suelos y mitigación", duracion: 2 },
  "Herramientas de manejo de suelos, aguas y vegetación": { libro: "Brady & Weil - The Nature and Properties of Soils", seccion: "Manejo de suelos, aguas y vegetación", duracion: 2 },
  "Manejo mecanizado de suelos": { libro: "Brady & Weil - The Nature and Properties of Soils", seccion: "Manejo mecanizado de suelos", duracion: 1 },

  "Dimensiones de la sustentabilidad de sistemas agrarios": { libro: "Apuntes de cátedra", seccion: "AFO II: dimensiones de la sustentabilidad", duracion: 1 },
  "Diagnóstico de sustentabilidad de un sistema agrario mediante indicadores": { libro: "Apuntes de cátedra", seccion: "AFO II: indicadores de sustentabilidad", duracion: 2 },

  // --- Semestre 6 ---
  "Mejoramiento genético de especies cultivadas": { libro: "Poehlman - Breeding Field Crops", seccion: "Mejoramiento genético de cultivos", duracion: 2 },
  "Recursos genéticos vegetales": { libro: "Poehlman - Breeding Field Crops", seccion: "Recursos genéticos vegetales", duracion: 1 },
  "Producción de semilla de calidad": { libro: "Poehlman - Breeding Field Crops", seccion: "Producción de semilla", duracion: 1 },
  "Obtención de cultivares y multiplicación comercial": { libro: "Poehlman - Breeding Field Crops", seccion: "Obtención y multiplicación de cultivares", duracion: 1 },

  "Sociología rural y configuraciones sociales del agro": { libro: "Apuntes de cátedra", seccion: "Sociología rural", duracion: 1 },
  "Actores sociales del medio rural": { libro: "Apuntes de cátedra", seccion: "Actores sociales del medio rural", duracion: 1 },
  "Herramientas de intervención profesional en territorios rurales": { libro: "Apuntes de cátedra", seccion: "Intervención profesional en el territorio", duracion: 1 },

  "Morfología, fisiología y hábitos de los insectos": { libro: "Triplehorn & Johnson - Borror and DeLong's Introduction to the Study of Insects", seccion: "Morfología y fisiología de insectos", duracion: 2 },
  "Ciclos de vida de los insectos e interacción con el ambiente": { libro: "Triplehorn & Johnson - Borror and DeLong's Introduction to the Study of Insects", seccion: "Ciclos de vida e interacción ambiental", duracion: 2 },
  "Manejo integrado de plagas de importancia agronómica": { libro: "Triplehorn & Johnson - Borror and DeLong's Introduction to the Study of Insects", seccion: "Manejo integrado de plagas", duracion: 2 },

  "Diagnóstico de enfermedades de las plantas": { libro: "Agrios - Plant Pathology", seccion: "Diagnóstico fitopatológico", duracion: 2 },
  "Ciclos de las enfermedades vegetales": { libro: "Agrios - Plant Pathology", seccion: "Ciclos de las enfermedades", duracion: 2 },
  "Manejo integrado y gestión sustentable de enfermedades vegetales": { libro: "Agrios - Plant Pathology", seccion: "Manejo integrado de enfermedades", duracion: 2 },

  // --- Semestre 7 ---
  "Sistemas de producción y manejo de bovinos para carne": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Sistemas de producción de carne bovina", duracion: 2 },
  "Tecnologías de producción de carne bovina": { libro: "Church - Fundamentos de Nutrición de Rumiantes", seccion: "Tecnologías de producción de carne", duracion: 2 },
  "Impacto económico de la producción de carne a nivel de empresa ganadera": { libro: "Barry/Ellinger - Financial Management in Agriculture", seccion: "Impacto económico de la ganadería de carne", duracion: 1 },

  "Bases fisiológicas de la respuesta de los cultivos de verano al manejo": { libro: "Loomis & Connor - Crop Ecology", seccion: "Ecofisiología de cultivos de verano", duracion: 2 },
  "Manejo de cultivos de verano en secano": { libro: "Apuntes de cátedra", seccion: "Manejo de cultivos de verano en secano", duracion: 2 },
  "Manejo de malezas, enfermedades y plagas en cultivos de verano": { libro: "Apuntes de cátedra", seccion: "Manejo de malezas, enfermedades y plagas en verano", duracion: 2 },

  // --- Semestre 8 ---
  "Ecofisiología de cultivos de invierno": { libro: "Loomis & Connor - Crop Ecology", seccion: "Ecofisiología de cultivos de invierno", duracion: 2 },
  "Manejo agronómico de cultivos de invierno": { libro: "Apuntes de cátedra", seccion: "Manejo agronómico de cultivos de invierno", duracion: 2 },
  "Formulación de paquetes tecnológicos para cultivos de invierno": { libro: "Apuntes de cátedra", seccion: "Paquetes tecnológicos de invierno", duracion: 1 },

  "Resultados económico-financieros y patrimoniales de sistemas productivos agrarios": { libro: "Apuntes de cátedra", seccion: "Resultados económico-financieros de la empresa agraria", duracion: 2 },
  "Indicadores técnicos, económicos y financieros de la empresa agraria": { libro: "Apuntes de cátedra", seccion: "Indicadores técnicos y económico-financieros", duracion: 2 },
  "Niveles de planificación de la empresa agraria": { libro: "Apuntes de cátedra", seccion: "Niveles de planificación", duracion: 1 },
  "Formas de organización empresarial agraria": { libro: "Apuntes de cátedra", seccion: "Formas de organización empresarial", duracion: 1 },

  "Diagnóstico de sistemas de producción de pasto y grano a escala predial": { libro: "Apuntes de cátedra", seccion: "AFO III: diagnóstico predial pasto-grano", duracion: 2 },
  "Caracterización de los recursos naturales del predio": { libro: "Apuntes de cátedra", seccion: "AFO III: caracterización de recursos naturales", duracion: 1 },
  "Clínica agronómica: producción animal, agricultura en rotación con pasturas y campo natural": { libro: "Apuntes de cátedra", seccion: "AFO III: clínica agronómica integrada", duracion: 3 },
  "Análisis de resultados productivos, socioeconómicos y ambientales": { libro: "Apuntes de cátedra", seccion: "AFO III: análisis de resultados", duracion: 2 },
  "Propuesta de cambio del sistema de producción": { libro: "Apuntes de cátedra", seccion: "AFO III: propuesta de cambio del sistema", duracion: 2 },
};

// Mapeo módulo -> ícono (emoji). Reusa íconos de otras facultades para
// conceptos similares a propósito (ya confirmado en el historial que está
// bien -- no hace falta que sea único por facultad).
const ICONOS = {
  "Organización celular": "🔬",
  "Biología aplicada y método científico": "🧫",
  "Cálculo aplicado a fenómenos biológicos": "📐",
  "Álgebra lineal aplicada a la agronomía": "🧮",
  "Herramientas para el trabajo académico": "📚",
  "El agrónomo y el sistema agropecuario uruguayo": "🇺🇾",
  "Mecánica clásica aplicada a la agronomía": "⚙️",
  "Mecánica de fluidos aplicada": "💧",
  "Fundamentos físico-químicos aplicados a la agronomía": "🧪",
  "Termodinámica de procesos naturales": "🔥",
  "Morfología y clasificación vegetal": "🌿",
  "Reproducción vegetal": "🌸",
  "Biomoléculas de interés agronómico": "🧬",
  "Metabolismo y genética molecular": "🧬",
  "Anatomía y fisiología de animales productivos": "🐄",
  "Reproducción y homeostasis animal": "🐮",
  "Sistema climático y geología": "🌍",
  "Hidrología y edafología general": "💧",
  "Ciclo biológico y desarrollo vegetal": "🌱",
  "Microorganismos y ambientes agropecuarios": "🦠",
  "Probabilidad aplicada a la agronomía": "🎲",
  "Inferencia estadística agronómica": "📊",
  "Microeconomía aplicada a la producción agropecuaria": "💰",
  "Contexto macroeconómico agropecuario": "💵",
  "Clima y producción agropecuaria": "☁️",
  "Riesgo climático agropecuario": "🌦️",
  "Ciencia del suelo": "🌍",
  "Bases de la herencia en plantas y animales": "🧬",
  "Genoma y herramientas moleculares": "🧬",
  "Diseño experimental agronómico": "📋",
  "Modelos de regresión agronómicos": "📈",
  "Competitividad agroindustrial uruguaya": "🏭",
  "Mercado agropecuario mundial": "🌐",
  "Digestión y metabolismo de animales productivos": "🐄",
  "Estructura y funcionamiento de agroecosistemas": "🌾",
  "Manejo y sustentabilidad de agroecosistemas": "♻️",
  "Nutrientes en el sistema suelo-planta": "🌍",
  "Corrección tecnológica de la fertilidad": "🧪",
  "Genética de poblaciones": "🧬",
  "Genética cuantitativa y mejoramiento": "🧬",
  "Ciclo reproductivo de especies productivas": "🐮",
  "Interrelación nutricional y ambiental": "🥩",
  "Bases fisiológicas del rendimiento de cultivos": "🌾",
  "Respuesta de los cultivos a factores ambientales": "☀️",
  "Degradación y conservación de suelos": "🌍",
  "Manejo mecanizado de suelos": "🚜",
  "Sustentabilidad de sistemas agrarios": "♻️",
  "Mejoramiento genético vegetal": "🌱",
  "Producción de semilla y cultivares": "🌱",
  "Sociología rural": "🏘️",
  "Intervención en territorios rurales": "🗺️",
  "Biología de insectos": "🐛",
  "Manejo de plagas": "🐛",
  "Patología vegetal": "🍄",
  "Manejo de enfermedades vegetales": "🍄",
  "Producción de bovinos de carne": "🐄",
  "Impacto económico de la ganadería de carne": "💰",
  "Bases fisiológicas de cultivos de verano": "☀️",
  "Manejo de cultivos de verano": "🌽",
  "Ecofisiología y manejo de cultivos de invierno": "🌾",
  "Paquetes tecnológicos de invierno": "🌾",
  "Análisis económico-financiero de la empresa agraria": "💰",
  "Planificación y organización de la empresa agraria": "📋",
  "Diagnóstico predial agrícola-ganadero": "🚜",
  "Clínica agronómica agrícola-ganadera": "🩺",
};

const catPath = path.join(ROOT, 'data', 'catalogo-agronomia.json');
const textosPath = path.join(ROOT, 'data', 'textos.json');
const duracionesPath = path.join(ROOT, 'data', 'duraciones.json');
const iconosPath = path.join(ROOT, 'data', 'modulo-icons.json');

const cat = JSON.parse(fs.readFileSync(catPath, 'utf8'));
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

Object.entries(cat).forEach(([sem, materias]) => {
  const nombresVistos = new Set();
  materias.forEach((m) => {
    if (nombresVistos.has(m.nombre)) dupMateriaPorSem.push(`${sem}:${m.nombre}`);
    nombresVistos.add(m.nombre);
    nMaterias++;
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

console.log('--- Integridad del catálogo de Agronomía ---');
console.log('materias:', nMaterias);
console.log('modulos (instancias):', nModulosInstancias, '| unicos:', modulosUnicos.size);
console.log('temas (instancias):', nTemasInstancias, '| unicos:', temasUnicos.size);
console.log('materias duplicadas dentro del mismo semestre:', dupMateriaPorSem);
console.log('temas sin entrada de bibliografia preparada:', temasSinBiblio);
console.log('modulos sin icono preparado:', modulosSinIcono);
console.log('temas cuyo textos.json actual difiere del esperado (posible pisada por otra facultad):', valorTextoDistinto);
console.log('modulos cuyo modulo-icons.json actual difiere del esperado:', valorIconoDistinto);

if (dupMateriaPorSem.length || temasSinBiblio.length || modulosSinIcono.length || valorTextoDistinto.length || valorIconoDistinto.length) {
  console.error('\nABORTADO: hay problemas de integridad, no se escribió nada.');
  process.exit(1);
}

// Escribe (o re-escribe con el mismo valor, si ya corrió antes) las
// entradas de este catálogo en los diccionarios globales. Nunca toca
// claves de otras facultades.
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
