import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalDocument } from "@/components/LegalDoc";
import { consent } from "@/data/legal";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getContent();
  return { title: `Согласие на обработку персональных данных — ${siteName}` };
}

export default async function ConsentPage() {
  const { siteName, footer } = await getContent();
  return (
    <>
      <Header siteName={siteName} footer={footer} />
      <main className="min-h-screen bg-ink pt-32 text-paper">
        <article className="mx-auto max-w-3xl px-5 pb-24 sm:px-10">
          <Link href="/" className="text-sm font-bold uppercase tracking-wide text-lime hover:underline">← На главную</Link>
          <h1 className="mt-10 text-[clamp(1.6rem,4vw,3rem)] font-extrabold uppercase leading-[1.02] tracking-tight [text-wrap:balance]">
            {consent.title}
          </h1>
          <LegalDocument doc={consent} />
        </article>
      </main>
      <Footer siteName={siteName} footer={footer} />
    </>
  );
}
