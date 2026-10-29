import { defineField, defineType } from "sanity";

export const videoReview = defineType({
  name: "videoReview",
  title: "Видео-отзывы",
  type: "document",
  fields: [
    defineField({ name: "order", title: "Порядок", type: "number", description: "Чем меньше число, тем раньше видео.", initialValue: 10 }),
    defineField({ name: "title", title: "Подпись", type: "string", description: "Например: Название компании, отзыв резидента.", validation: (r) => r.required() }),
    defineField({
      name: "url",
      title: "Ссылка на видео",
      type: "url",
      description: "Адрес ролика из браузера: YouTube, VK Видео, Rutube или Vimeo. Сам файл загружать не нужно.",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "poster",
      title: "Обложка",
      type: "image",
      description: "Необязательно. Картинка, которая видна до нажатия на воспроизведение.",
      options: { hotspot: true },
    }),
  ],
  orderings: [{ title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "url", media: "poster" } },
});
