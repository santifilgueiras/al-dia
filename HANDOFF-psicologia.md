# Al Día — Traspaso: soporte multi-facultad (arrancando por Psicología) + rebranding de íconos

Este documento es un anexo de `HANDOFF.md` (léelo primero si no lo hiciste — tiene el contexto completo del producto, las decisiones de diseño y el algoritmo de calendario). Acá se detalla un pedido puntual de Santiago hecho en una sesión de Cowork: agregar la Facultad de Psicología (UDELAR) como segunda facultad de la app, generalizando el flujo para que en el futuro se puedan sumar más facultades sin reescribir nada — y además rebrandear los íconos de la app, que hoy son 100% de temática médica, a algo genérico de "estudio".

No se tocó código en esta sesión de Cowork — este documento es la especificación para que Claude Code lo implemente.

## 1. Qué pidió Santiago (alcance de este trabajo)

1. Agregar la Facultad de Psicología, con **todos sus años/semestres, materias, y temas de cada una** — mismo nivel de detalle que ya existe para Medicina.
2. El flujo debe arrancar pidiéndole al usuario **de qué facultad tiene el examen**, y de ahí en adelante todo sigue igual que hoy (elegir año/semestre → elegir materia → elegir temas → configurar ritmo → calendario), aplicado también al calendario, al detalle de tema, al resumen y a la generación de fichas de estudio (pantalla "Estudiar").
3. Cambiar el estilo del ícono de la app (PWA/logo) y de los "íconos de adelante" (pantalla de bienvenida) — hoy son de temática médica (cruz médica, estetoscopio, pastilla, corazón, pulmón, ADN) — por algo relacionado a "estudio" en general, no a medicina.
4. Igual que en Medicina, agregarle íconos a los módulos/temas de las materias de Psicología — mismo tratamiento que ya existe.

## 2. Estado actual del código (lo que hay que generalizar)

Todo esto vive en `mockup-firme.html` salvo que se indique lo contrario. Es un prototipo de una sola página (HTML/CSS/JS vanilla), sin build step — los cambios se hacen directo ahí.

### 2.1 Modelo de datos: hoy es "por año", sin noción de facultad

```js
// línea ~789
const ANIOS = [1, 2, 3, 4, 5, 6, 7];
function anioLabel(n) { ... } // "1º año" ... "7º año (Internado)"

// línea ~802
const CATALOGO_POR_ANIO = {
  1: [ { nombre: "Introducción a la Biología Celular...", contexto: "UDELAR · 1er año", modulos: [...] }, ... ],
  2: [ ... ],
  ...
  7: [ ... ]
};
```

`CATALOGO_POR_ANIO` tiene **25 unidades curriculares de la carrera de Doctor en Medicina** (una sola facultad, hardcodeada). No existe ningún concepto de "facultad" en el modelo — todo asume Medicina.

`MODULO_ICONS` (línea ~1128) es un diccionario plano `nombre de módulo → emoji`, con ~141 entradas, todas de módulos de Medicina.

`TEXTOS` (línea ~1284) es un diccionario plano `nombre de tema → { libro, seccion }` con referencias bibliográficas médicas (Harrison, Farreras-Rozman, Goodman & Gilman, Florez) — solo tiene sentido para Medicina, no aplica a Psicología.

### 2.2 Pantallas (flujo de creación de examen)

- **S1 "Elegir año"** (`data-screen="1"`, línea ~503): título "¿En qué año estás?", lista `#aniosList` poblada por `renderAnios()` (línea ~3837) iterando `ANIOS`.
- **S9 "Elegir materia"** (`data-screen="9"`, línea ~512): título dinámico `#materiaAnioTitle`, lista `#materiasDelAnio` poblada por `renderMateriasDelAnio()` (línea ~3851), que lee `CATALOGO_POR_ANIO[borradorExamen.anio]`.
- `elegirAnio(anio)` (línea ~3845) guarda `borradorExamen.anio` y navega a S9.
- `elegirMateriaCatalogo(idx)` (línea ~3864) guarda `borradorExamen.materiaNombre` y `borradorExamen.modulos` desde el catálogo, y navega a S2 (elegir temas).
- `agregarExamen()` (línea ~3819) es el punto de entrada: crea un `borradorExamen` nuevo y navega a S1. Ojo la línea exacta del objeto inicial:
  ```js
  borradorExamen = { selected: [], ownTemas: [], states: {}, touched: {}, proximoRepaso: {}, intervaloIdx: {}, selectedPace: null, prioridad: false, rendidaManual: false, fechaRendidaLabel: '', materiaNombre: '', fecha: '', usaCatalogo: true, anio: null, modulos: [] };
  ```
  **No tiene campo `facultad`.**

### 2.3 Cada examen guardado (`examenes[]`) tampoco tiene facultad

El objeto de cada examen en curso/rendido (usado en el hub de Exámenes S8, en el calendario combinado S4, en el resumen S6, etc.) tiene `anio` y `materiaNombre`, pero no `facultad`. Todo lo que hoy usa `anioLabel(e.anio)` para mostrar contexto va a necesitar saber también de qué facultad es ese año/semestre, porque **Psicología no se organiza en "años" sino en semestres (1º a 8º), y el label es distinto** ("3er semestre", no "3er año").

### 2.4 Pantalla "Estudiar" (fichas de repaso) — S10, línea ~727

Los tres `<select>` (`fichasAnioSelect`, `fichasMateriaSelect`, `fichasTemaSelect`) se pueblan así:
- `renderFichasSelect()` (línea ~4257): pone `ANIOS` en `fichasAnioSelect`.
- `onFichasAnioChange()` (línea ~4264): lee `CATALOGO_POR_ANIO[anio]` y llena `fichasMateriaSelect`.
- `onFichasMateriaChange()` (línea ~4274): llena `fichasTemaSelect` con los temas de esa materia.

Mismo problema: asume un solo catálogo por año, sin facultad.

### 2.5 `server.js` — prompts de IA hardcodeados a Medicina

- `POST /api/fichas` (línea ~103): el prompt dice literalmente *"Sos un tutor de medicina para un estudiante de la carrera de Doctor en Medicina (UDELAR) que está repasando el tema..."*.
- `POST /api/resumen` (línea ~168): mismo problema, *"Sos un tutor de medicina para un estudiante de la carrera de Doctor en Medicina (UDELAR)..."*.

Ambos necesitan recibir la facultad/carrera como parámetro desde el front y armar el prompt dinámicamente, en vez de tenerlo fijo.

### 2.6 Íconos — hoy 100% temática médica

- **Logo / marca** (pantalla S0, "Bienvenida", línea ~426): `<div class="logo">🩺</div>`, y `<div class="deco-icons">🩺 💊 🫀 🫁 🧬</div>`.
- **Botón principal de inicio** (línea ~432): `💊 Empezar`.
- **PWA / manifest** (`manifest.json`): `name`, `description` dicen *"Organizá tu estudio de medicina..."*.
- **Íconos de la PWA** (`icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `maskable-512.png`, `icon.svg`): generados por `_make_icons.js`, que dibuja una **cruz médica** (dos rectángulos blancos en cruz sobre el gradiente `#6fc3e0 → #58c896`) — ver el SVG `svgIcon`/`svgMaskable` en ese archivo.
- **Ícono de materia hardcodeado**: en `renderMateriasDelAnio()` (línea ~3856), la card de cada materia siempre muestra `🫀 ${m.nombre}` — el corazón está **hardcodeado para TODAS las materias**, sin importar el tema. Esto es un bug/oversight a corregir de paso (no es exclusivo de agregar Psicología: hoy hasta una materia de Neurología muestra un corazón).

## 3. Plan de cambios

### Parte A — Generalizar el modelo de datos a multi-facultad

1. **Restructurar el catálogo** de `CATALOGO_POR_ANIO` (plano) a algo con facultad como primer nivel. Sugerencia de forma (mantener el resto de la app lo más parecido posible para minimizar el diff):

   ```js
   const FACULTADES = {
     medicina: {
       label: "Facultad de Medicina",
       cicloLabel: "año",          // para textos genéricos: "¿En qué {cicloLabel} estás?"
       ciclos: [1,2,3,4,5,6,7],
       ciclos_label: { 1:'1º año', ..., 7:'7º año (Internado)' },
       catalogoPorCiclo: CATALOGO_POR_ANIO,      // el objeto que ya existe, sin tocar sus datos
     },
     psicologia: {
       label: "Facultad de Psicología",
       cicloLabel: "semestre",
       ciclos: [1,2,3,4,5,6,7,8],
       ciclos_label: { 1:'1º semestre', ..., 8:'8º semestre' },
       catalogoPorCiclo: CATALOGO_POR_CICLO_PSICOLOGIA,  // nuevo, ver Parte B
     },
   };
   ```

   Ojo: esto es una sugerencia de forma, no una orden — Claude Code puede elegir otra estructura si preserva mejor el resto del código, pero **el punto no negociable es que "año" deje de estar hardcodeado como unidad de tiempo** (Psicología usa semestres).

2. **Nueva pantalla "Elegir facultad"**, antes de la actual S1. Mismo patrón visual que S1/S9 (lista de `pace-pill` o cards, como en `renderAnios()`/`renderMateriasDelAnio()`). Al elegir, guarda `borradorExamen.facultad` y recién ahí navega a la pantalla de elegir año/semestre (que ahora debe leer `FACULTADES[borradorExamen.facultad]` en vez de las constantes globales `ANIOS`/`CATALOGO_POR_ANIO`).

3. **Actualizar el flujo S1 → S9 → S2** (`renderAnios`, `elegirAnio`, `renderMateriasDelAnio`, `elegirMateriaCatalogo`) para que lean del catálogo de la facultad elegida (`borradorExamen.facultad`), no de las constantes globales. Actualizar también los textos genéricos ("¿En qué año estás?" → "¿En qué {año|semestre} estás?" según la facultad).

4. **Agregar `facultad` al objeto de examen** (`borradorExamen` y cada entrada de `examenes[]`). Usarlo en:
   - El texto de contexto que hoy muestra `m.contexto` (ej. "UDELAR · 5to año") — pasa a incluir la facultad (ej. "UDELAR · Psicología · 3er semestre").
   - Cualquier lugar que hoy llame `anioLabel(e.anio)` directo — tiene que resolver el label correcto según `e.facultad`.
   - El hub de Exámenes (S8) y "materias rendidas", si en algún momento se quiere agrupar/filtrar por facultad (no es obligatorio para el MVP de este cambio, pero dejarlo preparado si es fácil).

5. **Pantalla "Estudiar" (fichas, S10)**: agregar un `<select id="fichasFacultadSelect">` antes de `fichasAnioSelect`, con su propio `onFichasFacultadChange()` que puebla el select de año/semestre según la facultad elegida — misma cascada que ya existe, un nivel más arriba.

6. **`server.js`**: los endpoints `/api/fichas` y `/api/resumen` deben recibir `facultad`/`carrera` (ej. "Licenciatura en Psicología" vs "Doctor en Medicina") desde el body del POST, y usarlo para armar el prompt en vez del texto fijo "estudiante de la carrera de Doctor en Medicina". El front (`generarFichas()`, línea ~4285, y la función de `generarResumen()`) tiene que mandar ese dato en el `fetch`.

### Parte B — Cargar el catálogo de Psicología

Ya está investigado y verificado el plan de estudios vigente (Plan 2013) de la Facultad de Psicología, UDELAR, fuente oficial: https://psico.edu.uy/ensenanza/grado/licenciatura/plan/malla-curricular

Está volcado en **`catalogo-psicologia-udelar.json`** (mismo directorio que este documento), con la misma lógica de fuente que `catalogo-clinica-medica-udelar.json` (que ya usa la app para Medicina). Organizado por semestre (1º a 8º), cada uno con su lista de materias.

**Importante — a diferencia del catálogo de Medicina, acá los "temas" (el contenido dentro de cada materia, lo que se tilda en la pantalla de "Elegir temas") todavía NO está digitalizado.** El catálogo de Medicina se construyó destilando ~500 objetivos oficiales de un PDF público de la Facultad de Medicina (programa de la UC 19) en 64 temas del tamaño en que un estudiante se sienta a estudiar algo de una vez. Para Psicología, ese mismo trabajo está pendiente:

- Cada unidad curricular en `psico.edu.uy` tiene una página propia (ej. https://psico.edu.uy/ensenanza/plan/cursos/1semestre/fundamentos-de-la-psicologicas) con "Objetivos de formación" — pero son 3 a 5 objetivos generales por materia, mucho más generales que los ~500 objetivos puntuales que tenía el programa de Medicina. No alcanza por sí solo para destilar un catálogo de temas de estudio real.
- La fuente más rica probablemente sea el **programa/syllabus real que reparte cada docente** (bibliografía por unidad temática), que no siempre está publicado en la web pública — hay que evaluar si se consigue vía el EVA de la facultad, pidiéndoselo a algún estudiante/docente, o buscando si el SIFP (`sifp.psico.edu.uy`) publica algo más detallado además de las "Guías" (horarios/salones, no contenido).
- El catálogo distingue dos tipos de unidad curricular (campo `"tipo"` en el JSON): **`"contenido"`** (tiene cuerpo de conocimiento propio, candidata real a catálogo de temas — ej. "Psicopatología Clínica de Adultos") y **`"transversal"`** (Idiomas, Cooperación Institucional, Proyectos, Prácticas, Optativas, Referencial de Egreso, Trabajo Final de Grado — son categorías curriculares sin programa de contenido fijo, no tiene sentido armarles un catálogo de temas). Recomendación: no mostrar las `"transversal"` en el selector de materias con catálogo — tratarlas como "materia propia" (el estudiante carga sus propios temas si de verdad quiere estudiar para eso) o directamente excluirlas del selector.

**Mientras no se digitalicen los temas**, cada materia de tipo `"contenido"` debe comportarse en la app igual que hoy se comporta una materia sin catálogo (`usaCatalogo: false` en términos del código actual) — el estudiante entra directo a cargar sus propios temas a mano. Esto es exactamente lo que ya soporta el flujo existente (ver `renderCatalogo()`, línea ~2148: si `modulos.length === 0`, ya muestra el mensaje "no está en nuestro catálogo todavía"). Es decir: **cargar el catálogo de materias de Psicología ya es útil hoy, aunque el catálogo de temas de cada una se complete después, materia por materia.**

Si Santiago quiere, el siguiente paso natural (fuera del alcance de este documento) es repetir el proceso de digitalización que se hizo para Clínica Médica, materia por materia, a medida que consiga los programas reales.

### Parte C — Íconos por módulo/materia para Psicología

1. Igual que `MODULO_ICONS` tiene un emoji por nombre de módulo de Medicina, hay que agregar entradas para los módulos de Psicología a medida que se carguen temas reales (por ahora no hay módulos todavía porque los temas están pendientes — ver Parte B). Cuando se digitalicen temas de una materia y se agrupen en módulos, sumar sus íconos al mismo diccionario (o a uno separado por facultad, si se prefiere prolijidad — cualquiera de las dos formas es razonable).

2. **Corregir el ícono hardcodeado de materia.** Hoy `renderMateriasDelAnio()` (línea ~3856) siempre muestra `🫀 ${m.nombre}` sin importar la materia. Reemplazar por algo dinámico: un ícono por materia (agregar un campo `icono` a cada materia del catálogo, con un fallback genérico tipo 📘 si no está definido) o, más simple, un ícono fijo por facultad (🩺/⚕️ para Medicina, 🧠 para Psicología) hasta que valga la pena afinarlo por materia.

### Parte D — Rebranding de íconos: de "medicina" a "estudio" genérico

Ya no tiene sentido que la marca de la app sea una cruz médica/estetoscopio ahora que hay más de una facultad. Mantener la paleta de marca (gradiente `#6fc3e0 → #58c896`, `theme_color` `#4f9dd6`, `background_color` `#eaf6fb`) pero cambiar el glifo/emoji a algo neutral de "estudio":

1. **`_make_icons.js`**: cambiar el SVG de la cruz (`svgIcon`/`svgMaskable`, dos rectángulos en cruz) por una forma que lea a "estudio" — ideas: un librito abierto simplificado, un birrete de graduación, o un símbolo tipo "cerebro" simplificado en geometría (igual de simple que la cruz actual, para que rasterice bien en cualquier tamaño). Correr el script de nuevo para regenerar `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `maskable-512.png`, `icon.svg` en `icons/`.
2. **Logo y decoración en la pantalla de Bienvenida** (S0, línea ~426): cambiar `<div class="logo">🩺</div>` y `<div class="deco-icons">🩺 💊 🫀 🫁 🧬</div>` por emojis neutrales de estudio — ej. `📚 🧠 🎓 ✏️ 📝` (a definir el set final con Santiago, esto es una sugerencia de punto de partida).
3. **Botón "💊 Empezar"** (línea ~432): cambiar el emoji por algo genérico (ej. `📚 Empezar` o `🚀 Empezar`).
4. **`manifest.json`**: actualizar `description` ("Organizá tu estudio de medicina con un calendario de repaso espaciado." → algo que no mencione medicina, ej. "Organizá tu estudio con un calendario de repaso espaciado.").
5. Revisar si hay más menciones sueltas a "medicina" en textos de UI genéricos (no en nombres de materias/catálogo, esos quedan como están) — buscar `grep -in "medicina" mockup-firme.html manifest.json` después de los cambios de arriba para confirmar que lo que queda son solo nombres propios de materias/facultad, no textos genéricos de marca.

## 4. Decisiones abiertas — confirmar con Santiago antes de dar por terminado

- Set final de emojis/glifo para el rebranding (Parte D) — se dieron sugerencias, no son definitivas.
- Si el ícono de materia (Parte C.2) va por materia individual o por facultad (más simple, menos trabajo).
- Cómo conseguir los programas reales de las materias de Psicología para digitalizar temas (Parte B) — no se puede avanzar ese punto sin una fuente de contenido más rica que lo que hay publicado en `psico.edu.uy`.
- Si además de Psicología conviene ya dejar el modelo de datos (Parte A) preparado con un tercer ejemplo dummy, para forzar que el diseño realmente generalice a N facultades y no solo a 2 hardcodeadas.

## 5. Orden sugerido de trabajo

1. Parte A (generalizar el modelo a multi-facultad) — es el cambio de raíz, todo lo demás depende de esto.
2. Parte B (cargar `catalogo-psicologia-udelar.json` en el nuevo modelo) — para poder probar Parte A con datos reales de una segunda facultad.
3. Parte D (rebranding de íconos) — independiente de A/B, se puede hacer en paralelo si hay más de una persona, o intercalado.
4. Parte C (íconos por módulo/materia) — depende de B (necesita que haya al menos algunos módulos/materias de Psicología cargados para tener qué iconografiar más allá del ícono por defecto).

Como en el resto del proyecto, conviene mostrar avances chicos y concretos (un mockup clickeable, una captura) en vez de construir todo de una — así lo venían trabajando hasta acá.
