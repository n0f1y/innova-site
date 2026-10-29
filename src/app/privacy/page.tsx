import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getContent();
  return { title: `Политика конфиденциальности — ${siteName}` };
}

export default async function PrivacyPage() {
  const { siteName, footer } = await getContent();
  return (
    <>
      <Header siteName={siteName} footer={footer} />
      <main className="min-h-screen bg-ink pt-32 text-paper">
        <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-10">
          <Link href="/" className="text-sm font-bold uppercase tracking-wide text-lime hover:underline">← На главную</Link>
          <h1 className="mt-10 text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
            Политика конфиденциальности
          </h1>
          <p className="mt-8 text-lg font-medium leading-relaxed text-paper/80">
            Заглушка: текст политики конфиденциальности будет добавлен после согласования с заказчиком.
          </p>
        </div>
      </main>
      <Footer siteName={siteName} footer={footer} />
    </>
  );
}
