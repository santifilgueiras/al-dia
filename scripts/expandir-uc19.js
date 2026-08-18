// Agrega a Clínica Médica (UC 19, año 5 de Medicina) los temas reales del
// programa oficial 2023 (fmed.edu.uy, Anexo 1) que faltaban en el catálogo
// -- confirmado comparando módulo por módulo. Reportado por la novia de
// Santiago: Nefrourología solo tenía 4 de los 6 temas reales (faltaba
// justamente "Infecciones del tracto genitourinario"), y al revisar el
// programa completo se encontraron faltantes similares en Cardiovascular,
// Respiratorio, Endocrinología, Hematología, Infectología, Neurología y
// Reumatología. No se tocan Oncología (ya cubría los 3 temas reales +
// contenido extra) ni Gastroenterología salvo un tema, ni las 4 materias
// de taller (Psiquiatría/Psicología médica/Medicina legal/Bioética,
// alcance distinto -- ver mensaje al usuario).
//
// Cada tema nuevo agrega también su entrada en TEXTOS (bibliografía,
// mismo patrón "capítulo de X (también en Farreras-Rozman)" ya usado en
// todo el catálogo real de Medicina) y en DURACIONES (1-3 días según
// densidad/complejidad del tema, mismo criterio que el resto).
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const catalogo = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-medicina.json'), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(DATA, 'textos.json'), 'utf8'));
const duraciones = JSON.parse(fs.readFileSync(path.join(DATA, 'duraciones.json'), 'utf8'));

const uc19 = catalogo[5].find(m => m.nombre.includes('Clínica'));
if (!uc19) throw new Error('No se encontró Clínica Médica (UC 19) en año 5');

function harrison(seccion) {
  return { libro: 'Harrison', seccion: `capítulo de ${seccion} (también en Farreras-Rozman)` };
}

// { modulo: [ [nombreTema, seccionBibliografia, dias], ... ] }
const AGREGAR = {
  'Cardiovascular': [
    ['Miocardiopatías', 'Miocardiopatías', 2],
    ['Cardiopatías valvulares', 'Cardiopatías valvulares', 2],
    ['Endocarditis infecciosa', 'Endocarditis infecciosa', 2],
    ['Enfermedades del pericardio', 'Enfermedades del pericardio', 1],
    ['Síncope', 'Síncope', 1],
    ['Trastornos de la conducción cardíaca', 'Trastornos de la conducción cardíaca (bloqueos AV, de rama)', 1],
  ],
  'Respiratorio': [
    ['Síndrome mediastinal', 'Síndrome mediastinal', 1],
    ['Supuraciones pulmonares', 'Supuraciones pulmonares (absceso de pulmón)', 1],
  ],
  'Nefrourología': [
    ['Glomerulopatías', 'Glomerulopatías', 2],
    ['Uropatía obstructiva', 'Uropatía obstructiva', 1],
    ['Neoplasma de próstata', 'Cáncer de próstata', 1],
    ['Infecciones del tracto genitourinario', 'Infecciones urinarias', 2],
  ],
  'Gastroenterología': [
    ['Síndrome de intestino irritable', 'Síndrome de intestino irritable', 1],
  ],
  'Endocrinología': [
    ['Bocio y nódulo tiroideo', 'Bocio y nódulo tiroideo', 1],
    ['Enfermedad de la adenohipófisis', 'Enfermedades de la hipófisis anterior', 2],
    ['Síndrome de Cushing', 'Síndrome de Cushing', 1],
    ['Insuficiencia suprarrenal', 'Insuficiencia suprarrenal (Addison)', 1],
  ],
  'Hematología': [
    // Reemplaza el bucket genérico "Anemias" -- ver quitarAntes abajo -- por
    // los 4 subtipos reales del programa, cada uno con estudio y manejo
    // distintos.
    ['Anemia ferropénica', 'Anemia ferropénica', 1],
    ['Anemia megaloblástica', 'Anemia megaloblástica', 1],
    ['Anemia inflamatoria', 'Anemia de los trastornos crónicos/inflamatoria', 1],
    ['Anemia hemolítica', 'Anemias hemolíticas', 2],
    ['Trombocitopenia inmune', 'Trombocitopenia inmune (PTI)', 1],
    ['Síndromes mieloproliferativos', 'Neoplasias mieloproliferativas', 2],
  ],
  'Infectología': [
    ['Infección de piel y partes blandas', 'Infecciones de piel y partes blandas', 1],
  ],
  'Neurología': [
    ['Meningitis', 'Meningitis', 1],
    ['Tumores del sistema nervioso central', 'Tumores del sistema nervioso central', 2],
    ['Enfermedades desmielinizantes', 'Enfermedades desmielinizantes (esclerosis múltiple)', 2],
    ['Polineuropatías y polirradiculopatías', 'Polineuropatías y polirradiculopatías (incl. Guillain-Barré)', 2],
    ['Parálisis facial periférica', 'Parálisis facial periférica (de Bell)', 1],
    ['Compresión medular', 'Compresión medular', 1],
    ['Vértigo', 'Vértigo', 1],
  ],
  'Reumatología': [
    ['Lupus eritematoso sistémico', 'Lupus eritematoso sistémico', 2],
    ['Artritis reumatoide', 'Artritis reumatoide', 2],
    ['Esclerosis sistémica', 'Esclerosis sistémica (esclerodermia)', 1],
    ['Espondiloartropatías', 'Espondiloartropatías', 2],
    ['Osteoporosis', 'Osteoporosis', 1],
    ['Artrosis', 'Artrosis', 1],
    ['Artritis infecciosa', 'Artritis infecciosa (séptica)', 1],
    ['Artritis microcristalina', 'Artritis microcristalina (gota, pseudogota)', 1],
  ],
};

// "Enfermedades reumatológicas prevalentes: diagnóstico y tratamiento" era
// el bucket genérico que ahora se reemplaza por las 8 enfermedades
// puntuales de arriba -- se saca para no dejar un tema redundante con las
// que sí se nombran una por una.
const QUITAR = {
  'Hematología': ['Anemias'],
  'Reumatología': ['Enfermedades reumatológicas prevalentes: diagnóstico y tratamiento'],
};

let agregados = 0, quitados = 0;
uc19.modulos.forEach(mod => {
  const aQuitar = QUITAR[mod.modulo];
  if (aQuitar) {
    const antes = mod.temas.length;
    mod.temas = mod.temas.filter(t => !aQuitar.includes(t));
    quitados += antes - mod.temas.length;
  }
  const aAgregar = AGREGAR[mod.modulo];
  if (!aAgregar) return;
  aAgregar.forEach(([nombre, seccion, dias]) => {
    if (mod.temas.includes(nombre)) return; // ya está, no duplicar
    mod.temas.push(nombre);
    textos[nombre] = harrison(seccion);
    duraciones[nombre] = dias;
    agregados++;
  });
});

fs.writeFileSync(path.join(DATA, 'catalogo-medicina.json'), JSON.stringify(catalogo, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');

console.log(`Temas agregados: ${agregados} -- temas quitados (buckets reemplazados): ${quitados}`);
console.log('Nuevo total UC19:', uc19.modulos.reduce((s, m) => s + m.temas.length, 0));
