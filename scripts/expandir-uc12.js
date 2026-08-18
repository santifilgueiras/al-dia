// Agrega a Digestivo-Renal-Endócrino-Metabolismo-Reproducción y Desarrollo (UC 12,
// año 3 de Medicina) los temas reales del programa oficial 2026 (fmed.edu.uy) que
// faltaban en el catálogo -- confirmado comparando módulo por módulo contra el
// Anexo 1 (programa detallado) real. Parte de la auditoría completa del catálogo
// de Medicina pedida por Santiago ("NECESITO Q TE FIJES DETALLADAMENTE SI FALTAN
// TEMAS DE OTRAS MATERIAS").
//
// Módulos 2 (Sistema Digestivo), 4 (Sistema Endócrino) y 5 (Sistema Renal) ya
// cubrían el programa real completo (con temas consolidados) -- no se tocan.
//
// Cada tema nuevo agrega también su entrada en TEXTOS y DURACIONES, mismo
// patrón que scripts/expandir-uc19.js.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-medicina.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));

const uc12 = catalogo[3].find(m => m.nombre.includes('Digestivo'));
if (!uc12) throw new Error('No se encontró UC 12 en año 3');

// { modulo: [ [nombreTema, {libro, seccion}, dias], ... ] }
const AGREGAR = {
  'Biología del Desarrollo': [
    [
      'Mecanismos celulares y señalización en el desarrollo',
      { libro: 'Gilbert, Biología del desarrollo', seccion: 'capítulo de señalización celular en el desarrollo (inducción, comunicación paracrina/autocrina, vías de señalización)' },
      1,
    ],
    [
      'Embrión somítico y desarrollo del sistema músculo-esquelético',
      { libro: 'Moore, Embriología clínica', seccion: 'capítulo de somitas, mesodermo axial/paraxial/lateral y desarrollo del sistema muscular y esquelético' },
      1,
    ],
    [
      'Genes y desarrollo: regulación génica y ejes corporales',
      { libro: 'Gilbert, Biología del desarrollo', seccion: 'capítulo de cascadas de regulación génica, ejes corporales, genes homeóticos (Drosophila y mamíferos)' },
      2,
    ],
  ],
  'Nutrición y Metabolismo': [
    [
      'Particularidades metabólicas de tejidos (hepático, muscular y adiposo)',
      { libro: 'Devlin, Bioquímica', seccion: 'capítulo de metabolismo específico de tejido hepático, muscular cardíaco/esquelético y adiposo' },
      1,
    ],
  ],
  'Sistema Reproductor': [
    [
      'Histología de la glándula mamaria',
      { libro: 'Ross-Pawlina, Histología', seccion: 'capítulo de glándula mamaria (organización histológica, glándula activa y en reposo)' },
      1,
    ],
  ],
};

let agregados = 0;
uc12.modulos.forEach(mod => {
  const aAgregar = AGREGAR[mod.modulo];
  if (!aAgregar) return;
  aAgregar.forEach(([nombre, texto, dias]) => {
    if (mod.temas.includes(nombre)) return; // ya está, no duplicar
    mod.temas.push(nombre);
    textos[nombre] = texto;
    duraciones[nombre] = dias;
    agregados++;
  });
});

fs.writeFileSync(path.join(DATA, 'catalogo-medicina.json'), JSON.stringify(catalogo, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');

console.log(`Temas agregados: ${agregados}`);
console.log('Nuevo total UC12:', uc12.modulos.reduce((s, m) => s + m.temas.length, 0));
