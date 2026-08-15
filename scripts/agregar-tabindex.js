// Agrega tabindex="0" role="button" justo antes de "onclick=" en las líneas
// indicadas -- los elementos clickeables que no son <button> nativos
// (tabs, tarjetas de tema/materia, fichas con flip, etc.) quedan alcanzables
// por teclado. Se excluyen a propósito los overlays de fondo de modal (que
// cierran al tocar afuera, no son "botones" reales -- Escape es la forma
// convencional de cerrarlos, no Tab+Enter sobre un div de pantalla completa).
const fs = require('fs');
const path = require('path');
const HTML_PATH = path.join(__dirname, '..', 'mockup-firme.html');

const LINEAS = [
  2146, 2147, 2148, 2149, 2150, 2151, 2159, 2160, 2161, 2207, 2208,
  3007, 3012, 3836, 3882, 4229, 4261, 4377, 4394, 4484, 4491, 4501,
  4548, 4775, 5320, 5392, 5393, 6229,
];

const lineas = fs.readFileSync(HTML_PATH, 'utf8').split('\n');
let cambiadas = 0;
for (const n of LINEAS) {
  const idx = n - 1;
  const original = lineas[idx];
  if (!original.includes(' onclick=')) {
    throw new Error(`Línea ${n} no tiene " onclick=" -- revisar a mano:\n${original}`);
  }
  if (original.includes('tabindex="0" role="button"')) {
    console.log(`Línea ${n} ya tiene tabindex -- se salta.`);
    continue;
  }
  lineas[idx] = original.replace(' onclick=', ' tabindex="0" role="button" onclick=');
  cambiadas++;
}
fs.writeFileSync(HTML_PATH, lineas.join('\n'), 'utf8');
console.log(`Listo: ${cambiadas} líneas actualizadas.`);
