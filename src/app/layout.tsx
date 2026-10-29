import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

// Геометрический гротеск с кириллицей; next/font самохостит и не даёт FOUT
const sans = Jost({ subsets: ["cyrillic", "latin"], variable: "--font-sans", weight: ["400", "500", "700", "800"] });

// Название во вкладке браузера берётся из настроек сайта
export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getContent();
  return {
    title: `${siteName} — бизнес-инкубатор инноваций устойчивого развития`,
    description:
      "Бизнес-инкубатор инноваций устойчивого развития. Комплексное сопровождение от идеи до инвестиций и внедрения. Резидентство открыто для любого региона Российской Федерации и Союзного государства.",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={sans.variable}>
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
