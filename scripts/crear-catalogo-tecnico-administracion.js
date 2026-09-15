// Crea data/catalogo-tecnico-administracion.json: la Tecnicatura en
// Administración y Ciencias Administrativas de FCEA (5 semestres, 225
// créditos), una carrera CORTA y distinta de "Licenciatura en Administración"
// (8 semestres, ya cargada en catalogo-administracion.json). Hasta ahora no
// existía como carrera propia en la app -- Santiago mandó el link oficial
// (fcea.udelar.edu.uy/depto-adm-ensenanza/tecnicatura-admin-ciencias-adm.html)
// y pidió que la app calzara con esa grilla exacta.
//
// Para las UC que la Tecnicatura comparte con otras carreras de FCEA ya
// cargadas (mismo código real, ver fichas oficiales), se REUSA el contenido
// que ya existe (sea el temario real completo, como Cálculo I/Introducción a
// la Estadística, o el placeholder viejo de otras materias) en vez de
// reinventarlo. Las UC exclusivas de la Tecnicatura (Derecho Civil, EFIs,
// Marketing Digital/Estratégico/de Servicios, etc.) se cargan con un
// placeholder mínimo (mismo nivel que tenía el resto del catálogo antes de
// las rondas de expansión real) -- Santiago pidió solo ajustar la ESTRUCTURA
// para que calce con la grilla, no investigar las 38 UC una por una.
const fs = require('fs');
const path = require('path');
const DATA = __dirname + '/../data';

const admin = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-administracion.json'), 'utf8'));
const contadorPublico = JSON.parse(fs.readFileSync(path.join(DATA, 'catalogo-contador-publico.json'), 'utf8'));

function buscar(catalogo, nombre) {
  for (const sem of Object.keys(catalogo)) {
    const m = catalogo[sem].find(x => x.nombre === nombre);
    if (m) return m.modulos;
  }
  throw new Error(`No se encontró "${nombre}" para reusar`);
}

function reusar(catalogo, nombreOrigen, nombreDestino) {
  const modulos = JSON.parse(JSON.stringify(buscar(catalogo, nombreOrigen)));
  return { nombre: nombreDestino || nombreOrigen, modulos };
}

// Placeholder mínimo (mismo nivel que el resto del catálogo antes de
// expandirse): 1 módulo genérico, 2 temas descriptivos del contenido
// sintético que publica FCEA en la grilla curricular.
function placeholder(nombre, modulo, tema1, tema2, icono) {
  const textos = require(path.join(DATA, 'textos.json'));
  const duraciones = require(path.join(DATA, 'duraciones.json'));
  const iconos = require(path.join(DATA, 'modulo-icons.json'));
  if (!textos[tema1]) { textos[tema1] = { libro: 'Apuntes de cátedra', seccion: `${nombre}: ${modulo}` }; duraciones[tema1] = 1; }
  if (!textos[tema2]) { textos[tema2] = { libro: 'Apuntes de cátedra', seccion: `${nombre}: ${modulo}` }; duraciones[tema2] = 1; }
  if (!iconos[modulo]) iconos[modulo] = icono;
  fs.writeFileSync(path.join(DATA, 'textos.json'), JSON.stringify(textos, null, 2) + '\n');
  fs.writeFileSync(path.join(DATA, 'duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
  fs.writeFileSync(path.join(DATA, 'modulo-icons.json'), JSON.stringify(iconos, null, 2) + '\n');
  return { nombre, modulos: [{ modulo, temas: [tema1, tema2] }] };
}

const catalogo = {
  '1': [
    reusar(admin, 'Administración y Gestión de las Organizaciones I'),
    reusar(admin, 'Conceptos Contables'),
    reusar(admin, 'Introducción a la Microeconomía'),
    reusar(admin, 'Cálculo I'),
  ],
  '2': [
    reusar(admin, 'Administración y Gestión de las Organizaciones II'),
    reusar(admin, 'Contabilidad General I'),
    placeholder('Derecho Civil', 'Parte general del derecho civil', 'Personas físicas y jurídicas', 'Obligaciones y contratos civiles', '⚖️'),
    placeholder('Investigación Colaborativa Internacional en Gestión de Personas', 'Proyecto de investigación colaborativa', 'Gestión de personas en contexto internacional', 'Trabajo colaborativo en equipos interdisciplinarios', '🌎'),
  ],
  '3': [
    reusar(admin, 'Procesos y Sistemas de Información'),
    reusar(contadorPublico, 'Contabilidad General II'),
    placeholder('Derecho Comercial', 'Régimen jurídico comercial', 'Sociedades comerciales y estatuto del comerciante', 'Contratos comerciales y títulos valores', '⚖️'),
    reusar(admin, 'Introducción a la Estadística'),
    reusar(admin, 'Marketing Básico'),
  ],
  '4': [
    reusar(admin, 'Administración de Recursos Humanos'),
    placeholder('Diseño Organizacional', 'Diseño de estructuras organizativas', 'Modelos de estructura organizativa', 'Diseño de puestos y procesos', '🏢'),
    reusar(contadorPublico, 'Contabilidad General III'),
    reusar(admin, 'Matemática Financiera'),
    reusar(contadorPublico, 'Legislación Laboral y Seguridad Social'),
    placeholder('Compras Públicas para el Desarrollo', 'Compras públicas', 'Marco normativo de las compras estatales', 'Compras públicas como herramienta de desarrollo', '🏛️'),
    placeholder('Prospectiva Estratégica: Con la Mirada en el Futuro', 'Prospectiva estratégica', 'Métodos de prospectiva y escenarios futuros', 'Planificación estratégica de largo plazo', '🔭'),
    placeholder('Economía Circular', 'Economía circular', 'Principios de la economía circular', 'Modelos de negocio circulares', '♻️'),
    placeholder('EFI: Contabilidad en las Escuelas', 'Espacio de Formación Integral', 'Extensión universitaria en contabilidad escolar', 'Enseñanza de nociones contables en el medio', '🎓'),
    placeholder('EFI: Costos para la Gestión de Emprendimientos Sociales y Comunitarios', 'Espacio de Formación Integral', 'Costos aplicados a emprendimientos sociales', 'Gestión económica de proyectos comunitarios', '🎓'),
    placeholder('Derecho Público', 'Derecho público', 'Organización del Estado y función pública', 'Actos y contratos administrativos', '⚖️'),
    placeholder('Gestión Financiera del Estado', 'Finanzas públicas', 'Presupuesto público y ejecución financiera', 'Gestión financiera de organismos estatales', '🏛️'),
    reusar(admin, 'Cambio Organizacional'),
    placeholder('Marketing Estratégico', 'Marketing estratégico', 'Análisis estratégico de mercado', 'Formulación de estrategias de marketing', '📣'),
  ],
  '5': [
    reusar(admin, 'Comportamiento Organizacional'),
    placeholder('Transformación Cultural', 'Cultura organizacional', 'Diagnóstico de la cultura organizacional', 'Procesos de transformación cultural', '🌱'),
    placeholder('EFI Cooperativas de Trabajo y Colectivos Autogestionados', 'Espacio de Formación Integral', 'Gestión de cooperativas de trabajo', 'Colectivos autogestionados y economía social', '🎓'),
    placeholder('Taller de Gestión de Cargos y Remuneraciones', 'Gestión de cargos y remuneraciones', 'Valoración de cargos', 'Diseño de estructuras salariales', '💰'),
    placeholder('EFI: MicroCECEA', 'Espacio de Formación Integral', 'Asesoramiento a micro y pequeñas empresas', 'Práctica de extensión en gestión de emprendimientos', '🎓'),
    placeholder('Ética y Ejercicio Profesional', 'Ética profesional', 'Principios éticos del ejercicio profesional', 'Casos de ética aplicada a la gestión', '🧭'),
    placeholder('Análisis Institucional y Planificación en el Sector Público', 'Gestión pública', 'Análisis institucional de organismos públicos', 'Planificación estratégica en el sector público', '🏛️'),
    placeholder('Marketing de Servicios', 'Marketing de servicios', 'Particularidades del marketing de servicios', 'Calidad y experiencia del servicio', '📣'),
    placeholder('Marketing Digital', 'Marketing digital', 'Canales y herramientas digitales de marketing', 'Métricas y campañas en medios digitales', '📱'),
    placeholder('Liderazgo para la Innovación Social', 'Liderazgo e innovación social', 'Liderazgo aplicado a proyectos de impacto social', 'Innovación social: metodologías y casos', '💡'),
    reusar(admin, 'Costos para la Gestión'),
  ],
};

fs.writeFileSync(path.join(DATA, 'catalogo-tecnico-administracion.json'), JSON.stringify(catalogo, null, 2) + '\n');

const total = Object.values(catalogo).reduce((s, arr) => s + arr.length, 0);
console.log(`catalogo-tecnico-administracion.json creado: ${total} materias en ${Object.keys(catalogo).length} semestres.`);
