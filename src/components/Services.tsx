import { getContent } from "@/lib/content";
import { ServiceCard } from "./ServiceCard";
import { Heading } from "./Heading";

export async function Services() {
  const { services } = await getContent();
  return (
    <>
      <section id="services" className="relative z-10 mx-auto max-w-[100rem] scroll-mt-20 px-5 pt-28 text-paper sm:px-10">
        <Heading showDot={false} className="[text-shadow:0_2px_28px_rgb(35_35_33/0.55)]">Чем мы занимаемся</Heading>
        <p className="mt-6 max-w-2xl text-xl font-medium leading-snug sm:text-2xl">Восемь направлений, которые помогают бизнесу расти и развиваться устойчиво.</p>
        {/* Две колонки; правая сдвинута вниз — «лесенка». pb компенсирует сдвиг последней карточки */}
        <ul className="mt-14 grid gap-6 md:grid-cols-2 md:pb-20">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} lowered={i % 2 === 1} />
          ))}
        </ul>
      </section>
      {/* Плавный уход фото в тёмный блок следующей секции */}
      <div aria-hidden="true" className="relative z-10 h-40 bg-gradient-to-b from-transparent to-ink" />
    </>
  );
}
