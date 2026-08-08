---
name: plan-estudio-espaciado
description: Organiza el estudio de materias con muchos temas (típico de medicina) armando un cronograma día por día con repaso espaciado, y lleva un archivo de seguimiento por tema (nuevo / flojo / firme) que se actualiza cada vez que el estudiante repasa. Usar siempre que alguien quiera organizar el estudio para un parcial o examen, se sienta abrumado por la cantidad de temas, diga que "lee mucho pero se le olvida todo" o "siente que no sabe nada" a pesar de estudiar, pida un cronograma de estudio, un plan de repaso, o quiera registrar qué temas tiene firmes y cuáles no antes de una fecha límite. También usar para actualizar un plan existente cuando el estudiante cuenta qué repasó y cómo le fue (bien / mal / regular) con algún tema.
---

# Plan de estudio con repaso espaciado

## Por qué funciona así

La sensación de "estudio mucho y siento que no sé nada" casi siempre no es un problema de conocimiento sino de que la información se lee una vez y no se vuelve a activar: sin repaso, se olvida a los pocos días aunque en su momento se haya entendido bien. La solución no es leer más, es programar cuándo volver a cada tema (repaso espaciado) y llevar un registro objetivo de qué está firme y qué no, para que la ansiedad de "no sé nada" se convierta en una lista concreta y manejable.

Esta skill hace dos cosas:
1. Arma un cronograma que reparte temas nuevos y repasos entre hoy y la fecha del examen.
2. Mantiene un archivo de seguimiento por materia que persiste entre conversaciones, así el plan se ajusta con el tiempo en vez de rehacerse de cero cada vez.

## Primer uso para una materia (todavía no hay archivo de seguimiento)

Preguntar lo que falte de esto (no lo que ya haya dado el usuario):
- Lista de temas o módulos a cubrir (puede ser una lista pegada, o un PDF/programa de la materia).
- Fecha del examen o parcial.
- Días y, si lo sabe, horas disponibles por día para estudiar esa materia (aproximado está bien).
- Si ya hay temas que domina de antes, para no tratarlos como nuevos.

Con eso:
1. Crear el archivo de seguimiento (ver formato abajo) en la carpeta de trabajo del usuario, nombrado `seguimiento-<materia>.json`. Confirmar con el usuario dónde guardarlo si no es obvio.
2. Correr `scripts/build_plan.py` (ver "Cómo generar el cronograma" abajo) para calcular la distribución de temas nuevos y las fechas de repaso.
3. Presentar el cronograma día por día en texto claro, y ofrecer guardarlo como archivo si el usuario lo quiere para imprimir o tener a mano.
4. Cerrar reflejando el panorama real: cuántos temas hay, cuántos son nuevos, cuántos repasos caen antes del examen. Esto ayuda a que el volumen se sienta manejable en vez de infinito.

## Uso de seguimiento (ya existe el archivo)

Cuando el usuario cuenta qué repasó ("hoy vi arritmias, me costó" / "fibrilación auricular ya la tengo firme"), actualizar el archivo de seguimiento:
- Marcar el tema con su nuevo estado: `nuevo` (no visto aún), `flojo` (visto pero no consolidado — le costó, dudó, tuvo que volver a leer), `firme` (lo explicaría sin mirar apuntes).
- Registrar la fecha de hoy como `last_reviewed`.
- Volver a correr `scripts/build_plan.py` para recalcular las próximas fechas de repaso de ese tema y reacomodar el cronograma restante hasta el examen.

No hace falta rehacer todo el plan a mano: el script recalcula las fechas de repaso según el estado y devuelve el cronograma actualizado.

## Formato del archivo de seguimiento

JSON con esta forma (crear si no existe, actualizar si existe):

```json
{
  "materia": "Clínica Médica",
  "exam_date": "2026-09-15",
  "topics": [
    {"name": "Fibrilación auricular", "status": "nuevo", "last_reviewed": null, "next_review": null},
    {"name": "Insuficiencia cardíaca", "status": "flojo", "last_reviewed": "2026-08-01", "next_review": "2026-08-03"}
  ]
}
```

`status` es uno de: `nuevo`, `flojo`, `firme`.

## Cómo generar el cronograma

Usar el script `scripts/build_plan.py`, no calcular las fechas de repaso a mano — la aritmética de fechas e intervalos es mecánica y el script ya la tiene resuelta y probada, así se evita el error típico de contar mal los días o desordenar los repasos.

```bash
python3 scripts/build_plan.py \
  --tracking seguimiento-<materia>.json \
  --today 2026-08-05 \
  --hours-per-day 2 \
  --topics-per-day 3
```

(`--hours-per-day` y `--topics-per-day` son aproximados, ajustar según lo que cuente el usuario; si no da esa info usar 3 temas/día como default razonable para una materia con carga media.)

El script:
- Si un tema es `nuevo`, lo agenda para un primer pase pronto (respetando la capacidad diaria) y no antes de que le toque en el orden.
- Después de cada repaso, calcula el próximo según el estado: `firme` empuja el intervalo más largo (efecto de que ya está consolidado y necesita menos repaso), `flojo` lo acorta (necesita volver pronto), `nuevo` recién repasado pasa a un intervalo corto.
- Nunca agenda repasos después de `exam_date`; todo lo que no llegó a `firme` se agrupa en un repaso final los 1-2 días antes del examen.
- Devuelve un JSON con el cronograma día por día y el archivo de seguimiento actualizado con las `next_review` calculadas.

Leer la salida del script y presentarla en texto legible (lista por día), no pegar el JSON crudo al usuario.

## Al presentar el plan o una actualización

Incluir siempre, en lenguaje simple:
- El cronograma de los próximos días (no hace falta mostrar todo hasta el examen si es muy largo — mostrar la próxima semana y mencionar que el resto sigue el mismo patrón).
- Un resumen de estado: cuántos temas están `firme`, `flojo`, `nuevo`.
- Si aplica, una frase breve reconociendo que sentir que "no sabe nada" es normal cuando hay muchos temas sin repasar todavía, y que el número de temas `firme` es la métrica real de progreso — no la sensación.

No usar un tono de coach motivacional forzado ni signos de exclamación de más; el objetivo es claridad y que el estudiante vea el plan como algo manejable, con datos concretos en vez de ánimo genérico.
