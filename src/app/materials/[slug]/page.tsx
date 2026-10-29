import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RichText, type Block } from "@/components/RichText";
import { getContent } from "@/lib/content";
import { sanityFetch } from "@/lib/sanity";

// Материалы блога обновляются вместе с контентом; новые материалы из панели открываются по первому запросу
export const revalidate = 60;

type Material = { kind: "article" | "guide" | "news"; title: string; date?: string; body: Block[] };

const QUERY = `*[_type == "article" && slug.current == $slug && count(body) > 0][0]{
  kind, title, date,
  body[]{ ..., _type == "image" => { "url": asset->url, alt } }
}`;

const kindLabel = { article: "Статья", guide: "Гайд", news: "Новость инкубатора" } as const;

async function getMaterial(slug: string) {
  return sanityFetch<Material | null>(QUERY, { slug });
}

export async function generateStaticParams() {
  const { blog } = await getContent();
  return [...blog.articles, ...blog.guides, ...blog.news].filter((m) => m.slug).map((m) => ({ slug: m.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [{ siteName }, material] = await Promise.all([getContent(), getMaterial(slug)]);
  return { title: material ? `${material.title} — ${siteName}` : siteName };
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ siteName, footer }, material] = await Promise.all([getContent(), getMaterial(slug)]);
  if (!material) notFound();

  const date = material.date ? material.date.split("-").reverse().join(".") : "";

  return (
    <>
      <Header siteName={siteName} footer={footer} />
      <main className="min-h-screen bg-ink pt-32 text-paper">
        <article className="mx-auto max-w-3xl px-5 pb-24 sm:px-10">
          <Link href="/#blog" className="text-sm font-bold uppercase tracking-wide text-lime hover:underline">← Полезные материалы</Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-wide text-lime">
            {kindLabel[material.kind]}
            {date && <span className="ml-3 tabular-nums text-paper/60">{date}</span>}
          </p>
          <h1 className="mt-4 text-[clamp(1.9rem,5vw,3.75rem)] font-bold uppercase leading-[1.02] tracking-tight [text-wrap:balance]">{material.title}</h1>
          <div className="mt-10 border-t border-paper/20 pt-4">
            <RichText blocks={material.body} />
          </div>
        </article>
      </main>
      <Footer siteName={siteName} footer={footer} />
    </>
  );
}
