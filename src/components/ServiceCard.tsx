import Link from "next/link";
import type { Service } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";

// Заглушка, пока нет фото услуги: тёмная с салатовым свечением
const PLACEHOLDER =
  "radial-gradient(circle at 85% 0%, rgb(187 255 0 / 0.28), transparent 55%), linear-gradient(135deg, #34342F, #232321)";
// Вуаль поверх фото, чтобы светлый текст читался на любом снимке; у «шумных» снимков она плотнее
const veil = ([top, bottom]: [number, number] = [0.5, 0.84]) =>
  `linear-gradient(rgb(35 35 33 / ${top}), rgb(35 35 33 / ${bottom}))`;

export function ServiceCard({ service, lowered }: { service: Service; lowered: boolean }) {
  const background = service.image ? `${veil(service.imageVeil)}, url(${service.image})` : PLACEHOLDER;

  return (
    <li className={lowered ? "md:translate-y-20" : ""}>
      <Link
        href={`/services/${service.slug}`}
        className="group relative isolate flex h-full min-h-[21rem] flex-col overflow-hidden rounded-3xl border border-paper/25 bg-ink/45 p-6 text-paper outline-none backdrop-blur-[3px] transition-[border-color] duration-500 hover:border-paper/70 focus-visible:ring-2 focus-visible:ring-lime sm:p-8"
      >
        {/* Фон, который проявляется при наведении или фокусе */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-no-repeat opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            backgroundImage: background,
            backgroundSize: service.image ? `100% 100%, ${service.imageSize ?? "cover"}` : "cover",
            backgroundPosition: service.image ? `center, ${service.imagePosition ?? "center"}` : "center",
          }}
        />
        <div className="flex items-start justify-between">
          <span className="flex size-9 items-center justify-center rounded-full bg-lime text-sm font-bold tabular-nums text-ink">
            {String(service.id).padStart(2, "0")}
          </span>
          <ServiceIcon id={service.id} className="size-9 text-lime" />
        </div>
        <h3 className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight [text-wrap:balance] sm:text-3xl">{service.title}</h3>
        <ul className="mt-5 space-y-1.5 text-base font-medium text-paper/85">
          {service.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-paper/20 pt-5 text-sm font-bold">
          <span>
            <span className="font-medium text-paper/70">Стоимость: </span>
            {service.price}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/40 px-4 py-1.5 text-sm font-bold transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink group-focus-visible:border-lime group-focus-visible:bg-lime group-focus-visible:text-ink">
            Подробнее <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
