require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5173;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
// Modelo aparte para fichas -- mucho más barato que Sonnet, calidad
// suficiente para preguntas de repaso. Configurable por separado del modelo
// de /api/resumen (que se queda en MODEL) para no atarlos entre sí.
const FICHAS_MODEL = process.env.ANTHROPIC_FICHAS_MODEL || 'claude-haiku-4-5';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || '';
const PUSH_CRON_SECRET = process.env.PUSH_CRON_SECRET || '';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT || 'mailto:sin-configurar@example.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// Cliente con la service role key -- SOLO se usa acá, del lado del server,
// para el cron de recordatorios: necesita leer push_subscriptions y
// app_state de TODOS los usuarios (bypassea RLS a propósito). Nunca se
// manda al navegador -- el cliente sigue usando la anon key + RLS como
// siempre, tanto para app_state como para su propia fila de
// push_subscriptions.
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;
// En memoria, nunca se escribe a disco -- el archivo solo vive lo que dura
// el request.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.use(express.json());

// Servir SOLO lo que la app necesita en público -- antes era
// express.static(__dirname), que exponía la carpeta entera (schema SQL,
// HANDOFF.md, scripts de build, package.json...) por HTTP. Una vez
// desplegado en un dominio real eso queda accesible para cualquiera, así
// que se restringe a una lista explícita de archivos/carpetas públicas.
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'landing.html')));
app.get('/landing.html', (req, res) => res.sendFile(path.join(__dirname, 'landing.html')));
app.get('/instalar.html', (req, res) => res.sendFile(path.join(__dirname, 'instalar.html')));
app.get('/mockup-firme.html', (req, res) => res.sendFile(path.join(__dirname, 'mockup-firme.html')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, 'sw.js')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'robots.txt')));
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, 'sitemap.xml')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
// El paquete de supabase-js (cliente para el navegador) servido por
// nosotros mismos, para no depender de un CDN externo.
app.use('/vendor/supabase.js', express.static(
  require.resolve('@supabase/supabase-js/dist/umd/supabase.js')
));

// La URL y la anon key de Supabase NO son secretas -- están diseñadas para
// vivir en el navegador (la seguridad real la da RLS en la base, no
// esconder esto). Viven en .env igual que el resto de la config para tener
// todo en un solo lugar, pero se sirven así en vez de hardcodearlas en el
// HTML para no tener que editar el HTML cada vez que cambian.
app.get('/api/config', (req, res) => {
  res.json({ supabaseUrl: SUPABASE_URL, supabaseAnonKey: SUPABASE_ANON_KEY, vapidPublicKey: VAPID_PUBLIC_KEY });
});

// Exige un JWT de Supabase válido en Authorization: Bearer <token>. Usa
// supabaseAdmin (service role) para validar el token porque ya existe en
// este archivo y evita crear un segundo cliente solo para esto -- validar
// un token ajeno con la service role es seguro, lo único que hace es
// confirmar de quién es. Deja el id del usuario en req.userId para que la
// ruta y el rate limiter lo usen. Protege los endpoints que llaman a la API
// de Claude (fichas/simulacro/explicar/resumen/corregir-resumen) -- antes
// eran POST públicos, cualquiera con la URL podía gastar la API key del
// server sin pasar por la app ni tener cuenta.
async function requireAuth(req, res, next) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Falta configurar Supabase en el server.' });
  }
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'No autenticado. Iniciá sesión de nuevo.' });
  }
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Sesión inválida o vencida. Iniciá sesión de nuevo.' });
    }
    req.userId = data.user.id;
    next();
  } catch (e) {
    console.error('Error validando token en requireAuth', e);
    return res.status(401).json({ error: 'No se pudo validar la sesión. Iniciá sesión de nuevo.' });
  }
}

// Límite simple por usuario (no por IP -- varios estudiantes reales pueden
// compartir red de facultad) para los endpoints que llaman a Claude --
// ventana fija de 1 hora, tope conservador. En memoria del proceso: alcanza
// para una sola instancia (Render free tier hoy). Si esto pasa a correr en
// más de una instancia, hay que mover el contador a Supabase o similar.
const LIMITE_IA_POR_HORA = 20;
const usoIAPorUsuario = new Map(); // userId -> [timestamps de la última hora]

function rateLimitIA(req, res, next) {
  const ahora = Date.now();
  const unaHora = 60 * 60 * 1000;
  const historial = (usoIAPorUsuario.get(req.userId) || []).filter(t => ahora - t < unaHora);
  if (historial.length >= LIMITE_IA_POR_HORA) {
    return res.status(429).json({ error: 'Llegaste al límite de usos de IA por hora. Probá de nuevo en un rato.' });
  }
  historial.push(ahora);
  usoIAPorUsuario.set(req.userId, historial);
  next();
}

// Modelos que soportan la variante 20260209 de la tool de búsqueda web (con
// filtrado dinámico). Los demás -- incluido Haiku -- necesitan la variante
// básica 20250305; pedirles la nueva devuelve error.
const MODELOS_BUSQUEDA_DINAMICA = new Set([
  'claude-opus-5', 'claude-opus-4-8', 'claude-opus-4-7', 'claude-opus-4-6',
  'claude-sonnet-5', 'claude-sonnet-4-6',
]);
function toolBusquedaWebPara(modelo) {
  const tipo = MODELOS_BUSQUEDA_DINAMICA.has(modelo) ? 'web_search_20260209' : 'web_search_20250305';
  return { type: tipo, name: 'web_search', max_uses: 3 };
}

async function llamarClaude(prompt, maxTokens, tools, modelo) {
  const body = { model: modelo || MODEL, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] };
  if (tools) body.tools = tools;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const errBody = await r.text();
    console.error('Anthropic API error', r.status, errBody);
    const err = new Error('La API de Claude devolvió un error. Revisá la consola del server.');
    err.status = 502;
    throw err;
  }
  const data = await r.json();
  const bloquesTexto = (data.content || []).filter(b => b.type === 'text');
  if (!tools) return bloquesTexto.map(b => b.text || '').join('');
  // Con la tool de búsqueda web, Claude puede escribir comentarios de texto
  // ENTRE rondas de búsqueda (ej. "voy a buscar..."), no solo al final -- si
  // concatenáramos todos los bloques de texto, esos comentarios podrían
  // confundir la extracción del JSON final. La respuesta real (con el JSON)
  // es el ÚLTIMO bloque de texto, así que solo se usa ese.
  return bloquesTexto.length ? (bloquesTexto[bloquesTexto.length - 1].text || '') : '';
}

const MAX_CHARS_APUNTE = 18000; // recorte para no mandar prompts gigantes -- alcanza sobra para un apunte de una clase/capítulo

// Extrae el texto de un archivo subido (PDF o .docx) para usarlo como
// contenido base de un prompt. Compartida entre /api/fichas (apunte propio
// del estudiante) y /api/resumen.
async function extraerTextoArchivo(file) {
  const nombre = file.originalname || '';
  const ext = nombre.split('.').pop().toLowerCase();
  if (ext === 'doc') {
    const err = new Error('El formato .doc (Word viejo) no está soportado -- guardalo como .docx o PDF y volvé a subirlo.');
    err.status = 400;
    throw err;
  }
  if (ext !== 'pdf' && ext !== 'docx') {
    const err = new Error('Formato no soportado. Subí un PDF o un Word (.docx).');
    err.status = 400;
    throw err;
  }
  let texto = '';
  try {
    if (ext === 'pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      await parser.destroy();
      texto = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      texto = result.value;
    }
  } catch (e) {
    console.error('Error extrayendo texto', e);
    const err = new Error('No se pudo leer el archivo -- ¿está corrupto o protegido con contraseña?');
    err.status = 400;
    throw err;
  }
  texto = (texto || '').trim();
  if (!texto) {
    const err = new Error('No encontramos texto en el archivo (¿es un escaneo/imagen sin texto seleccionable?).');
    err.status = 400;
    throw err;
  }
  return texto.slice(0, MAX_CHARS_APUNTE);
}

// Extrae el primer bloque JSON válido de la respuesta -- Claude a veces
// agrega texto alrededor a pesar de que se le pide que no lo haga.
function extraerJSON(texto) {
  const match = texto.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// Igual que extraerJSON pero para un objeto {...} en vez de un array --
// usada por /api/explicar (Preguntame sobre esto), que devuelve una
// pregunta/evaluación suelta, no una lista.
function extraerJSONObjeto(texto) {
  const match = texto.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// La IA, al armar el JSON de opción múltiple, tiende a poner la respuesta
// correcta casi siempre en las primeras posiciones (el propio ejemplo del
// prompt muestra "correcta": 0, y eso la ancla) -- nunca o casi nunca en la
// última opción. Un estudiante que se da cuenta puede usar ese patrón para
// descartar la última opción sin saber la respuesta real. En vez de confiar
// en que la IA randomice bien (los LLM son malos para eso), mezclamos las
// opciones acá con Fisher-Yates cada vez que se sirven fichas -- tanto recién
// generadas como desde la cache compartida -- así la posición de la correcta
// queda uniformemente distribuida sin importar el sesgo del modelo.
function mezclarOpcionesMultiple(fichas) {
  return fichas.map(f => {
    if (!Array.isArray(f.opciones)) return f;
    const correctaValor = f.opciones[Number(f.correcta)];
    const opciones = [...f.opciones];
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    return { ...f, opciones, correcta: opciones.indexOf(correctaValor) };
  });
}

app.post('/api/fichas', requireAuth, rateLimitIA, upload.single('archivo'), async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  const { tema, materiaNombre, carrera, libro, seccion, tipo, cantidad } = req.body || {};
  if (!tema) return res.status(400).json({ error: 'Falta el tema.' });
  const conBusqueda = req.body.conBusqueda === 'true';

  let apuntePropio = '';
  if (req.file) {
    try {
      apuntePropio = await extraerTextoArchivo(req.file);
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  }

  const esMultiple = tipo === 'multiple';
  const n = Math.max(4, Math.min(30, parseInt(cantidad, 10) || 15)); // clamp defensivo -- el front ya limita a 6-30
  const tipoCache = esMultiple ? 'multiple' : 'normal';

  // Cache compartida entre TODOS los estudiantes -- si alguien ya pidió
  // exactamente este tema/tipo/cantidad/con-búsqueda, se sirve esa copia sin
  // gastar un solo token de la API key. Nunca se cachea (ni se lee la cache)
  // cuando hay un apunte propio subido, porque ese contenido es único de esa
  // persona.
  if (!apuntePropio && supabaseAdmin) {
    try {
      const { data: cacheada, error: errCache } = await supabaseAdmin
        .from('fichas_cache')
        .select('fichas')
        .eq('tema', tema)
        .eq('tipo', tipoCache)
        .eq('cantidad', n)
        .eq('con_busqueda', conBusqueda)
        .maybeSingle();
      if (errCache) console.error('Error leyendo fichas_cache (sigue sin cache)', errCache);
      if (cacheada) {
        const fichasServidas = esMultiple ? mezclarOpcionesMultiple(cacheada.fichas) : cacheada.fichas;
        return res.json({ fichas: fichasServidas, cache: true });
      }
    } catch (e) {
      console.error('Error leyendo fichas_cache (sigue sin cache)', e);
    }
  }

  // Si el estudiante subió su propio apunte, las fichas se anclan a ESE
  // contenido en vez de la bibliografía genérica de cátedra -- así quedan
  // fieles a lo que está estudiando de verdad.
  const contextoBiblio = apuntePropio
    ? `El estudiante subió su propio apunte sobre este tema -- basate PRINCIPALMENTE en el contenido de ese apunte (no en un libro genérico) para armar las preguntas y respuestas. Apunte del estudiante:\n"""\n${apuntePropio}\n"""`
    : libro
      ? `La referencia de cátedra para este tema es "${libro}"${seccion ? `, sección "${seccion}"` : ''}. Basate en el contenido estándar de esa fuente.`
      : 'No hay una referencia bibliográfica específica cargada -- usá el contenido estándar de la materia.';

  const consigna = esMultiple
    ? `Generá ${n} preguntas de opción múltiple sobre este tema, de nivel de examen de grado -- ni trivial ni de sub-especialidad. Cada una con 4 opciones (una correcta, tres distractores plausibles pero incorrectos, no absurdos). No repitas la misma pregunta de dos formas distintas.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
[{"pregunta": "...", "opciones": ["...", "...", "...", "..."], "correcta": 0}, ...]
Donde "correcta" es el índice (0 a 3, como NÚMERO, nunca como string entre comillas) de la opción correcta dentro de "opciones".`
    : `Generá ${n} fichas de estudio (pregunta y respuesta) tipo flashcard sobre este tema, de nivel de examen de grado -- ni trivial ni de sub-especialidad. Las respuestas deben ser concisas (2-4 líneas) y precisas. No repitas la misma pregunta de dos formas distintas.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
[{"pregunta": "...", "respuesta": "..."}, ...]`;

  const busquedaParciales = conBusqueda
    ? `\n\nAntes de armar las fichas, buscá en internet parciales o exámenes anteriores reales de "${materiaNombre || tema}" (o de la materia equivalente) en la Universidad de la República (UDELAR). Usalos SOLO para calibrar el estilo, el nivel de dificultad y el tipo de pregunta que se toma habitualmente en esta materia -- nunca para copiar textualmente una pregunta de un examen real.`
    : '';

  const prompt = `Sos un tutor para un estudiante de la carrera de ${carrera || 'grado'} (UDELAR) que está repasando el tema "${tema}" de la materia "${materiaNombre || ''}".
${contextoBiblio}${busquedaParciales}

${consigna}`;

  try {
    const texto = await llamarClaude(
      prompt,
      Math.max(3000, n * 220 + 1500),
      conBusqueda ? [toolBusquedaWebPara(FICHAS_MODEL)] : undefined,
      FICHAS_MODEL,
    );
    const fichas = extraerJSON(texto);
    if (!fichas) {
      console.error('Respuesta sin JSON reconocible:', texto);
      return res.status(502).json({ error: 'No se pudo interpretar la respuesta de la IA. Probá de nuevo.' });
    }
    res.json({ fichas: esMultiple ? mezclarOpcionesMultiple(fichas) : fichas });
    // Guardar en la cache DESPUÉS de responder -- el estudiante no tiene que
    // esperar a que termine de escribirse. Se guarda el original SIN mezclar
    // (mezclarOpcionesMultiple ya corre de nuevo en cada lectura de la cache,
    // así cada estudiante ve un orden distinto). Igual que la lectura, nunca
    // se guarda contenido generado a partir de un apunte propio.
    if (!apuntePropio && supabaseAdmin) {
      supabaseAdmin.from('fichas_cache').upsert({
        tema, materia_nombre: materiaNombre || null, tipo: tipoCache, cantidad: n, con_busqueda: conBusqueda, fichas,
      }, { onConflict: 'tema,tipo,cantidad,con_busqueda' }).then(({ error }) => {
        if (error) console.error('Error guardando fichas_cache', error);
      }).catch(e => console.error('Error guardando fichas_cache', e));
    }
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Error de conexión con la API de Claude.' });
  }
});

// Simulacro de examen completo: a diferencia de /api/fichas (un tema puntual)
// o del modo "test" de /api/explicar (5 preguntas de un tema), acá se arma un
// examen mezclado de TODA la materia -- se le manda la lista completa de
// temas del catálogo y se le pide que reparta las preguntas entre varios,
// etiquetando cada una con el tema exacto al que corresponde para que el
// front pueda armar el desglose de "temas flojos" al final.
//
// Si el estudiante sube un parcial real anterior, ESE es el ancla principal
// (estilo, formato, nivel de dificultad, y qué temas priorizar) en vez de
// inventar todo desde el catálogo -- sin un parcial real de referencia, un
// simulacro "genérico" no se diferencia mucho de simplemente pedir más
// fichas de varios temas.
app.post('/api/simulacro', requireAuth, rateLimitIA, upload.single('archivo'), async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  const { materiaNombre, carrera, cantidad } = req.body || {};
  let temas;
  try {
    temas = JSON.parse(req.body.temas || '[]');
  } catch (e) {
    return res.status(400).json({ error: 'Lista de temas inválida.' });
  }
  if (!materiaNombre) return res.status(400).json({ error: 'Falta la materia.' });
  if (!Array.isArray(temas) || !temas.length) return res.status(400).json({ error: 'Faltan los temas de la materia.' });
  const n = Math.max(10, Math.min(30, parseInt(cantidad, 10) || 20));

  let parcialTexto = '';
  if (req.file) {
    try {
      parcialTexto = await extraerTextoArchivo(req.file);
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  }

  const consignaParcial = parcialTexto
    ? `El estudiante subió un PARCIAL REAL anterior de esta materia -- usalo como referencia PRINCIPAL de estilo, formato de pregunta, nivel de dificultad y qué temas priorizar (los que aparecen en el parcial real reflejan lo que la cátedra realmente toma). Generá preguntas NUEVAS que imiten ese estilo -- nunca copies una pregunta del parcial tal cual. Completá con otros temas de la lista del programa si hace falta llegar a la cantidad pedida.

Parcial real de referencia:
"""
${parcialTexto}
"""`
    : 'Elegí una mezcla representativa de temas de la lista, no te concentres en pocos.';

  const prompt = `Sos un profesor armando un simulacro de examen final para un estudiante de ${carrera || 'grado'} (UDELAR) sobre la materia "${materiaNombre}".

Estos son los temas del programa (lista completa del catálogo, no necesariamente los que toma cada examen puntual):
${temas.map(t => `- ${t}`).join('\n')}

${consignaParcial}

Generá ${n} preguntas de opción múltiple de nivel de examen final de grado (ni trivial ni de sub-especialidad), repartidas entre varios temas distintos (no repitas el mismo tema más de 2-3 veces si se puede evitar). Cada pregunta con 4 opciones (una correcta, tres distractores plausibles pero incorrectos, no absurdos). No repitas la misma pregunta de dos formas distintas.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
[{"pregunta": "...", "opciones": ["...", "...", "...", "..."], "correcta": 0, "tema": "..."}, ...]
Donde "correcta" es el índice (0 a 3, como NÚMERO, nunca como string entre comillas) de la opción correcta, y "tema" es EXACTAMENTE uno de los nombres de tema de la lista de arriba (copiado tal cual, sin modificarlo, incluso si el estilo viene del parcial subido).`;

  try {
    const texto = await llamarClaude(prompt, Math.max(4500, n * 260 + 2000), undefined, FICHAS_MODEL);
    const preguntas = extraerJSON(texto);
    if (!preguntas) {
      console.error('Respuesta sin JSON reconocible (simulacro):', texto);
      return res.status(502).json({ error: 'No se pudo interpretar la respuesta de la IA. Probá de nuevo.' });
    }
    res.json({ preguntas: mezclarOpcionesMultiple(preguntas) });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Error de conexión con la API de Claude.' });
  }
});

// "Explícamelo" -- tutor de IA dentro de Estudiar (ver
// Especificacion_Al_Dia_modificaciones_v2.docx, punto 4). Un solo endpoint
// para los 4 modos, distinguidos por `modo` en el body:
//   simple / examen  -> devuelve { texto } con la explicación.
//   preguntas        -> sin `historial`, devuelve la primera pregunta
//                       ({ pregunta }); con `historial` (rondas previas
//                       {pregunta, respuesta}), evalúa la última respuesta y
//                       genera la siguiente ({ estado, explicacion,
//                       siguientePregunta }).
//   test             -> devuelve { preguntas: [...] } en el mismo formato de
//                       opción múltiple que ya usan las fichas (reutiliza
//                       mezclarOpcionesMultiple para no sesgar la posición
//                       de la correcta).
// Usa JSON normal (no multipart) -- a diferencia de fichas/resumen, acá no
// hay archivo que subir.
app.post('/api/explicar', requireAuth, rateLimitIA, async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  const { tema, modo, carrera, materiaNombre, historial } = req.body || {};
  if (!tema) return res.status(400).json({ error: 'Falta el tema.' });
  if (!['simple', 'examen', 'preguntas', 'test'].includes(modo)) {
    return res.status(400).json({ error: 'Modo inválido.' });
  }

  // Nunca se inventa carrera/materia si no hay dato real cargado -- ver
  // punto 4.6 del documento ("no inventar datos académicos que el sistema
  // no tenga").
  const contextoAcademico = carrera
    ? `Es un estudiante de ${carrera}${materiaNombre ? `, cursando la materia "${materiaNombre}"` : ''}.`
    : 'No se conoce su carrera ni materia -- no inventes ese dato, adaptá el nivel a un estudiante universitario en general.';

  try {
    if (modo === 'simple' || modo === 'examen') {
      const consigna = modo === 'simple'
        ? 'Dale una explicación clara y simple, evitando tecnicismos innecesarios, como si recién estuviera empezando a ver el tema. Si ayuda a entenderlo, usá un ejemplo o una analogía.'
        : 'Dale una explicación completa, con el nivel de detalle que debería dominar para una evaluación de grado: mecanismos, clasificaciones, matices y datos que suelen tomarse en examen.';
      const prompt = `Sos el tutor de IA de Al Día, una app de estudio para universitarios. ${contextoAcademico}
El estudiante te escribió porque no entiende: "${tema}"

${consigna}

Respondé en español rioplatense, con tono cercano de tutor (no de chat genérico ni acartonado). Organizá la respuesta en párrafos cortos separados por un salto de línea en blanco; si necesitás enumerar algo, usá líneas que empiecen con "- ". No uses markdown de ningún otro tipo (nada de "#", "**", etc).`;
      const texto = await llamarClaude(prompt, 1200, undefined, FICHAS_MODEL);
      return res.json({ texto: texto.trim() });
    }

    if (modo === 'preguntas') {
      if (!historial || !historial.length) {
        const prompt = `Sos el tutor de IA de Al Día. ${contextoAcademico}
Le vas a hacer preguntas progresivas al estudiante sobre el tema "${tema}" para evaluar si lo entiende (empezando simple y subiendo la dificultad de a poco según cómo responda).

Hacé SOLO la primera pregunta, básica. Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después: {"pregunta": "..."}`;
        const texto = await llamarClaude(prompt, 300, undefined, FICHAS_MODEL);
        const data = extraerJSONObjeto(texto);
        if (!data || !data.pregunta) {
          console.error('Respuesta sin JSON reconocible (explicar/preguntas, primera):', texto);
          return res.status(502).json({ error: 'No se pudo generar la pregunta. Probá de nuevo.' });
        }
        return res.json({ pregunta: data.pregunta });
      }
      const historialTexto = historial
        .map((h, i) => `Pregunta ${i + 1}: ${h.pregunta}\nRespuesta del estudiante: ${h.respuesta}`)
        .join('\n\n');
      const prompt = `Sos el tutor de IA de Al Día. ${contextoAcademico}
Estás evaluando al estudiante sobre el tema "${tema}" con preguntas progresivas. Así fue la conversación hasta ahora:

${historialTexto}

Evaluá la ÚLTIMA respuesta del estudiante (¿fue correcta, parcialmente correcta o incorrecta?) con una explicación breve de por qué, y generá la SIGUIENTE pregunta -- un poco más difícil si venía respondiendo bien, o reforzando el mismo punto de otra forma si no.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después: {"estado": "correcta", "explicacion": "...", "siguientePregunta": "..."}
Donde "estado" es exactamente una de estas tres palabras: "correcta", "parcial" o "incorrecta".`;
      const texto = await llamarClaude(prompt, 500, undefined, FICHAS_MODEL);
      const data = extraerJSONObjeto(texto);
      if (!data || !data.siguientePregunta) {
        console.error('Respuesta sin JSON reconocible (explicar/preguntas, siguiente):', texto);
        return res.status(502).json({ error: 'No se pudo interpretar la respuesta de la IA. Probá de nuevo.' });
      }
      return res.json(data);
    }

    // modo === 'test'
    const prompt = `Sos el tutor de IA de Al Día. ${contextoAcademico}
Armá una mini evaluación de 5 preguntas de opción múltiple sobre el tema "${tema}", nivel universitario, para comprobar si el estudiante lo entendió de verdad. Cada una con 4 opciones (una correcta, tres distractores plausibles pero incorrectos, no absurdos).

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
[{"pregunta": "...", "opciones": ["...", "...", "...", "..."], "correcta": 0}, ...]
Donde "correcta" es el índice (0 a 3, como NÚMERO, nunca como string entre comillas) de la opción correcta dentro de "opciones".`;
    const texto = await llamarClaude(prompt, 2200, undefined, FICHAS_MODEL);
    const preguntas = extraerJSON(texto);
    if (!preguntas) {
      console.error('Respuesta sin JSON reconocible (explicar/test):', texto);
      return res.status(502).json({ error: 'No se pudo interpretar la respuesta de la IA. Probá de nuevo.' });
    }
    res.json({ preguntas: mezclarOpcionesMultiple(preguntas) });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Error de conexión con la API de Claude.' });
  }
});

app.post('/api/resumen', requireAuth, rateLimitIA, upload.single('archivo'), async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  if (!req.file) return res.status(400).json({ error: 'Falta el archivo.' });

  let texto;
  try {
    texto = await extraerTextoArchivo(req.file);
  } catch (e) {
    return res.status(e.status || 400).json({ error: e.message });
  }

  const prompt = `Sos un tutor universitario para un estudiante de grado (UDELAR). Te paso el contenido de un apunte para que se lo resuma para estudiar.

Armá un resumen de estudio organizado en secciones cortas (una línea "## Título de la sección" por cada una, sin usar "#" simple) con los puntos clave en viñetas (líneas que empiecen con "- "). Priorizá definiciones, mecanismos, clasificaciones y datos que suelen tomarse en un examen de grado. Sintetizá, no copies el texto textual. No uses negrita con asteriscos ni ningún otro formato markdown más allá de "##" y "-".

Contenido del apunte:
"""
${texto}
"""`;

  let resumen;
  try {
    resumen = await llamarClaude(prompt, 1800);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || 'Error de conexión con la API de Claude.' });
  }

  // A partir de acá la respuesta ya no es JSON -- es el PDF mismo, para que
  // el navegador lo descargue directo en vez de mostrarlo en la pantalla.
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];
  doc.on('data', c => chunks.push(c));
  doc.on('end', () => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resumen-al-dia.pdf"');
    res.send(Buffer.concat(chunks));
  });

  doc.fontSize(17).font('Helvetica-Bold').fillColor('#2b4152').text('Resumen de apuntes — Al Día', { align: 'left' });
  doc.moveDown();
  const lineasResumen = resumen.split('\n').map(l => l.trim()).filter(Boolean);
  lineasResumen.forEach(line => {
    const headerMatch = line.match(/^#{1,3}\s+(.*)/);
    const limpia = (s) => s.replace(/\*\*/g, '');
    if (headerMatch) {
      doc.moveDown(0.6).fontSize(13).font('Helvetica-Bold').fillColor('#2b4152').text(limpia(headerMatch[1]));
    } else if (line.startsWith('- ')) {
      doc.fontSize(11).font('Helvetica').fillColor('#000000').text(`•  ${limpia(line.slice(2))}`, { indent: 15 });
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#000000').text(limpia(line));
    }
  });
  doc.end();
});

// Corregir mi resumen: a diferencia de /api/resumen (resume un apunte de
// cátedra que subís), acá lo que sube el estudiante es SU PROPIO resumen ya
// hecho -- la IA lo compara contra la referencia bibliográfica real del tema
// (mismo libro/sección que usa /api/fichas) y devuelve qué cubre bien, qué le
// falta y qué tiene mal. Responde JSON (no PDF) porque es feedback para
// reaccionar en el momento, no algo para guardar y leer después.
app.post('/api/corregir-resumen', requireAuth, rateLimitIA, upload.single('archivo'), async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  const { tema, materiaNombre, carrera, libro, seccion } = req.body || {};
  if (!tema) return res.status(400).json({ error: 'Falta el tema.' });
  if (!req.file) return res.status(400).json({ error: 'Falta el archivo con tu resumen.' });

  let texto;
  try {
    texto = await extraerTextoArchivo(req.file);
  } catch (e) {
    return res.status(e.status || 400).json({ error: e.message });
  }

  const contextoBiblio = libro
    ? `La referencia de cátedra para este tema es "${libro}"${seccion ? `, sección "${seccion}"` : ''}. Usala como base de lo que el estudiante debería saber.`
    : 'No hay una referencia bibliográfica específica cargada -- usá el contenido estándar de la materia como base.';

  const prompt = `Sos un tutor universitario para un estudiante de ${carrera || 'grado'} (UDELAR) que está repasando el tema "${tema}"${materiaNombre ? ` de la materia "${materiaNombre}"` : ''}.
${contextoBiblio}

El estudiante subió SU PROPIO resumen de estudio sobre este tema (lo que escribió mientras estudiaba, no un apunte de cátedra). Comparalo contra lo que debería saber según la referencia de arriba y evaluá qué tan completo y correcto está.

Resumen del estudiante:
"""
${texto}
"""

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
{"cobertura": 72, "bien": ["...", "..."], "faltantes": ["...", "..."], "errores": ["...", "..."]}
Donde:
- "cobertura" es un número entero de 0 a 100 que estima qué porcentaje del tema cubre bien el resumen.
- "bien" es una lista corta (máximo 6) de los puntos clave que el resumen cubre correctamente.
- "faltantes" es una lista (máximo 6) de puntos importantes del tema que el resumen NO menciona.
- "errores" es una lista de afirmaciones incorrectas o imprecisas que sí aparecen en el resumen (lista vacía si no encontrás ninguna).`;

  try {
    const respuesta = await llamarClaude(prompt, 1800, undefined, FICHAS_MODEL);
    const data = extraerJSONObjeto(respuesta);
    if (!data) {
      console.error('Respuesta sin JSON reconocible (corregir-resumen):', respuesta);
      return res.status(502).json({ error: 'No se pudo interpretar la respuesta de la IA. Probá de nuevo.' });
    }
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Error de conexión con la API de Claude.' });
  }
});

// ---- Recordatorio diario (push real) ----
// El cliente gestiona su PROPIA suscripción directo contra Supabase (anon
// key + RLS, misma fila que auth.uid()) -- no hace falta un endpoint acá
// para eso. Lo único que necesita el server es: 1) publicar la clave
// pública VAPID (ya en /api/config) y 2) este endpoint, que un cron EXTERNO
// dispara cada 15 min para mandar los push reales -- necesita leer
// push_subscriptions y app_state de TODOS los usuarios, por eso usa
// supabaseAdmin (service role) en vez del cliente normal.

function fechaHoyMontevideo() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function horaAhoraMontevideo() {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Montevideo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
}

// Redondea "HH:MM" hacia abajo al escalón de 15 min más cercano, para
// comparar la hora elegida por el usuario contra la hora actual sin
// depender de que el cron externo pegue justo al minuto exacto.
function bucket15(hhmm) {
  const [h, m] = String(hhmm || '00:00').split(':').map(Number);
  const flooredM = m - (m % 15);
  return `${String(h).padStart(2, '0')}:${String(flooredM).padStart(2, '0')}`;
}

// Reimplementación server-side de pendingCountGlobal() del front (mismo
// criterio: temas de exámenes en curso con calendario armado que no están
// "firme"). Vive acá porque el server no tiene acceso al estado en memoria
// del navegador -- solo a la foto guardada en app_state.
function pendingCountFromEstado(estado) {
  const examenes = (estado && estado.examenes) || [];
  const hoy = fechaHoyMontevideo();
  let n = 0;
  examenes.forEach((e) => {
    const rendido = e.ejemplo || e.rendidaManual || (e.fecha && e.fecha < hoy);
    if (rendido) return;
    if (!(e.selected && e.selected.length && e.selectedPace)) return;
    const states = e.states || {};
    n += e.selected.filter((t) => states[t] !== 'firme').length;
  });
  return n;
}

app.post('/api/push/send-reminders', async (req, res) => {
  if (!PUSH_CRON_SECRET) return res.status(500).json({ error: 'Falta configurar PUSH_CRON_SECRET en el .env del server.' });
  const secret = req.get('x-cron-secret') || req.query.secret;
  if (secret !== PUSH_CRON_SECRET) return res.status(401).json({ error: 'No autorizado.' });
  if (!supabaseAdmin) return res.status(500).json({ error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el .env del server.' });
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return res.status(500).json({ error: 'Faltan las claves VAPID en el .env del server.' });

  const hoy = fechaHoyMontevideo();
  const bucketAhora = bucket15(horaAhoraMontevideo());
  // ?forzar=1 -- para probar a mano con curl sin esperar el bucket de 15
  // min ni el límite de "una vez por día". Igual exige el secreto del cron.
  const forzar = req.query.forzar === '1';

  try {
    let query = supabaseAdmin.from('push_subscriptions').select('*').eq('activo', true);
    if (!forzar) query = query.or(`ultimo_envio.is.null,ultimo_envio.neq.${hoy}`);
    const { data: subs, error } = await query;
    if (error) throw error;

    const candidatas = forzar ? (subs || []) : (subs || []).filter((s) => bucket15(s.hora) === bucketAhora);
    if (!candidatas.length) return res.json({ enviados: 0, revisadas: 0 });

    // Una sola consulta de app_state por usuario único entre las candidatas
    // -- evita pedir el mismo estado varias veces si alguien tiene la app
    // instalada en más de un dispositivo.
    const userIds = [...new Set(candidatas.map((s) => s.user_id))];
    const { data: estados, error: errEstados } = await supabaseAdmin
      .from('app_state')
      .select('user_id, estado')
      .in('user_id', userIds);
    if (errEstados) throw errEstados;
    const estadoPorUsuario = new Map((estados || []).map((r) => [r.user_id, r.estado]));

    let enviados = 0;
    for (const sub of candidatas) {
      const n = pendingCountFromEstado(estadoPorUsuario.get(sub.user_id));
      const mensaje = n > 0
        ? `Te quedan ${n} tema${n > 1 ? 's' : ''} para repasar hoy. No dejes que se acumulen.`
        : 'Estás al día con todo. ¡Seguí así!';
      try {
        await webpush.sendNotification(sub.subscription, JSON.stringify({ titulo: '📚 Al Día', mensaje }));
        enviados++;
        await supabaseAdmin.from('push_subscriptions').update({ ultimo_envio: hoy }).eq('id', sub.id);
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          // Suscripción vencida/inválida (el usuario desinstaló, borró
          // datos del navegador, etc.) -- se limpia sola en vez de
          // reintentar para siempre.
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
        } else {
          console.error('Error mandando push', sub.id, e.statusCode, e.body);
        }
      }
    }
    res.json({ enviados, revisadas: candidatas.length });
  } catch (e) {
    console.error('Error en send-reminders', e);
    res.status(500).json({ error: 'Error inesperado disparando recordatorios.' });
  }
});

// Multer tira sus propios errores (ej. archivo muy pesado) antes de llegar
// a la ruta -- este handler los convierte a JSON como el resto de la API.
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'El archivo es muy pesado (máximo 15MB).' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error inesperado en el server.' });
});

app.listen(PORT, () => console.log(`Al Día corriendo en http://localhost:${PORT}/mockup-firme.html`));
