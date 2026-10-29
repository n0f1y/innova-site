import Link from "next/link";
import { hero } from "@/data/content";

// Короткие названия услуг для полосы внизу экрана
const strip = ["Стратегия", "Инвестиции", "IT", "Право", "Маркетинг", "Бухгалтерия", "Менторство", "Резидентура"];

const shadow = "[text-shadow:0_2px_28px_rgb(35_35_33/0.55)]";

export function Hero() {
  return (
    <section id="top" className="relative z-10 flex min-h-svh flex-col text-paper">
      <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col justify-end px-5 pb-14 pt-32 sm:px-10">
        <p className="mb-5 max-w-3xl text-sm font-bold uppercase tracking-wide text-lime">{hero.eyebrow}</p>

        <h1 className={`text-[clamp(1.7rem,7.2vw,6.5rem)] font-bold uppercase leading-[0.98] tracking-tight [text-wrap:balance] ${shadow}`}>
          {hero.title}
        </h1>

        <p className={`mt-8 max-w-2xl text-lg font-medium leading-snug sm:text-xl ${shadow}`}>{hero.lead}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/#apply"
            className="inline-flex min-h-12 items-center rounded-full bg-lime px-7 font-bold text-ink transition-transform duration-300 hover:scale-105"
          >
            Оставить заявку
          </Link>
          <Link
            href="/#services"
            className="inline-flex min-h-12 items-center rounded-full border border-paper/60 px-7 font-bold transition-colors duration-300 hover:bg-paper hover:text-ink"
          >
            Смотреть услуги
          </Link>
        </div>
      </div>

      <div className="border-t border-paper/20 bg-ink/70 backdrop-blur-sm">
        <ul className="mx-auto flex max-w-[100rem] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-5 text-sm font-medium sm:px-10 sm:text-base">
          {strip.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
