import Link from "next/link";
import { getContent } from "@/lib/content";
import type { BlogItem } from "@/lib/types";
import { Heading } from "./Heading";

const row = "group flex items-start justify-between gap-4 py-4 text-lg font-medium leading-snug";

function Column({ title, items }: { title: string; items: BlogItem[] }) {
  return (
    <div>
      <h3 className="border-b border-ink pb-3 text-xl font-bold uppercase tracking-tight">{title}</h3>
      {items.length === 0 && <p className="py-4 text-lg font-medium leading-snug text-muted">Материалы появятся здесь</p>}
      <ul className="divide-y divide-ink/15">
        {items.map((it, i) => (
          <li key={`${it.title}-${i}`}>
            {it.slug ? (
              // Материал опубликован: заголовок ведёт на его страницу
              <Link href={`/materials/${it.slug}`} className={`${row} hover:underline`}>
                <span>
                  {it.date && <span className="block text-sm tabular-nums text-muted">{it.date}</span>}
                  {it.title}
                </span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            ) : (
              // Текста пока нет: заголовок показываем без ссылки
              <p className={row}>
                <span>
                  {it.date && <span className="block text-sm tabular-nums text-muted">{it.date}</span>}
                  {it.title}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Все три колонки видны всегда; пустая показывает подпись, пока владелец не добавит записи
export async function Blog() {
  const { blog } = await getContent();
  const columns = [
    { title: "Гайды", items: blog.guides },
    { title: "Статьи", items: blog.articles },
    { title: "Новости инкубатора", items: blog.news },
  ];

  return (
    <section id="blog" className="relative z-10 scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <Heading dot="text-ink">Полезные материалы</Heading>

        <div className={`mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3`}>
          {columns.map((c) => (
            <Column key={c.title} title={c.title} items={c.items} />
          ))}
        </div>
      </div>
    </section>
  );
}
