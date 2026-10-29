import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Услуги",
  type: "document",
  fields: [
    defineField({
      name: "order",
      title: "Номер услуги",
      type: "number",
      description: "Определяет порядок карточек и цифру в кружке. Иконки заложены для номеров 1–8, у остальных будет нейтральная.",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({ name: "title", title: "Название", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Адрес страницы",
      type: "slug",
      description: "Часть ссылки, например «legal» даст сайт/services/legal. Нажмите «Generate» или впишите латиницей.",
      options: { source: "title", maxLength: 40 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      title: "Что входит",
      type: "array",
      description: "Короткие пункты списка на карточке и на странице услуги.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "price", title: "Стоимость", type: "string", description: "Например: от 25 000 ₽ или «По запросу».", initialValue: "По запросу" }),
    defineField({
      name: "image",
      title: "Фото карточки",
      type: "image",
      description: "Показывается при наведении на карточку. Используйте точку фокуса («Hotspot»), чтобы выбрать главное в кадре.",
      options: { hotspot: true },
    }),
    defineField({
      name: "veil",
      title: "Затемнение фото",
      type: "string",
      description: "Если на светлом фото плохо читается текст, выберите более плотное затемнение.",
      options: {
        list: [
          { title: "Обычное", value: "normal" },
          { title: "Плотное (для светлых фото)", value: "strong" },
          { title: "Максимальное", value: "max" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
    defineField({
      name: "zoom",
      title: "Приближение фото, %",
      type: "number",
      description: "Необязательно. Например 160 приблизит кадр. Оставьте пустым, если не уверены.",
      validation: (r) => r.min(100).max(300),
    }),
  ],
  orderings: [{ title: "По номеру", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", order: "order", media: "image" },
    prepare: ({ title, order, media }) => ({ title: `${String(order ?? "").padStart(2, "0")} · ${title ?? ""}`, media }),
  },
});
