import { defineArrayMember, defineField, defineType } from "sanity";

// Текст статьи, гайда или новости: абзацы, заголовки, списки, жирный и курсив, ссылки, картинки
export const blockContent = defineType({
  name: "blockContent",
  title: "Текст материала",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Обычный текст", value: "normal" },
        { title: "Заголовок", value: "h2" },
        { title: "Подзаголовок", value: "h3" },
        { title: "Цитата", value: "blockquote" },
      ],
      lists: [
        { title: "Маркированный список", value: "bullet" },
        { title: "Нумерованный список", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Жирный", value: "strong" },
          { title: "Курсив", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Ссылка",
            fields: [
              defineField({
                name: "href",
                type: "string",
                title: "Адрес",
                description: "Начинается с https://, mailto: или tel:",
                validation: (r) =>
                  r.required().custom((value) => (value && /^(https?:\/\/|mailto:|tel:)/i.test(value) ? true : "Ссылка должна начинаться с https://, mailto: или tel:")),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Картинка",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Описание картинки", description: "Коротко, что на картинке. Нужно для людей с плохим зрением и поисковиков." })],
    }),
  ],
});
