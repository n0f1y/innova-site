import { cache } from "react";
import { services as localServices } from "@/data/services";
import * as local from "@/data/content";
import { SITE_NAME } from "@/data/site";
import { sanityFetch } from "./sanity";
import { QUERY, mapRemote, type Remote } from "./map-remote";
import type { SiteContent } from "./types";

// Запасные данные: показываются, пока Sanity не подключён или недоступен
const defaults: SiteContent = {
  siteName: SITE_NAME,
  conditions: local.conditions,
  tariffs: local.tariffs,
  rent: local.rent,
  footer: local.footer,
  services: localServices,
  experts: [],
  cases: [],
  videos: [],
  blog: { articles: local.blog.articles, guides: local.blog.guides, news: local.blog.news },
};

// Один запрос на страницу: cache() не даёт блокам запрашивать контент повторно
export const getContent = cache(async (): Promise<SiteContent> => {
  const remote = await sanityFetch<Remote>(QUERY);
  return remote ? mapRemote(remote, defaults) : defaults;
});
