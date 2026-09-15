// Completa "Procesos Sociales y Herramientas de Intervención en el
// Territorio" (Agronomía, semestre 6) con los temas que faltaban del
// programa oficial real ("Programa Prosite 2024", cátedra de Sociología
// Rural) -- encontrado navegando la página del Departamento de Ciencias
// Sociales en portal.fagro.edu.uy. La bibliografía de los primeros 4 temas
// coincide exactamente con los 16 PDFs que Santiago había mandado en una
// ronda anterior, confirmando que ese contenido ya cargado es correcto;
// este script agrega los 7 temas restantes (Temas 6 a 13 del programa
// oficial) más un tema al módulo de Desarrollo Rural que había quedado
// incompleto (Tema 5 del programa, subtema de extensión rural).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-agronomia.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));

const materia = catalogo['6'].find(m => m.nombre === 'Procesos Sociales y Herramientas de Intervención en el Territorio');
if (!materia) throw new Error('No se encontró "Procesos Sociales..." en semestre 6 de Agronomía');

// Tema suelto que se agrega al módulo ya existente de Desarrollo Rural y Territorio
const TEMA_ATER = ['Trayectorias conceptuales y prácticas de extensión rural (ATER)', 'Alemany y Sevilla-Guzmán - ¿Vuelve la Extensión Rural?', 'artículo sobre extensión rural en Latinoamérica', 1];
const moduloDesarrolloRural = materia.modulos.find(m => m.modulo === 'Desarrollo Rural y Territorio');
if (!moduloDesarrolloRural) throw new Error('No se encontró el módulo "Desarrollo Rural y Territorio"');
moduloDesarrolloRural.temas.push(TEMA_ATER[0]);
textos[TEMA_ATER[0]] = { libro: TEMA_ATER[1], seccion: TEMA_ATER[2] };
duraciones[TEMA_ATER[0]] = TEMA_ATER[3];

// [modulo, icono, [ [tema, libro, seccion, dias], ... ] ]
const MODULOS_NUEVOS = [
  ['Estratificación social en el agro uruguayo', '👥', [
    ['Empresarios/as y terratenientes: heterogeneidad social de las empresas agrícolas', 'Oyhantçabal Benelli - Los Terratenientes Agrarios en el Uruguay Contemporáneo', 'capítulo de El Cambio Agrario en el Uruguay Contemporáneo', 2],
    ['Productores/as familiares: caracterización y transformaciones recientes', 'Cardeillac Gulla - La Producción (Cada Vez Menos) Familiar Uruguaya en los Albores del Siglo XXI', 'capítulo de El Cambio Agrario en el Uruguay Contemporáneo', 2],
    ['Asalariados/as rurales: proletarización del agro uruguayo', 'Carámbula y Oyhantçabal Benelli - Proletarización del Agro Uruguayo a Comienzos del Siglo XXI', 'artículo de la revista Eutopía', 2],
  ]],
  ['Organizaciones, políticas públicas e innovación', '🏛️', [
    ['Organizaciones agrarias y procesos colectivos', 'Piñeiro y Fernández - Organizaciones Rurales', 'capítulo de El Campo Uruguayo: Una Mirada desde la Sociología Rural', 2],
    ['Estado y políticas públicas dirigidas al sector agropecuario', 'Riella y Mascheroni - Las Políticas Públicas y las Organizaciones Agrarias en el Uruguay Progresista', 'capítulos 2, 3 y 5', 2],
    ['Innovación en procesos agropecuarios', 'Bianco - La Innovación en los Estudios Sociales de Procesos Agropecuarios', 'artículo en Agrociencia Uruguay', 2],
  ]],
];

MODULOS_NUEVOS.forEach(([modulo, , temas]) => {
  materia.modulos.push({ modulo, temas: temas.map(([nombre]) => nombre) });
});

let totalTemas = 1; // el tema de ATER agregado arriba
MODULOS_NUEVOS.forEach(([modulo, icono, temas]) => {
  if (!iconos[modulo]) iconos[modulo] = icono;
  temas.forEach(([nombre, libro, seccion, dias]) => {
    textos[nombre] = { libro, seccion };
    duraciones[nombre] = dias;
    totalTemas++;
  });
});

fs.writeFileSync(path.join(DATA, 'catalogo-agronomia.json'), JSON.stringify(catalogo, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');

const totalTemasMateria = materia.modulos.reduce((s, m) => s + m.temas.length, 0);
console.log(`"Procesos Sociales..." ahora tiene ${materia.modulos.length} módulos / ${totalTemasMateria} temas (+${totalTemas} nuevos).`);
