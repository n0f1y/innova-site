// Линейные иконки услуг (24×24), цвет задаётся через currentColor
const paths: Record<number, React.ReactNode> = {
  1: <path d="M4 19c3-1 3-6 6-6s3 3 6 1 3-6 4-9M17 5h3v3" />, // стратегия: растущий маршрут
  2: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6.5 9.5v.01M17.5 14.5v.01" /></>, // инвестиции: купюра
  3: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="m7 9 3 3-3 3M13 15h4M9 21h6" /></>, // IT: терминал
  4: <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" />, // право: весы
  5: <path d="M3 11v2a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1zM18 9a4 4 0 0 1 0 6" />, // маркетинг: рупор
  6: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></>, // бухгалтерия: калькулятор
  7: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c1.8.8 3 2.6 3 5.5" /></>, // менторство: люди
  8: <path d="M4 21V5l8-2v18M12 9h8v12M7 9h2M7 13h2M7 17h2M15 13h2M15 17h2M2 21h20" />, // резидентура: здание
};

export function ServiceIcon({ id, className = "" }: { id: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[id] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
