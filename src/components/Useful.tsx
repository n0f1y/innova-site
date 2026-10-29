import { useful } from "@/data/content";
import { Heading } from "./Heading";

// Шесть карточек 3×2 подобраны по размеру так, чтобы помещаться на одном экране ноутбука
export function Useful() {
  return (
    <section id="useful" className="relative z-10 scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[100rem] px-5 pb-20 pt-4 sm:px-10">
        <Heading className="max-w-5xl !text-[clamp(1.7rem,4.2vw,3.5rem)]">{useful.title}</Heading>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useful.items.map((item) => (
            <li key={item.who} className="flex flex-col rounded-3xl border border-paper/20 p-5 sm:p-6">
              <h3 className="text-lg font-bold uppercase leading-tight tracking-tight text-lime [text-wrap:balance] sm:text-xl">{item.who}</h3>
              <p className="mt-3 text-base font-medium leading-snug text-paper/85">{item.what}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
