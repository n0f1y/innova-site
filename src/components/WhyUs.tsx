import { mission, whyUs } from "@/data/content";
import { Eyebrow, Heading } from "./Heading";

export function WhyUs() {
  return (
    <section id="why" className="relative z-10 scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <Eyebrow className="text-muted">{whyUs.tagline}</Eyebrow>
        <Heading dot="text-ink">{whyUs.title}</Heading>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {whyUs.items.map((item, i) => (
            <li key={item.title} className="flex flex-col rounded-3xl border border-ink/20 bg-white/50 p-6 sm:p-8">
              <span className="flex size-9 items-center justify-center rounded-full bg-lime text-sm font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-xl font-bold uppercase leading-tight tracking-tight [text-wrap:balance] min-[380px]:text-2xl">{item.title}</h3>
              <div className="mt-4 space-y-3 text-base font-medium leading-snug text-muted">
                {item.text.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-3xl bg-ink p-8 text-paper sm:p-12">
          <p className="text-sm font-bold uppercase tracking-wide text-lime">{mission.title}</p>
          <p className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-tight sm:text-4xl [text-wrap:balance]">{mission.text}</p>
        </div>
      </div>
    </section>
  );
}
