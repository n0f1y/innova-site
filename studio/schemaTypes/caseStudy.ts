import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Кейсы резидентов",
  type: "document",
  fields: [
    defineField({ name: "order", title: "Порядок", type: "number", description: "Чем меньше число, тем раньше карточка.", initialValue: 10 }),
    defineField({ name: "title", title: "Название компании", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tag", title: "Метка", type: "string", description: "Короткая отметка над названием, например IT или ESG." }),
    defineField({ name: "text", title: "Краткая история успеха", type: "text", rows: 3 }),
    defineField({
      name: "stats",
      title: "Цифры",
      type: "array",
      description: "Обычно две: привлечённые инвестиции и рост выручки.",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Значение", type: "string", description: "Например: 25 млн ₽ или +40%" }),
            defineField({ name: "label", title: "Подпись", type: "string", description: "Например: привлечено инвестиций" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
  ],
  orderings: [{ title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "tag" } },
});
