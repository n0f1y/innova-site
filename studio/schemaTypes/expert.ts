import { defineField, defineType } from "sanity";

export const expert = defineType({
  name: "expert",
  title: "Эксперты и менторы",
  type: "document",
  fields: [
    defineField({ name: "order", title: "Порядок", type: "number", description: "Чем меньше число, тем раньше карточка.", initialValue: 10 }),
    defineField({ name: "name", title: "Имя и фамилия", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "field",
      title: "Направление",
      type: "string",
      description: "По нему работает фильтр на сайте.",
      options: {
        list: [
          { title: "IT", value: "IT" },
          { title: "Юриспруденция", value: "Юриспруденция" },
          { title: "Маркетинг", value: "Маркетинг" },
          { title: "Финансы", value: "Финансы" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "focus", title: "Специализация", type: "string", description: "Например: CRM/ERP, автоматизация" }),
    defineField({ name: "experience", title: "Опыт", type: "string", description: "Например: 12 лет. Пустое поле скроет строку." }),
    defineField({ name: "photo", title: "Фото", type: "image", options: { hotspot: true }, description: "Без фото покажутся инициалы." }),
  ],
  orderings: [{ title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "field", media: "photo" } },
});
