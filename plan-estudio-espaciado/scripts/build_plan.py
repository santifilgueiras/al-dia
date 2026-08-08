#!/usr/bin/env python3
"""
Genera un cronograma de estudio con repaso espaciado a partir de un archivo
de seguimiento (JSON). Ver SKILL.md para el formato de entrada y el contrato
de uso.

Uso:
    python3 build_plan.py --tracking seguimiento-<materia>.json \
        --today 2026-08-05 --topics-per-day 3

Imprime a stdout un JSON con:
  - "schedule": { "YYYY-MM-DD": [ {"name": ..., "action": "nuevo"|"repaso", "status": ...}, ... ] }
  - "updated_tracking": el archivo de seguimiento con next_review recalculado
  - "summary": conteo de temas por estado

También sobreescribe el archivo de tracking en disco con el estado actualizado,
salvo que se pase --dry-run.
"""
import argparse
import json
import sys
from datetime import date, timedelta

# Intervalo (en días) según la racha de repasos consecutivos marcados "firme".
# Índice 0 = primer repaso después de estudiarlo por primera vez.
FIRME_INTERVALS = [2, 5, 10, 20, 30]
FLOJO_INTERVAL = 2  # si quedó "flojo", se reintenta pronto


def parse_date(s):
    return date.fromisoformat(s)


def review_event_next(topic, today):
    """Llamar SOLO cuando el tema fue repasado HOY (last_reviewed == today).
    Este es el único momento en que la racha (streak) debe avanzar o
    resetearse -- si se llamara en cada corrida del script sin que haya
    habido un repaso real, un tema "firme" se iría espaciando solo con
    cada regeneración del plan, sin que el estudiante lo haya repasado.
    Eso simularía un progreso que no ocurrió, así que hay que evitarlo."""
    streak = topic.get("streak", 0)
    if topic["status"] == "flojo":
        streak = 0
        interval = FLOJO_INTERVAL
    elif topic["status"] == "firme":
        interval = FIRME_INTERVALS[min(streak, len(FIRME_INTERVALS) - 1)]
        streak += 1
    else:  # nuevo pero ya con last_reviewed (caso raro) -> tratar como flojo
        streak = 0
        interval = FLOJO_INTERVAL

    topic["streak"] = streak
    next_date = today + timedelta(days=interval)
    return next_date.isoformat()


def build_plan(tracking, today, exam_date, topics_per_day):
    days = []
    d = today
    while d <= exam_date:
        days.append(d)
        d += timedelta(days=1)
    if not days:
        days = [today]

    capacity = {day.isoformat(): topics_per_day for day in days}
    schedule = {day.isoformat(): [] for day in days}

    def place(day_iso, entry):
        # si no hay lugar ese día, buscar el próximo día con capacidad libre
        idx = [d.isoformat() for d in days].index(day_iso) if day_iso in capacity else 0
        for day in days[idx:]:
            iso = day.isoformat()
            if capacity[iso] > 0:
                capacity[iso] -= 1
                schedule[iso].append(entry)
                return iso
        # sin lugar antes del examen: forzar en el último día (mejor esfuerzo)
        last = days[-1].isoformat()
        schedule[last].append(entry)
        return last

    studied_topics = []
    new_topics = []
    for topic in tracking["topics"]:
        topic.setdefault("streak", 0)
        if topic.get("last_reviewed"):
            studied_topics.append(topic)
        else:
            new_topics.append(topic)

    # 1) Repasos ya pendientes (temas con historial), ordenados por urgencia.
    # Importante: solo se toca la racha (streak) de un tema si HOY es su
    # last_reviewed, es decir si el estudiante realmente lo repasó hoy. Si
    # no, se respeta el next_review que ya tenía calculado de una corrida
    # anterior -- no se recalcula ni se avanza la racha solo por volver a
    # generar el plan.
    for topic in sorted(studied_topics, key=lambda t: t.get("next_review") or today.isoformat()):
        reviewed_today = topic.get("last_reviewed") == today.isoformat()
        if reviewed_today:
            topic["next_review"] = review_event_next(topic, today)
        elif not topic.get("next_review"):
            topic["next_review"] = today.isoformat()

        if topic["status"] == "firme" and parse_date(topic["next_review"]) > exam_date:
            continue  # ya consolidado y el próximo repaso cae después del examen: no hace falta agendar
        target = topic["next_review"] if topic["next_review"] in capacity else today.isoformat()
        placed_day = place(target, {"name": topic["name"], "action": "repaso", "status": topic["status"]})
        topic["next_review"] = placed_day

    # 2) Temas nuevos: repartir en el hueco disponible, en orden, lo antes posible
    for topic in new_topics:
        placed_day = place(today.isoformat(), {"name": topic["name"], "action": "nuevo", "status": "nuevo"})
        topic["next_review"] = placed_day  # fecha tentativa de primer estudio

    # 3) Repaso final pre-examen: todo lo que no esté "firme" con racha >=2, 1-2 días antes del examen
    final_review_day = max(days[0], exam_date - timedelta(days=1))
    pending_final = [t["name"] for t in tracking["topics"] if t["status"] != "firme" or t.get("streak", 0) < 2]
    if pending_final:
        schedule.setdefault(final_review_day.isoformat(), [])
        schedule[final_review_day.isoformat()].append({
            "name": "REPASO FINAL: " + ", ".join(pending_final),
            "action": "repaso_final",
            "status": "mixto",
        })

    summary = {
        "total_temas": len(tracking["topics"]),
        "firme": sum(1 for t in tracking["topics"] if t["status"] == "firme"),
        "flojo": sum(1 for t in tracking["topics"] if t["status"] == "flojo"),
        "nuevo": sum(1 for t in tracking["topics"] if t["status"] == "nuevo"),
    }

    # limpiar días vacíos del output para no ensuciar la presentación
    schedule = {k: v for k, v in schedule.items() if v}
    return schedule, summary


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tracking", required=True, help="Path al JSON de seguimiento")
    ap.add_argument("--today", required=True, help="Fecha de hoy, YYYY-MM-DD")
    ap.add_argument("--topics-per-day", type=int, default=3)
    ap.add_argument("--hours-per-day", type=float, default=None, help="Informativo, no cambia el cálculo por ahora")
    ap.add_argument("--dry-run", action="store_true", help="No escribir el archivo de tracking, solo imprimir")
    args = ap.parse_args()

    with open(args.tracking, "r", encoding="utf-8") as f:
        tracking = json.load(f)

    today = parse_date(args.today)
    exam_date = parse_date(tracking["exam_date"])

    if exam_date < today:
        print(json.dumps({"error": "exam_date ya pasó, revisar el archivo de tracking"}), file=sys.stderr)
        sys.exit(1)

    schedule, summary = build_plan(tracking, today, exam_date, args.topics_per_day)

    if not args.dry_run:
        with open(args.tracking, "w", encoding="utf-8") as f:
            json.dump(tracking, f, ensure_ascii=False, indent=2)

    print(json.dumps({
        "schedule": schedule,
        "updated_tracking": tracking,
        "summary": summary,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
