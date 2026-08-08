// Genera los íconos de la PWA a partir de un SVG vectorial (mismo gradiente
// que el logo del mockup: #6fc3e0 -> #58c896) -- un libro abierto simple en
// vez de un emoji, para que se vea nítido en cualquier tamaño sin depender
// de qué fuentes de emoji tenga el sistema que la rasteriza. Antes era una
// cruz médica; se cambió a este glifo neutral de "estudio" al agregar
// Psicología como segunda facultad (ver HANDOFF-psicologia.md, Parte D).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GRAD_DEFS = `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6fc3e0"/>
      <stop offset="100%" stop-color="#58c896"/>
    </linearGradient>`;

// El libro es un único path cerrado: arranca en el centro-arriba (la
// "encuadernación"), baja por el borde izquierdo, cruza por el centro-abajo
// (el otro lado de la encuadernación) y sube por el borde derecho -- dos
// páginas abiertas en forma de ala, sin necesitar más de una forma.
const BOOK_PATH = 'M256 178 C 214 152 152 148 108 170 L 108 344 C 152 322 214 326 256 352 C 298 326 360 322 404 344 L 404 170 C 360 148 298 152 256 178 Z';

// Ícono normal: fondo redondeado, el libro ocupa casi todo -- para
// apple-touch-icon e íconos "any" (iOS ya recorta las esquinas solo).
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${GRAD_DEFS}</defs>
  <rect width="512" height="512" rx="115" fill="url(#grad)"/>
  <path d="${BOOK_PATH}" fill="#ffffff"/>
</svg>`.trim();

// Ícono "maskable": el fondo llega hasta el borde (sin esquinas redondeadas
// propias, el sistema operativo aplica su propia máscara -- círculo, squircle,
// etc.) y el libro se achica y centra dentro de la "safe zone" para que no
// quede cortado al recortar.
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${GRAD_DEFS}</defs>
  <rect width="512" height="512" fill="url(#grad)"/>
  <g transform="translate(256,256) scale(0.6) translate(-256,-256)">
    <path d="${BOOK_PATH}" fill="#ffffff"/>
  </g>
</svg>`.trim();

// sharp/libvips no puede escribir directo en outputs/icons en esta máquina
// (algo del lado de Windows lo bloquea con "unable to open for write" --
// un fs.writeFileSync normal a la misma carpeta SÍ funciona, así que
// generamos en el scratchpad con sharp y después copiamos con fs plano.
const scratchDir = 'C:\\Users\\Usuario\\AppData\\Local\\Temp\\claude\\C--Users-Usuario\\3396db7f-4a8c-4754-9f76-e207e080df1c\\scratchpad';
const outDir = path.join(__dirname, 'icons');
fs.writeFileSync(path.join(outDir, 'icon.svg'), svgIcon);

const targets = [
  { file: 'icon-192.png', size: 192, svg: svgIcon },
  { file: 'icon-512.png', size: 512, svg: svgIcon },
  { file: 'apple-touch-icon.png', size: 180, svg: svgIcon }, // iOS Home Screen quiere PNG, no SVG
  { file: 'maskable-512.png', size: 512, svg: svgMaskable },
];

(async () => {
  for (const t of targets) {
    const scratchPath = path.join(scratchDir, t.file);
    await sharp(Buffer.from(t.svg))
      .resize(t.size, t.size)
      .png()
      .toFile(scratchPath);
    fs.copyFileSync(scratchPath, path.join(outDir, t.file));
    fs.unlinkSync(scratchPath);
    console.log('Generado', t.file);
  }
})();
