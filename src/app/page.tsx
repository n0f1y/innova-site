import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Hero } from "@/components/Hero";
import { WhyUs } from "@/components/WhyUs";
import { Activities } from "@/components/Activities";
import { Services } from "@/components/Services";
import { Useful } from "@/components/Useful";
import { Programs } from "@/components/Programs";
import { Cases } from "@/components/Cases";
import { Experts } from "@/components/Experts";
import { Investments } from "@/components/Investments";
import { Blog } from "@/components/Blog";
import { About } from "@/components/About";
import { ApplyForm } from "@/components/ApplyForm";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content";

// Правки из Sanity появляются на сайте не позже чем через минуту после публикации.
// Значение должно быть числом прямо здесь: Next.js не принимает его из общей константы.
export const revalidate = 60;

// Порядок блоков по правкам заказчика: hero → почему мы → виды деятельности → услуги → полезно →
// резидентство → (кейсы, эксперты скрыты, пока пусты) → инвестиции → материалы → о нас → заявка → подвал
export default async function Home() {
  const { siteName, footer } = await getContent();
  return (
    <>
      <HeroBackdrop />
      <Header siteName={siteName} footer={footer} />
      <main>
        <Hero />
        <WhyUs />
        <Activities />
        <Services />
        <Useful />
        <Programs />
        <Cases />
        <Experts />
        <Investments />
        <Blog />
        <About />
        <ApplyForm />
      </main>
      <Footer siteName={siteName} footer={footer} />
    </>
  );
}
