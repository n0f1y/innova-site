import { defineArrayMember, defineField, defineType } from "sanity";

// Единственный документ: общие тексты, цифры и контакты сайта
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Название компании", type: "string", description: "Показывается в шапке, главном заголовке, подвале и во вкладке браузера.", validation: (r) => r.required() }),

    defineField({
      name: "conditions",
      title: "Условия вступления в резидентство",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),

    defineField({
      name: "tariffs",
      title: "Тарифы",
      type: "array",
      description: "Первый тариф показывается обычной карточкой, второй выделяется салатовым.",
      of: [
        defineArrayMember({
          type: "object",
          name: "tariff",
          fields: [
            defineField({ name: "name", title: "Название тарифа", type: "string", validation: (r) => r.required() }),
            defineField({ name: "price", title: "Цена", type: "string", description: "Например: 2 800 ₽", validation: (r) => r.required() }),
            defineField({ name: "period", title: "Период", type: "string", initialValue: "в месяц" }),
            defineField({ name: "note", title: "Примечание", type: "string", description: "Необязательно. Например: Тариф доступен для физических лиц." }),
            defineField({ name: "features", title: "Что входит", type: "array", of: [defineArrayMember({ type: "string" })] }),
          ],
          preview: { select: { title: "name", subtitle: "price" } },
        }),
      ],
    }),

    defineField({
      name: "rent",
      title: "Льготная аренда по годам",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "rentStep",
          fields: [
            defineField({ name: "year", title: "Год", type: "string", description: "Например: 1-й год" }),
            defineField({ name: "from", title: "От, %", type: "number", description: "Нижняя граница доли от рыночной стоимости. Для одного значения повторите число из поля «До».", validation: (r) => r.min(0).max(100) }),
            defineField({ name: "share", title: "До, %", type: "number", description: "Верхняя граница доли (длина шкалы).", validation: (r) => r.min(0).max(100) }),
            defineField({ name: "label", title: "Подпись", type: "string", description: "Например: 15–25% от рыночной стоимости" }),
          ],
          preview: { select: { title: "year", subtitle: "label" } },
        }),
      ],
    }),

    defineField({
      name: "footer",
      title: "Контакты (подвал и мобильное меню)",
      type: "object",
      fields: [
        defineField({ name: "address", title: "Адрес", type: "string" }),
        defineField({ name: "phone", title: "Телефон", type: "string" }),
        defineField({ name: "email", title: "E-mail", type: "string" }),
        defineField({
          name: "socials",
          title: "Соцсети",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "social",
              fields: [
                defineField({ name: "label", title: "Название", type: "string", description: "Например: Telegram" }),
                defineField({
                  name: "href",
                  title: "Ссылка",
                  type: "string",
                  description: "Полный адрес, например https://t.me/name",
                  validation: (r) =>
                    r.custom((value) =>
                      !value || /^(https?:\/\/|mailto:|tel:)/i.test(value) ? true : "Ссылка должна начинаться с https://, mailto: или tel:",
                    ),
                }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Настройки сайта" }) },
});
