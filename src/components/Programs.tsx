import Link from "next/link";
import { getContent } from "@/lib/content";
import { Eyebrow, Heading } from "./Heading";

export async function Programs() {
  const { conditions, rent, tariffs } = await getContent();
  return (
    <section id="programs" className="relative z-10 scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[100rem] px-5 pb-24 sm:px-10">
        <Eyebrow className="text-lime">Условия вступления и тарифы</Eyebrow>
        <Heading>Программы резидентства</Heading>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-paper/20 p-6 sm:p-8">
            <h3 className="text-xl font-bold uppercase tracking-tight">Условия вступления</h3>
            <ul className="mt-6 space-y-4">
              {conditions.map((c) => (
                <li key={c} className="flex gap-3 text-lg font-medium leading-snug">
                  <span aria-hidden="true" className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-bold text-ink">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {tariffs.map((t, i) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-3xl p-6 sm:p-8 ${i === 1 ? "bg-lime text-ink" : "border border-paper/20"}`}
            >
              <h3 className="text-xl font-bold uppercase tracking-tight">Тариф «{t.name}»</h3>
              <p className="mt-6 text-5xl font-extrabold tracking-tight">{t.price}</p>
              <p className={`text-sm font-medium ${i === 1 ? "text-ink/70" : "text-paper/70"}`}>{t.period}</p>
              <a
                href="#rent"
                className={`mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-bold underline decoration-1 underline-offset-4 ${
                  i === 1 ? "text-ink" : "text-lime"
                }`}
              >
                Аренда помещения не входит в тариф ↓
              </a>
              <ul className="mt-6 space-y-2 text-lg font-medium">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden="true">+</span>
                    {f}
                  </li>
                ))}
              </ul>
              {t.note && (
                <p className={`mt-4 rounded-2xl border px-4 py-2.5 text-sm font-bold ${i === 1 ? "border-ink/30" : "border-lime text-lime"}`}>{t.note}</p>
              )}
              <Link
                href="/#apply"
                className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-6 font-bold transition-transform duration-300 hover:scale-105 ${
                  i === 1 ? "bg-ink text-paper" : "bg-lime text-ink"
                }`}
              >
                Выбрать тариф
              </Link>
            </div>
          ))}
        </div>

        <div id="rent" className="mt-6 scroll-mt-24 rounded-3xl border border-paper/20 p-6 sm:p-8">
          <h3 className="text-xl font-bold uppercase tracking-tight">Льготная аренда</h3>
          <p className="mt-3 w-fit rounded-2xl border border-lime px-4 py-2.5 text-sm font-bold text-lime">
            Оплачивается отдельно: в стоимость тарифов аренда не входит
          </p>
          <p className="mt-3 text-paper/70">Доля от рыночной стоимости аренды растёт по мере развития резидента.</p>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {rent.map((r) => (
              <li key={r.year}>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">{r.year}</span>
                  <span className="text-3xl font-extrabold tracking-tight text-lime">{r.from < r.share ? `${r.from}–${r.share}%` : `${r.share}%`}</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-paper/15" role="img" aria-label={r.label}>
                  <div className="flex h-full" style={{ width: `${r.share}%` }}>
                    <div className="h-full bg-lime" style={{ width: `${(r.from / r.share) * 100}%` }} />
                    <div className="h-full flex-1 bg-lime/45" />
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-paper/75">{r.label}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
