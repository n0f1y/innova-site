import { activities } from "@/data/content";
import { Heading } from "./Heading";

export function Activities() {
  return (
    <section id="activities" className="relative z-10 scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <Heading className="max-w-5xl !text-[clamp(1.9rem,5vw,4.5rem)]">{activities.title}</Heading>

        <div className="mt-8 max-w-3xl space-y-3 text-lg font-medium leading-snug text-paper/85 sm:text-xl">
          {activities.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <ol className="mt-12 grid grid-cols-1 border-t border-paper/25 md:grid-cols-2">
          {activities.items.map((item, i) => (
            <li
              key={item}
              className="flex items-baseline gap-5 border-b border-paper/25 py-6 md:pr-8 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-8 md:[&:nth-child(even)]:pr-0"
            >
              <span className="text-sm font-bold tabular-nums text-lime">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg font-bold uppercase leading-tight tracking-tight [text-wrap:balance] min-[380px]:text-xl sm:text-2xl">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
