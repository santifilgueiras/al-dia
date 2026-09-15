// Motor compartido para los scripts de expansión de FCEA. Dado un nombre de
// materia y su lista de módulos/temas, busca y actualiza esa materia en
// TODOS los catálogos de FCEA donde aparezca (Contador Público, Economía,
// Administración, Tecnicatura en Administración) -- varias materias son
// unidades curriculares compartidas entre carreras, así que definirlas una
// sola vez basta para actualizar los 4 catálogos a la vez.
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');

const CATALOGOS = ['contador-publico', 'economia', 'administracion', 'tecnico-administracion'];

function cargarTodo() {
  const catalogos = {};
  CATALOGOS.forEach(c => {
    catalogos[c] = JSON.parse(fs.readFileSync(path.join(DATA, `catalogo-${c}.json`), 'utf8'));
  });
  const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
  const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));
  const iconos = JSON.parse(fs.readFileSync(path.join(DATA, 'modulo-icons.json'), 'utf8'));
  return { catalogos, textos, duraciones, iconos };
}

function guardarTodo({ catalogos, textos, duraciones, iconos }) {
  CATALOGOS.forEach(c => {
    fs.writeFileSync(path.join(DATA, `catalogo-${c}.json`), JSON.stringify(catalogos[c], null, 2) + '\n');
  });
  fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
  fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
  fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');
}

// MATERIAS: [ [nombreMateria, [ [modulo, icono, [ [tema, libro, seccion, dias], ... ] ], ... ] ], ... ]
function aplicarMaterias(MATERIAS) {
  const state = cargarTodo();
  const { catalogos, textos, duraciones, iconos } = state;

  let totalMateriasActualizadas = 0;
  let totalTemas = 0;
  const noEncontradas = [];

  MATERIAS.forEach(([nombreMateria, MODULOS]) => {
    let encontradaEnAlguna = false;

    CATALOGOS.forEach(carrera => {
      const cat = catalogos[carrera];
      Object.keys(cat).forEach(sem => {
        const materia = cat[sem].find(m => m.nombre === nombreMateria);
        if (materia) {
          encontradaEnAlguna = true;
          materia.modulos = MODULOS.map(([modulo, , temas]) => ({
            modulo,
            temas: temas.map(([nombre]) => nombre),
          }));
        }
      });
    });

    if (!encontradaEnAlguna) {
      noEncontradas.push(nombreMateria);
      return;
    }

    MODULOS.forEach(([modulo, icono, temas]) => {
      if (!iconos[modulo]) iconos[modulo] = icono;
      temas.forEach(([nombre, libro, seccion, dias]) => {
        textos[nombre] = { libro, seccion };
        duraciones[nombre] = dias;
        totalTemas++;
      });
    });

    totalMateriasActualizadas++;
  });

  guardarTodo(state);

  if (noEncontradas.length) {
    console.log('ADVERTENCIA -- no se encontraron en ningún catálogo:', noEncontradas.join(', '));
  }
  console.log(`${totalMateriasActualizadas} materias de FCEA actualizadas, ${totalTemas} temas en total.`);
}

module.exports = { aplicarMaterias };
