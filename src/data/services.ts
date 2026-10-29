export type Service = {
  id: number;
  slug: string; // адрес детальной страницы /services/<slug>
  title: string;
  items: string[];
  price: string; // цены в ТЗ не заданы — пока «по запросу»
  // Фон карточки при наведении, например "/services/01.webp" (файл кладём в public/services/)
  image?: string;
  // Кадрирование фото, если на снимке есть собственные надписи, мешающие тексту карточки
  imageSize?: string; // например "190%"
  imagePosition?: string; // например "62% 18%"
  // Плотность затемнения фото сверху и снизу карточки, по умолчанию [0.5, 0.84]
  imageVeil?: [number, number];
};

const PRICE = "По запросу";

// Источник: ТЗ «Инкубатор_ТЗ_Сайт_карточки_услуг.docx», порядок и нумерация как в ТЗ.
export const services: Service[] = [
  { id: 1, slug: "strategy", title: "Стратегический консалтинг", items: ["Разработка стратегии роста", "Бизнес-план", "Финансовая модель", "Дорожная карта"], price: PRICE, image: "/services/01.webp" },
  { id: 2, slug: "investments", title: "Привлечение инвестиций и грантов", items: ["Pitch deck", "Заявки на гранты (ФРИИ, Сколково)", "Поиск бизнес-ангелов", "Подготовка к питчам"], price: PRICE, image: "/services/02.webp", imageSize: "190%", imagePosition: "62% 18%" },
  { id: 3, slug: "it", title: "IT-консалтинг и цифровая трансформация", items: ["Внедрение CRM/ERP", "Автоматизация", "Разработка MVP", "Кибербезопасность"], price: PRICE, image: "/services/03.webp" },
  { id: 4, slug: "legal", title: "Юридическое сопровождение", items: ["Регистрация", "Патентование", "Договоры", "Защита интеллектуальной собственности", "Корпоративные споры"], price: PRICE, image: "/services/04.webp", imagePosition: "35% 50%", imageVeil: [0.6, 0.9] },
  { id: 5, slug: "marketing", title: "Маркетинг и продвижение", items: ["Digital-маркетинг", "SMM", "SEO", "Таргет", "Брендинг", "Выход на маркетплейсы стран BRICS"], price: PRICE, image: "/services/05.webp" },
  { id: 6, slug: "accounting", title: "Бухгалтерия и налоги", items: ["Ведение учёта", "Оптимизация налогообложения", "Отчётность"], price: PRICE, image: "/services/06.webp", imagePosition: "50% 60%", imageVeil: [0.62, 0.9] },
  { id: 7, slug: "mentoring", title: "Менторство и обучение", items: ["Индивидуальное менторство", "Групповые интенсивы", "Мастер-классы", "Нетворкинг"], price: PRICE, image: "/services/07.jpg", imageSize: "auto 108%", imagePosition: "72% 30%", imageVeil: [0.58, 0.88] },
  { id: 8, slug: "residency", title: "Резидентура и инфраструктура", items: ["Льготная аренда офиса/коворкинга", "Переговорные", "Лаборатории", "Юридический адрес"], price: PRICE, image: "/services/08.jpg", imageVeil: [0.6, 0.9] },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
