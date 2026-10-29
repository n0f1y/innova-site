import { createClient } from "@sanity/client";

// Идентификаторы проекта Sanity берутся из переменных окружения (.env.local и настройки хостинга).
// Пока их нет, сайт целиком работает на локальных данных из src/data.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityEnabled = Boolean(projectId);

const client = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: true, perspective: "published" })
  : null;

// Правки владельца попадают на сайт не позже чем через REVALIDATE секунд после публикации
export const REVALIDATE = 60;

// Без настроек Sanity возвращает null, и сайт берёт локальные данные.
// Если Sanity настроен, но не отвечает, ошибку не прячем: при обновлении живого сайта Next.js
// тогда оставит последнюю удачную версию страницы, а при сборке с неверными настройками
// сборка упадёт с понятной причиной, а не опубликует заглушки вместо правок владельца.
export async function sanityFetch<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } });
  } catch (error) {
    console.error("Sanity: не удалось получить контент.", error);
    throw error;
  }
}
