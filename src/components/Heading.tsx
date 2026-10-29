// Заголовок секции в стиле сайта: капс, жирный, точка-акцент
export function Heading({
  children,
  dot = "text-lime",
  showDot = false,
  className = "",
}: {
  children: React.ReactNode;
  dot?: string;
  showDot?: boolean;
  className?: string;
}) {
  return (
    <h2 className={`text-[clamp(2.1rem,6.2vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight [text-wrap:balance] ${className}`}>
      {children}
      {/* После вопросительного знака точку не ставим */}
      {showDot && !(typeof children === "string" && children.trim().endsWith("?")) && <span className={dot}>.</span>}
    </h2>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-4 text-sm font-bold uppercase tracking-wide ${className}`}>{children}</p>;
}
