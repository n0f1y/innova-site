// Собирает seed/data.ndjson из текущих локальных данных сайта (src/data) и фото услуг.
// Загрузка в Sanity: npm run seed:import (после входа: npx sanity login).
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { services } from "../../src/data/services.ts";
import * as content from "../../src/data/content.ts";
import { SITE_NAME } from "../../src/data/site.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const keyed = (list) => list.map((item, i) => ({ _key: `k${i + 1}`, ...item }));

// Идентификатор проекта берём из studio/.env (или из переменных окружения)
const envFile = path.join(root, "studio", ".env");
const env = { ...(existsSync(envFile) ? Object.fromEntries(readFileSync(envFile, "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])) : {}), ...process.env };
const projectId = env.SANITY_STUDIO_PROJECT_ID;
const dataset = env.SANITY_STUDIO_DATASET || "production";

// Фото, уже загруженные в проект: имя файла → идентификатор ресурса. Так повторный запуск ссылается на них напрямую.
const assetIds = new Map();
if (projectId) {
  try {
    const q = encodeURIComponent('*[_type == "sanity.imageAsset"]{ originalFilename, _id }');
    const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${q}&perspective=raw`);
    if (res.ok) for (const a of (await res.json()).result ?? []) assetIds.set(a.originalFilename, a._id);
  } catch {
    // нет сети или проекта — используем первую загрузку файлов
  }
}

// «/services/01.webp» → картинка со ссылкой на загруженное фото и точкой фокуса
const image = (publicPath, imagePosition) => {
  const file = path.join(root, "public", publicPath);
  if (!existsSync(file)) return undefined;
  const m = imagePosition && /([\d.]+)%\s+([\d.]+)%/.exec(imagePosition);
  const hotspot = m ? { _type: "sanity.imageHotspot", x: Number(m[1]) / 100, y: Number(m[2]) / 100, width: 0.2, height: 0.2 } : undefined;
  const id = assetIds.get(path.basename(file));
  if (id) return { _type: "image", asset: { _type: "reference", _ref: id }, ...(hotspot && { hotspot }) };
  // Первая загрузка: фото ещё нет в проекте, import загрузит их сам. Точки фокуса добавит повторный запуск seed:make и seed:import.
  return { _sanityAsset: `image@${pathToFileURL(file).href}` };
};

// «170%» → 170, «auto 108%» (по высоте) → примерно 162 по ширине
const zoomOf = (size) => {
  if (!size) return undefined;
  const m = /(\d+(?:\.\d+)?)%/.exec(size);
  if (!m) return undefined;
  return size.startsWith("auto") ? Math.round(Number(m[1]) * 1.5) : Number(m[1]);
};

const docs = [];

docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: SITE_NAME,
  conditions: content.conditions,
  tariffs: keyed(content.tariffs.map((t) => ({ ...t, features: [...t.features] }))),
  rent: keyed(content.rent),
  footer: {
    address: content.footer.address,
    phone: content.footer.phone,
    email: content.footer.email,
    socials: keyed(content.footer.socials),
  },
});

for (const s of services) {
  docs.push({
    _id: `service-${String(s.id).padStart(2, "0")}`,
    _type: "service",
    order: s.id,
    title: s.title,
    slug: { _type: "slug", current: s.slug },
    items: s.items,
    price: s.price,
    veil: s.imageVeil && s.imageVeil[0] >= 0.6 ? "strong" : "normal",
    zoom: zoomOf(s.imageSize),
    image: s.image ? image(s.image, s.imagePosition) : undefined,
  });
}

content.experts.forEach((e, i) => {
  docs.push({
    _id: `expert-${String(i + 1).padStart(2, "0")}`,
    _type: "expert",
    order: (i + 1) * 10,
    name: e.name,
    field: e.field,
    focus: e.focus,
    experience: "XX лет",
  });
});

content.cases.forEach((c, i) => {
  docs.push({
    _id: `case-${String(i + 1).padStart(2, "0")}`,
    _type: "caseStudy",
    order: (i + 1) * 10,
    title: c.title,
    tag: c.tag,
    text: c.text,
    stats: keyed(c.stats.map(([value, label]) => ({ value, label }))),
  });
});

// Гайды без текста: в списке на сайте они видны, но без ссылки, пока владельцы не напишут материал
const articles = [
  ...content.blog.articles.map((a) => ({ kind: "article", title: a.title })),
  ...content.blog.guides.map((a) => ({ kind: "guide", title: a.title })),
  ...content.blog.news.map((n) => ({ kind: "news", title: n.title })),
];
articles.forEach((a, i) => {
  docs.push({ _id: `article-${String(i + 1).padStart(2, "0")}`, _type: "article", order: (i + 1) * 10, ...a });
});

const clean = (obj) => JSON.parse(JSON.stringify(obj)); // убираем undefined
mkdirSync(path.join(root, "studio", "seed"), { recursive: true });
const out = path.join(root, "studio", "seed", "data.ndjson");
writeFileSync(out, docs.map((d) => JSON.stringify(clean(d))).join("\n") + "\n", "utf8");
console.log(`Готово: ${docs.length} документов → ${path.relative(root, out)}`);
