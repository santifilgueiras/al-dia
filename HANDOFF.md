# Al Día — Documento de traspaso

Este documento resume todo lo trabajado en una sesión de Cowork con Claude, para que se pueda continuar el desarrollo en Claude Code sin perder contexto. Incluye la idea de producto, las decisiones tomadas (y por qué), la investigación hecha, la especificación funcional del mockup actual, y lo que falta.

Todos los archivos mencionados están en la misma carpeta que este documento.

---

## 1. Qué es "Al Día"

Una app/web para organizar el estudio de estudiantes de medicina, empezando por Uruguay (UDELAR). Le decís qué temas tenés que estudiar y para cuándo es el examen, y arma un calendario día por día con repaso espaciado — no solo un cronograma de "primera vuelta", sino que programa cuándo volver a repasar cada tema para que no se olvide, y lleva un registro de qué temas tenés firmes, cuáles flojos y cuáles ni viste todavía.

**Origen de la idea:** nace de un problema real y puntual (la novia del usuario, 5to año de Medicina en UDELAR) — tiene muchos temas que estudiar, lee mucho, y aun así siente que "no sabe nada" porque no hay estructura de repaso, solo lectura lineal.

## 2. El problema real que resuelve

La sensación de "estudio mucho y siento que no sé nada" casi siempre no es un problema de conocimiento sino de que la información se lee una vez y no se vuelve a activar (sin repaso espaciado se olvida, aunque en su momento se haya entendido bien). La solución no es leer más: es (a) programar cuándo volver a cada tema, y (b) llevar un registro objetivo de qué está firme y qué no, para que la ansiedad se convierta en una lista concreta y manejable.

## 3. Investigación de mercado hecha

- **UDELAR, Clínica Médica (UC 19), programa oficial 2022** (PDF público de la Facultad de Medicina): se extrajo el listado completo de objetivos por módulo (~500 objetivos en 15 módulos) y se destiló en un catálogo de 64 temas usables — ver `catalogo-clinica-medica-udelar.json`. También se confirmó el formato real de evaluación: parciales de 30 preguntas de opción múltiple, 60% para aprobar, y "encuentros clínicos" orales.
- **Competencia identificada:**
  - **Memodi** (app en español, gratis con compras integradas): repetición espaciada + active recall, pero con contenido genérico fijo (~750 temas de "toda la medicina"), no personalizado a lo que está dando cada cátedra. Esa es la diferenciación clave de Al Día: el estudiante (o la cátedra) carga sus propios temas y fecha de examen, no un banco de contenido genérico.
  - **iDoctus**: más referencia clínica que herramienta de estudio.
  - **AMBOSS** (~428 USD/año) y **UWorld** (~320 USD/año): pensados para el USMLE de EEUU, carísimos e inaccesibles para un estudiante uruguayo, no alineados a ningún currículum local.
- **Conclusión de mercado:** el hueco real no es el contenido médico (ahí la competencia ya tiene ventaja), sino la personalización al plan de estudio real de cada estudiante — nadie hace eso hoy en español/LatAm.

## 4. Decisiones de producto (y el porqué)

- **Gratis al principio.** No hay costo de infraestructura significativo (texto/JSON, nada de IA cara corriendo todo el tiempo), así que se puede sostener gratis mientras se construye adopción. Monetización futura: bancos de preguntas compartidos, generación de práctica con IA — no ahora.
- **Catálogo + temas propios, no uno u otro.** El estudiante puede elegir temas de un catálogo pre-cargado (curado a partir de programas oficiales) O escribir los suyos a mano. Los propios se buscan en Google Books al no tener referencia oficial.
- **Beachhead: UDELAR Clínica Médica, 5to año**, con el catálogo real ya cargado (ver sección 6). Expandir materia por materia, facultad por facultad después.
- **El catálogo se mantiene curado a mano al principio** (digitalizando programas oficiales), recién más adelante se evalúa abrir a que la comunidad sume materias (con moderación).
- **Nombre:** se evaluaron "Firme" (conecta con el lenguaje nuevo/flojo/firme ya usado en toda la app), "Lo Tenés", "Rendí", "Racha", "Al Día". El usuario eligió tono **"cercano y motivador"** (no clínico/corporativo) y decidió arrancar con **"Al Día"** (queda abierto a cambiarlo más adelante — dijo explícitamente "ponele Al Día por ahora, después vemos").
- **Referencias bibliográficas sin infringir copyright.** La bibliografía real de la cátedra es: Harrison (Principios de Medicina Interna), Farreras-Rozman (Medicina Interna), Goodman & Gilman (Bases Farmacológicas de la Terapéutica), Florez (Farmacología Humana). El usuario pidió explícitamente poder linkear directo a los libros descargados/piratas — **se rechazó esa parte a propósito**: no se debe linkear ni alojar copias de libros con copyright. La solución implementada es buscar en Google Books (previews legítimas) combinando el libro que mejor cubre cada tema + el nombre del tema, y se sugirió verificar acceso institucional legítimo (AccessMedicine para Goodman & Gilman, ClinicalKey para Farreras-Rozman, ambos con cuenta de biblioteca universitaria). **Si se retoma este punto, mantener esta política: nunca linkear a descargas piratas de libros con copyright, ni alojar su contenido.**

## 5. Especificación funcional del mockup actual

Archivo: **`mockup-firme.html`** (nombre de archivo desactualizado, el nombre in-app ya es "Al Día"). Es un prototipo clickeable de una sola página (HTML/CSS/JS vanilla, sin dependencias), pensado para validar el flujo con usuarios reales antes de construir la app de verdad. No persiste nada — al recargar la página se pierde todo el estado. Es responsive: en pantallas angostas se ve como un teléfono, en pantallas anchas (`@media min-width: 860px`) se ve como una página web normal.

### Pantallas actuales (data-screen="N")

0. **Bienvenida** — logo, nombre, tagline, botón "Empezar". *(El usuario pidió rediseñar esta pantalla de inicio con logo + texto explicativo + menú de navegación — quedó pendiente, ver sección 7.)*
1. **Elegir materia** — por ahora solo Clínica Médica UDELAR está cargada.
2. **Elegir temas** — un único flujo (sin tabs): acordeón por módulo con checkboxes del catálogo, y debajo una sección "Tus temas" con input + botón "+ Agregar" para temas propios, que aparecen en la misma lista al agregarlos.
3. **Configurar** — en este orden:
   - **Orden de estudio**: lista de temas seleccionados con flechas ▲▼ para reordenar. Por defecto se ordenan siguiendo la secuencia del programa oficial (módulo por módulo), temas propios al final.
   - **Fecha del examen**.
   - **Ritmo** (temas en paralelo, tope máximo): pastillas calculadas dinámicamente desde el mínimo necesario hasta +2, más una opción "Otro" con input numérico libre. Importante: este número es un **techo de tolerancia**, no una orden — el algoritmo de generación usa siempre el mínimo necesario real, nunca fuerza paralelismo innecesario.
   - Botón "Generar calendario" (cambia a "Actualizar calendario" si ya había un plan generado).
4. **Calendario** — vista día por día de los próximos días, con conteo firme/flojo/nuevo arriba, y link "Ajustar ritmo" que vuelve a la pantalla 3 sin perder el progreso ya marcado.
5. **Detalle de tema** — al tocar un tema: 3 botones (Todavía no lo vi / Me costó (flojo) / Lo tengo firme), y una tarjeta de referencia bibliográfica (libro + sección + botón de búsqueda en Google Books).
6. **Resumen** — conteo firme/flojo/nuevo, próximo repaso, mensaje explícito de que "sentir que no sabés nada es normal cuando hay temas sin repasar — lo que importa es el número de firmes", y un CTA a repasar cuando corresponde.
7. **Repaso** — cola de temas que todavía no están firmes. Se habilita (muestra contenido) recién cuando el estudiante ya vio TODOS los temas seleccionados al menos una vez (antes de eso, muestra cuántos le faltan por ver). Cada fila tiene su propia lupa de referencia.

Navegación inferior (bottom-nav) con 4 pestañas: Calendario / Repaso (con badge de cantidad pendiente) / Resumen / Materias.

### Algoritmo de generación del calendario (el corazón del producto)

Implementado en la función `generarCalendario()` dentro del `<script>` del HTML. Lógica en dos fases:

**Fase 1 — estudio inicial, con "carriles":**
- Cada tema tiene una **duración estimada** en días enteros (1-3), en el objeto `DURACIONES` — por ahora son estimaciones a ojo del propio Claude, calibradas con cuánto contenido tiene cada tema en el programa real. **Pendiente real:** si se le pasa a Claude el material que usan los estudiantes (apuntes, capítulos), puede reemplazar esto por una estimación basada en contenido real en vez de una estimación a ojo.
- Se calcula el ritmo mínimo necesario: `minPace = ceil(sum(duraciones) / diasUtiles)`, donde `diasUtiles = días hasta el examen - 1` (el último día se reserva para repaso final).
- Se usan `carriles` (lanes) = `minPace` (nunca el techo elegido por el usuario si es mayor — ver bug #3 abajo). Cada carril es "la próxima fecha libre para arrancar un tema nuevo". Los temas se asignan al carril que se libera antes, y **un tema, una vez asignado, ocupa su carril entero y seguido** — nunca se corta a la mitad para arrancar otro y volver después (el usuario fue explícito: los estudiantes prefieren terminar un tema antes de empezar el siguiente).

**Fase 2 — repaso espaciado, recién después de que TODOS los temas tuvieron su primera vuelta:**
- Se calcula `finFase1` = la fecha en que se libera el último carril (el tema que termina más tarde).
- Recién desde ahí se agenda el primer repaso de cada tema (a los +2 días de `finFase1`, con un pequeño *stagger* por índice de tema para no amontonar todos los repasos el mismo día), y de ahí en más con intervalos crecientes (+5, +10, +20 días) mientras entren antes del examen.
- **A propósito, no se agenda ningún repaso durante la Fase 1** — el usuario fue explícito en que mezclar repaso con temas nuevos sin ver todavía no tiene sentido.
- El día antes del examen queda reservado para un "REPASO FINAL" que agrupa todo lo que no llegó a estar firme.

### Marcado de progreso y cola de repaso

- Cada tema tiene `status`: `nuevo` / `flojo` / `firme`, y un flag `touched` (true solo si fue marcado flojo o firme alguna vez — "todavía no lo vi" no cuenta como touched).
- `allSeen()` = todos los temas seleccionados están `touched`. Recién ahí se habilita de verdad la pantalla de Repaso (antes, muestra cuántos faltan).
- Al reajustar el ritmo (`Ajustar ritmo` → regenerar calendario), se preserva el `states`/`touched` existente para los temas que sigan seleccionados — no se resetea el progreso.

## 6. Archivos incluidos en esta carpeta

- **`mockup-firme.html`** — el prototipo clickeable descripto arriba. Es el artefacto más importante para portar a una app real.
- **`catalogo-clinica-medica-udelar.json`** — catálogo completo real: 64 temas en 15 módulos (Cardiovascular, Respiratorio, Nefrourología, Gastroenterología, Endocrinología, Hematología, Infectología, Neurología, Autoinmunes, Reumatología, Oncología, Psiquiatría, Psicología médica, Medicina legal, Bioética), destilado de los objetivos oficiales de UDELAR. El mockup HTML solo usa un subconjunto de 4 módulos / 19 temas (hardcodeados en el JS, variable `CATALOGO`) para que la demo sea liviana — al construir la app real, usar este JSON completo como fuente de datos en vez del array hardcodeado.
- **`plan-estudio-espaciado/`** (carpeta) y **`plan-estudio-espaciado.skill`** — una skill de Claude (no parte de la app) creada antes del mockup, que hace lo mismo conceptualmente pero como asistente conversacional en vez de UI: arma un cronograma con repaso espaciado y mantiene un archivo de seguimiento JSON por materia. Incluye:
  - `SKILL.md` — las instrucciones de la skill.
  - `scripts/build_plan.py` — el script Python que calcula fechas de repaso (versión temprana del mismo algoritmo de repaso espaciado, sin la parte de "carriles"/duración variable que sí tiene el mockup HTML — si se retoma esta skill, valdría la pena portarle las mejoras del mockup).
  - `evals/` — casos de prueba usados para validar la skill.
- **`plan-estudio-espaciado-workspace/`** — resultados de las pruebas con y sin la skill (benchmark, no es parte del producto).

## 7. Bugs encontrados y corregidos durante el desarrollo (contexto útil, no repetir)

1. **Streak fantasma en `build_plan.py`** (la skill, no el mockup HTML): el script incrementaba la racha de un tema "firme" cada vez que se corría el script, aunque el estudiante no lo hubiera repasado ese día realmente. Se corrigió para que la racha solo avance si `last_reviewed == hoy`.
2. **Referencia bibliográfica confusa:** primero se linkeaba al PDF del programa oficial de UDELAR (que es un listado de objetivos, no un libro de texto) a la página donde arranca el módulo entero — resultaba en aterrizar en una página con demasiados objetivos sin relación clara al tema puntual. Se reemplazó por Google Books buscando en la bibliografía real (Harrison, Farreras-Rozman, etc.), nunca linkeando a copias del libro completo.
3. **Ritmo tratado como obligación en vez de techo:** al principio, si el usuario elegía "2 temas en paralelo", el algoritmo SIEMPRE usaba 2 carriles, aunque con 1 solo alcanzara de sobra para llegar a tiempo — resultaba en temas mostrados en paralelo sin necesidad. Se corrigió: el algoritmo siempre calcula y usa el mínimo de carriles matemáticamente necesario (`calcularRitmo().minPace`), el valor elegido por el usuario queda como techo informativo/de tolerancia, no como parámetro real de scheduling.
4. **Repasos mezclados con la primera vuelta:** originalmente cada tema agendaba su propio primer repaso a los +2 días de terminar SU bloque individual, lo que mezclaba repasos con temas nuevos que otros temas del plan todavía no habían visto. Se corrigió separando en dos fases explícitas (ver sección 5) — ningún repaso se agenda hasta que todos los temas tuvieron su primera vuelta.

## 8. Pendiente / próximos pasos

En orden de lo último que se estaba pidiendo cuando se cortó la sesión:

1. **Rediseño de la pantalla de inicio + navegación.** El usuario pidió explícitamente: al entrar a la app/web, un logo arriba, texto explicando para qué sirve, y un menú de navegación (no el bottom-nav actual que solo aparece después de generar un calendario). Mencionó una sección "Calendario" y una sección "Materias" — con una subsección de **"materias rendidas"** (historial de exámenes ya dados). Este punto quedó cortado a mitad de mensaje, vale la pena volver a preguntar el detalle exacto antes de construirlo.
2. **Soporte para más de un examen en paralelo.** Pedido explícito, pospuesto a propósito varias veces por ser un cambio de modelo de datos más grande (un tema deja de pertenecer a "la" materia y pasa a pertenecer a una de varias, cada una con su propia fecha). Se sugirió: colores o páginas distintas por materia/examen, y un calendario combinado que reparta los días entre ambos exámenes según urgencia. No implementado todavía, ni siquiera diseñado en detalle.
3. **"Materias rendidas" (historial) necesita persistencia real.** Es la señal de que el mockup HTML sin backend ya no alcanza — se puede simular la pantalla con datos de ejemplo hardcodeados para definir el diseño, pero la funcionalidad real requiere guardar datos entre sesiones (backend + base de datos, o como mínimo localStorage/cuenta de usuario).
4. **Sistema de diseño visual.** Se definió tono ("cercano y motivador", no clínico/corporativo) y nombre provisorio ("Al Día", el usuario dijo que lo puede cambiar después). Falta: paleta de colores concreta, tipografía, iconografía, y aplicar eso de forma consistente a todas las pantallas (el mockup actual usa una paleta azul genérica, no definida a propósito para el tono elegido).
5. **Estimación real de duración por tema.** Hoy `DURACIONES` en el mockup son estimaciones a ojo. El usuario ofreció pasar el material real que usan los estudiantes (apuntes, capítulos) para que Claude analice cuánto contenido tiene cada tema y calcule una duración más real.
6. **Catálogo completo.** Cargar los 64 temas / 15 módulos reales (`catalogo-clinica-medica-udelar.json`) en vez del subconjunto de 19 temas hardcodeado en el HTML.
7. **Decisión de stack técnico:** todavía no se decidió si esto se construye como web app (recomendado — más simple, el usuario mismo pidió explícitamente que funcione en compu como web en vez de una app de escritorio separada), qué backend/base de datos, y si habrá cuentas de usuario.

## 9. Nota sobre cómo seguir

El usuario (Santiago) está construyendo esto con y para su novia (estudiante real de 5to año de Medicina, UDELAR), como validación de una idea de negocio real, no solo un ejercicio. El tono de trabajo hasta acá fue: proponer, mostrar un mockup clickeable, el usuario lo prueba y da feedback puntual y concreto (a veces con capturas de pantalla), iterar. Vale la pena mantener ese mismo ritmo de iteración rápida en Claude Code en vez de intentar construir todo de una sin volver a mostrar avances.
