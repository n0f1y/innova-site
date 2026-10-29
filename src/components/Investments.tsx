import Link from "next/link";
import { investing } from "@/data/content";
import { Heading } from "./Heading";

export function Investments() {
  return (
    <section id="investments" className="relative z-10 scroll-mt-20 bg-lime text-ink">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading dot="text-ink">Привлечение инвестиций</Heading>
          <Link
            href="/#apply"
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-bold text-paper transition-transform duration-300 hover:scale-105"
          >
            Обсудить привлечение
          </Link>
        </div>

        <ol className="mt-14 grid border-t border-ink md:grid-cols-2">
          {investing.map((item, i) => (
            <li key={item.title} className="flex gap-5 border-b border-ink py-7 md:pr-8 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-8 md:[&:nth-child(even)]:pr-0">
              <span className="text-sm font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">{item.title}</h3>
                <p className="mt-2 text-lg font-medium">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
