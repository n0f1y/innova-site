"use client";

import { useState } from "react";
import { expertFilters, type ExpertFilter } from "@/data/content";
import type { Expert } from "@/lib/types";

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function ExpertsGrid({ experts }: { experts: Expert[] }) {
  const [filter, setFilter] = useState<ExpertFilter>("Все");
  const shown = filter === "Все" ? experts : experts.filter((e) => e.field === filter);

  return (
    <>
      <div role="group" aria-label="Фильтр по направлениям" className="mt-10 flex flex-wrap gap-2">
        {expertFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`min-h-11 rounded-full border px-5 text-sm font-bold transition-colors duration-300 ${
              filter === f ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
        {shown.map((e, i) => (
          <li key={`${e.field}-${e.name}-${i}`} className="overflow-hidden rounded-3xl border border-ink/20 bg-white/50">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-ink text-paper">
              {e.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.photo} alt={e.name} loading="lazy" className="absolute inset-0 size-full object-cover" style={{ objectPosition: e.photoPosition ?? "50% 30%" }} />
              ) : (
                <>
                  <span aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(135deg,#BBFF00_0_1px,transparent_1px_8px)]" />
                  <span className="relative flex size-20 items-center justify-center rounded-full bg-lime text-2xl font-extrabold text-ink">{initialsOf(e.name)}</span>
                  <span className="absolute bottom-3 left-4 text-xs font-medium text-paper/70">Фото эксперта</span>
                </>
              )}
            </div>
            <div className="p-5">
              <span className="rounded-full border border-ink/30 px-3 py-1 text-xs font-bold uppercase tracking-wide">{e.field}</span>
              <h3 className="mt-4 text-xl font-bold tracking-tight">{e.name}</h3>
              <p className="mt-1 text-sm font-medium text-muted">{e.focus}</p>
              {e.experience && <p className="mt-4 border-t border-ink/15 pt-3 text-sm font-medium">Опыт: {e.experience}</p>}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
