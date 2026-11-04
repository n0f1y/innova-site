import type { LegalDoc } from "@/data/legal";

// Адреса почты и сайта в юридическом тексте превращаем в ссылки
const LINK = /(https?:\/\/[^\s,;)]*[^\s,;).]|[\w.-]+@[\w.-]+\.\w+)/g;

function Text({ children }: { children: string }) {
  return (
    <>
      {children.split(LINK).map((part, i) =>
        i % 2 === 1 ? (
          <a
            key={i}
            href={part.includes("@") ? `mailto:${part}` : part}
            className="underline decoration-lime underline-offset-4 [overflow-wrap:anywhere]"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mt-10 space-y-4 text-base font-medium leading-relaxed text-paper/85">
      {doc.blocks.map((b, i) => {
        if (b.t === "h2") return <h2 key={i} className="!mt-10 text-xl font-extrabold uppercase leading-tight tracking-tight text-paper">{b.x}</h2>;
        if (b.t === "p") return <p key={i}><Text>{b.x}</Text></p>;
        const List = b.t === "ul" ? "ul" : "ol";
        return (
          <List key={i} className={`space-y-2 pl-6 ${b.t === "ul" ? "list-disc" : "list-decimal"} marker:text-lime`}>
            {b.x.map((li, j) => (
              <li key={j}><Text>{li}</Text></li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
