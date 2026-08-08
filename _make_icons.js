// Genera los íconos de la PWA a partir de un SVG vectorial (mismo gradiente
// que el logo del mockup: #6fc3e0 -> #58c896) -- un cruz médica simple en
// vez de un emoji, para que se vea nítida en cualquier tamaño sin depender
// de qué fuentes de emoji tenga el sistema que la rasteriza.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GRAD_DEFS = `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6fc3e0"/>
      <stop offset="100%" stop-color="#58c896"/>
    </linearGradient>`;

// Ícono normal: fondo redondeado, la cruz ocupa casi todo -- para
// apple-touch-icon e íconos "any" (iOS ya recorta las esquinas solo).
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${GRAD_DEFS}</defs>
  <rect width="512" height="512" rx="115" fill="url(#grad)"/>
  <rect x="216" y="120" width="80" height="272" rx="26" fill="#ffffff"/>
  <rect x="120" y="216" width="272" height="80" rx="26" fill="#ffffff"/>
</svg>`.trim();

// Ícono "maskable": el fondo llega hasta el borde (sin esquinas redondeadas
// propias, el sistema operativo aplica su propia máscara -- círculo, squircle,
// etc.) y la cruz se achica y centra dentro de la "safe zone" para que no
// quede cortada al recortar.
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${GRAD_DEFS}</defs>
  <rect width="512" height="512" fill="url(#grad)"/>
  <g transform="translate(256,256) scale(0.6) translate(-256,-256)">
    <rect x="216" y="120" width="80" height="272" rx="26" fill="#ffffff"/>
    <rect x="120" y="216" width="272" height="80" rx="26" fill="#ffffff"/>
  </g>
</svg>`.trim();

// sharp/libvips no puede escribir directo en outputs/icons en esta máquina
// (algo del lado de Windows lo bloquea con "unable to open for write" --
// un fs.writeFileSync normal a la misma carpeta SÍ funciona, así que
// generamos en el scratchpad con sharp y después copiamos con fs plano.
const scratchDir = 'C:\\Users\\Usuario\\AppData\\Local\\Temp\\claude\\C--Users-Usuario\\0c47ce00-b2f4-46e2-b2ba-70042d4ecc8f\\scratchpad';
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
