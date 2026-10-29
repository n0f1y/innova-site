import { about } from "@/data/content";
import { Heading } from "./Heading";

export function About() {
  return (
    <section id="about" className="relative z-10 scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <Heading>О нас</Heading>
        <p className="mt-6 max-w-3xl text-xl font-medium leading-snug">{about.lead}</p>
        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-paper/20 bg-paper/20 sm:grid-cols-2 lg:grid-cols-4">
          {about.cards.map((a) => (
            <li key={a.title} className="bg-ink p-6 sm:p-8">
              <h3 className="text-xl font-bold uppercase tracking-tight text-lime">{a.title}</h3>
              <p className="mt-3 text-base font-medium leading-snug text-paper/80">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
