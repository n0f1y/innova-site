import type { FooterInfo } from "./types";

export type ContactRow = { label: string; value: string; href?: string };

const norm = (s: string) => s.trim().toLowerCase();
const TG = ["telegram", "телеграм", "тг", "tg"];
const VK = ["vk", "вк", "вконтакте"];

// Строки контактов с подписями; пустые остаются видимыми и ждут заполнения в панели
export function contactRows(f: FooterInfo): ContactRow[] {
  const pick = (names: string[]) => f.socials.find((s) => names.includes(norm(s.label)));
  const tg = pick(TG);
  const vk = pick(VK);
  const rest = f.socials.filter((s) => s !== tg && s !== vk);
  return [
    { label: "Адрес", value: f.address },
    { label: "Телефон", value: f.phone },
    { label: "E-mail", value: f.email },
    { label: "Telegram", value: tg?.href ?? "", href: tg?.href },
    { label: "VK", value: vk?.href ?? "", href: vk?.href },
    ...rest.map((s) => ({ label: s.label, value: s.href, href: s.href })),
  ];
}
