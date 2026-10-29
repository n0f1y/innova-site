import type { Service } from "../data/services";
import type { BlogItem, CaseItem, Expert, ExpertField, FooterInfo, RentStep, SiteContent, Tariff } from "./types";

// Единый запрос всего контента сайта. Названия полей совпадают со схемой в studio/schemaTypes.
export const QUERY = `{
  "settings": *[_type == "siteSettings"][0]{
    siteName,
    conditions,
    tariffs[]{ name, price, period, features, note },
    rent[]{ year, from, share, label },
    footer{ address, phone, email, socials[]{ label, href } }
  },
  "services": *[_type == "service" && defined(slug.current)] | order(order asc){
    order, "slug": slug.current, title, items, price, veil, zoom,
    "image": image.asset->url, "hotspot": image.hotspot
  },
  "experts": *[_type == "expert"] | order(order asc){
    name, field, focus, experience,
    "photo": photo.asset->url, "hotspot": photo.hotspot
  },
  "cases": *[_type == "caseStudy"] | order(order asc){ tag, title, text, stats[]{ value, label } },
  "videos": *[_type == "videoReview" && defined(url)] | order(order asc){ title, url, "poster": poster.asset->url },
  "articles": *[_type == "article"] | order(order asc, date desc){
    kind, title, date, "slug": slug.current, "hasBody": count(body) > 0
  }
}`;

type Hotspot = { x: number; y: number } | null;

export type Remote = {
  settings: {
    siteName?: string;
    conditions?: string[];
    tariffs?: Tariff[];
    rent?: RentStep[];
    footer?: Partial<FooterInfo>;
  } | null;
  services: { order: number; slug: string; title: string; items?: string[]; price?: string; veil?: string; zoom?: number; image?: string; hotspot?: Hotspot }[];
  experts: { name: string; field: ExpertField; focus?: string; experience?: string; photo?: string; hotspot?: Hotspot }[];
  cases: { tag?: string; title: string; text?: string; stats?: { value: string; label: string }[] }[];
  videos?: { title: string; url: string; poster?: string }[];
  articles: { kind: "article" | "guide" | "news"; title: string; date?: string; slug?: string; hasBody?: boolean }[];
};

const VEIL: Record<string, [number, number]> = { normal: [0.5, 0.84], strong: [0.62, 0.9], max: [0.72, 0.95] };

const position = (h?: Hotspot) => (h ? `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` : undefined);
const photoUrl = (url?: string, width = 1600) => (url ? `${url}?w=${width}&auto=format&q=80` : undefined);
const formatDate = (iso?: string) => (iso ? iso.split("-").reverse().join(".") : "");

// Сводим ответ Sanity к данным сайта. Одиночные поля настроек при отсутствии берём из запасных данных,
// списки (услуги, эксперты, кейсы, материалы) показываем ровно так, как их оставил владелец, даже пустыми.
export function mapRemote(remote: Remote, defaults: SiteContent): SiteContent {
  const s = remote.settings;

  const services: Service[] = (remote.services ?? []).map((r) => ({
    id: r.order,
    slug: r.slug,
    title: r.title,
    items: r.items ?? [],
    price: r.price || "По запросу",
    image: photoUrl(r.image),
    imagePosition: position(r.hotspot),
    imageSize: r.zoom ? `${r.zoom}%` : undefined,
    imageVeil: VEIL[r.veil ?? "normal"] ?? VEIL.normal,
  }));

  const experts: Expert[] = (remote.experts ?? []).map((r) => ({
    name: r.name,
    field: r.field,
    focus: r.focus ?? "",
    experience: r.experience || "",
    photo: photoUrl(r.photo, 800),
    photoPosition: position(r.hotspot),
  }));

  const cases: CaseItem[] = (remote.cases ?? []).map((r) => ({
    tag: r.tag ?? "",
    title: r.title,
    text: r.text ?? "",
    stats: (r.stats ?? []).map((x) => [x.value, x.label] as [string, string]),
  }));

  const articles = remote.articles ?? [];
  // Ссылка на материал есть, только если у него задан адрес и написан текст
  const item = (a: (typeof articles)[number]): BlogItem => ({
    title: a.title,
    slug: a.slug && a.hasBody ? a.slug : undefined,
    date: formatDate(a.date) || undefined,
  });

  return {
    siteName: s?.siteName || defaults.siteName,
    conditions: s?.conditions ?? defaults.conditions,
    tariffs: s?.tariffs ?? defaults.tariffs,
    rent: s?.rent ?? defaults.rent,
    footer: {
      address: s?.footer?.address ?? defaults.footer.address,
      phone: s?.footer?.phone ?? defaults.footer.phone,
      email: s?.footer?.email ?? defaults.footer.email,
      socials: s?.footer?.socials ?? defaults.footer.socials,
    },
    services,
    experts,
    cases,
    videos: (remote.videos ?? []).map((v) => ({ title: v.title, url: v.url, poster: photoUrl(v.poster, 1200) })),
    blog: {
      articles: articles.filter((a) => a.kind === "article").map(item),
      guides: articles.filter((a) => a.kind === "guide").map(item),
      news: articles.filter((a) => a.kind === "news").map(item),
    },
  };
}
