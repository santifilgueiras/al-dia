# Handoff: Al Día — rediseño de la app de repaso espaciado

## Overview
Rediseño completo de "Al Día", app web (PWA) de repaso espaciado para estudiantes de la UdelaR. Cubre la landing, la pantalla Hoy, Repaso, Materias, Estudiar, Fichas, Resumen de apuntes, el flujo de alta de materia (4 pasos) y la versión mobile.

## About the Design Files
El archivo `Al Dia - Rediseno.dc.html` de este bundle es una **referencia de diseño hecha en HTML** — un prototipo que muestra el aspecto y el comportamiento buscados, NO código de producción para copiar tal cual.

La tarea es **recrear estos diseños dentro del entorno ya existente del codebase de Al Día** (repo: ver github.md), usando sus patrones, componentes y librerías actuales. Si alguna pantalla no tiene equivalente en el código, implementarla con las mismas convenciones que el resto de la app.

El HTML del prototipo usa estilos inline y clases utilitarias propias del entorno de diseño; ignorar esa estructura y quedarse con los **valores** (colores, tipografías, espaciados, jerarquía, copy).

## Fidelity
**Alta fidelidad.** Colores, tipografías, tamaños y espaciados son definitivos. Recrear la UI de forma fiel al pixel, con los componentes del codebase.

## Cómo está organizado el prototipo
El archivo es un lienzo con **turnos** (secciones), del más nuevo al más viejo. Cada opción tiene un id visible que sirve como referencia:

| id | Pantalla |
|----|----------|
| 6a | Alta de materia — pasos 1 y 2 (carrera / materia) |
| 6b | Alta de materia — pasos 3 y 4 (temas / fecha y orden) |
| 5a | Fichas (flashcards) |
| 5b | Resumen de apuntes |
| 5c | Mobile — Hoy, Repaso, Ficha |
| 4a | Repaso |
| 4b | Materias |
| 4c | Estudiar |
| 3a | Landing |
| 2a | Hoy (versión final) |
| 1a / 1b / 1c | Exploraciones iniciales de Hoy — **descartadas**, solo contexto |

Implementar **2a, 3a, 4a, 4b, 4c, 5a, 5b, 5c, 6a, 6b**. El turno 1 es histórico.

## Design Tokens

### Colores
| Token | Hex | Uso |
|---|---|---|
| `--ink` | #14201d | Texto principal, sidebar, fondos oscuros |
| `--teal` | #0f766e | Primario: botones, acentos, estado "firme" |
| `--teal-hover` | #0b5a54 | Hover de botón primario |
| `--teal-light` | #7fe6d0 | Texto de item activo en sidebar oscuro |
| `--teal-tint` | rgba(15,118,110,.08–.16) | Fondos de selección / item activo |
| `--amber` | #e0a33c | Estado "flojo", racha, badges de atención |
| `--amber-deep` | #b8811f / #b45309 / #8a5a08 | Texto sobre fondo ámbar claro |
| `--paper` | #faf9f6 | Fondo de app |
| `--paper-2` | #f4f2ec | Fondo de panel secundario |
| `--surface` | #ffffff | Cards |
| Bordes | rgba(0,0,0,.07) · .09 · .10 · .13 · .15 | Sutil → definido |
| Texto secundario | rgba(0,0,0,.55) | Subtítulos |
| Texto terciario | rgba(0,0,0,.38–.45) | Meta, "sin ver" |

Regla: **teal = progreso/acción**, **ámbar = atención/racha**, nunca al revés. Sin gradientes salvo la máscara de fade de listas.

### Tipografía
- **Public Sans** — toda la UI. Pesos 400 / 500 / 600 / 700.
- **IBM Plex Mono** — solo números, fechas, etiquetas en mayúscula y métricas. Pesos 500 / 600 / 700.

Escala usada:
| Rol | Valor |
|---|---|
| H1 de pantalla | 700 26–27px / 1.15, Public Sans |
| Título de card | 700 15.5px / 1.25 |
| Cuerpo | 400 13.5–14px / 1.5 |
| Botón | 600 12–13.5px |
| Nav item | 400/600 13.5px |
| Meta mono | 500 11–12.5px, IBM Plex Mono |
| Etiqueta mono | 600/700 10–11.5px, letter-spacing .06–.1em, MAYÚSCULAS |

### Espaciado / forma
- Padding de contenido: 30–34px vertical, 34–38px horizontal.
- Gap entre bloques: 20px; dentro de una card: 13px; entre filas de lista: 5–6px.
- Radios: 7–8px (botones, filas), 9px (inputs, cards chicas), 11px (cards de materia), 20px (chips/pills).
- Sombra de card: `0 1px 3px rgba(0,0,0,.05)`; fila arrastrada: `0 6px 16px rgba(0,0,0,.1)`.
- Barras de progreso: alto 7px, radio 4px, track `rgba(0,0,0,.07)`, segmentos teal (firme) + ámbar (flojo).
- Sidebar: 196px fijo, fondo #14201d, items con radio 7px y margen lateral 10px.

## Pantallas

### Hoy (2a)
Punto de entrada. Sidebar + columna de contenido.
- Header: H1 "Hoy" + fecha en mono.
- **Bloque de foco único**: la materia prioritaria con cuenta de días al examen, barra de progreso con % y CTA primario. Es el único elemento con fondo teal-tint — nada más compite con él.
- **Repaso**: cuántas tarjetas vencen hoy, agrupadas, con CTA.
- **Esta semana**: fila de 7 días con marca de actividad.
- **Racha**: al pie del sidebar, 🔥 con animación `flame` (1.5s ease-in-out infinite, transform-origin 50% 85%) + número en mono + "DÍAS SEGUIDOS".

### Repaso (4a)
Agrupado por **urgencia**, no una lista plana: "Atrasadas", "Hoy", "Próximas". Cada grupo con encabezado mono en mayúsculas y línea divisoria. Filas con materia, tema y cuántas tarjetas.

### Materias (4b)
Grid de 3 columnas, gap 14px. Cada card muestra el estado en la superficie: badge PRIORITARIA (teal) o PRIORIZAR (outline, clickable), nombre, fecha + "en N días", conteo de temas, % firme, barra segmentada teal/ámbar, y el desglose "N firmes / N flojos / N sin ver" en mono. Acciones: "Ver temas" (primario solo en la prioritaria) y "Rendida". Abajo, sección RENDIDAS con chips 🎓.

### Estudiar (4c)
Tres herramientas en **pestañas**, no acordeón. Pestaña activa con fondo teal-tint y texto teal.

### Fichas (5a)
Una tarjeta por vez, centrada, el foco en la pregunta. Progreso de la sesión arriba, botones de autoevaluación abajo.

### Resumen de apuntes (5b)
Dropzone real (borde dasheado) y el resultado queda **atado al tema**, no suelto.

### Mobile (5c)
Tres pantallas (Hoy, Repaso, Ficha) con barra de navegación inferior. Objetivos táctiles ≥44px.

### Alta de materia — 4 pasos (6a, 6b)
Indicador de paso: etiqueta "PASO N DE 4" en mono teal + 4 barritas de 22×3px (llenas = teal, vacías = rgba(0,0,0,.12)).

1. **Carrera** — select de Facultad + buscador y lista de carreras. Al elegir carrera queda cargado el plan de estudios.
2. **Materia** — chips de filtro por semestre + lista con checkbox, cada item con "SEM N · N temas en el programa". Multi-selección. Escape: "¿No está en la lista? Agregarla a mano".
3. **Temas** — los temas del programa vienen pre-cargados y pre-tildados; el usuario **destilda** lo que no entra (tachado + opacidad reducida). Alternativa: "Pegar mi lista". Contador al pie "15 de 16 temas elegidos".
4. **Fecha y orden** — date picker; debajo, feedback inmediato en mono teal: "en 121 días · ~8 min de repaso por día". Lista de temas reordenable por drag (handle ⠿, índice en mono, la fila arrastrada con borde dasheado teal, rotación -.6deg y sombra elevada). CTA "Crear el plan de repaso" + "Atrás".

## Interacciones
- Hover de botón primario: `#0f766e` → `#0b5a54`.
- Hover de botón/fila secundaria: `border-color: #0f766e; color: #0f766e`.
- Drag & drop en el paso 4: al levantar una fila, borde dasheado teal, `transform: rotate(-.6deg)`, sombra `0 6px 16px rgba(0,0,0,.1)`, cursor `grabbing`.
- Racha: keyframes `flame` con leve escala/rotación, 1.5s infinite.
- Listas largas: máscara de fade al pie en lugar de scrollbar visible, y una línea "+ N temas más".

## Estado necesario
- Alta de materia: `facultad`, `carrera`, `materiasSeleccionadas[]`, `temasSeleccionados[]`, `ordenTemas[]`, `fechaExamen` → al confirmar, generar el plan de repaso espaciado.
- Materias: `prioritaria` (una sola), estado por tema (`firme` | `flojo` | `sinVer`), `rendida`.
- Repaso: cola de tarjetas por vencimiento (atrasadas / hoy / próximas).

## Contenido de ejemplo
Los datos del prototipo son de Ingeniería en Computación (FING, UdelaR): Programación 2, Matemática Discreta 2, Geometría y Álgebra Lineal 2, Cálculo en Varias Variables. Los temas de Programación 2 (Modularización y TAD, punteros, listas, pilas y colas, ABB, AVL, hashing, orden de tiempo) son reales — sirven de semilla para el plan de estudios precargado.

## Assets
- `icons/icon-192.png` — ícono de la PWA, tomado del repo. Es el logo del sidebar (22×22, radio 6px).
- Los íconos de navegación son emoji (📅 🔁 📚 📊 📖 🔥 🎓), tal como en la app original.
- Fuentes desde Google Fonts: Public Sans, IBM Plex Mono.

## Screenshots
En `screenshots/` hay una captura por pantalla, con el mismo id que la tabla de arriba:

| Archivo | Pantalla |
|---|---|
| `2a-hoy.png` | Hoy |
| `3a-landing.png` | Landing |
| `4a-repaso.png` | Repaso |
| `4b-materias.png` | Materias |
| `4c-estudiar.png` | Estudiar |
| `5a-fichas.png` | Fichas |
| `5b-resumen-apuntes.png` | Resumen de apuntes |
| `5c-mobile.png` | Mobile (Hoy, Repaso, Ficha) |
| `6a-alta-pasos-1-2.png` | Alta de materia — pasos 1 y 2 |
| `6b-alta-pasos-3-4.png` | Alta de materia — pasos 3 y 4 |

Las capturas son la referencia visual; los valores exactos están en este README y en el HTML.

## Files
- `Al Dia - Rediseno.dc.html` — el prototipo completo, todos los turnos.
- `github.md` — repo y rama de origen.
