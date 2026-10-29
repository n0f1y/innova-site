import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceIcon } from "@/components/ServiceIcon";
import { getContent } from "@/lib/content";

// Страницы услуг обновляются вместе с контентом; новые услуги из Sanity создаются по первому запросу
export const revalidate = 60;

export async function generateStaticParams() {
  const { services } = await getContent();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { siteName, services } = await getContent();
  const service = services.find((s) => s.slug === slug);
  return { title: service ? `${service.title} — ${siteName}` : siteName };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { siteName, footer, services } = await getContent();
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === service.slug);
  const prev = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];

  return (
    <>
      <Header siteName={siteName} footer={footer} />
      <main className="min-h-screen bg-ink pt-32 text-paper">
        <div className="mx-auto max-w-[100rem] px-5 pb-24 sm:px-10">
          <Link href="/#services" className="text-sm font-bold uppercase tracking-wide text-lime hover:underline">← Все услуги</Link>

          <div className="mt-10 flex items-center gap-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-lime text-sm font-bold tabular-nums text-ink">
              {String(service.id).padStart(2, "0")}
            </span>
            <ServiceIcon id={service.id} className="size-10 text-lime" />
          </div>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.1rem,6.2vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight [text-wrap:balance]">
            {service.title}
          </h1>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-3xl border border-paper/20 p-6 sm:p-8">
              <h2 className="text-xl font-bold uppercase tracking-tight">Что входит</h2>
              <ul className="mt-6 divide-y divide-paper/15">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-4 py-4 text-xl font-medium">
                    <span aria-hidden="true" className="text-lime">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <aside className="flex flex-col rounded-3xl bg-lime p-6 text-ink sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide">Стоимость</p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">{service.price}</p>
              <p className="mt-3 text-base font-medium">Подробное описание и цены будут добавлены на этой странице.</p>
              <Link
                href="/#apply"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-bold text-paper transition-transform duration-300 hover:scale-105"
              >
                Оставить заявку
              </Link>
            </aside>
          </div>

          <nav aria-label="Другие услуги" className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href={`/services/${prev.slug}`} className="rounded-3xl border border-paper/20 p-6 transition-colors duration-300 hover:border-paper/60">
              <span className="text-sm font-medium text-paper/60">← Предыдущая</span>
              <span className="mt-2 block text-xl font-bold uppercase tracking-tight">{prev.title}</span>
            </Link>
            <Link href={`/services/${next.slug}`} className="rounded-3xl border border-paper/20 p-6 text-right transition-colors duration-300 hover:border-paper/60">
              <span className="text-sm font-medium text-paper/60">Следующая →</span>
              <span className="mt-2 block text-xl font-bold uppercase tracking-tight">{next.title}</span>
            </Link>
          </nav>
        </div>
      </main>
      <Footer siteName={siteName} footer={footer} />
    </>
  );
}
