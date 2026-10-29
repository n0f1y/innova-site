import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Блог и новости",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Раздел",
      type: "string",
      options: {
        list: [
          { title: "Статья", value: "article" },
          { title: "Гайд", value: "guide" },
          { title: "Новость инкубатора", value: "news" },
        ],
        layout: "radio",
      },
      initialValue: "article",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Заголовок", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", title: "Дата", type: "date", description: "Показывается у новостей.", options: { dateFormat: "DD.MM.YYYY" } }),
    defineField({
      name: "slug",
      title: "Адрес страницы",
      type: "slug",
      description: "Часть ссылки латиницей, например grant-guide. Нажмите «Generate». Без адреса и текста материал виден в списке, но не открывается.",
      options: { source: "title", maxLength: 60 },
    }),
    defineField({
      name: "body",
      title: "Текст",
      type: "blockContent",
      description: "Сам материал. Когда текст написан и задан адрес, заголовок в списке на сайте становится ссылкой на отдельную страницу.",
    }),
    defineField({ name: "order", title: "Порядок", type: "number", description: "Чем меньше число, тем выше в списке. Новости дополнительно сортируются по дате.", initialValue: 10 }),
  ],
  orderings: [{ title: "По дате, новые сверху", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", kind: "kind", date: "date", body: "body" },
    prepare: ({ title, kind, date, body }) => ({
      title,
      subtitle: `${{ article: "Статья", guide: "Гайд", news: "Новость" }[kind as string] ?? ""}${date ? ` · ${date}` : ""}${body?.length ? "" : " · без текста"}`,
    }),
  },
});
