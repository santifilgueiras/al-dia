// Reemplaza el placeholder viejo (3 temas) de "Procesos Sociales y Herramientas
// de Intervención en el Territorio" (Agronomía, año/semestre 6) por el temario
// real de los 5 primeros temas de la materia -- Santiago mandó el programa
// real (temas + bibliografía en PDF) de la cátedra de Sociología Rural de la
// Facultad de Agronomía. La materia completa tiene 13 temas según el
// cronograma real (`1_Prosite_2026.pdf`); estos son los primeros 5, es
// probable que lleguen más en una próxima ronda.
//
// Cada tema de clase se cargó como un módulo propio, con sub-temas extraídos
// de los PDFs reales (paráfrasis tipo tabla de contenidos, nunca copia
// textual -- varias fuentes son artículos/libros con copyright real: Bianco y
// Chiappe, Bernstein, Vassallo, Mascheroni y Riella, Cardeillac et al.).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

const materia = catalogo['6'].find(m => m.nombre === 'Procesos Sociales y Herramientas de Intervención en el Territorio');
if (!materia) throw new Error('No se encontró la materia en año/semestre 6 de Agronomía');

// [modulo, icono, [ [tema, libro, seccion, dias], ... ] ]
const MODULOS = [
  ['Abordajes conceptuales para el estudio de la sociedad rural', '🔎', [
    ['Objeto de estudio de la sociología rural y dicotomía rural-urbano', 'Bianco y Chiappe - La Sociología Rural: Una Introducción', 'capítulo introductorio', 1],
    ['El continuo rural-urbano y la definición compuesta de ruralidad de Sorokin y Zimmerman', 'Bianco y Chiappe - La Sociología Rural: Una Introducción', 'capítulo introductorio', 1],
    ['Institucionalización de la sociología rural académica en Uruguay', 'Bianco y Chiappe - La Sociología Rural: Una Introducción', 'capítulo introductorio', 1],
  ]],
  ['El agro uruguayo en el capitalismo mundial: una mirada de largo plazo', '🌐', [
    ['Teoría de los regímenes alimentarios internacionales (Friedmann y McMichael)', 'Apuntes de cátedra', 'Teórico: el agro uruguayo en el capitalismo global', 2],
    ['Del cultivo a la agricultura: formación del sector agrícola en el capitalismo industrial', 'Bernstein - Class Dynamics of Agrarian Change', 'capítulo de producción agrícola y agricultura local y global', 2],
    ['Historia agraria uruguaya y su inserción en los sucesivos regímenes alimentarios', 'Apuntes de cátedra', 'Teórico: el agro uruguayo en el capitalismo global', 2],
    ['Globalización neoliberal y expansión del agronegocio en el agro uruguayo reciente', 'Oyhantçabal, Ceroni y Carámbula - El Espacio Agrario Uruguayo en el Siglo XXI', 'capítulo de transformaciones recientes del agro uruguayo', 2],
    ['Cambios en el mercado de tierras: concentración y extranjerización', 'Oyhantçabal, Ceroni y Carámbula - El Espacio Agrario Uruguayo en el Siglo XXI', 'capítulo de mercado de tierras', 2],
  ]],
  ['Dinámicas poblacionales y de empleo en el medio rural', '👥', [
    ['Definiciones alternativas de población rural en Uruguay: enfoque de unión vs. intersección', 'Suárez - Caracterización de Población y Hogares Rurales según Definiciones Alternativas', 'capítulo de definiciones de población rural', 1],
    ['Evolución histórica de la población rural uruguaya', 'Piñeiro y Cardeillac - Población Rural en Uruguay', 'capítulo de evolución de la población rural', 2],
    ['Caracterización de hogares rurales según definiciones alternativas', 'Suárez - Caracterización de Población y Hogares Rurales según Definiciones Alternativas', 'capítulo de caracterización de hogares rurales', 1],
    ['Tendencias recientes del empleo y el mercado de trabajo rural', 'Cabella y Pardo - Población en Uruguay', 'capítulo de dinámica poblacional reciente', 2],
  ]],
  ['Desarrollo Rural y Territorio', '🗺️', [
    ['Desarrollo agropecuario, desarrollo agrario y desarrollo rural: distinción conceptual', 'Vassallo - Desarrollo Rural: Teorías, Enfoques y Problemas Nacionales', 'capítulo de desarrollo agrario y desarrollo rural', 1],
    ['La pobreza rural como fundamento del concepto de desarrollo rural', 'Vassallo - Desarrollo Rural: Teorías, Enfoques y Problemas Nacionales', 'capítulo de desarrollo agrario y desarrollo rural', 1],
    ['El enfoque territorial del desarrollo rural: territorio, economía territorial y competitividad territorial', 'Sepúlveda, Rodríguez, Echeverri y Portilla - El Enfoque Territorial del Desarrollo Rural', 'capítulo de la propuesta del IICA sobre enfoque territorial', 2],
    ['Cohesión social y cohesión territorial como metas del desarrollo rural', 'Sepúlveda, Rodríguez, Echeverri y Portilla - El Enfoque Territorial del Desarrollo Rural', 'capítulo de la propuesta del IICA sobre enfoque territorial', 1],
  ]],
  ['El enfoque de género y juventudes en el medio rural', '⚖️', [
    ['Sexo y género: distinción conceptual y división sexual del trabajo', 'Apuntes de cátedra', 'Clase: género, juventud y ruralidad', 1],
    ['Vulnerabilidad laboral de las mujeres en áreas rurales de Uruguay', 'Mascheroni y Riella - La Vulnerabilidad Laboral de las Mujeres en Áreas Rurales', 'artículo completo', 2],
    ['Brechas de género en el acceso a la tierra, el empleo y la sucesión de la explotación', 'Apuntes de cátedra', 'Clase: género, juventud y ruralidad', 2],
    ['Heterogeneidad de las juventudes rurales', 'Cardeillac, Krapovickas y Juncal - Ruralidad y Asincronía: Transiciones a la Adultez en Uruguay', 'capítulo de juventudes en la ruralidad uruguaya', 1],
    ['Asincronía de género en las transiciones a la adultez en el medio rural', 'Cardeillac, Krapovickas y Juncal - Ruralidad y Asincronía: Transiciones a la Adultez en Uruguay', 'capítulo de desigualdad de género y asincronía en la transición', 2],
  ]],
];

materia.modulos = MODULOS.map(([modulo, , temas]) => ({
  modulo,
  temas: temas.map(([nombre]) => nombre),
}));

MODULOS.forEach(([modulo, icono, temas]) => {
  if (!iconos[modulo]) iconos[modulo] = icono;
  temas.forEach(([nombre, libro, seccion, dias]) => {
    textos[nombre] = { libro, seccion };
    duraciones[nombre] = dias;
  });
});

fs.writeFileSync(path.join(DATA, 'catalogo-agronomia.json'), JSON.stringify(catalogo, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');

const totalTemas = materia.modulos.reduce((s, m) => s + m.temas.length, 0);
console.log(`"Procesos Sociales y Herramientas de Intervención en el Territorio" ahora tiene ${materia.modulos.length} módulos / ${totalTemas} temas.`);
