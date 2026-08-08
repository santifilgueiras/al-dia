require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 5173;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
// En memoria, nunca se escribe a disco -- el archivo solo vive lo que dura
// el request.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.use(express.json());

// Servir SOLO lo que la app necesita en público -- antes era
// express.static(__dirname), que exponía la carpeta entera (schema SQL,
// HANDOFF.md, scripts de build, package.json...) por HTTP. Una vez
// desplegado en un dominio real eso queda accesible para cualquiera, así
// que se restringe a una lista explícita de archivos/carpetas públicas.
app.get('/', (req, res) => res.redirect('/mockup-firme.html'));
app.get('/mockup-firme.html', (req, res) => res.sendFile(path.join(__dirname, 'mockup-firme.html')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, 'sw.js')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
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
  res.json({ supabaseUrl: SUPABASE_URL, supabaseAnonKey: SUPABASE_ANON_KEY });
});

async function llamarClaude(prompt, maxTokens) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) {
    const errBody = await r.text();
    console.error('Anthropic API error', r.status, errBody);
    const err = new Error('La API de Claude devolvió un error. Revisá la consola del server.');
    err.status = 502;
    throw err;
  }
  const data = await r.json();
  return (data.content || []).map(b => b.text || '').join('');
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

app.post('/api/fichas', async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  const { tema, materiaNombre, libro, seccion, tipo, cantidad } = req.body || {};
  if (!tema) return res.status(400).json({ error: 'Falta el tema.' });

  const esMultiple = tipo === 'multiple';
  const n = Math.max(4, Math.min(30, parseInt(cantidad, 10) || 15)); // clamp defensivo -- el front ya limita a 6-30

  const contextoBiblio = libro
    ? `La referencia de cátedra para este tema es "${libro}"${seccion ? `, sección "${seccion}"` : ''}. Basate en el contenido estándar de esa fuente.`
    : 'No hay una referencia bibliográfica específica cargada -- usá el contenido estándar de la materia.';

  const consigna = esMultiple
    ? `Generá ${n} preguntas de opción múltiple sobre este tema, de nivel de examen de grado -- ni trivial ni de sub-especialidad. Cada una con 4 opciones (una correcta, tres distractores plausibles pero incorrectos, no absurdos). No repitas la misma pregunta de dos formas distintas.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
[{"pregunta": "...", "opciones": ["...", "...", "...", "..."], "correcta": 0}, ...]
Donde "correcta" es el índice (0 a 3, como NÚMERO, nunca como string entre comillas) de la opción correcta dentro de "opciones".`
    : `Generá ${n} fichas de estudio (pregunta y respuesta) tipo flashcard sobre este tema, de nivel de examen de grado -- ni trivial ni de sub-especialidad. Las respuestas deben ser concisas (2-4 líneas), precisas y clínicamente correctas. No repitas la misma pregunta de dos formas distintas.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
[{"pregunta": "...", "respuesta": "..."}, ...]`;

  const prompt = `Sos un tutor de medicina para un estudiante de la carrera de Doctor en Medicina (UDELAR) que está repasando el tema "${tema}" de la materia "${materiaNombre || ''}".
${contextoBiblio}

${consigna}`;

  try {
    const texto = await llamarClaude(prompt, Math.max(1500, n * 220));
    const fichas = extraerJSON(texto);
    if (!fichas) {
      console.error('Respuesta sin JSON reconocible:', texto);
      return res.status(502).json({ error: 'No se pudo interpretar la respuesta de la IA. Probá de nuevo.' });
    }
    res.json({ fichas });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Error de conexión con la API de Claude.' });
  }
});

const MAX_CHARS_APUNTE = 18000; // recorte para no mandar prompts gigantes -- alcanza sobra para un apunte de una clase/capítulo

app.post('/api/resumen', upload.single('archivo'), async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en el archivo .env del server (ver .env.example).' });
  }
  if (!req.file) return res.status(400).json({ error: 'Falta el archivo.' });

  const nombre = req.file.originalname || '';
  const ext = nombre.split('.').pop().toLowerCase();

  let texto = '';
  try {
    if (ext === 'pdf') {
      const parser = new PDFParse({ data: req.file.buffer });
      const data = await parser.getText();
      await parser.destroy();
      texto = data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      texto = result.value;
    } else if (ext === 'doc') {
      return res.status(400).json({ error: 'El formato .doc (Word viejo) no está soportado -- guardalo como .docx o PDF y volvé a subirlo.' });
    } else {
      return res.status(400).json({ error: 'Formato no soportado. Subí un PDF o un Word (.docx).' });
    }
  } catch (e) {
    console.error('Error extrayendo texto', e);
    return res.status(400).json({ error: 'No se pudo leer el archivo -- ¿está corrupto o protegido con contraseña?' });
  }

  texto = (texto || '').trim();
  if (!texto) {
    return res.status(400).json({ error: 'No encontramos texto en el archivo (¿es un escaneo/imagen sin texto seleccionable?).' });
  }
  texto = texto.slice(0, MAX_CHARS_APUNTE);

  const prompt = `Sos un tutor de medicina para un estudiante de la carrera de Doctor en Medicina (UDELAR). Te paso el contenido de un apunte para que se lo resuma para estudiar.

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
