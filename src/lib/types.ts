import type { Service } from "@/data/services";

export type Tariff = { name: string; price: string; period: string; features: string[]; note?: string };
export type RentStep = { year: string; share: number; from: number; label: string };
export type CaseItem = { tag: string; title: string; text: string; stats: [string, string][] };
export type ExpertField = "IT" | "Юриспруденция" | "Маркетинг" | "Финансы";
export type Expert = { name: string; field: ExpertField; focus: string; experience: string; photo?: string; photoPosition?: string };
export type VideoItem = { title: string; url?: string; poster?: string };
// Запись блога: ссылка появляется, только если у материала есть страница (slug и текст)
export type BlogItem = { title: string; slug?: string; date?: string };
export type Blog = { articles: BlogItem[]; guides: BlogItem[]; news: BlogItem[] };
export type Social = { label: string; href: string };
export type FooterInfo = { address: string; phone: string; email: string; socials: Social[] };

export type SiteContent = {
  siteName: string;
  conditions: string[];
  tariffs: Tariff[];
  rent: RentStep[];
  footer: FooterInfo;
  services: Service[];
  experts: Expert[];
  cases: CaseItem[];
  videos: VideoItem[];
  blog: Blog;
};
